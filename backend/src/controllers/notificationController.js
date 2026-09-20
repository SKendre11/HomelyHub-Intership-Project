import { Notification } from "../Models/notificationModel.js";

// Internal helper function to create a notification
const createNotification = async ({ userId, title, message, type = "general", data = {} }) => {
  try {
    return await Notification.create({
      user: userId,
      title,
      message,
      type,
      data,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

// GET logged-in user notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

    res.status(200).json({
      status: "success",
      unreadCount,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// MARK SINGLE NOTIFICATION AS READ
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        status: "fail",
        message: "Notification not found",
      });
    }

    const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

    res.status(200).json({
      status: "success",
      unreadCount,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// MARK ALL AS READ
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });

    res.status(200).json({
      status: "success",
      message: "All notifications marked as read.",
      unreadCount: 0,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export { createNotification, getNotifications, markAsRead, markAllAsRead };
