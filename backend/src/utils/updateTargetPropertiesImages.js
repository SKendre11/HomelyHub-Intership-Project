import mongoose from "mongoose";
import dotenv from "dotenv";
import { Property } from "../Models/propertyModel.js";

dotenv.config();

async function updateSpecificPropertyImages() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for updating specific property images...");

    // 1. Kochi Marine Drive Harbour Flat
    const kochiImages = [
      {
        public_id: "kochi_harbour_0",
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80" // Marine Drive Harbour View main
      },
      {
        public_id: "kochi_harbour_1",
        url: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80" // Living room / Hall photo
      },
      {
        public_id: "kochi_harbour_2",
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80" // Sea-facing balcony view
      },
      {
        public_id: "kochi_harbour_3",
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80" // Master bedroom
      },
      {
        public_id: "kochi_harbour_4",
        url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80" // Kitchen
      },
      {
        public_id: "kochi_harbour_5",
        url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80" // Bathroom
      }
    ];

    // 2. Coorg Coffee Estate Cottage
    const coorgImages = [
      {
        public_id: "coorg_cottage_0",
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80" // Coorg Coffee Estate Plantation main
      },
      {
        public_id: "coorg_cottage_1",
        url: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80" // Cottage exterior
      },
      {
        public_id: "coorg_cottage_2",
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80" // Living area
      },
      {
        public_id: "coorg_cottage_3",
        url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80" // Coffee estate landscape
      },
      {
        public_id: "coorg_cottage_4",
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80" // Patio & Garden
      },
      {
        public_id: "coorg_cottage_5",
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80" // Cozy Bedroom
      }
    ];

    // 3. Palawan Eco Pine Cabin
    const palawanImages = [
      {
        public_id: "palawan_cabin_0",
        url: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80" // Eco Pine Cabin main
      },
      {
        public_id: "palawan_cabin_1",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" // Beach & Nature view
      },
      {
        public_id: "palawan_cabin_2",
        url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80" // Cabin Bedroom interior
      },
      {
        public_id: "palawan_cabin_3",
        url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80" // Living room
      },
      {
        public_id: "palawan_cabin_4",
        url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80" // Resort surroundings
      },
      {
        public_id: "palawan_cabin_5",
        url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80" // Porch / Lounge
      }
    ];

    // Execute updates in MongoDB for target properties
    const res1 = await Property.updateOne(
      { propertyName: "Kochi Marine Drive Harbour Flat" },
      { $set: { images: kochiImages } }
    );
    console.log("Kochi Marine Drive Harbour Flat update result:", res1);

    const res2 = await Property.updateOne(
      { propertyName: "Coorg Coffee Estate Cottage" },
      { $set: { images: coorgImages } }
    );
    console.log("Coorg Coffee Estate Cottage update result:", res2);

    const res3 = await Property.updateOne(
      { propertyName: "Palawan Eco Pine Cabin" },
      { $set: { images: palawanImages } }
    );
    console.log("Palawan Eco Pine Cabin update result:", res3);

    console.log("==========================================");
    console.log("✅ Successfully updated image field for all 3 target properties!");
    console.log("Zero property IDs, titles, prices, locations, amenities, or bookings were modified.");
    console.log("==========================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating specific property images:", error);
    process.exit(1);
  }
}

updateSpecificPropertyImages();
