import { bookingActions } from "./booking-slice.js";
import { axiosInstance } from "../../utils/axios.js";

// CREATE BOOKING ORDER (calculates amount on backend & checks overlaps)
export const createBookingOrder = (bookingData) => async (dispatch) => {
  try {
    dispatch(bookingActions.getRequest());

    const { data } = await axiosInstance.post(
      "/v1/rent/user/booking/create-order",
      bookingData
    );

    dispatch(bookingActions.setOrderData(data));
    return data;
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || "Failed to create booking order";
    dispatch(bookingActions.getError(errorMsg));
    throw new Error(errorMsg);
  }
};

// CONFIRM BOOKING & SAVE TO DATABASE
export const confirmBooking = (confirmData) => async (dispatch) => {
  try {
    dispatch(bookingActions.getRequest());

    const { data } = await axiosInstance.post(
      "/v1/rent/user/booking/verify-payment",
      confirmData
    );

    dispatch(bookingActions.setBookingDetails(data.booking));
    return data;
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || "Failed to confirm booking";
    dispatch(bookingActions.getError(errorMsg));
    throw new Error(errorMsg);
  }
};

// FETCH USER BOOKINGS
export const fetchUserBookings = () => async (dispatch) => {
  try {
    dispatch(bookingActions.getRequest());

    const { data } = await axiosInstance.get("/v1/rent/user/booking");

    dispatch(bookingActions.setBookings(data.data?.bookings || []));
  } catch (error) {
    dispatch(
      bookingActions.getError(
        error.response?.data?.message || "Failed to fetch bookings"
      )
    );
  }
};

// FETCH ONE BOOKING DETAILS
export const fetchBookingDetails = (bookingId) => async (dispatch) => {
  try {
    dispatch(bookingActions.getRequest());

    const { data } = await axiosInstance.get(
      `/v1/rent/user/booking/${bookingId}`
    );

    dispatch(bookingActions.setBookingDetails(data.data?.booking));
  } catch (error) {
    dispatch(
      bookingActions.getError(
        error.response?.data?.message || "Failed to fetch booking details"
      )
    );
  }
};

// CANCEL BOOKING
export const cancelBookingAction = (bookingId) => async (dispatch) => {
  try {
    dispatch(bookingActions.getRequest());

    await axiosInstance.delete(`/v1/rent/user/booking/${bookingId}`);

    dispatch(bookingActions.removeBooking(bookingId));
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || "Failed to cancel booking";
    dispatch(bookingActions.getError(errorMsg));
    throw new Error(errorMsg);
  }
};

// RESPOND TO BOOKING REQUEST (OWNER ACCEPT / REJECT)
export const respondToBookingRequest = (bookingId, status) => async (dispatch) => {
  try {
    dispatch(bookingActions.getRequest());

    const { data } = await axiosInstance.patch(
      `/v1/rent/user/booking/${bookingId}/respond`,
      { status }
    );

    return data;
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || "Failed to respond to booking request";
    dispatch(bookingActions.getError(errorMsg));
    throw new Error(errorMsg);
  }
};

