import { axiosInstance } from "../../utils/axios";
import { adminActions } from "./admin-slice";

export const fetchAdminStats = () => async (dispatch) => {
  try {
    dispatch(adminActions.adminRequest());
    const response = await axiosInstance.get("/v1/admin/stats");
    dispatch(
      adminActions.getAdminStatsSuccess({
        stats: response.data.stats,
        recentBookings: response.data.recentBookings,
      })
    );
  } catch (error) {
    dispatch(
      adminActions.adminFailed(
        error.response?.data?.message || "Failed to fetch admin stats"
      )
    );
  }
};

export const fetchAdminUsers = () => async (dispatch) => {
  try {
    dispatch(adminActions.adminRequest());
    const response = await axiosInstance.get("/v1/admin/users");
    dispatch(adminActions.getAdminUsersSuccess(response.data.users || []));
  } catch (error) {
    dispatch(
      adminActions.adminFailed(
        error.response?.data?.message || "Failed to fetch users"
      )
    );
  }
};

export const updateAdminUserRole = (userId, role) => async (dispatch) => {
  try {
    dispatch(adminActions.adminRequest());
    const response = await axiosInstance.patch(`/v1/admin/users/${userId}/role`, {
      role,
    });
    dispatch(adminActions.updateUserRoleSuccess(response.data.user));
  } catch (error) {
    dispatch(
      adminActions.adminFailed(
        error.response?.data?.message || "Failed to update user role"
      )
    );
  }
};

export const deleteAdminUser = (userId) => async (dispatch) => {
  try {
    dispatch(adminActions.adminRequest());
    await axiosInstance.delete(`/v1/admin/users/${userId}`);
    dispatch(adminActions.deleteUserSuccess(userId));
  } catch (error) {
    dispatch(
      adminActions.adminFailed(
        error.response?.data?.message || "Failed to delete user"
      )
    );
  }
};

export const fetchAdminProperties = () => async (dispatch) => {
  try {
    dispatch(adminActions.adminRequest());
    const response = await axiosInstance.get("/v1/admin/properties");
    dispatch(adminActions.getAdminPropertiesSuccess(response.data.properties || []));
  } catch (error) {
    dispatch(
      adminActions.adminFailed(
        error.response?.data?.message || "Failed to fetch properties"
      )
    );
  }
};

export const updateAdminPropertyStatus = (propertyId, status) => async (dispatch) => {
  try {
    dispatch(adminActions.adminRequest());
    const response = await axiosInstance.patch(
      `/v1/admin/properties/${propertyId}/status`,
      { status }
    );
    dispatch(adminActions.updatePropertyStatusSuccess(response.data.property));
  } catch (error) {
    dispatch(
      adminActions.adminFailed(
        error.response?.data?.message || "Failed to update property status"
      )
    );
  }
};

export const deleteAdminProperty = (propertyId) => async (dispatch) => {
  try {
    dispatch(adminActions.adminRequest());
    await axiosInstance.delete(`/v1/admin/properties/${propertyId}`);
    dispatch(adminActions.deletePropertyAdminSuccess(propertyId));
  } catch (error) {
    dispatch(
      adminActions.adminFailed(
        error.response?.data?.message || "Failed to delete property"
      )
    );
  }
};

export const fetchAdminBookings = () => async (dispatch) => {
  try {
    dispatch(adminActions.adminRequest());
    const response = await axiosInstance.get("/v1/admin/bookings");
    dispatch(adminActions.getAdminBookingsSuccess(response.data.bookings || []));
  } catch (error) {
    dispatch(
      adminActions.adminFailed(
        error.response?.data?.message || "Failed to fetch bookings"
      )
    );
  }
};

export const cancelAdminBooking = (bookingId) => async (dispatch) => {
  try {
    dispatch(adminActions.adminRequest());
    await axiosInstance.delete(`/v1/admin/bookings/${bookingId}`);
    dispatch(adminActions.cancelBookingAdminSuccess(bookingId));
  } catch (error) {
    dispatch(
      adminActions.adminFailed(
        error.response?.data?.message || "Failed to cancel booking"
      )
    );
  }
};

export const fetchAdminReviews = () => async (dispatch) => {
  try {
    dispatch(adminActions.adminRequest());
    const response = await axiosInstance.get("/v1/admin/reviews");
    dispatch(adminActions.getAdminReviewsSuccess(response.data.reviews || []));
  } catch (error) {
    dispatch(
      adminActions.adminFailed(
        error.response?.data?.message || "Failed to fetch reviews"
      )
    );
  }
};

export const deleteAdminReview = (propertyId, reviewId) => async (dispatch) => {
  try {
    dispatch(adminActions.adminRequest());
    await axiosInstance.delete(`/v1/admin/properties/${propertyId}/reviews/${reviewId}`);
    dispatch(adminActions.deleteReviewAdminSuccess(reviewId));
  } catch (error) {
    dispatch(
      adminActions.adminFailed(
        error.response?.data?.message || "Failed to delete review"
      )
    );
  }
};
