import mongoose from "mongoose";
import dotenv from "dotenv";
import { Property } from "../Models/propertyModel.js";

dotenv.config();

async function updateKashmirProperties() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for Kashmir property image updates...");

    // 1. Update Kashmir Shalimar Guest House specifically
    const targetImage = "https://tse1.mm.bing.net/th/id/OIP.e8p4Q14rqIiD4VmzaD6PYAHaEL?r=0&rs=1&pid=ImgDetMain&o=7&rm=3";

    // Build 6 high quality images for Kashmir Shalimar Guest House with the target image as primary
    const shalimarImages = [
      { public_id: "kashmir_shalimar_0", url: targetImage },
      { public_id: "kashmir_shalimar_1", url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80" },
      { public_id: "kashmir_shalimar_2", url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80" },
      { public_id: "kashmir_shalimar_3", url: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80" },
      { public_id: "kashmir_shalimar_4", url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80" },
      { public_id: "kashmir_shalimar_5", url: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?auto=format&fit=crop&w=1200&q=80" }
    ];

    const result = await Property.updateOne(
      { propertyName: "Kashmir Shalimar Guest House" },
      { $set: { images: shalimarImages } }
    );

    console.log("Updated Kashmir Shalimar Guest House:", result);

    // Verify update
    const updatedProp = await Property.findOne({ propertyName: "Kashmir Shalimar Guest House" });
    if (updatedProp) {
      console.log("✅ Verified Kashmir Shalimar Guest House images:");
      console.log("Primary Image URL:", updatedProp.images[0].url);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating Kashmir properties:", error);
    process.exit(1);
  }
}

updateKashmirProperties();
