import { pool } from "../../config/db";
import { AppError } from "../../middleware/errorHandler";
import type {
  CreateVehicle,
  UpdateVehicle,
  Vehicle,
} from "../../types/typeDefine";

const createVehicle = async (vehicleData: CreateVehicle): Promise<Vehicle> => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = vehicleData;

  // Validate input
  if (
    !vehicle_name ||
    !type ||
    !registration_number ||
    !daily_rent_price ||
    !availability_status
  ) {
    throw new AppError(400, "All fields are required");
  }

  if (daily_rent_price <= 0) {
    throw new AppError(400, "Daily rent price must be positive");
  }

  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result.rows[0];
};

const getAllVehicles = async (): Promise<Vehicle[]> => {
  const result = await pool.query("SELECT * FROM vehicles ORDER BY id DESC");
  return result.rows;
};
const getVehicleById = async (id: number): Promise<Vehicle> => {
  const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    throw new AppError(404, "Vehicle not found");
  }

  return result.rows[0];
};
const updateVehicle = async (
  id: number,
  vehicleData: UpdateVehicle
): Promise<Vehicle> => {
  //verify vehicle exists
  const existingVehicle = await getVehicleById(id);

  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = vehicleData;

  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (vehicle_name !== undefined) {
    updates.push(`vehicle_name = $${paramCount++}`);
    values.push(vehicle_name);
  }

  if (type !== undefined) {
    updates.push(`type = $${paramCount++}`);
    values.push(type);
  }

  if (registration_number !== undefined) {
    updates.push(`registration_number = $${paramCount++}`);
    values.push(registration_number);
  }

  if (daily_rent_price !== undefined) {
    if (daily_rent_price <= 0) {
      throw new AppError(400, "Daily rent price must be positive");
    }
    updates.push(`daily_rent_price = $${paramCount++}`);
    values.push(daily_rent_price);
  }

  if (availability_status !== undefined) {
    updates.push(`availability_status = $${paramCount++}`);
    values.push(availability_status);
  }

  if (updates.length === 0) {
    return await getVehicleById(id);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const query = `UPDATE vehicles SET ${updates.join(
    ", "
  )} WHERE id = $${paramCount} RETURNING *`;

  const result = await pool.query(query, values);
  return result.rows[0];
};
const deleteVehicle = async (id: number): Promise<void> => {
  // Verify vehicle exists
  await getVehicleById(id);

  // Check for active bookings
  const bookingCheck = await pool.query(
    "SELECT COUNT(*) FROM bookings WHERE vehicle_id = $1 AND status = 'active'",
    [id]
  );

  if (parseInt(bookingCheck.rows[0].count) > 0) {
    throw new AppError(400, "Cannot delete vehicle with active bookings");
  }

  await pool.query("DELETE FROM vehicles WHERE id = $1", [id]);
};

export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
