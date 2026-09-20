import express from "express";
import { isAuthenticatedUser, authorizeRoles } from "../controllers/authController.js";
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllPropertiesAdmin,
  updatePropertyStatus,
  deletePropertyAdmin,
  getAllBookingsAdmin,
  cancelBookingAdmin,
  getAllReviewsAdmin,
  deleteReviewAdmin,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// Protect all admin routes: Must be logged in & role === "admin"
adminRouter.use(isAuthenticatedUser, authorizeRoles("admin"));

// Stats
adminRouter.get("/stats", getAdminStats);

// User Management
adminRouter.get("/users", getAllUsers);
adminRouter.patch("/users/:userId/role", updateUserRole);
adminRouter.delete("/users/:userId", deleteUser);

// Property Management
adminRouter.get("/properties", getAllPropertiesAdmin);
adminRouter.patch("/properties/:propertyId/status", updatePropertyStatus);
adminRouter.delete("/properties/:propertyId", deletePropertyAdmin);

// Booking Management
adminRouter.get("/bookings", getAllBookingsAdmin);
adminRouter.delete("/bookings/:bookingId", cancelBookingAdmin);

// Review Management
adminRouter.get("/reviews", getAllReviewsAdmin);
adminRouter.delete("/properties/:propertyId/reviews/:reviewId", deleteReviewAdmin);

export { adminRouter };
