import React, { useEffect } from "react";

import "../../css/PropertyListing.css";

import PropertyImg from "./PropertyImg";
import PaymentForm from "./PaymentForm";
import PropertyAmenities from "./PropertyAmenities";
import PropertMapInfo from "./PropertyMapInfo";

import { useParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";

import { useDispatch, useSelector } from "react-redux";

import { getPropertyDetails } from "../../store/PropertyDetails/propertyDetails-action.js";


const PropertyListing = () => {
  const dispatch = useDispatch();

  // Get property ID from URL
  const { id } = useParams();

  // Get property details from Redux
  const {
    loading = false,
    propertyDetails = null,
    error = null,
  } = useSelector(
    (state) => state.propertyDetails || {}
  );


  // ============================================================
  // FETCH PROPERTY DETAILS
  // ============================================================

  useEffect(() => {
    if (!id) {
      console.error("❌ Property ID is missing from URL");
      return;
    }

    console.log("====================================");
    console.log("🏠 PROPERTY DETAILS PAGE");
    console.log("Property ID:", id);
    console.log("====================================");

    dispatch(getPropertyDetails(id));
  }, [dispatch, id]);


  // ============================================================
  // PROPERTY ID MISSING
  // ============================================================

  if (!id) {
    return (
      <div className="property-error">
        <div className="property-error-content">

          <span className="material-symbols-outlined">
            error
          </span>

          <h2>Property ID Missing</h2>

          <p>
            We could not find a property ID in the URL.
          </p>

          <p>
            Please go back and select a property again.
          </p>

        </div>
      </div>
    );
  }


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="property-loading">

        <LoadingSpinner />

        <p>
          Loading property details...
        </p>

      </div>
    );
  }


  // ============================================================
  // API ERROR
  // ============================================================

  if (error) {
    return (
      <div className="property-error">

        <div className="property-error-content">

          <span className="material-symbols-outlined">
            error
          </span>

          <h2>
            Unable to Load Property
          </h2>

          <p>
            {error}
          </p>

          <p className="property-error-id">
            Property ID: {id}
          </p>

          <button
            type="button"
            className="retry-button"
            onClick={() =>
              dispatch(getPropertyDetails(id))
            }
          >
            <span className="material-symbols-outlined">
              refresh
            </span>

            Try Again
          </button>

        </div>

      </div>
    );
  }


  // ============================================================
  // PROPERTY NOT FOUND
  // ============================================================

  if (!propertyDetails) {
    return (
      <div className="property-error">

        <div className="property-error-content">

          <span className="material-symbols-outlined">
            home
          </span>

          <h2>
            Property Not Found
          </h2>

          <p>
            We could not find the property you are looking for.
          </p>

          <p className="property-error-id">
            Property ID: <strong>{id}</strong>
          </p>

          <button
            type="button"
            className="retry-button"
            onClick={() =>
              dispatch(getPropertyDetails(id))
            }
          >

            <span className="material-symbols-outlined">
              refresh
            </span>

            Try Again

          </button>

        </div>

      </div>
    );
  }


  // ============================================================
  // PROPERTY DATA
  // ============================================================

  const {
    propertyName = "Property",
    address = {},
    description = "No description available.",
    images = [],
    amenities = [],
    maximumGuest = 0,
    price = 0,

    // Your Property model uses currentBooking
    currentBooking = [],

    // Fallback if another document uses currentBookings
    currentBookings = [],

  } = propertyDetails;


  // ============================================================
  // PROPERTY ADDRESS
  // ============================================================

  const propertyAddress = [
    address?.area,
    address?.city,
    address?.state,
    address?.pincode,
  ]
    .filter(Boolean)
    .join(", ");


  // ============================================================
  // BOOKINGS
  // ============================================================

  const bookings =
    currentBooking?.length > 0
      ? currentBooking
      : currentBookings || [];


  // ============================================================
  // MAIN PROPERTY PAGE
  // ============================================================

  return (
    <div className="property-container">


      {/* ======================================================
          PROPERTY TITLE
      ====================================================== */}

      <p className="property-header">
        {propertyName}
      </p>


      {/* ======================================================
          PROPERTY LOCATION
      ====================================================== */}

      <h6 className="property-location">

        <span className="material-symbols-outlined">
          house
        </span>

        <span className="location">
          {propertyAddress || "Location not available"}
        </span>

      </h6>


      {/* ======================================================
          PROPERTY IMAGES
      ====================================================== */}

      <PropertyImg
        images={images || []}
      />


      {/* ======================================================
          MIDDLE SECTION
      ====================================================== */}

      <div className="middle-container row">


        {/* ====================================================
            DESCRIPTION + AMENITIES
        ==================================================== */}

        <div className="des-and-amenities col-md-8 col-sm-12 col-12">


          {/* DESCRIPTION */}

          <h2 className="property-description-header">
            Description
          </h2>

          <p className="property-description">

            {description || "No description available."}

            <br />
            <br />

            <strong>
              Maximum number of guests:
            </strong>{" "}

            {maximumGuest || "Not specified"}

          </p>


          <hr />


          {/* AMENITIES */}

          <PropertyAmenities
            amenities={amenities || []}
          />

        </div>


        {/* ====================================================
            PAYMENT
        ==================================================== */}

        <div className="property-payment col-md-4 col-sm-12 col-12">

          <PaymentForm
            propertyId={id}
            price={price}
            propertyName={propertyName}
            address={address}
            maximumGuest={maximumGuest}
            currentBookings={bookings}
          />

        </div>

      </div>


      {/* ======================================================
          MAP
      ====================================================== */}

      <hr />

      <div className="property-map">

        <div className="map-image-exinfo-container row">

          <PropertMapInfo
            address={address}
          />

        </div>

      </div>

    </div>
  );
};


export default PropertyListing;
