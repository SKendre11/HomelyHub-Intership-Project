import React, { useState } from "react";
import "../../css/Payment.css";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { confirmBooking } from "../../store/Booking/booking-action";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { propertyId } = useParams();

  const { currentOrder, loading, error } = useSelector(
    (state) => state.booking || {}
  );
  const { propertyDetails } = useSelector(
    (state) => state.propertyDetails || {}
  );

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "**** **** **** 4242",
    expiry: "12/28",
    cvv: "***",
    nameOnCard: "John Doe",
  });
  const [upiId, setUpiId] = useState("user@upi");
  const [showGateway, setShowGateway] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const checkinDate = currentOrder?.fromDate
    ? new Date(currentOrder.fromDate).toLocaleDateString()
    : "Not selected";
  const checkoutDate = currentOrder?.toDate
    ? new Date(currentOrder.toDate).toLocaleDateString()
    : "Not selected";
  const totalPrice = currentOrder?.amount || 0;
  const propertyName = propertyDetails?.propertyName || "HomelyHub Stay";
  const guests = currentOrder?.guests || 1;
  const nights = currentOrder?.nights || 1;

  const handleProceedToGateway = () => {
    if (!currentOrder) {
      toast.error("No active booking summary found. Please select dates again.");
      navigate(`/propertylist/${propertyId}`);
      return;
    }
    setShowGateway(true);
  };

  const handleConfirmPayment = async () => {
    try {
      setConfirming(true);
      const res = await dispatch(
        confirmBooking({
          orderId: currentOrder.orderId,
          bookingDetails: currentOrder,
          forceStatus: "success",
        })
      );

      if (res && res.success !== false) {
        toast.success("🎉 Payment Successful & Booking Confirmed!");
        setShowGateway(false);
        navigate("/user/mybookings");
      } else {
        toast.error("Payment verification failed. Please try again.");
      }
    } catch (err) {
      toast.error(err.message || "Payment processing failed");
    } finally {
      setConfirming(false);
    }
  };

  const handleCancel = () => {
    toast.error("Booking process cancelled");
    navigate(`/propertylist/${propertyId}`);
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Secure Payment & Checkout</h1>
        <p>{propertyName}</p>
      </div>

      <div className="payment-content">
        {/* Booking Summary Card */}
        <div className="booking-summary-card">
          <h3>Reservation Summary</h3>
          <div className="detail-row">
            <span>Property:</span>
            <strong>{propertyName}</strong>
          </div>
          <div className="detail-row">
            <span>Check-in:</span>
            <span>{checkinDate}</span>
          </div>
          <div className="detail-row">
            <span>Check-out:</span>
            <span>{checkoutDate}</span>
          </div>
          <div className="detail-row">
            <span>Guests:</span>
            <span>{guests} Guests</span>
          </div>
          <div className="detail-row">
            <span>Nights:</span>
            <span>{nights} Nights</span>
          </div>
          <div className="detail-row total-row">
            <strong>Total Amount:</strong>
            <strong style={{ color: "#ff385c", fontSize: "18px" }}>
              ₹{totalPrice.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        {/* Payment Methods Selection */}
        <div className="payment-method-card" style={{ marginTop: "20px", background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #ddd" }}>
          <h3>Select Payment Method</h3>
          <div style={{ display: "flex", gap: "15px", margin: "15px 0" }}>
            <label style={{ flex: 1, padding: "12px", border: paymentMethod === "card" ? "2px solid #ff385c" : "1px solid #ccc", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                name="pm"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              💳 Credit / Debit Card
            </label>
            <label style={{ flex: 1, padding: "12px", border: paymentMethod === "upi" ? "2px solid #ff385c" : "1px solid #ccc", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                name="pm"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              📱 UPI / GPay / PhonePe
            </label>
          </div>

          {paymentMethod === "card" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
              <input
                type="text"
                placeholder="Card Number"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
                <input
                  type="password"
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                  style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              </div>
            </div>
          )}

          {paymentMethod === "upi" && (
            <div style={{ marginTop: "10px" }}>
              <input
                type="text"
                placeholder="Enter UPI ID (e.g. name@upi)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
            </div>
          )}
        </div>

        {error && <div className="error-message" style={{ color: "red", marginTop: "10px" }}>{error}</div>}

        <div className="payment-action" style={{ display: "flex", gap: "15px", marginTop: "24px" }}>
          <button
            onClick={handleCancel}
            className="book-now-btn"
            style={{ backgroundColor: "#888", flex: 1 }}
          >
            Cancel
          </button>
          <button
            onClick={handleProceedToGateway}
            disabled={loading || confirming || !currentOrder}
            className="book-now-btn"
            style={{ flex: 2, backgroundColor: "#ff385c" }}
          >
            Pay & Confirm ₹{totalPrice.toLocaleString("en-IN")}
          </button>
        </div>
      </div>

      {/* HomelyHub Gateway Modal */}
      {showGateway && (
        <div className="payment-gateway-overlay" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000 }}>
          <div className="payment-gateway-modal" style={{ background: "#fff", padding: "30px", borderRadius: "16px", maxWidth: "480px", width: "100%", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <div className="gateway-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "20px" }}>🏠 HomelyHub Secure Pay</h2>
                <span style={{ fontSize: "12px", color: "#777" }}>Order ID: {currentOrder?.orderId}</span>
              </div>
              <span style={{ fontSize: "12px", background: "#e8f5e9", color: "#2e7d32", padding: "4px 8px", borderRadius: "12px", fontWeight: "bold" }}>🔒 256-Bit SSL</span>
            </div>

            <div className="gateway-content">
              <p style={{ margin: "0 0 15px 0", fontSize: "15px" }}>
                Confirm payment for <strong>{propertyName}</strong> ({nights} Nights)
              </p>
              <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "16px" }}>
                  <span>Amount to Pay:</span>
                  <span style={{ color: "#ff385c" }}>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setShowGateway(false)}
                  disabled={confirming}
                  style={{ flex: 1, padding: "12px", border: "1px solid #ccc", background: "#f5f5f5", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={confirming}
                  style={{ flex: 2, padding: "12px", border: "none", background: "#ff385c", color: "#fff", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                >
                  {confirming ? "Processing Payment..." : `Authorize ₹${totalPrice.toLocaleString("en-IN")}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
