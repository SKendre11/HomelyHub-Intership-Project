import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHostProperties,
  fetchHostBookings,
  fetchHostStats,
  createHostProperty,
  updateHostProperty,
  deleteHostProperty,
} from "../../store/Host/host-action";
import { respondToBookingRequest } from "../../store/Booking/booking-action";
import { hostActions } from "../../store/Host/host-slice";
import LoadingSpinner from "../LoadingSpinner";
import toast from "react-hot-toast";
import "../../css/HostDashboard.css";


const AMENITY_OPTIONS = [
  { name: "Wifi", icon: "wifi" },
  { name: "Kitchen", icon: "kitchen" },
  { name: "AC", icon: "ac_unit" },
  { name: "Washing Machine", icon: "local_laundry_service" },
  { name: "TV", icon: "tv" },
  { name: "Pool", icon: "pool" },
  { name: "Free Parking", icon: "local_parking" },
  { name: "Gym", icon: "fitness_center" },
  { name: "Breakfast", icon: "free_breakfast" },
  { name: "Balcony", icon: "balcony" },
  { name: "Garden", icon: "park" },
  { name: "Pet Friendly", icon: "pets" },
  { name: "Hot Water", icon: "water_drop" },
  { name: "Workspace", icon: "desk" },
  { name: "Elevator", icon: "elevator" },
];

const PROPERTY_TYPES = [
  "House",
  "Flat",
  "Guest House",
  "Hotel",
  "Villa",
  "Apartment",
  "Cottage",
  "Resort",
];

const ROOM_TYPES = ["Anytype", "Room", "Entire Home", "Shared Room"];

