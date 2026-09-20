import React, { useState } from "react";
import Modal from "./Modal";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";

const PropertyImg = ({ images = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getUrl = (img) => {
    if (!img) return DEFAULT_IMAGE;
    if (typeof img === "string") return img;
    return img.url || DEFAULT_IMAGE;
  };

  const mainImage = getUrl(images[0]);
  const middleImages = images.length > 1 ? images.slice(1, 4) : [null, null, null];
  const fifthImage = getUrl(images[5] || images[images.length - 1]);

  const handleShowAllPhotos = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="property-img-container">
        <div className="img-item">
          <img
            src={mainImage}
            className="images"
            style={{
              borderTopLeftRadius: "10px",
              borderBottomLeftRadius: "10px",
            }}
            alt="property-1"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_IMAGE;
            }}
          />
        </div>

        {middleImages.map((image, index) => (
          <div key={index}>
            <img
              className="images"
              src={getUrl(image)}
              alt={`property-${index + 2}`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_IMAGE;
              }}
            />
          </div>
        ))}
        <div>
          <img
            className="images"
            src={fifthImage}
            alt="property-5"
            style={{ borderBottomRightRadius: "10px" }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_IMAGE;
            }}
          />
          <button className="similar-photos" onClick={handleShowAllPhotos}>
            <span className="material-symbols-outlined">photo_library</span>
          </button>
        </div>
      </div>

      <div className="similar-photos-container"></div>
      {isModalOpen && <Modal images={images} onClose={handleCloseModal} />}
    </>
  );
};

export default PropertyImg;
