import React, { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { DatePicker, Space } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { createBookingOrder } from "../../store/Booking/booking-action";
import toast from "react-hot-toast";

const PaymentForm = ({
  price,
  propertyName,
  address,
  maximumGuest,
  propertyId,
  currentBookings = [],
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;

  const { isAuthenticated, user } = useSelector((state) => state.user || {});

  const [calculatedPrice, setCalulatedPrice] = useState(0);

  const isDateDisabled = (current) => {
    const today = moment().startOf("day");
    if (current.isBefore(today)) {
      return true;
    }

    return currentBookings.some((booking) => {
      const startDate = moment(booking.fromDate).startOf("day");
      const endDate = moment(booking.toDate).startOf("day");
      const currentMoment = moment(current.toDate()).startOf("day");

      return (
        currentMoment.isSameOrAfter(startDate) &&
        currentMoment.isSameOrBefore(endDate)
      );
    });
  };

  const form = useForm({
    defaultValues: {
      dateRange: [],
      guests: "1",
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || "",
    },
    onSubmit: async ({ value }) => {
      if (!value.dateRange || value.dateRange.length < 2) {
        toast.error("Please select valid check-in and check-out dates.");
        return;
      }

      const [checkinDate, checkoutDate] = value.dateRange;
      const guests = Number(value.guests);

      if (!guests || guests <= 0 || guests > maximumGuest) {
        toast.error(`Guests must be between 1 and ${maximumGuest}`);
        return;
      }

      try {
        const res = await dispatch(
          createBookingOrder({
            propertyId,
            fromDate: checkinDate,
            toDate: checkoutDate,
            guests,
          })
        );

        toast.success("📩 Booking request sent to owner for approval!");
        navigate("/user/mybookings");
      } catch (err) {
        toast.error(err.message || "Failed to create booking request");
      }
    },

  });

  useEffect(() => {
    if (user) {
      form.setFieldValue("name", user.name || "");
      form.setFieldValue("phoneNumber", user.phoneNumber || "");
    }
  }, [user]);


  return (
    <div className="form-container">
      <form
        className="payment-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="price-pernight">
          Price: <b>&#8377;{price}</b>
          <span> / Per night</span>
        </div>
        <div className="payment-field">
          <form.Field name="dateRange">
            {(field) => (
              <div className="date">
                <Space direction="vertical" size={12}>
                  <RangePicker
                    format="YYYY-MM-DD"
                    picker="date"
                    disabledDate={isDateDisabled}
                    onChange={(value, dateString) => {
                      field.handleChange(dateString);
                      const [checkin, checkout] = dateString;
                      if (checkin && checkout) {
                        const nights = moment(checkout, "YYYY-MM-DD").diff(
                          moment(checkin, "YYYY-MM-DD"),
                          "days"
                        );
                        const total = price * nights;
                        setCalulatedPrice(total);
                      } else {
                        setCalulatedPrice(0);
                      }
                    }}
                  />
                </Space>
              </div>
            )}
          </form.Field>
          <form.Field
            name="guests"
            validators={{
              onChange: ({ value }) =>
                value > 0 && value <= maximumGuest
                  ? undefined
                  : `Guests must be 1 - ${maximumGuest}`,
            }}
          >
            {(field) => (
              <div className="guest">
                <label className="payment-labels">Number of guests:</label>
                <br></br>
                <input
                  type="number"
                  className="no-of-guest"
                  placeholder="Guest"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                ></input>
                {field.state.meta.errors && (
                  <p style={{ color: "red" }}>{field.state.meta.errors}</p>
                )}
              </div>
            )}
          </form.Field>
          <div className="name-phoneno">
            <form.Field name="name">
              {(field) => (
                <>
                  <label className="payment-labels">Your full name:</label>{" "}
                  <br></br>
                  <input
                    type="text"
                    className="full-name"
                    placeholder="Name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  ></input>
                </>
              )}
            </form.Field>
            <br></br>
            <form.Field name="phoneNumber">
              {(field) => (
                <>
                  <label className="payment-labels">Phone Number:</label>{" "}
                  <br></br>
                  <input
                    type="number"
                    className="phone-number"
                    placeholder="Number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  ></input>
                </>
              )}
            </form.Field>
          </div>
        </div>
        <div className="book-place">
          {!isAuthenticated ? (
            <button type="button" onClick={() => navigate("/login")}>
              Login to Request Booking
            </button>
          ) : (
            <button type="submit">Request Booking • &#8377;{calculatedPrice}</button>
          )}

        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
