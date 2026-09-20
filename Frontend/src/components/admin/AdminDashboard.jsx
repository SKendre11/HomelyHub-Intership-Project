import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminStats,
  fetchAdminUsers,
  updateAdminUserRole,
  deleteAdminUser,
  fetchAdminProperties,
  updateAdminPropertyStatus,
  deleteAdminProperty,
  fetchAdminBookings,
  cancelAdminBooking,
  fetchAdminReviews,
  deleteAdminReview,
} from "../../store/Admin/admin-action";
import { adminActions } from "../../store/Admin/admin-slice";
import LoadingSpinner from "../LoadingSpinner";
import "../../css/AdminDashboard.css";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    stats,
    recentBookings,
    users,
    properties,
    bookings,
    reviews,
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.admin);

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "overview") dispatch(fetchAdminStats());
    if (tab === "users") dispatch(fetchAdminUsers());
    if (tab === "properties") dispatch(fetchAdminProperties());
    if (tab === "bookings") dispatch(fetchAdminBookings());
    if (tab === "reviews") dispatch(fetchAdminReviews());
  };

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateAdminUserRole(userId, newRole));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteAdminUser(userId));
    }
  };

  const handleStatusChange = (propertyId, newStatus) => {
    dispatch(updateAdminPropertyStatus(propertyId, newStatus));
  };

  const handleDeleteProperty = (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      dispatch(deleteAdminProperty(propertyId));
    }
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      dispatch(cancelAdminBooking(bookingId));
    }
  };

  const handleDeleteReview = (propertyId, reviewId) => {
    if (window.confirm("Are you sure you want to remove this review?")) {
      dispatch(deleteAdminReview(propertyId, reviewId));
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <div>
          <h2>Admin Command Center 🛡️</h2>
          <p>Global platform administration, users, properties, and revenue</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="material-symbols-outlined stat-icon user-icon">group</span>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalUsers || 0}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="material-symbols-outlined stat-icon prop-icon">apartment</span>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalProperties || 0}</span>
            <span className="stat-label">Total Properties</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="material-symbols-outlined stat-icon book-icon">receipt_long</span>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalBookings || 0}</span>
            <span className="stat-label">Total Bookings</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="material-symbols-outlined stat-icon rev-icon">payments</span>
          <div className="stat-info">
            <span className="stat-value">₹{(stats?.totalRevenue || 0).toLocaleString()}</span>
            <span className="stat-label">Platform Revenue</span>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="admin-alert admin-alert-error">
          {error}
          <button onClick={() => dispatch(adminActions.clearAdminMessages())}>×</button>
        </div>
      )}
      {successMessage && (
        <div className="admin-alert admin-alert-success">
          {successMessage}
          <button onClick={() => dispatch(adminActions.clearAdminMessages())}>×</button>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => handleTabChange("overview")}
        >
          Overview
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => handleTabChange("users")}
        >
          User Management
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "properties" ? "active" : ""}`}
          onClick={() => handleTabChange("properties")}
        >
          Property Management
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => handleTabChange("bookings")}
        >
          Booking Management
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => handleTabChange("reviews")}
        >
          Review Management
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="admin-tab-section">
          <h3>Recent Reservations</h3>
          {recentBookings && recentBookings.length > 0 ? (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Property</th>
                    <th>Dates</th>
                    <th>Guests</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.user?.name || "User"}</td>
                      <td>{b.property?.propertyName || "Property"}</td>
                      <td>
                        {new Date(b.fromDate).toLocaleDateString()} -{" "}
                        {new Date(b.toDate).toLocaleDateString()}
                      </td>
                      <td>{b.guests}</td>
                      <td>₹{b.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data-msg">No recent bookings recorded.</p>
          )}
        </div>
      )}

      {/* Tab 2: User Management */}
      {activeTab === "users" && (
        <div className="admin-tab-section">
          <h3>Users List ({users.length})</h3>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="user-cell">
                          <img
                            src={u.avatar?.url || "https://via.placeholder.com/40"}
                            alt={u.name}
                            className="avatar-sm"
                          />
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phoneNumber}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="role-select"
                        >
                          <option value="user">User</option>
                          <option value="host">Host</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn-admin-action delete"
                          onClick={() => handleDeleteUser(u._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Property Management */}
      {activeTab === "properties" && (
        <div className="admin-tab-section">
          <h3>Platform Properties ({properties.length})</h3>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Host</th>
                    <th>City</th>
                    <th>Price/Night</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div className="property-cell">
                          <img
                            src={p.images?.[0]?.url || "https://via.placeholder.com/50"}
                            alt={p.propertyName}
                            className="property-img-sm"
                          />
                          <span>{p.propertyName}</span>
                        </div>
                      </td>
                      <td>{p.userId?.name || "Host"}</td>
                      <td>{p.address?.city}</td>
                      <td>₹{p.price}</td>
                      <td>
                        <select
                          value={p.status || "Active"}
                          onChange={(e) => handleStatusChange(p._id, e.target.value)}
                          className={`status-select status-${(p.status || "Active").toLowerCase()}`}
                        >
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Blocked">Blocked</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn-admin-action delete"
                          onClick={() => handleDeleteProperty(p._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Booking Management */}
      {activeTab === "bookings" && (
        <div className="admin-tab-section">
          <h3>All Platform Reservations ({bookings.length})</h3>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Property</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.user?.name || "Guest"}</td>
                      <td>{b.property?.propertyName || "Property"}</td>
                      <td>{new Date(b.fromDate).toLocaleDateString()}</td>
                      <td>{new Date(b.toDate).toLocaleDateString()}</td>
                      <td className="amount-cell">₹{b.price}</td>
                      <td>
                        <button
                          className="btn-admin-action cancel"
                          onClick={() => handleCancelBooking(b._id)}
                        >
                          Cancel Booking
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Review Management */}
      {activeTab === "reviews" && (
        <div className="admin-tab-section">
          <h3>Property Reviews ({reviews.length})</h3>
          {loading ? (
            <LoadingSpinner />
          ) : reviews.length === 0 ? (
            <p className="no-data-msg">No property reviews posted yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r) => (
                    <tr key={r.reviewId}>
                      <td>{r.propertyName}</td>
                      <td>⭐ {r.rating} / 5</td>
                      <td>{r.comment || "No comment"}</td>
                      <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn-admin-action delete"
                          onClick={() => handleDeleteReview(r.propertyId, r.reviewId)}
                        >
                          Remove Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
