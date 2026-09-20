import { axiosInstance } from "../../utils/axios";
import { notificationActions } from "./notification-slice";

export const fetchNotifications = () => async (dispatch) => {
  try {
    dispatch(notificationActions.getNotificationsRequest());
    const response = await axiosInstance.get("/v1/notifications");
    dispatch(
      notificationActions.getNotificationsSuccess({
        notifications: response.data.notifications || [],
        unreadCount: response.data.unreadCount || 0,
      })
    );
  } catch (error) {
    dispatch(
      notificationActions.getNotificationsFailed(
        error.response?.data?.message || "Failed to fetch notifications"
      )
    );
  }
};

export const markNotificationAsRead = (id) => async (dispatch, getState) => {
  try {
    const response = await axiosInstance.patch(`/v1/notifications/${id}/read`);
    const currentNotifications = getState().notifications.notifications;
    const updated = currentNotifications.map((n) =>
      n._id === id ? { ...n, read: true } : n
    );
    dispatch(
      notificationActions.markReadSuccess({
        notifications: updated,
        unreadCount: response.data.unreadCount ?? 0,
      })
    );
  } catch (error) {
    console.error("Failed to mark notification as read", error);
  }
};

export const markAllNotificationsAsRead = () => async (dispatch) => {
  try {
    await axiosInstance.patch("/v1/notifications/read-all");
    dispatch(notificationActions.markAllReadSuccess());
  } catch (error) {
    console.error("Failed to mark all notifications as read", error);
  }
};
