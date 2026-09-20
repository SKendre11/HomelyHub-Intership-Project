import React, { useState } from "react";
import FilterModal from "./FilterModal";
import { useDispatch, useSelector } from "react-redux";
import { propertyAction } from "../../store/Property/property-slice";
import { getAllProperties } from "../../store/Property/property-action";

const Filter = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchParams } = useSelector((state) => state.property || {});

  const handleShowAllPhotos = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFilterChange = (updatedFilters) => {
    if (typeof updatedFilters === "object") {
      dispatch(
        propertyAction.updateSearchParams({
          ...updatedFilters,
          page: 1,
        })
      );
      dispatch(getAllProperties());
    }
  };


  return (
    <>
      <span
        className="material-symbols-outlined filter"
        onClick={handleShowAllPhotos}
      >
        tune
      </span>
      {isModalOpen && (
        <FilterModal
          selectedFilters={searchParams || {}}
          onFilterChange={handleFilterChange}
          onClose={handleCloseModal}
        />
      )}

    </>
  );
};

export default Filter;
