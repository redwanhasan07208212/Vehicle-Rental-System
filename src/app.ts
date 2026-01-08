import express, { type Request, type Response } from "express";
import initDB from "./config/db";
import { AuthRoutes } from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";
import { userRoutes } from "./modules/users/user.routes";
import { BookingRoutes } from "./modules/bookings/booking.routes";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Vehicle Rental System Api is Running",
  });
});

initDB();

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bookings", BookingRoutes);

//404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.path,
    statusCode: 404,
  });
});

// errorHandler
app.use(errorHandler);

export default app;