const HostDashboard = () => {
  const dispatch = useDispatch();
  const { properties, bookings, stats, loading, error, successMessage } = useSelector(
    (state) => state.host
  );

  const [activeTab, setActiveTab] = useState("properties");
  const [showModal, setShowModal] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    propertyName: "",
    description: "",
    extraInfo: "Check-in on time",
    propertyType: "House",
    roomType: "Entire Home",
    price: 1500,
    maximumGuest: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    address: {
      area: "",
      city: "",
      state: "",
      pincode: "",
    },
    amenities: [],
    imageUrl1: "",
    imageUrl2: "",
    imageUrl3: "",
    imageUrl4: "",
    imageUrl5: "",
    imageUrl6: "",
  });

  useEffect(() => {
    dispatch(fetchHostProperties());
    dispatch(fetchHostBookings());
    dispatch(fetchHostStats());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.some((a) => a.name === amenity.name);
      if (exists) {
        return {
          ...prev,
          amenities: prev.amenities.filter((a) => a.name !== amenity.name),
        };
      } else {
        return {
          ...prev,
          amenities: [...prev.amenities, amenity],
        };
      }
    });
  };

  const resetForm = () => {
    setFormData({
      propertyName: "",
      description: "",
      extraInfo: "Check-in on time",
      propertyType: "House",
      roomType: "Entire Home",
      price: 1500,
      maximumGuest: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      address: {
        area: "",
        city: "",
        state: "",
        pincode: "",
      },
      amenities: [],
      imageUrl1: "",
      imageUrl2: "",
      imageUrl3: "",
      imageUrl4: "",
      imageUrl5: "",
      imageUrl6: "",
    });
    setEditingPropertyId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (property) => {
    setEditingPropertyId(property._id);
    const imgUrls = (property.images || []).map((img) => img.url);

    setFormData({
      propertyName: property.propertyName || "",
      description: property.description || "",
      extraInfo: property.extraInfo || "",
      propertyType: property.propertyType || "House",
      roomType: property.roomType || "Entire Home",
      price: property.price || 500,
      maximumGuest: property.maximumGuest || 2,
      bedrooms: property.bedrooms || 1,
      beds: property.beds || 1,
      bathrooms: property.bathrooms || 1,
      address: {
        area: property.address?.area || "",
        city: property.address?.city || "",
        state: property.address?.state || "",
        pincode: property.address?.pincode || "",
      },
      amenities: property.amenities || [],
      imageUrl1: imgUrls[0] || "",
      imageUrl2: imgUrls[1] || "",
      imageUrl3: imgUrls[2] || "",
      imageUrl4: imgUrls[3] || "",
      imageUrl5: imgUrls[4] || "",
      imageUrl6: imgUrls[5] || "",
    });

    setShowModal(true);
  };

  const handleSubmitProperty = async (e) => {
    e.preventDefault();

    // Prepare images array
    const rawUrls = [
      formData.imageUrl1,
      formData.imageUrl2,
      formData.imageUrl3,
      formData.imageUrl4,
      formData.imageUrl5,
      formData.imageUrl6,
    ].filter((url) => url && url.trim() !== "");

    const images = rawUrls.map((url) => ({ url: url.trim() }));

    const payload = {
      propertyName: formData.propertyName,
      description: formData.description,
      extraInfo: formData.extraInfo,
      propertyType: formData.propertyType,
      roomType: formData.roomType,
      price: Number(formData.price),
      maximumGuest: Number(formData.maximumGuest),
      bedrooms: Number(formData.bedrooms),
      beds: Number(formData.beds),
      bathrooms: Number(formData.bathrooms),
      address: {
        area: formData.address.area,
        city: formData.address.city,
        state: formData.address.state,
        pincode: Number(formData.address.pincode),
      },
      amenities: formData.amenities,
      images,
    };

    let result;
    if (editingPropertyId) {
      result = await dispatch(updateHostProperty(editingPropertyId, payload));
    } else {
      result = await dispatch(createHostProperty(payload));
    }

    if (result.success) {
      setShowModal(false);
      resetForm();
      dispatch(fetchHostStats());
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm("Are you sure you want to delete this property listing?")) {
      const res = await dispatch(deleteHostProperty(id));
      if (res.success) {
        dispatch(fetchHostStats());
      }
    }
  };

  const handleRespondToBooking = async (bookingId, status) => {
    try {
      const res = await dispatch(respondToBookingRequest(bookingId, status));
      if (res && res.success !== false) {
        toast.success(`Booking request ${status.toLowerCase()} successfully!`);
        dispatch(fetchHostBookings());
        dispatch(fetchHostStats());
      }
    } catch (err) {
      toast.error(err.message || `Failed to ${status.toLowerCase()} booking request`);
    }
  };

  return (
    <div className="host-dashboard-container">
      <div className="host-header">
        <div>
          <h2>Owner Dashboard</h2>
          <p>Manage your properties, review booking requests, and track earnings</p>
        </div>
        <button className="add-property-btn" onClick={openAddModal}>
          <span className="material-symbols-outlined">add</span>
          Add New Property
        </button>
      </div>

      {/* Overview Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="material-symbols-outlined stat-icon">house</span>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalProperties || properties.length}</span>
            <span className="stat-label">Active Listings</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="material-symbols-outlined stat-icon">pending_actions</span>
          <div className="stat-info">
            <span className="stat-value" style={{ color: "#f59e0b" }}>
              {stats?.pendingRequests || bookings.filter(b => b.bookingStatus === "Pending").length}
            </span>
            <span className="stat-label">Pending Requests</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="material-symbols-outlined stat-icon">book_online</span>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalBookings || bookings.length}</span>
            <span className="stat-label">Total Reservations</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="material-symbols-outlined stat-icon">payments</span>
          <div className="stat-info">
            <span className="stat-value">₹{(stats?.totalRevenue || 0).toLocaleString()}</span>
            <span className="stat-label">Confirmed Earnings</span>
          </div>
        </div>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="host-alert host-alert-error">
          {error}
          <button onClick={() => dispatch(hostActions.clearHostMessages())}>×</button>
        </div>
      )}
      {successMessage && (
        <div className="host-alert host-alert-success">
          {successMessage}
          <button onClick={() => dispatch(hostActions.clearHostMessages())}>×</button>
        </div>
      )}

      {/* Dashboard Tabs */}
      <div className="host-tabs">
        <button
          className={`tab-btn ${activeTab === "properties" ? "active" : ""}`}
          onClick={() => setActiveTab("properties")}
        >
          My Properties ({properties.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          Booking Requests & Reservations ({bookings.length})
        </button>
      </div>

      {/* Tab Content: Properties */}
      {activeTab === "properties" && (
        <div className="properties-tab-content">
          {loading ? (
            <LoadingSpinner />
          ) : properties.length === 0 ? (
            <div className="empty-host-state">
              <span className="material-symbols-outlined">add_home</span>
              <h3>No Properties Listed Yet</h3>
              <p>Start earning by creating your first property listing on HomelyHub!</p>
              <button className="add-property-btn" onClick={openAddModal}>
                Create Property
              </button>
            </div>
          ) : (
            <div className="host-properties-grid">
              {properties.map((property) => (
                <div key={property._id} className="host-property-card">
                  <div className="card-image-wrapper">
                    <img
                      src={property.images?.[0]?.url || "https://via.placeholder.com/400x300"}
                      alt={property.propertyName}
                    />
                    <span className="property-type-tag">{property.propertyType}</span>
                  </div>
                  <div className="card-details">
                    <h4>{property.propertyName}</h4>
                    <p className="location-text">
                      <span className="material-symbols-outlined">location_on</span>
                      {property.address?.city}, {property.address?.state}
                    </p>
                    <div className="property-specs">
                      <span>{property.maximumGuest} guests</span> •{" "}
                      <span>{property.bedrooms} beds</span> •{" "}
                      <span>₹{property.price}/night</span>
                    </div>
                    <div className="card-actions">
                      <button className="btn-edit" onClick={() => openEditModal(property)}>
                        <span className="material-symbols-outlined">edit</span> Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteProperty(property._id)}
                      >
                        <span className="material-symbols-outlined">delete</span> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Host Bookings & Approval */}
      {activeTab === "bookings" && (
        <div className="bookings-tab-content">
          {loading ? (
            <LoadingSpinner />
          ) : bookings.length === 0 ? (
            <div className="empty-host-state">
              <span className="material-symbols-outlined">event_busy</span>
              <h3>No Booking Requests Yet</h3>
              <p>When guests request to book your properties, their details will appear here for your approval.</p>
            </div>
          ) : (
            <div className="host-bookings-table-wrapper">
              <table className="host-bookings-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Property</th>
                    <th>Check-In / Out</th>
                    <th>Nights & Guests</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const status = booking.bookingStatus || (booking.paid ? "Confirmed" : "Pending");
                    const isPending = status === "Pending";

                    return (
                      <tr key={booking._id}>
                        <td>
                          <div className="guest-info">
                            <strong className="guest-name">{booking.user?.name || "Guest"}</strong>
                            <span className="guest-contact">{booking.user?.email}</span>
                            <span className="guest-contact">{booking.user?.phoneNumber || "Phone not provided"}</span>
                          </div>
                        </td>
                        <td>
                          <strong>{booking.property?.propertyName || "Property Stay"}</strong>
                        </td>
                        <td>
                          {new Date(booking.fromDate).toLocaleDateString()} —{" "}
                          {new Date(booking.toDate).toLocaleDateString()}
                        </td>
                        <td>
                          {booking.numberOfNights || 1} Nights • {booking.guests || 1} Guests
                        </td>
                        <td className="booking-amount">
                          ₹{booking.price?.toLocaleString("en-IN")}
                        </td>
                        <td>
                          {booking.paid || status === "Confirmed" ? (
                            <span className="hh-badge hh-badge-confirmed">Confirmed</span>
                          ) : status === "Accepted" ? (
                            <span className="hh-badge hh-badge-accepted">Accepted (Unpaid)</span>
                          ) : status === "Rejected" ? (
                            <span className="hh-badge hh-badge-rejected">Declined</span>
                          ) : (
                            <span className="hh-badge hh-badge-pending">Pending Approval</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {isPending && (
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button
                                  onClick={() => handleRespondToBooking(booking._id, "Accepted")}
                                  className="hh-btn hh-btn-accent"
                                  style={{ padding: "5px 12px", fontSize: "12px" }}
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleRespondToBooking(booking._id, "Rejected")}
                                  style={{
                                    background: "#fee2e2",
                                    color: "#dc2626",
                                    border: "none",
                                    borderRadius: "9999px",
                                    padding: "5px 12px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            <button
                              onClick={() => setSelectedBookingDetails(booking)}
                              style={{
                                background: "#f1f5f9",
                                color: "#334155",
                                border: "1px solid #cbd5e1",
                                borderRadius: "9999px",
                                padding: "4px 10px",
                                fontSize: "11px",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}


      {/* Property Modal (Create / Edit) */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content host-property-modal">
            <div className="modal-header">
              <h3>{editingPropertyId ? "Edit Property Listing" : "Add New Property Listing"}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitProperty} className="host-form">
              <div className="form-section">
                <h4>Basic Info</h4>
                <div className="form-group">
                  <label>Property Name *</label>
                  <input
                    type="text"
                    name="propertyName"
                    value={formData.propertyName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Luxurious Sea View Apartment"
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Describe your property..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Property Type</label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                    >
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Room Type</label>
                    <select name="roomType" value={formData.roomType} onChange={handleInputChange}>
                      {ROOM_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Price per Night (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Capacity & Rooms</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Max Guests *</label>
                    <input
                      type="number"
                      name="maximumGuest"
                      value={formData.maximumGuest}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Bedrooms *</label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Beds *</label>
                    <input
                      type="number"
                      name="beds"
                      value={formData.beds}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Bathrooms *</label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Location Address</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Area / Locality *</label>
                    <input
                      type="text"
                      name="address.area"
                      value={formData.address.area}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Bandra West"
                    />
                  </div>
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Mumbai"
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Maharashtra"
                    />
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input
                      type="number"
                      name="address.pincode"
                      value={formData.address.pincode}
                      onChange={handleInputChange}
                      required
                      placeholder="400050"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Amenities</h4>
                <div className="amenities-selection-grid">
                  {AMENITY_OPTIONS.map((item) => {
                    const isSelected = formData.amenities.some((a) => a.name === item.name);
                    return (
                      <button
                        type="button"
                        key={item.name}
                        className={`amenity-chip ${isSelected ? "selected" : ""}`}
                        onClick={() => handleAmenityToggle(item)}
                      >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-section">
                <h4>Property Images (URLs)</h4>
                <p className="image-note">Provide at least 1 image URL (Up to 6 allowed)</p>
                <div className="form-row-2">
                  <input
                    type="url"
                    name="imageUrl1"
                    value={formData.imageUrl1}
                    onChange={handleInputChange}
                    placeholder="Image 1 URL (Main Photo) *"
                    required
                  />
                  <input
                    type="url"
                    name="imageUrl2"
                    value={formData.imageUrl2}
                    onChange={handleInputChange}
                    placeholder="Image 2 URL"
                  />
                  <input
                    type="url"
                    name="imageUrl3"
                    value={formData.imageUrl3}
                    onChange={handleInputChange}
                    placeholder="Image 3 URL"
                  />
                  <input
                    type="url"
                    name="imageUrl4"
                    value={formData.imageUrl4}
                    onChange={handleInputChange}
                    placeholder="Image 4 URL"
                  />
                  <input
                    type="url"
                    name="imageUrl5"
                    value={formData.imageUrl5}
                    onChange={handleInputChange}
                    placeholder="Image 5 URL"
                  />
                  <input
                    type="url"
                    name="imageUrl6"
                    value={formData.imageUrl6}
                    onChange={handleInputChange}
                    placeholder="Image 6 URL"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading
                    ? "Saving..."
                    : editingPropertyId
                    ? "Update Listing"
                    : "Publish Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBookingDetails && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: "550px", borderRadius: "16px", padding: "24px" }}>
            <div className="modal-header" style={{ marginBottom: "16px", borderBottom: "1px solid #e2e8f0", pb: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Reservation Details</h3>
              <button className="close-btn" onClick={() => setSelectedBookingDetails(null)}>
                ×
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px" }}>
              {/* Property Details */}
              <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: "12px" }}>
                <h4 style={{ margin: "0 0 4px 0", color: "#0f172a", fontSize: "15px" }}>
                  {selectedBookingDetails.property?.propertyName || "Property Stay"}
                </h4>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                  {selectedBookingDetails.property?.address?.city}, {selectedBookingDetails.property?.address?.state}
                </p>
              </div>

              {/* Guest Info */}
              <div>
                <h5 style={{ margin: "0 0 8px 0", color: "#475569", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px" }}>
                  Guest Information
                </h5>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "12px" }}>Name:</span>
                    <div style={{ fontWeight: 600 }}>{selectedBookingDetails.user?.name || "Guest"}</div>
                  </div>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "12px" }}>Email:</span>
                    <div style={{ fontWeight: 600 }}>{selectedBookingDetails.user?.email || "N/A"}</div>
                  </div>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "12px" }}>Phone:</span>
                    <div style={{ fontWeight: 600 }}>{selectedBookingDetails.user?.phoneNumber || "N/A"}</div>
                  </div>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "12px" }}>Guests Count:</span>
                    <div style={{ fontWeight: 600 }}>{selectedBookingDetails.guests || 1} Person(s)</div>
                  </div>
                </div>
              </div>

              {/* Stay Dates & Price */}
              <div style={{ borderTop: "1px solid #f1f5f9", pt: "12px" }}>
                <h5 style={{ margin: "0 0 8px 0", color: "#475569", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px" }}>
                  Stay & Billing
                </h5>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "12px" }}>Check-In:</span>
                    <div style={{ fontWeight: 600 }}>{new Date(selectedBookingDetails.fromDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "12px" }}>Check-Out:</span>
                    <div style={{ fontWeight: 600 }}>{new Date(selectedBookingDetails.toDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "12px" }}>Duration:</span>
                    <div style={{ fontWeight: 600 }}>{selectedBookingDetails.numberOfNights || 1} Night(s)</div>
                  </div>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "12px" }}>Total Amount:</span>
                    <div style={{ fontWeight: 700, color: "#16a34a", fontSize: "16px" }}>
                      ₹{selectedBookingDetails.price?.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", pt: "12px" }}>
                <div>
                  <span style={{ color: "#64748b", fontSize: "12px" }}>Booking Status: </span>
                  <strong style={{ marginLeft: "4px" }}>
                    {selectedBookingDetails.bookingStatus || (selectedBookingDetails.paid ? "Confirmed" : "Pending")}
                  </strong>
                </div>
                <div>
                  <span style={{ color: "#64748b", fontSize: "12px" }}>Payment Status: </span>
                  <strong style={{ marginLeft: "4px", color: selectedBookingDetails.paid ? "#16a34a" : "#d97706" }}>
                    {selectedBookingDetails.paid ? "Paid" : selectedBookingDetails.paymentStatus || "Pending"}
                  </strong>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
              <button
                className="hh-btn hh-btn-outline"
                onClick={() => setSelectedBookingDetails(null)}
                style={{ padding: "8px 20px" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostDashboard;
