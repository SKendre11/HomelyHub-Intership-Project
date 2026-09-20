import { axiosInstance } from "../../utils/axios";
import { hostActions } from "./host-slice";

export const fetchHostProperties = () => async (dispatch) => {
  try {
    dispatch(hostActions.hostRequest());
    const response = await axiosInstance.get("/v1/host/properties");
    dispatch(hostActions.getPropertiesSuccess(response.data.properties || []));
  } catch (error) {
    dispatch(
      hostActions.hostFailed(
        error.response?.data?.message || "Failed to fetch host properties"
      )
    );
  }
};

export const fetchHostBookings = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get("/v1/host/bookings");
    dispatch(hostActions.getBookingsSuccess(response.data.bookings || []));
  } catch (error) {
    dispatch(
      hostActions.hostFailed(
        error.response?.data?.message || "Failed to fetch host bookings"
      )
    );
  }
};

export const fetchHostStats = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get("/v1/host/stats");
    dispatch(hostActions.getStatsSuccess(response.data.stats || {}));
  } catch (error) {
    console.error("Failed to fetch host stats", error);
  }
};

export const createHostProperty = (propertyData) => async (dispatch) => {
  try {
    dispatch(hostActions.hostRequest());
    const response = await axiosInstance.post("/v1/host/properties", propertyData);
    dispatch(hostActions.createPropertySuccess(response.data.property));
    return { success: true };
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to create property";
    dispatch(hostActions.hostFailed(msg));
    return { success: false, message: msg };
  }
};

export const updateHostProperty = (id, propertyData) => async (dispatch) => {
  try {
    dispatch(hostActions.hostRequest());
    const response = await axiosInstance.put(`/v1/host/properties/${id}`, propertyData);
    dispatch(hostActions.updatePropertySuccess(response.data.property));
    return { success: true };
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to update property";
    dispatch(hostActions.hostFailed(msg));
    return { success: false, message: msg };
  }
};

export const deleteHostProperty = (id) => async (dispatch) => {
  try {
    dispatch(hostActions.hostRequest());
    await axiosInstance.delete(`/v1/host/properties/${id}`);
    dispatch(hostActions.deletePropertySuccess(id));
    return { success: true };
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to delete property";
    dispatch(hostActions.hostFailed(msg));
    return { success: false, message: msg };
  }
};
