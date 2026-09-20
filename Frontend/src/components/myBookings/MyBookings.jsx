import React, { useEffect, useState } from "react";
import "../../css/MyBookings.css";
import ProgressSteps from "../ProgressSteps";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings, cancelBookingAction } from "../../store/Booking/booking-action";
import { bookingActions } from "../../store/Booking/booking-slice";
import toast from "react-hot-toast";

const MyBookings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bookings = [], loading } = useSelector(
    (state) => state.booking || {}
  );
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const handleBookingClick = (bookingId) => {
    navigate(`/user/myBookings/${bookingId}`);
  };

  const handlePayNow = (e, booking) => {
    e.stopPropagation();
    const propertyId = booking.property?._id || booking.property;
    dispatch(
      bookingActions.setOrderData({
        orderId: "order_" + Date.now(),
        bookingId: booking._id,
        amount: booking.price,
        nights: booking.numberOfNights,
        propertyId,
        fromDate: booking.fromDate,
        toDate: booking.toDate,
        guests: booking.guests,
      })
    );
    navigate(`/payment/${propertyId}`);
  };

  const handleCancelBooking = async (e, bookingId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to cancel this booking request?")) {
      try {
        await dispatch(cancelBookingAction(bookingId));
        toast.success("Booking request cancelled.");
      } catch (err) {
        toast.error(err.message || "Failed to cancel booking");
      }
    }
  };

  const pendingBookings = bookings.filter((b) => b.bookingStatus === "Pending");
  const acceptedBookings = bookings.filter((b) => b.bookingStatus === "Accepted");
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === "Confirmed" || b.paid);
  const rejectedBookings = bookings.filter((b) => b.bookingStatus === "Rejected");

  const displayedBookings =
    activeTab === "pending"
      ? pendingBookings
      : activeTab === "accepted"
      ? acceptedBookings
      : activeTab === "confirmed"
      ? confirmedBookings
      : activeTab === "rejected"
      ? rejectedBookings
      : bookings;

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "70vh" }}>
        <LoadingSpinner />
        <p className="mt-3">Loading your bookings...</p>
      </div>
    );
  }

  const renderStatusBadge = (status, paid) => {
    if (paid || status === "Confirmed") {
      return (
        <span className="hh-badge hh-badge-confirmed">
          ✅ Payment Successful — Confirmed
        </span>
      );
    }
    if (status === "Accepted") {
      return (
        <span className="hh-badge hh-badge-accepted">
          ⚡ Booking Accepted — Payment Pending
        </span>
      );
    }
    if (status === "Rejected") {
      return (
        <span className="hh-badge hh-badge-rejected">
          ❌ Request Declined by Host
        </span>
      );
    }
    if (status === "Cancelled") {
      return (
        <span className="hh-badge hh-badge-cancelled">
          🚫 Booking Cancelled
        </span>
      );
    }
    return (
      <span className="hh-badge hh-badge-pending">
        ⏳ Awaiting Owner Approval
      </span>
    );
  };

  return (
    <>
      <ProgressSteps />
      <div style={{ maxWidth: "1100px", margin: "30px auto", padding: "0 24px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "32px", color: "#0f172a" }}>
            My Bookings & Requests
          </h2>
          <p style={{ color: "#64748b", fontSize: "15px" }}>
            Track your property booking requests, host approvals, and payment statuses.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "28px" }}>
          <button
            onClick={() => setActiveTab("all")}
            className={`hh-btn ${activeTab === "all" ? "hh-btn-accent" : "hh-btn-outline"}`}
            style={{ padding: "8px 18px", fontSize: "14px" }}
          >
            All Requests ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`hh-btn ${activeTab === "pending" ? "hh-btn-accent" : "hh-btn-outline"}`}
            style={{ padding: "8px 18px", fontSize: "14px" }}
          >
            ⏳ Pending ({pendingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab("accepted")}
            className={`hh-btn ${activeTab === "accepted" ? "hh-btn-accent" : "hh-btn-outline"}`}
            style={{ padding: "8px 18px", fontSize: "14px" }}
          >
            ⚡ Accepted ({acceptedBookings.length})
          </button>
          <button
            onClick={() => setActiveTab("confirmed")}
            className={`hh-btn ${activeTab === "confirmed" ? "hh-btn-accent" : "hh-btn-outline"}`}
            style={{ padding: "8px 18px", fontSize: "14px" }}
          >
            ✅ Confirmed ({confirmedBookings.length})
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`hh-btn ${activeTab === "rejected" ? "hh-btn-accent" : "hh-btn-outline"}`}
            style={{ padding: "8px 18px", fontSize: "14px" }}
          >
            ❌ Declined ({rejectedBookings.length})
          </button>
        </div>

        {displayedBookings.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#ffffff",
              borderRadius: "24px",
              border: "1px dashed #cbd5e1",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#64748b" }}>
              luggage
            </span>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, marginTop: "12px" }}>
              No {activeTab !== "all" ? activeTab : ""} bookings found
            </h3>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
              You don't have any stays in this category yet.
            </p>
            <button className="hh-btn hh-btn-accent" onClick={() => navigate("/")}>
              Explore Properties
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {displayedBookings.map((booking) => {
              const property = booking.property || {};
              const owner = booking.owner || {};
              const propertyImage =
                property.images?.length > 0
                  ? property.images[0].url
                  : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";

              const status = booking.bookingStatus || "Pending";
              const isAccepted = status === "Accepted" && !booking.paid;
              const isPending = status === "Pending";

              return (
                <div
                  key={booking._id}
                  onClick={() => handleBookingClick(booking._id)}
                  style={{
                    background: "#ffffff",
                    borderRadius: "24px",
                    border: "1px solid rgba(226, 232, 240, 0.8)",
                    padding: "20px",
                    boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.06)",
                    cursor: "pointer",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "24px",
                    alignItems: "center",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 12px 28px -6px rgba(15, 23, 42, 0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px -2px rgba(15, 23, 42, 0.06)";
                  }}
                >
                  {/* Thumbnail Image */}
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <img
                      src={propertyImage}
                      alt={property.propertyName}
                      style={{
                        width: "120px",
                        height: "100px",
                        borderRadius: "16px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      {renderStatusBadge(status, booking.paid)}
                      <h4
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 700,
                          fontSize: "18px",
                          marginTop: "8px",
                          marginBottom: "4px",
                          color: "#0f172a",
                        }}
                      >
                        {property.propertyName || "Property Stay"}
                      </h4>
                      <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                        📍 {property.address?.city || "India"}, {property.address?.state || ""}
                      </p>
                    </div>
                  </div>

                  {/* Dates & Guests */}
                  <div style={{ fontSize: "13px", color: "#475569", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div>
                      <strong>Dates: </strong>
                      {new Date(booking.fromDate).toLocaleDateString()} — {new Date(booking.toDate).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Nights & Guests: </strong>
                      {booking.numberOfNights || 1} Nights • {booking.guests || 1} Guests
                    </div>
                    {owner.name && (
                      <div style={{ color: "#0d9488" }}>
                        <strong>Host: </strong>{owner.name} ({owner.phoneNumber || owner.email || "Contact Available"})
                      </div>
                    )}
                  </div>

                  {/* Pricing & Action */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "12px", color: "#64748b", display: "block" }}>Total Booking Amount</span>
                      <strong style={{ fontSize: "22px", fontFamily: "'Outfit', sans-serif", color: "#0f172a" }}>
                        ₹{booking.price?.toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      {isAccepted && (
                        <button
                          onClick={(e) => handlePayNow(e, booking)}
                          className="hh-btn hh-btn-accent"
                          style={{ padding: "8px 20px", fontSize: "14px", animation: "pulseGlow 2s infinite" }}
                        >
                          💳 Pay Now (₹{booking.price})
                        </button>
                      )}

                      {(isPending || isAccepted) && (
                        <button
                          onClick={(e) => handleCancelBooking(e, booking._id)}
                          style={{
                            background: "transparent",
                            border: "1px solid #ef4444",
                            color: "#ef4444",
                            borderRadius: "9999px",
                            padding: "8px 16px",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MyBookings;


