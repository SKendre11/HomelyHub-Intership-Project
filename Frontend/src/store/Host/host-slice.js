import { createSlice } from "@reduxjs/toolkit";

const hostSlice = createSlice({
  name: "host",
  initialState: {
    properties: [],
    bookings: [],
    stats: {
      totalProperties: 0,
      totalBookings: 0,
      totalRevenue: 0,
    },
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    hostRequest(state) {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    },
    getPropertiesSuccess(state, action) {
      state.loading = false;
      state.properties = action.payload;
    },
    getBookingsSuccess(state, action) {
      state.loading = false;
      state.bookings = action.payload;
    },
    getStatsSuccess(state, action) {
      state.loading = false;
      state.stats = action.payload;
    },
    createPropertySuccess(state, action) {
      state.loading = false;
      state.properties.unshift(action.payload);
      state.stats.totalProperties += 1;
      state.successMessage = "Property created successfully!";
    },
    updatePropertySuccess(state, action) {
      state.loading = false;
      state.properties = state.properties.map((p) =>
        p._id === action.payload._id ? action.payload : p
      );
      state.successMessage = "Property updated successfully!";
    },
    deletePropertySuccess(state, action) {
      state.loading = false;
      state.properties = state.properties.filter((p) => p._id !== action.payload);
      state.stats.totalProperties = Math.max(0, state.stats.totalProperties - 1);
      state.successMessage = "Property deleted successfully!";
    },
    hostFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearHostMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const hostActions = hostSlice.actions;
export default hostSlice.reducer;
