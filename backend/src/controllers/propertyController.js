import { Property } from "../Models/propertyModel.js";
import { APIFeatures } from "../utils/APIFeatures.js";

const getProperties = async (req, res) => {
  try {
    const features = new APIFeatures(
      Property.find(),
      req.query
    )
      .filter()
      .search()
      .sort()
      .paginate();

    const doc = await features.query;

    const countFeatures = new APIFeatures(
      Property.find(),
      req.query
    )
      .filter()
      .search();

    const totalProperties = await Property.countDocuments(countFeatures.query.getFilter());

    res.status(200).json({
      status: "success",
      totalProperties,
      properties: doc,
    });
  } catch (error) {

    console.error("Error searching properties:", error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        status: "fail",
        message: "Property not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

export {
  getProperties,
  getProperty,
};