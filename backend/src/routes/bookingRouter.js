import express from "express";

import {
  createOrder,
  respondToBookingRequest,
  verifyPayment,
  getBookingDetails,
  getUserBookings,
  cancelBooking,
} from "../controllers/bookingController.js";

import { protect } from "../controllers/authController.js";

const bookingRouter = express.Router();

bookingRouter.get("/", protect, getUserBookings);

bookingRouter.get("/:bookingId", protect, getBookingDetails);

bookingRouter.delete("/:bookingId", protect, cancelBooking);

bookingRouter.post("/create-order", protect, createOrder);

bookingRouter.patch("/:bookingId/respond", protect, respondToBookingRequest);

bookingRouter.post("/verify-payment", protect, verifyPayment);

export { bookingRouter };


