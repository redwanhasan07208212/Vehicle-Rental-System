import { Router } from "express";
import { adminMiddleware, authMiddleware } from "../../middleware/auth";
import { userController } from "./user.controller";

const router = Router();

router.get("/", authMiddleware, adminMiddleware, userController.getAllUsers);
router.put("/:userId", authMiddleware, userController.updateUser);
router.delete(
  "/:userId",
  authMiddleware,
  adminMiddleware,
  userController.deleteUser
);

export const userRoutes = router;
