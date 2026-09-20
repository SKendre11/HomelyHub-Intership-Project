import express from "express";
import { isAuthenticatedUser } from "../controllers/authController.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.use(isAuthenticatedUser);

notificationRouter.get("/", getNotifications);
notificationRouter.patch("/read-all", markAllAsRead);
notificationRouter.patch("/:id/read", markAsRead);

export { notificationRouter };
