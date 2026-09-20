import {propertyAction} from "./property-slice.js";
import {axiosInstance} from "../../utils/axios.js";

//get all properties
//1. start api req
//2. tell redux loading is started
//3. get search parameters
//4. call backend api
//5 Wait for response
//6. get property data
//7. send data to reduc store 
//8.if error send error to redux store
//dispatch => SEND to redux store
//getState => get data from redux store

export const getAllProperties = () => async (dispatch, getState) => {
  try {
    console.log("API call started");

    dispatch(propertyAction.getRequest());

    const { searchParams } = getState().property;

    console.log("Search Params:", searchParams);

    const response = await axiosInstance.get(
      "/v1/rent/listing/properties",
      {
        params: {
          ...searchParams,
        },
      }
    );

    if (!response || !response.data) {
      throw new Error("Could not fetch properties");
    }

    console.log("API Response:", response.data);

    dispatch(propertyAction.getProperties(response.data));
  } catch (error) {
    console.error("Property API Error:", error);

    dispatch(
      propertyAction.getError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch properties"
      )
    );
  }
};

