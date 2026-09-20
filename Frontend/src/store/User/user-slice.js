import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,

    reducers: {

        // Signup
        getSignupRequest(state) {
            state.loading = true;
            state.error = null;
        },

        getSignupDetails(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },

        // Login
        getLoginRequest(state) {
            state.loading = true;
            state.error = null;
        },

        getLoginDetails(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },

        // Current User
        getCurrentRequest(state) {
            state.loading = true;
            state.error = null;
        },

        getCurrentUser(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },

        // Update User
        getUpdateRequest(state) {
            state.loading = true;
        },

        getUpdateUser(state, action) {
            state.user = action.payload;
            state.loading = false;
        },

        // Forgot Password
        getForgotPasswordRequest(state) {
            state.loading = true;
        },

        getForgotPasswordSuccess(state) {
            state.loading = false;
        },

        // Reset Password
        getResetPasswordRequest(state) {
            state.loading = true;
        },

        getResetPasswordSuccess(state) {
            state.loading = false;
        },

        // Update Password
        getUpdatePasswordRequest(state) {
            state.loading = true;
        },

        getUpdatePasswordSuccess(state) {
            state.loading = false;
        },

        // Error
        getError(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        // Logout
        getLogoutRequest(state) {
            state.loading = true;
        },

        getLogoutSuccess(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
    },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;