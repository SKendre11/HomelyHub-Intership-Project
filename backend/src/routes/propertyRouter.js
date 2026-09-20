import express from "express";

import {
    getProperties,
    getProperty
} from "../controllers/propertyController.js";

const propertyRouter = express.Router();

propertyRouter.get("/properties", getProperties);

propertyRouter.get("/properties/:id", getProperty);

export { propertyRouter };