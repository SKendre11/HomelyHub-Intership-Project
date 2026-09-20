//address list

import express from "express";

import {
  signup,
  login,
  protect,
  getMe,
  updateMe,
  updatePassword,
  logout,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/authController.js";

const router = express.Router();

router.route("/signup").post(signup);

router.route("/login").post(login);

router.route("/me").get(protect, getMe);

router.route("/update").put(protect, updateMe);

router.route("/update-password").put(protect, updatePassword);

router.route("/logout").get(logout);

router.route("/wishlist").get(protect, getWishlist);

router.route("/wishlist/:propertyId")
  .post(protect, addToWishlist)
  .delete(protect, removeFromWishlist);

export { router };


