import type { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
  }
}

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      statusCode: err.statusCode,
    });
  }

  // Handle PostgreSQL errors
  if ((err as any).code === "23505") {
    return res.status(400).json({
      success: false,
      message: "Duplicate entry: This value already exists",
      statusCode: 400,
    });
  }

  // Default error response
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    statusCode: 500,
  });
};
