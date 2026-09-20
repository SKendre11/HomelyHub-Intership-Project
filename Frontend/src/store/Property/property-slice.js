//state manager 
//all property related state will be managed here, count, search, filter, sort, etc along with error handling and loading state
import { createSlice } from "@reduxjs/toolkit";

const propertySlice = createSlice({
  name: "property",

  initialState: {
    properties: [],
    totalProperties: 0,
    searchParams: {
      page: 1,
      limit: 12,
    },
    error: null,
    loading: false,
  },

  reducers: {
    getRequest(state) {
      state.loading = true;
      state.error = null;
    },

    getProperties(state, action) {
      state.properties = action.payload.properties || [];
      state.totalProperties = action.payload.totalProperties || 0;
      state.loading = false;
      state.error = null;
    },

    updateSearchParams(state, action) {
      const merged = {
        ...state.searchParams,
        ...action.payload,
      };
      Object.keys(merged).forEach((key) => {
        if (merged[key] === null || merged[key] === undefined || merged[key] === "") {
          delete merged[key];
        }
      });
      state.searchParams = merged;
    },

    resetSearchParams(state) {
      state.searchParams = {
        page: 1,
        limit: 12,
      };
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

export const propertyAction = propertySlice.actions;
export default propertySlice.reducer;
