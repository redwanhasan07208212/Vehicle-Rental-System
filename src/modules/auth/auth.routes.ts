import { Router } from "express";
import { authController } from "./auth.controller";

const auth = Router();

auth.post("/signup", authController.signUp);
auth.post("/signin", authController.signIn);

export const AuthRoutes = auth;
