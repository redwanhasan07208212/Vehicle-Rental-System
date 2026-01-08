import { Router } from "express";
import { adminMiddleware, authMiddleware } from "../../middleware/auth";
import { vehicleController } from "./vehicle.controller";

const router = Router();
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  vehicleController.createVehicle
);
router.get("/", vehicleController.getAllVehicles);
router.get("/:vehicleId", vehicleController.getVehicleById);
router.put(
  "/:vehicleId",
  authMiddleware,
  adminMiddleware,
  vehicleController.updateVehicle
);
router.delete(
  "/:vehicleId",
  authMiddleware,
  adminMiddleware,
  vehicleController.deleteVehicle
);

export const vehicleRoutes = router;
