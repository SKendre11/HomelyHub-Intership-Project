import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner";
import { fetchWishlist, removeFromWishlist } from "../../store/Wishlist/wishlist-action";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wishlist = [], loading } = useSelector(
    (state) => state.wishlist || {}
  );
  const { isAuthenticated } = useSelector((state) => state.user || {});

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = (e, propertyId) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeFromWishlist(propertyId));
    toast.success("Removed from wishlist");
  };

  if (!isAuthenticated) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "70vh" }}>
        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>Please log in to view your wishlist</h3>
        <button className="hh-btn hh-btn-accent mt-3" onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "60vh" }}>
        <LoadingSpinner />
        <p className="mt-3" style={{ color: "#64748b" }}>Loading your saved sanctuaries...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "40px auto", padding: "0 32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "34px", color: "#0f172a" }}>
          Saved Sanctuaries ({wishlist.length})
        </h2>
        <p style={{ color: "#64748b", fontSize: "15px" }}>
          Your handpicked favorite stays across India.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "#ffffff",
            borderRadius: "24px",
            border: "1px dashed #cbd5e1",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "56px", color: "#ff385c" }}>
            favorite_border
          </span>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, marginTop: "16px" }}>
            Your Wishlist is Empty
          </h3>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
            Explore properties and click the heart icon on any stay to save it here for later.
          </p>
          <button className="hh-btn hh-btn-accent" onClick={() => navigate("/")}>
            Explore Properties
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "28px",
          }}
        >
          {wishlist.map((property) => {
            if (!property || !property._id) return null;
            const image =
              property.images?.length > 0
                ? property.images[0].url
                : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";

            return (
              <div
                key={property._id}
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 16px 32px -8px rgba(15, 23, 42, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px -2px rgba(15, 23, 42, 0.05)";
                }}
              >
                {/* Remove Heart Button */}
                <button
                  onClick={(e) => handleRemove(e, property._id)}
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(8px)",
                    border: "none",
                    borderRadius: "50%",
                    width: "38px",
                    height: "38px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                  title="Remove from Wishlist"
                >
                  <span className="material-symbols-outlined" style={{ color: "#ff385c", fontSize: "22px" }}>
                    favorite
                  </span>
                </button>

                {/* Image */}
                <div style={{ height: "220px", overflow: "hidden" }}>
                  <Link to={`/propertylist/${property._id}`}>
                    <img
                      src={image}
                      alt={property.propertyName}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Link>
                </div>

                {/* Body */}
                <div style={{ padding: "18px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <Link
                    to={`/propertylist/${property._id}`}
                    style={{
                      textDecoration: "none",
                      color: "#0f172a",
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 700,
                      fontSize: "17px",
                      marginBottom: "6px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {property.propertyName}
                  </Link>

                  <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#64748b" }}>
                    📍 {property.address?.city || "India"}, {property.address?.state || ""}
                  </p>

                  <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                    <div>
                      <span style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>
                        ₹{property.price?.toLocaleString("en-IN")}
                      </span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}> / night</span>
                    </div>

                    <Link
                      to={`/propertylist/${property._id}`}
                      className="hh-btn hh-btn-accent"
                      style={{ padding: "6px 14px", fontSize: "12px" }}
                    >
                      Book Stay
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

