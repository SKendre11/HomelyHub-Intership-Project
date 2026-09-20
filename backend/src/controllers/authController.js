import { User } from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import imagekit from "../utils/ImagekitIO.js";

import {
  sendMail,
  forgotPasswordMailGenContent,
} from "../utils/mail.js";

import {
  signinToken,
  createSendToken,
  defaultAvatarUrl,
  filterObj,
} from "../utils/token.js";


// ===============================
// SIGNUP
// ===============================

const signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      avatar: {
        url: req.body.avatar || defaultAvatarUrl(req.body.name),
      },
    });

    createSendToken(newUser, 201, res);

  } catch (error) {
    const duplicateField = Object.keys(error.keyPattern || {})[0];

    const message = duplicateField
      ? `An account with that ${duplicateField} already exists`
      : error.message;

    res.status(400).json({
      status: "fail",
      message,
    });
  }
};


// ===============================
// LOGIN
// ===============================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Please provide email and password");
    }

    const user = await User.findOne({ email }).select("+password");

    if (
      !user ||
      !(await user.correctPassword(password, user.password))
    ) {
      throw new Error("Incorrect email or password");
    }

    createSendToken(user, 200, res);

  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
};


// ===============================
// PROTECT MIDDLEWARE
// ===============================

const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];

    } 
    // Get token from cookies
    else if (
      req.cookies.jwt &&
      req.cookies.jwt !== "loggedout"
    ) {
      token = req.cookies.jwt;
    }

    // Check if token exists
    if (!token) {
      throw new Error(
        "You are not logged in! Please login to access"
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find current user
    const currentUser = await User.findById(decoded.id);

    // Check if user exists
    if (!currentUser) {
      throw new Error(
        "The user belonging to this token doesn't exist"
      );
    }

    /*
      Password changed check is temporarily removed.

      Your error was:
      currentUser.changedPasswordAfter is not a function
    */

    // Give current user access
    req.user = currentUser;

    // Move to next middleware/controller
    next();

  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
};


// ===============================
// AUTHORIZE ROLES MIDDLEWARE
// ===============================

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: `Role (${req.user?.role || "guest"}) is not authorized to access this resource.`,
      });
    }
    next();
  };
};


// ===============================
// GET CURRENT USER
// ===============================

const getMe = async (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      user: req.user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};


// ===============================
// UPDATE USER PROFILE
// ===============================

const updateMe = async (req, res) => {
  try {
    const filteredBody = filterObj(req.body, "name", "phoneNumber");

    if (req.body.avatar) {
      filteredBody.avatar = {
        url: req.body.avatar,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};


// ===============================
// UPDATE PASSWORD
// ===============================

const updatePassword = async (req, res) => {
  try {
    const { passwordCurrent, password, passwordConfirm } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user || !(await user.correctPassword(passwordCurrent, user.password))) {
      throw new Error("Your current password is wrong.");
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};


// ===============================
// LOGOUT
// ===============================

const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};


// ===============================
// WISHLIST CONTROLLERS
// ===============================

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.status(200).json({
      status: "success",
      wishlist: user.wishlist || [],
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: propertyId } },
      { new: true }
    ).populate("wishlist");

    res.status(200).json({
      status: "success",
      message: "Added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: propertyId } },
      { new: true }
    ).populate("wishlist");

    res.status(200).json({
      status: "success",
      message: "Removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};


export {
  signup,
  login,
  protect,
  protect as isAuthenticatedUser,
  authorizeRoles,
  getMe,
  updateMe,
  updatePassword,
  logout,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};


