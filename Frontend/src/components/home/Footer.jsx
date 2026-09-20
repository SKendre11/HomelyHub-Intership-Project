import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#0f172a",
        color: "#94a3b8",
        padding: "60px 40px 30px 40px",
        marginTop: "80px",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "40px",
          marginBottom: "40px",
        }}
      >
        {/* Brand Column */}
        <div style={{ gridColumn: "span 1" }}>
          <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #ff385c 0%, #e11d48 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                home_pin
              </span>
            </div>
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: "22px",
                color: "#ffffff",
              }}
            >
              Homely<span style={{ color: "#ff385c" }}>Hub</span>
            </span>
          </div>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#94a3b8" }}>
            Discover extraordinary sanctuaries, luxury villas, and handpicked boutique accommodations across India.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h5 style={{ color: "#ffffff", fontFamily: "'Outfit', sans-serif", fontSize: "16px", marginBottom: "16px" }}>
            Explore
          </h5>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
            <li><Link to="/" style={{ color: "#94a3b8", textDecoration: "none" }}>All Properties</Link></li>
            <li><Link to="/ai-trip-planner" style={{ color: "#94a3b8", textDecoration: "none" }}>AI Trip Planner</Link></li>
            <li><Link to="/host/dashboard" style={{ color: "#94a3b8", textDecoration: "none" }}>Become a Host</Link></li>
            <li><Link to="/user/wishlist" style={{ color: "#94a3b8", textDecoration: "none" }}>Saved Wishlist</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h5 style={{ color: "#ffffff", fontFamily: "'Outfit', sans-serif", fontSize: "16px", marginBottom: "16px" }}>
            Support & Community
          </h5>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
            <li><span style={{ color: "#94a3b8" }}>24/7 Guest Support</span></li>
            <li><span style={{ color: "#94a3b8" }}>Trust & Safety</span></li>
            <li><span style={{ color: "#94a3b8" }}>Cancellation Options</span></li>
            <li><span style={{ color: "#94a3b8" }}>Host Guarantee</span></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h5 style={{ color: "#ffffff", fontFamily: "'Outfit', sans-serif", fontSize: "16px", marginBottom: "16px" }}>
            Stay Inspired
          </h5>
          <p style={{ fontSize: "13px", color: "#94a3b8" }}>
            Receive curated travel inspiration and exclusive member offers.
          </p>
          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            <input
              type="email"
              placeholder="Your email address"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "9999px",
                padding: "8px 16px",
                color: "#fff",
                fontSize: "13px",
                outline: "none",
                flex: 1,
              }}
            />
            <button
              style={{
                background: "#ff385c",
                color: "#fff",
                border: "none",
                borderRadius: "9999px",
                padding: "8px 18px",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Join
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          paddingTop: "24px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          fontSize: "13px",
        }}
      >
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} HomelyHub Technologies Inc. All rights reserved.</p>
        <div style={{ display: "flex", gap: "20px" }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Sitemap</span>
          <span>English (IN) • ₹ INR</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

