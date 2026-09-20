import { userActions } from "./user-slice.js";
import { axiosInstance } from "../../utils/axios";

// signup
export const getSignup = (user) => async (dispatch) => {
    try {
        dispatch(userActions.getSignupRequest());

        const { data } = await axiosInstance.post(
            "/v1/rent/user/signup",
            user
        );

        dispatch(userActions.getSignupDetails(data.user));
    } catch (error) {
        dispatch(
            userActions.getError(error.response?.data?.message)
        );
    }
};


// login
export const getLogin = (user) => async (dispatch) => {
    try {
        dispatch(userActions.getLoginRequest());

        const { data } = await axiosInstance.post(
            "/v1/rent/user/login",
            user
        );

        dispatch(userActions.getLoginDetails(data.user));
    } catch (error) {
        dispatch(
            userActions.getError(error.response?.data?.message)
        );
    }
};


// current user
export const currentUser = () => async (dispatch) => {
    try {
        dispatch(userActions.getCurrentRequest());

        const { data } = await axiosInstance.get(
            "/v1/rent/user/me"
        );

        dispatch(userActions.getCurrentUser(data.user));
    } catch {
        dispatch(userActions.getLogoutSuccess());
    }
};


// update user
export const updateUser = (updateUser) => async (dispatch) => {
    try {
        dispatch(userActions.getUpdateRequest());

        const { data } = await axiosInstance.put(
            "/v1/rent/user/update",
            updateUser
        );

        dispatch(userActions.getUpdateUser(data.user));
    } catch (error) {
        dispatch(
            userActions.getError(error.response?.data?.message)
        );
    }
};


// forgot password
export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch(userActions.getForgotPasswordRequest());

        const { data } = await axiosInstance.post(
            "/v1/rent/user/forgot-password",
            { email }
        );

        dispatch(userActions.getForgotPasswordSuccess(data));
    } catch (error) {
        dispatch(
            userActions.getError(error.response?.data?.message)
        );
    }
};


// reset password
export const resetPassword = (resetData) => async (dispatch) => {
    try {
        dispatch(userActions.getResetPasswordRequest());

        const { data } = await axiosInstance.post(
            "/v1/rent/user/reset-password",
            resetData
        );

        dispatch(userActions.getResetPasswordSuccess(data));
    } catch (error) {
        dispatch(
            userActions.getError(error.response?.data?.message)
        );
    }
};


// update password
export const updatePassword = (passwordData) => async (dispatch) => {
    try {
        dispatch(userActions.getUpdatePasswordRequest());

        const { data } = await axiosInstance.put(
            "/v1/rent/user/update-password",
            passwordData
        );

        dispatch(userActions.getUpdatePasswordSuccess(data));
    } catch (error) {
        dispatch(
            userActions.getError(error.response?.data?.message)
        );
    }
};


// logout
export const logout = () => async (dispatch) => {
    try {
        dispatch(userActions.getLogoutRequest());

        await axiosInstance.get(
            "/v1/rent/user/logout"
        );

        dispatch(userActions.getLogoutSuccess());
    } catch (error) {
        dispatch(
            userActions.getError(error.response?.data?.message)
        );
    }
};
