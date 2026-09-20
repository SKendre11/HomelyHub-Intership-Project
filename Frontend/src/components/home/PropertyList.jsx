import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import "../../css/Home.css";
import { useDispatch, useSelector } from "react-redux";
import { propertyAction } from "../../store/Property/property-slice.js";
import { getAllProperties } from "../../store/Property/property-action.js";
import { addToWishlist, removeFromWishlist } from "../../store/Wishlist/wishlist-action.js";
import toast from "react-hot-toast";

const CATEGORY_CHIPS = [
  { name: "All Stays", icon: "window", type: null },
  { name: "Apartment", icon: "apartment", type: "Apartment" },
  { name: "Resort", icon: "pool", type: "Resort" },
  { name: "Cabin", icon: "cabin", type: "Cabin" },
  { name: "Cottage", icon: "cottage", type: "Cottage" },
  { name: "Flat", icon: "domain", type: "Flat" },
  { name: "Gite", icon: "gite", type: "Gite" },
  { name: "Guest House", icon: "home_work", type: "Guest House" },
  { name: "Villa", icon: "villa", type: "Villa" },
  { name: "House", icon: "home", type: "House" },
  { name: "Hotel", icon: "hotel", type: "Hotel" },
];


const Card = ({
  id,
  image,
  name,
  address,
  price,
  rating,
  totalReviews,
  propertyType,
  maximumGuest,
  isVerified,
  isFeatured,
  discount,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wishlist = [] } = useSelector((state) => state.wishlist || {});
  const { isAuthenticated } = useSelector((state) => state.user || {});

  const isWishlisted = wishlist.some((item) => item && (item._id === id || item === id));

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please log in to save to your wishlist");
      navigate("/login");
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(id));
      toast.success("Added to wishlist");
    }
  };

  return (
    <div
      className="property-card"
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid rgba(226, 232, 240, 0.8)",
        boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 20px 35px -8px rgba(15, 23, 42, 0.12)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px -2px rgba(15, 23, 42, 0.05)";
      }}
    >
      {/* Property Image Container */}
      <div style={{ position: "relative", width: "100%", height: "240px", overflow: "hidden" }}>
        <Link to={`/propertylist/${id}`}>
          <img
            src={image}
            alt={name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
          />
        </Link>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            background: "rgba(255, 255, 255, 0.85)",
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
            transition: "transform 0.2s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <span
            className="material-symbols-outlined"
            style={{
              color: isWishlisted ? "#ff385c" : "#64748b",
              fontSize: "22px",
              fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            favorite
          </span>
        </button>

        {/* Badges */}
        <div style={{ position: "absolute", top: "14px", left: "14px", display: "flex", gap: "6px" }}>
          {isFeatured && (
            <span
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "9999px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            >
              Featured
            </span>
          )}
          {isVerified && (
            <span
              style={{
                background: "linear-gradient(135deg, #0d9488 0%, #059669 100%)",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "9999px",
              }}
            >
              ✓ Verified
            </span>
          )}
          {discount > 0 && (
            <span
              style={{
                background: "#ff385c",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "9999px",
              }}
            >
              {discount}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Property Information */}
      <div style={{ padding: "18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "6px" }}>
          <Link
            to={`/propertylist/${id}`}
            style={{
              textDecoration: "none",
              color: "#0f172a",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: "17px",
              lineHeight: "1.3",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {name}
          </Link>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#f59e0b" }}>
              star
            </span>
            <span>{rating ? rating.toFixed(1) : "4.9"}</span>
          </div>
        </div>

        {/* Location & Specs */}
        <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#0d9488" }}>
            location_on
          </span>
          {address || "India"}
        </p>

        <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#64748b", marginBottom: "16px", background: "#f8fafc", padding: "8px 12px", borderRadius: "10px" }}>
          <span>🏡 {propertyType}</span>
          <span>•</span>
          <span>👥 Up to {maximumGuest} guests</span>
        </div>

        {/* Price & CTA */}
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
          <div>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>
              ₹{price?.toLocaleString("en-IN")}
            </span>
            <span style={{ fontSize: "12px", color: "#64748b" }}> / night</span>
          </div>

          <Link
            to={`/propertylist/${id}`}
            style={{
              textDecoration: "none",
              background: "#0f172a",
              color: "#ffffff",
              padding: "8px 16px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 600,
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#ff385c")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#0f172a")}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const PropertyList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dispatch = useDispatch();

  const {
    properties = [],
    totalProperties = 0,
    loading = false,
  } = useSelector((state) => state.property);

  const lastPage = Math.ceil(totalProperties / 12);
  const propertyListRef = useRef(null);

  useEffect(() => {
    const params = { page: currentPage, propertyType: selectedCategory || "" };
    dispatch(propertyAction.updateSearchParams(params));
    dispatch(getAllProperties());
  }, [currentPage, selectedCategory, dispatch]);

  useEffect(() => {
    if (propertyListRef.current && properties.length > 0) {
      gsap.fromTo(
        propertyListRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, [properties]);

  const handleCategorySelect = (categoryType) => {
    setSelectedCategory(categoryType);
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSelectedCategory(null);
    setCurrentPage(1);
    dispatch(propertyAction.resetSearchParams());
    dispatch(getAllProperties());
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          margin: "16px 24px 32px 24px",
          borderRadius: "32px",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0d9488 100%)",
          color: "#ffffff",
          padding: "80px 40px",
          textAlign: "center",
          boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.25)",
        }}
      >
        <div style={{ position: "relative", zIndex: 2, maxWidth: "800px", margin: "0 auto" }}>
          <span
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              padding: "6px 16px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "20px",
            }}
          >
            ✨ Luxury Travel & Accommodations
          </span>

          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(32px, 5vw, 54px)",
              fontWeight: 800,
              lineHeight: "1.1",
              marginBottom: "20px",
              letterSpacing: "-0.03em",
            }}
          >
            Find your sanctuary anywhere in the world.
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#cbd5e1",
              maxWidth: "600px",
              margin: "0 auto 36px auto",
              lineHeight: "1.6",
            }}
          >
            Handpicked boutique villas, luxury apartments, and tranquil getaways verified for pure comfort.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link
              to="/ai-trip-planner"
              className="hh-btn hh-btn-accent"
              style={{ padding: "14px 28px", fontSize: "16px" }}
            >
              <span className="material-symbols-outlined">auto_awesome</span>
              Plan Trip with AI
            </Link>
          </div>
        </div>
      </section>

      {/* Category Filter Chips Bar */}
      <div
        style={{
          padding: "0 40px",
          maxWidth: "1360px",
          margin: "0 auto 28px auto",
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          paddingBottom: "10px",
        }}
      >
        {CATEGORY_CHIPS.map((chip) => {
          const isActive = selectedCategory === chip.type;
          return (
            <button
              key={chip.name}
              onClick={() => handleCategorySelect(chip.type)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "9999px",
                border: isActive ? "1.5px solid #ff385c" : "1.5px solid #e2e8f0",
                background: isActive ? "linear-gradient(135deg, #ff385c 0%, #e11d48 100%)" : "#ffffff",
                color: isActive ? "#ffffff" : "#0f172a",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: isActive ? "0 4px 15px rgba(255, 56, 92, 0.3)" : "0 2px 8px rgba(0,0,0,0.03)",
                transition: "all 0.2s ease",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                {chip.icon}
              </span>
              {chip.name}
            </button>
          );
        })}
      </div>

      {/* Main Grid & Content */}
      <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 40px" }}>
        {/* Count Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "22px", margin: 0, color: "#0f172a" }}>
            {selectedCategory ? `${selectedCategory} Stays` : "Explore Stays"}
            <span style={{ fontSize: "14px", fontWeight: 500, color: "#64748b", marginLeft: "10px" }}>
              ({totalProperties} properties found)
            </span>
          </h3>

          {selectedCategory && (
            <button
              onClick={handleClearAll}
              style={{
                background: "transparent",
                border: "none",
                color: "#ff385c",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Clear Filter ✕
            </button>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "28px",
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                style={{
                  height: "360px",
                  borderRadius: "20px",
                  background: "#e2e8f0",
                  animation: "pulse 1.5s infinite ease-in-out",
                }}
              />
            ))}
          </div>
        ) : properties.length === 0 ? (
          /* Empty State */
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "#ffffff",
              borderRadius: "24px",
              border: "1px dashed #cbd5e1",
              maxWidth: "500px",
              margin: "40px auto",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "56px", color: "#ff385c" }}>
              search_off
            </span>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, marginTop: "16px" }}>
              No Properties Found
            </h3>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
              We couldn't find any stays matching your selected criteria.
            </p>
            <button
              onClick={handleClearAll}
              style={{
                background: "#0f172a",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "9999px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              View All Properties
            </button>
          </div>
        ) : (
          /* Property Grid */
          <div
            ref={propertyListRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              gap: "28px",
            }}
          >
            {properties.map((property) => (
              <Card
                key={property._id}
                id={property._id}
                image={
                  property.images?.length > 0
                    ? property.images[0].url
                    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
                }
                name={property.propertyName}
                address={`${property.address?.city || ""}, ${property.address?.state || ""}`}
                price={property.price}
                rating={property.rating}
                totalReviews={property.totalReviews}
                propertyType={property.propertyType}
                maximumGuest={property.maximumGuest}
                isVerified={property.isVerified}
                isFeatured={property.isFeatured}
                discount={property.discount}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
              marginTop: "48px",
            }}
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                border: "1px solid #e2e8f0",
                background: currentPage === 1 ? "#f1f5f9" : "#ffffff",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>

            <span style={{ fontWeight: 600, fontSize: "14px", color: "#0f172a" }}>
              Page {currentPage} of {lastPage}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
              disabled={currentPage === lastPage}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                border: "1px solid #e2e8f0",
                background: currentPage === lastPage ? "#f1f5f9" : "#ffffff",
                cursor: currentPage === lastPage ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        )}

        {/* Why HomelyHub Trust Section */}
        <section
          style={{
            marginTop: "80px",
            background: "#ffffff",
            borderRadius: "32px",
            padding: "60px 40px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 30px -5px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px auto" }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "32px", color: "#0f172a" }}>
              Why Travel with HomelyHub?
            </h2>
            <p style={{ color: "#64748b", fontSize: "16px" }}>
              We curate verified accommodations that make every trip feel like a dream retreat.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "32px",
            }}
          >
            <div style={{ textAlign: "center", padding: "20px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "20px",
                  background: "#eff6ff",
                  color: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px auto",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>
                  verified_user
                </span>
              </div>
              <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>
                100% Verified Stays
              </h4>
              <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.5" }}>
                Every property listing undergoes rigorous quality and security inspections.
              </p>
            </div>

            <div style={{ textAlign: "center", padding: "20px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "20px",
                  background: "#f0fdf4",
                  color: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px auto",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>
                  bolt
                </span>
              </div>
              <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>
                Instant Owner Approval
              </h4>
              <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.5" }}>
                Seamless booking request & owner approval flow for total peace of mind.
              </p>
            </div>

            <div style={{ textAlign: "center", padding: "20px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "20px",
                  background: "#fef3c7",
                  color: "#f59e0b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px auto",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>
                  support_agent
                </span>
              </div>
              <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>
                24/7 Concierge Support
              </h4>
              <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.5" }}>
                Dedicated travel support team ready to assist you before, during, and after your stay.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PropertyList;

