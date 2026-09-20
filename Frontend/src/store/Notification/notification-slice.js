import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    getNotificationsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getNotificationsSuccess(state, action) {
      state.loading = false;
      state.notifications = action.payload.notifications;
      state.unreadCount = action.payload.unreadCount;
    },
    getNotificationsFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    markReadSuccess(state, action) {
      state.notifications = action.payload.notifications;
      state.unreadCount = action.payload.unreadCount;
    },
    markAllReadSuccess(state) {
      state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
      state.unreadCount = 0;
    },
  },
});

export const notificationActions = notificationSlice.actions;
export default notificationSlice.reducer;
