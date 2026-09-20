import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../store/Notification/notification-action";
import "../../css/Notification.css";

const NotificationDropdown = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state) => state.notifications);
  const { isAuthenticated } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
      // Poll notifications every 30s
      const interval = setInterval(() => {
        dispatch(fetchNotifications());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [dispatch, isAuthenticated]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) return null;

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleMarkAsRead = (id, e) => {
    e.stopPropagation();
    dispatch(markNotificationAsRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking_confirmed":
        return "🎉";
      case "payment_success":
        return "💳";
      case "payment_failed":
        return "⚠️";
      case "booking_cancelled":
        return "❌";
      default:
        return "🔔";
    }
  };

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      <button className="notification-bell-btn" onClick={toggleDropdown} title="Notifications">
        <span className="material-symbols-outlined bell-icon">notifications</span>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <div className="header-title">
              <h3>Notifications</h3>
              {unreadCount > 0 && <span className="unread-tag">{unreadCount} new</span>}
            </div>
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={handleMarkAllRead}>
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications && notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item._id}
                  className={`notification-item ${!item.read ? "unread" : ""}`}
                  onClick={(e) => !item.read && handleMarkAsRead(item._id, e)}
                >
                  <div className="notification-type-icon">{getNotificationIcon(item.type)}</div>
                  <div className="notification-content">
                    <div className="notification-item-title">{item.title}</div>
                    <p className="notification-message">{item.message}</p>
                    <span className="notification-time">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {!item.read && <span className="unread-dot" title="Unread"></span>}
                </div>
              ))
            ) : (
              <div className="notification-empty">
                <span className="material-symbols-outlined empty-icon">notifications_off</span>
                <p>No notifications yet</p>
                <small>You're all caught up!</small>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
