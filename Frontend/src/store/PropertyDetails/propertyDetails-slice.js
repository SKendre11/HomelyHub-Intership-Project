import { createSlice } from "@reduxjs/toolkit";

const propertyDetailsSlice = createSlice({
  name: "propertyDetails",

  initialState: {
    propertyDetails: null,
    loading: false,
    error: null,
  },

  reducers: {
    // ============================================================
    // REQUEST
    // ============================================================

    getListRequest(state) {
      state.loading = true;
      state.error = null;
    },

    // ============================================================
    // SUCCESS
    // ============================================================

    getPropertyDetails(state, action) {
      state.propertyDetails = action.payload;
      state.loading = false;
      state.error = null;
    },

    // ============================================================
    // ERROR
    // ============================================================

    getListError(state, action) {
      state.loading = false;
      state.error =
        action.payload || "Could not fetch property details.";

      state.propertyDetails = null;
    },

    // ============================================================
    // CLEAR
    // ============================================================

    clearPropertyDetails(state) {
      state.propertyDetails = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// ================================================================
// ACTIONS
// ================================================================

// Main export used by propertyDetails-action.js
export const propertyDetailsAction =
  propertyDetailsSlice.actions;

// Also export plural version for compatibility
export const propertyDetailsActions =
  propertyDetailsSlice.actions;

// ================================================================
// REDUCER
// ================================================================

export default propertyDetailsSlice.reducer;