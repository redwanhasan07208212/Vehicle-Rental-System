import type { Request, Response } from "express";
import { userService } from "./user.service";
import { AppError } from "../../middleware/errorHandler";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      error: (error as Error).message,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(parseInt(userId as string));
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user",
      error: (error as Error).message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const id = parseInt(userId as string);

    // Check authorization: admin can update anyone, customer can only update themselves
    if (req.user!.role === "customer" && req.user!.id !== id) {
      throw new AppError(
        403,
        "Forbidden: You can only update your own profile"
      );
    }

    const user = await userService.updateUser(id, req.body);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: (error as Error).message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await userService.deleteUser(parseInt(userId as string));
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: (error as Error).message,
    });
  }
};
