import type { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: (error as Error).message,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getBookings(
      req.user?.id,
      req.user?.role
    );
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
      error: (error as Error).message,
    });
  }
};

const getBookingById = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const booking = await bookingService.getBookingById(
      parseInt(bookingId as string)
    );
    res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve booking",
      error: (error as Error).message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const booking = await bookingService.updateBooking(
      parseInt(bookingId as string),
      req.body,
      req.user?.id,
      req.user?.role
    );
    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
      error: (error as Error).message,
    });
  }
};
export const bookingController = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
};
