import React, { useState } from "react";
import Search from "./Search";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Filter from "./Filter";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/User/user-action";
import NotificationDropdown from "../notification/NotificationDropdown";

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user || {});
  const { wishlist = [] } = useSelector((state) => state.wishlist || {});

  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoutUser = () => {
    dispatch(logout());
    toast.success("User logged out successfully");
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky-top" style={{ zIndex: 1000, padding: "12px 24px 0 24px" }}>
      <nav
        className="navbar navbar-expand-lg hh-glass-panel"
        style={{
          borderRadius: "9999px",
          padding: "10px 24px",
          background: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          boxShadow: "0 10px 30px -5px rgba(15, 23, 42, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Original Brand Logo */}
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center"
          style={{ textDecoration: "none" }}
        >
          <img
            src="/assets/logo.png"
            alt="HomelyHub Logo"
            style={{
              height: "45px",
              width: "auto",
              objectFit: "contain",
              cursor: "pointer",
            }}
          />
        </Link>


        {/* Center Search / Trip Planner Pill for Homepage */}
        {isHomePage && (
          <div
            className="d-none d-lg-flex align-items-center"
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "9999px",
              padding: "4px 8px 4px 16px",
              gap: "12px",
            }}
          >
            <Search />
            <Filter />
            <Link
              to="/ai-trip-planner"
              className="d-flex align-items-center gap-1"
              style={{
                textDecoration: "none",
                background: "linear-gradient(135deg, #0d9488 0%, #059669 100%)",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "9999px",
                fontSize: "13px",
                fontWeight: 600,
                boxShadow: "0 2px 10px rgba(13, 148, 136, 0.25)",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                auto_awesome
              </span>
              <span>AI Planner</span>
            </Link>
          </div>
        )}

        {/* Desktop Navigation Links & User Menu */}
        <div className="d-none d-lg-flex align-items-center" style={{ gap: "20px" }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#475569",
              fontWeight: 600,
              fontSize: "14px",
              transition: "color 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#ff385c")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#475569")}
          >
            Explore Stays
          </Link>

          <Link
            to="/ai-trip-planner"
            style={{
              textDecoration: "none",
              color: "#475569",
              fontWeight: 600,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#ff385c")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#475569")}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#0d9488" }}>
              sparkles
            </span>
            AI Planner
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/user/wishlist"
                style={{
                  textDecoration: "none",
                  color: "#475569",
                  fontWeight: 600,
                  fontSize: "14px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#ff385c")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#475569")}
              >
                Wishlist
                {wishlist.length > 0 && (
                  <span
                    style={{
                      background: "#ff385c",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: "9999px",
                    }}
                  >
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                to="/user/mybookings"
                style={{
                  textDecoration: "none",
                  color: "#475569",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#ff385c")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#475569")}
              >
                My Bookings
              </Link>
            </>
          )}

          {!isAuthenticated ? (
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                color: "#ffffff",
                padding: "10px 22px",
                borderRadius: "9999px",
                fontWeight: 600,
                fontSize: "14px",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                account_circle
              </span>
              Login / Sign Up
            </Link>
          ) : (
            <div className="d-flex align-items-center" style={{ gap: "12px" }}>
              <NotificationDropdown />

              <div className="dropdown">
                <button
                  className="btn d-flex align-items-center dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "9999px",
                    padding: "4px 8px 4px 4px",
                    background: "#ffffff",
                    cursor: "pointer",
                    gap: "8px",
                  }}
                >
                  {user.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt={user.name}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "#ff385c",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "14px",
                      }}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#0f172a",
                      maxWidth: "100px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user.name ? user.name.split(" ")[0] : "Account"}
                  </span>
                </button>

                <ul
                  className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2"
                  aria-labelledby="userDropdown"
                  style={{ borderRadius: "16px", padding: "8px" }}
                >
                  <li className="px-3 py-2 border-bottom mb-1">
                    <strong style={{ display: "block", fontSize: "14px", color: "#0f172a" }}>
                      {user.name}
                    </strong>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>{user.email}</span>
                  </li>
                  <li>
                    <Link className="dropdown-item rounded-3 py-2" to="/profile">
                      👤 My Account
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item rounded-3 py-2" to="/user/wishlist">
                      ❤️ Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item rounded-3 py-2" to="/user/mybookings">
                      🧳 My Bookings
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item rounded-3 py-2" to="/host/dashboard">
                      🏡 Host Dashboard
                    </Link>
                  </li>
                  {user.role === "admin" && (
                    <li>
                      <Link className="dropdown-item rounded-3 py-2" to="/admin/dashboard">
                        🛡️ Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item rounded-3 py-2 text-danger font-semibold"
                      type="button"
                      onClick={logoutUser}
                    >
                      🚪 Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="d-lg-none btn p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ border: "none", color: "#0f172a" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
            {mobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="d-lg-none mt-2 p-3 hh-glass-panel"
          style={{
            borderRadius: "20px",
            animation: "fadeIn 0.2s ease-out forwards",
            background: "#ffffff",
          }}
        >
          <div className="d-flex flex-column gap-3">
            <Link
              to="/"
              className="text-decoration-none text-dark font-semibold py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              🏡 Explore Stays
            </Link>
            <Link
              to="/ai-trip-planner"
              className="text-decoration-none text-dark font-semibold py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              ✨ AI Trip Planner
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/user/wishlist"
                  className="text-decoration-none text-dark font-semibold py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ❤️ Wishlist ({wishlist.length})
                </Link>
                <Link
                  to="/user/mybookings"
                  className="text-decoration-none text-dark font-semibold py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🧳 My Bookings
                </Link>
                <Link
                  to="/host/dashboard"
                  className="text-decoration-none text-dark font-semibold py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🏡 Host Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="text-decoration-none text-dark font-semibold py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  👤 My Profile
                </Link>
                <button
                  onClick={logoutUser}
                  className="btn btn-outline-danger w-100 rounded-pill py-2 mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary w-100 rounded-pill py-2 mt-2"
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: "#ff385c", borderColor: "#ff385c" }}
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

