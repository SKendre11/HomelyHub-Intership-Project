import React from "react";
import ProgressSteps from "../ProgressSteps";
import { Link } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import moment from "moment";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.user || {});

  return (
    <>
      <ProgressSteps profile />
      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 24px" }}>
        {loading && (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
            <LoadingSpinner />
          </div>
        )}

        {user && !loading && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "32px",
              padding: "40px",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              boxShadow: "0 12px 36px -8px rgba(15, 23, 42, 0.08)",
            }}
          >
            {/* User Profile Header */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "24px",
                paddingBottom: "32px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid #ff385c",
                  boxShadow: "0 4px 15px rgba(255, 56, 92, 0.2)",
                }}
              >
                <img
                  src={user.avatar?.url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"}
                  alt={user.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div>
                <span
                  style={{
                    background: "#f1f5f9",
                    color: "#0f172a",
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {user.role === "host" ? "🏡 Verified Host" : user.role === "admin" ? "🛡️ Admin" : "🧳 Guest Member"}
                </span>

                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "30px", margin: "8px 0 4px 0", color: "#0f172a" }}>
                  {user.name}
                </h2>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                  Member since {moment(user.createdAt).format("MMMM YYYY")}
                </p>
              </div>
            </div>

            {/* Profile Info Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "24px",
                margin: "32px 0",
              }}
            >
              <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "20px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                  Full Name
                </span>
                <p style={{ fontSize: "17px", fontWeight: 600, margin: "6px 0 0 0", color: "#0f172a" }}>
                  {user.name}
                </p>
              </div>

              <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "20px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                  Email Address
                </span>
                <p style={{ fontSize: "17px", fontWeight: 600, margin: "6px 0 0 0", color: "#0f172a" }}>
                  {user.email}
                </p>
              </div>

              <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "20px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                  Phone Number
                </span>
                <p style={{ fontSize: "17px", fontWeight: 600, margin: "6px 0 0 0", color: "#0f172a" }}>
                  {user.phoneNumber || "Not provided"}
                </p>
              </div>
            </div>

            {/* Shortcuts */}
            <div style={{ marginBottom: "32px" }}>
              <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "18px", marginBottom: "16px" }}>
                Quick Shortcuts
              </h4>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <Link to="/user/mybookings" className="hh-btn hh-btn-outline" style={{ fontSize: "14px" }}>
                  🧳 My Bookings & Requests
                </Link>
                <Link to="/user/wishlist" className="hh-btn hh-btn-outline" style={{ fontSize: "14px" }}>
                  ❤️ Saved Wishlist
                </Link>
                <Link to="/host/dashboard" className="hh-btn hh-btn-outline" style={{ fontSize: "14px" }}>
                  🏡 Host Dashboard
                </Link>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", paddingTop: "20px", borderTop: "1px solid #f1f5f9" }}>
              <Link to="/editprofile" className="hh-btn hh-btn-accent">
                Edit Profile Information
              </Link>
              <Link to="/user/updatepassword" className="hh-btn hh-btn-outline">
                Change Password
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;

