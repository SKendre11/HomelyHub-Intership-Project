import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState: {
    wishlist: [],
    loading: false,
    error: null,
  },

  reducers: {
    getRequest(state) {
      state.loading = true;
      state.error = null;
    },

    getWishlist(state, action) {
      state.wishlist = action.payload || [];
      state.loading = false;
      state.error = null;
    },

    addToWishlistSuccess(state, action) {
      state.wishlist = action.payload || [];
      state.loading = false;
    },

    removeFromWishlistSuccess(state, action) {
      state.wishlist = action.payload || [];
      state.loading = false;
    },

    getError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const wishlistActions = wishlistSlice.actions;
export default wishlistSlice.reducer;
