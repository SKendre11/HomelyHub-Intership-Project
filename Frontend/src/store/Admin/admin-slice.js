import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: {
      totalUsers: 0,
      totalProperties: 0,
      totalBookings: 0,
      totalRevenue: 0,
    },
    recentBookings: [],
    users: [],
    properties: [],
    bookings: [],
    reviews: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    adminRequest(state) {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    },
    getAdminStatsSuccess(state, action) {
      state.loading = false;
      state.stats = action.payload.stats;
      state.recentBookings = action.payload.recentBookings;
    },
    getAdminUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload;
    },
    updateUserRoleSuccess(state, action) {
      state.loading = false;
      state.users = state.users.map((u) =>
        u._id === action.payload._id ? action.payload : u
      );
      state.successMessage = "User role updated successfully.";
    },
    deleteUserSuccess(state, action) {
      state.loading = false;
      state.users = state.users.filter((u) => u._id !== action.payload);
      state.stats.totalUsers = Math.max(0, state.stats.totalUsers - 1);
      state.successMessage = "User deleted successfully.";
    },
    getAdminPropertiesSuccess(state, action) {
      state.loading = false;
      state.properties = action.payload;
    },
    updatePropertyStatusSuccess(state, action) {
      state.loading = false;
      state.properties = state.properties.map((p) =>
        p._id === action.payload._id ? action.payload : p
      );
      state.successMessage = "Property status updated.";
    },
    deletePropertyAdminSuccess(state, action) {
      state.loading = false;
      state.properties = state.properties.filter((p) => p._id !== action.payload);
      state.stats.totalProperties = Math.max(0, state.stats.totalProperties - 1);
      state.successMessage = "Property deleted by admin.";
    },
    getAdminBookingsSuccess(state, action) {
      state.loading = false;
      state.bookings = action.payload;
    },
    cancelBookingAdminSuccess(state, action) {
      state.loading = false;
      state.bookings = state.bookings.filter((b) => b._id !== action.payload);
      state.stats.totalBookings = Math.max(0, state.stats.totalBookings - 1);
      state.successMessage = "Booking cancelled by admin.";
    },
    getAdminReviewsSuccess(state, action) {
      state.loading = false;
      state.reviews = action.payload;
    },
    deleteReviewAdminSuccess(state, action) {
      state.loading = false;
      state.reviews = state.reviews.filter((r) => r.reviewId !== action.payload);
      state.successMessage = "Review deleted successfully.";
    },
    adminFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearAdminMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const adminActions = adminSlice.actions;
export default adminSlice.reducer;
