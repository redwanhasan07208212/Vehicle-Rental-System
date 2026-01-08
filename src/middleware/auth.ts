import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import config from "../config";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
        statusCode: 401,
      });
    }
    const token = authHeader.substring(7);
    const decoded = jwt.verify(
      token,
      config.secret_key as string
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
      statusCode: 401,
    });
  }
};
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.role !== "admin" || !req.user) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admins Access Required",
        statusCode: 403,
      });
    }
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Access Denied",
      statusCode: 403,
    });
  }
};
export const customerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.role !== "customer" || !req.user) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Customer Access Required",
        statusCode: 403,
      });
    }
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Access Denied",
      statusCode: 403,
    });
  }
};
