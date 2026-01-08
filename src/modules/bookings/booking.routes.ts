import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { bookingController } from "./booking.controller";

const router = Router();

router.post("/", authMiddleware, bookingController.createBooking);
router.get("/", authMiddleware, bookingController.getBookings);
router.put("/:bookingId", authMiddleware, bookingController.updateBooking);

export const BookingRoutes = router;
