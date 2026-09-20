import { User } from "../Models/userModel.js";
import { Property } from "../Models/propertyModel.js";
import { Booking } from "../Models/booking.js";

// GET ADMIN DASHBOARD STATS & OVERVIEW
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const bookings = await Booking.find();
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.price || 0), 0);

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .populate("property", "propertyName price");

    res.status(200).json({
      status: "success",
      stats: {
        totalUsers,
        totalProperties,
        totalBookings,
        totalRevenue,
      },
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      results: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// UPDATE USER ROLE
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "host", "admin"].includes(role)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid role specified.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User role updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// GET ALL PROPERTIES (ADMIN)
const getAllPropertiesAdmin = async (req, res) => {
  try {
    const properties = await Property.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email phoneNumber");

    res.status(200).json({
      status: "success",
      results: properties.length,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// UPDATE PROPERTY STATUS (Active, Pending, Blocked)
const updatePropertyStatus = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { status } = req.body;

    if (!["Active", "Inactive", "Pending", "Blocked"].includes(status)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid status value.",
      });
    }

    const property = await Property.findByIdAndUpdate(
      propertyId,
      { status },
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({
        status: "fail",
        message: "Property not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: `Property status updated to ${status}`,
      property,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// DELETE PROPERTY (ADMIN)
const deletePropertyAdmin = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const property = await Property.findByIdAndDelete(propertyId);

    if (!property) {
      return res.status(404).json({
        status: "fail",
        message: "Property not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Property deleted successfully by admin.",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// GET ALL BOOKINGS (ADMIN)
const getAllBookingsAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email phoneNumber")
      .populate("property", "propertyName price address");

    res.status(200).json({
      status: "success",
      results: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// CANCEL BOOKING (ADMIN)
const cancelBookingAdmin = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "Booking not found.",
      });
    }

    // Unblock dates in property
    await Property.findByIdAndUpdate(booking.property, {
      $pull: { currentBookings: { bookingId: booking._id } },
    });

    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({
      status: "success",
      message: "Booking cancelled by admin.",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// GET ALL REVIEWS (ADMIN)
const getAllReviewsAdmin = async (req, res) => {
  try {
    const properties = await Property.find({ "reviews.0": { $exists: true } }).select(
      "propertyName reviews"
    );

    const allReviews = [];
    properties.forEach((p) => {
      p.reviews.forEach((r) => {
        allReviews.push({
          reviewId: r._id,
          propertyId: p._id,
          propertyName: p.propertyName,
          userId: r.userId,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt,
        });
      });
    });

    res.status(200).json({
      status: "success",
      results: allReviews.length,
      reviews: allReviews,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// DELETE REVIEW (ADMIN)
const deleteReviewAdmin = async (req, res) => {
  try {
    const { propertyId, reviewId } = req.params;

    const property = await Property.findByIdAndUpdate(
      propertyId,
      { $pull: { reviews: { _id: reviewId } } },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({
        status: "fail",
        message: "Property not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Review deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export {
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
};
