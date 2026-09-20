import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "booking",

  initialState: {
    bookings: [],
    bookingDetails: null,
    currentOrder: null,
    loading: false,
    error: null,
  },

  reducers: {
    getRequest(state) {
      state.loading = true;
      state.error = null;
    },

    setOrderData(state, action) {
      state.currentOrder = action.payload;
      state.loading = false;
      state.error = null;
    },

    setBookings(state, action) {
      state.bookings = action.payload || [];
      state.loading = false;
      state.error = null;
    },

    setBookingDetails(state, action) {
      state.bookingDetails = action.payload;
      state.loading = false;
      state.error = null;
    },

    removeBooking(state, action) {
      state.bookings = state.bookings.filter(
        (booking) => booking._id !== action.payload
      );
      state.loading = false;
    },

    getError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    clearError(state) {
      state.error = null;
    },
  },
});

export const bookingActions = bookingSlice.actions;
export default bookingSlice.reducer;
