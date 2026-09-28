import express from "express";
import { generateTripPlan } from "../controllers/aiController.js";

const tripRouter = express.Router();

tripRouter.post("/", generateTripPlan);

export { tripRouter };
