import type { Request, Response } from "express";
import { authService } from "./auth.service";

const signUp = async (req: Request, res: Response) => {
  try {
    const user = await authService.userSignUp(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      statusCode: 201,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "User registration failed",
      statusCode: 500,
    });
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.userSignIn(req.body);
    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User sign-in failed",
      statusCode: 500,
    });
  }
};

export const authController = {
  signUp,
  signIn,
};
