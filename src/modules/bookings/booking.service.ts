import { AppError } from "../../middleware/errorHandler";
import { pool } from "../../config/db";
import type {
  Booking,
  CreateBooking,
  UpdateBooking,
  Vehicle,
} from "../../types/typeDefine";

// Calculate number of days between two dates
const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const createBooking = async (bookingData: CreateBooking): Promise<Booking> => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
    bookingData;

  // Validate input
  if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    throw new AppError(400, "All fields are required");
  }

  // Validate dates
  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);

  if (endDate <= startDate) {
    throw new AppError(400, "Rent end date must be after rent start date");
  }

  // Check vehicle exists and is available
  const vehicleResult = await pool.query(
    "SELECT * FROM vehicles WHERE id = $1",
    [vehicle_id]
  );

  if (vehicleResult.rows.length === 0) {
    throw new AppError(404, "Vehicle not found");
  }

  const vehicle = vehicleResult.rows[0] as Vehicle;

  if (vehicle.availability_status !== "available") {
    throw new AppError(400, "Vehicle is not available for booking");
  }

  // Check customer exists
  const customerResult = await pool.query("SELECT * FROM users WHERE id = $1", [
    customer_id,
  ]);

  if (customerResult.rows.length === 0) {
    throw new AppError(404, "Customer not found");
  }

  // Calculate total price
  const days = calculateDays(rent_start_date, rent_end_date);
  const total_price = days * vehicle.daily_rent_price;

  // Create booking in a transaction
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Create booking
    const bookingResult = await client.query(
      `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        "active",
      ]
    );

    // Update vehicle availability
    await client.query(
      "UPDATE vehicles SET availability_status = $1 WHERE id = $2",
      ["booked", vehicle_id]
    );

    await client.query("COMMIT");
    return bookingResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getBookings = async (
  userId?: number,
  userRole?: string
): Promise<Booking[]> => {
  let query = "SELECT * FROM bookings";
  const params: any[] = [];

  // If customer, only show their own bookings
  if (userRole === "customer" && userId) {
    query += " WHERE customer_id = $1";
    params.push(userId);
  }

  query += " ORDER BY id DESC";

  const result = await pool.query(query, params);
  return result.rows;
};

const getBookingById = async (id: number): Promise<Booking> => {
  const result = await pool.query("SELECT * FROM bookings WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    throw new AppError(404, "Booking not found");
  }

  return result.rows[0];
};

const updateBooking = async (
  id: number,
  updateData: UpdateBooking,
  userId?: number,
  userRole?: string
): Promise<Booking> => {
  const booking = await getBookingById(id);

  // Authorization check
  if (userRole === "customer" && booking.customer_id !== userId) {
    throw new AppError(403, "Forbidden: You can only update your own bookings");
  }

  const { status } = updateData;

  if (!status) {
    throw new AppError(400, "Status is required");
  }

  if (!["active", "cancelled", "returned"].includes(status)) {
    throw new AppError(400, "Invalid status");
  }

  // Customer can only cancel before start date
  if (userRole === "customer" && status === "cancelled") {
    const startDate = new Date(booking.rent_start_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (today >= startDate) {
      throw new AppError(
        400,
        "Cannot cancel booking: rental period has already started"
      );
    }
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Update booking status
    const result = await client.query(
      `UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, id]
    );

    const updatedBooking = result.rows[0];

    // If returned, update vehicle to available
    if (status === "returned") {
      await client.query(
        "UPDATE vehicles SET availability_status = $1 WHERE id = $2",
        ["available", booking.vehicle_id]
      );
    }

    // If cancelled, update vehicle to available
    if (status === "cancelled") {
      await client.query(
        "UPDATE vehicles SET availability_status = $1 WHERE id = $2",
        ["available", booking.vehicle_id]
      );
    }

    await client.query("COMMIT");
    return updatedBooking;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const bookingService = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
};
