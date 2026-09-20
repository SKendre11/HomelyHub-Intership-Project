import {
  propertyDetailsAction,
} from "./propertyDetails-slice.js";

import {
  axiosInstance,
} from "../../utils/axios.js";


// ============================================================
// GET PROPERTY DETAILS
// ============================================================

export const getPropertyDetails = (id) => async (dispatch) => {

  try {

    // ----------------------------------------------------------
    // Check property ID
    // ----------------------------------------------------------

    if (!id) {
      throw new Error(
        "Property ID is missing."
      );
    }


    console.log(
      "===================================="
    );

    console.log(
      "🔍 PROPERTY DETAILS REQUEST"
    );

    console.log(
      "Property ID:",
      id
    );

    console.log(
      "===================================="
    );


    // ----------------------------------------------------------
    // SET LOADING
    // ----------------------------------------------------------

    dispatch(
      propertyDetailsAction.getListRequest()
    );


    // ----------------------------------------------------------
    // API CALL
    // ----------------------------------------------------------

    const response =
      await axiosInstance.get(
        `/v1/rent/listing/properties/${id}`
      );


    console.log(
      "===================================="
    );

    console.log(
      "✅ PROPERTY DETAILS API RESPONSE"
    );

    console.log(
      response.data
    );

    console.log(
      "===================================="
    );


    // ----------------------------------------------------------
    // CHECK RESPONSE
    // ----------------------------------------------------------

    if (!response) {
      throw new Error(
        "No response received from server."
      );
    }


    if (!response.data) {
      throw new Error(
        "Server returned an empty response."
      );
    }


    // ----------------------------------------------------------
    // GET PROPERTY FROM RESPONSE
    // ----------------------------------------------------------

    const property =
      response.data.data;


    if (!property) {

      throw new Error(
        "Property details were not found in the server response."
      );

    }


    console.log(
      "✅ PROPERTY FOUND:",
      property
    );


    // ----------------------------------------------------------
    // SAVE PROPERTY TO REDUX
    // ----------------------------------------------------------

    dispatch(
      propertyDetailsAction.getPropertyDetails(
        property
      )
    );


  } catch (error) {

    console.error(
      "===================================="
    );

    console.error(
      "❌ PROPERTY DETAILS ERROR"
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Response:",
      error.response?.data
    );

    console.error(
      "Status:",
      error.response?.status
    );

    console.error(
      "===================================="
    );


    // ----------------------------------------------------------
    // CLEAR ERROR MESSAGE
    // ----------------------------------------------------------

    let errorMessage =
      "Unable to load property details.";


    if (error.response?.status === 404) {

      errorMessage =
        "Property not found. Please check the property ID.";

    }

    else if (error.response?.status === 400) {

      errorMessage =
        error.response?.data?.message ||
        "Invalid property ID.";

    }

    else if (error.response?.status === 500) {

      errorMessage =
        "Server error while loading property details.";

    }

    else if (error.response?.data?.message) {

      errorMessage =
        error.response.data.message;

    }

    else if (error.message) {

      errorMessage =
        error.message;

    }


    // ----------------------------------------------------------
    // SAVE ERROR TO REDUX
    // ----------------------------------------------------------

    dispatch(
      propertyDetailsAction.getListError(
        errorMessage
      )
    );

  }
};