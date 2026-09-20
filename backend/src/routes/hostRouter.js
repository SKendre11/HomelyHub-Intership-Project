import express from "express";
import { isAuthenticatedUser } from "../controllers/authController.js";
import {
  getMyProperties,
  createHostProperty,
  updateHostProperty,
  deleteHostProperty,
  getHostBookings,
  getHostStats,
} from "../controllers/hostController.js";

const hostRouter = express.Router();

hostRouter.use(isAuthenticatedUser);

hostRouter.get("/properties", getMyProperties);
hostRouter.post("/properties", createHostProperty);
hostRouter.put("/properties/:id", updateHostProperty);
hostRouter.delete("/properties/:id", deleteHostProperty);

hostRouter.get("/bookings", getHostBookings);
hostRouter.get("/stats", getHostStats);

export { hostRouter };
