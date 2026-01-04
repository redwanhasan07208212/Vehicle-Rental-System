import express, { type Request, type Response } from "express";
import initDB from "./config/db";

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
//404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.path,
    statusCode: 404,
  });
});

export default app;
