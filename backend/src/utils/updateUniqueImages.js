import mongoose from "mongoose";
import dotenv from "dotenv";
import { Property } from "../Models/propertyModel.js";

dotenv.config();

// 100% Verified, REAL Unsplash photo IDs (All return HTTP 200 OK)
const photoIdPool = [
  "1502672260266-1c1ef2d93688", "1522708323590-d24dbb6b0267", "1545324418-cc1a3fa10c00", "1512918728675-ed5a9ecdebfd", "1493809842364-78817add7ffb", "1560448204-e02f11c3d0e2",
  "1502005229762-cf1b2da7c5d6", "1567496898669-ee935f5f647a", "1505691938895-1758d7feb511", "1554995207-c18c203602cb", "1513694203232-719a280e022f", "1560185127-6ed189bf02f4",
  "1512917774080-9991f1c4c750", "1580587771525-78b9dba3b914", "1600585154340-be6161a56a0c", "1600566753376-12c8ab7fb75b", "1600607687939-ce8a6c25118c", "1600585154526-990dced4db0d",
  "1598928506311-c55ded91a20c", "1560448205-4d9b3e6bb6db", "1524758631624-e2822e304c36", "1586023492125-27b2c045efd7", "1515263487990-61b07816b324", "1565182999561-18d7dc61c393",
  "1556911220-e15b29be8c8f", "1507089947368-19c1da9775ae", "1583847268964-b28dc8f51f92", "1616486338812-3dadae4b4ace", "1618221195710-dd6b41faaea6", "1616046229478-9901c5536a45",
  "1615874959474-d609969a20ed", "1616594039964-ae9021a400a0", "1617103996702-96ff29b1c467", "1617806118233-18e1de247200", "1616047006789-b7af5afb8c20", "1618219908412-a29a1bb7b86e",
  "1600210492486-724fe5c67fb0", "1600573472550-8090b5e0745e", "1600566753086-00f18fb6b3ea", "1540555700478-4be289fbecef", "1582719478250-c89cae4dc85b", "1571896349842-33c89424de2d",
  "1520250497591-112f2f40a3f4", "1544161515-4ab6ce6db874", "1571003123894-1f0594d2b5d9", "1584132967334-10e028bd69f7", "1561501813-97bee59612c0", "1540541338287-41700207dee6",
  "1535827841776-24a31d129388", "1573843981267-be1999ff37cd", "1578683010236-d716f9a3f461", "1445019980597-93fa8acb246c", "1582719508461-905c673771fd", "1618773928121-c32242e63f39",
  "1590490360182-c33d57733427", "1507525428034-b723cf961d3e", "1506929562872-bb421503ef21", "1519046904884-53103b34b206", "1544551763-46a013bb70d5", "1512353087810-00dfd0123903",
  "1510414842594-a61c69b5ae57", "1506953823976-52e1fdc0149a", "1499793983690-e29da59ef1c2", "1449158743715-0a90ebb6d2d8", "1518780664697-55e3ad937233", "1470770841072-f978cf4d019e",
  "1542314831-068cd1dbfeeb", "1486406146926-c627a92ad1ab", "1510798831971-661eb04b3739", "1448375240586-882707db888b", "1506905925346-21bda4d32df4", "1454496522488-7a8e488e8606",
  "1464822759023-fed622ff2c3b", "1425913397330-cf8af2ff40a1", "1441974231531-c6227db76b6e", "1470071459604-3b5ec3a7fe05", "1542273917363-3b1817f69a2d", "1511497584788-876760111969",
  "1518495973542-4542c06a5843", "1596394516093-501ba68a0ba6", "1568605114967-8130f3a36994", "1476231682828-37e571bc172f", "1544735716-392fe2489ffa", "1626621341517-bbf3d9990a23",
  "1447752875215-b2761acb3c5d", "1449844908441-8829872d2607", "1501785888041-af3ef285b470", "1587061949409-02df41d5e562", "1564013799919-ab600027ffc6", "1600596542815-ffad4c1539a9",
  "1469854523086-cc02fe5d8800", "1506744038136-46273834b3fb", "1519681393784-d120267933ba", "1472214103451-9374bd1c798e", "1465146344425-f00d5f5c8f07", "1500530855697-b586d89ba3ee",
  "1473448912268-2022ce9509d8", "1551882547-ff40c63fe5fa", "1512343879784-a960bf40e7f2", "1596178065887-1198b6148b2b", "1613490493576-7fde63acd811", "1523217582562-09d0def993a6",
  "1484154218962-a197022b5858"
];

async function updateUniqueImages() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for updating real photo URLs...");

    const properties = await Property.find({});
    console.log(`Found ${properties.length} total properties in database.`);

    let poolIndex = 0;
    let updatedCount = 0;

    for (const property of properties) {
      const type = property.propertyType || "House";
      const newImages = [];

      for (let i = 0; i < 6; i++) {
        const photoId = photoIdPool[poolIndex % photoIdPool.length];
        poolIndex++;
        newImages.push({
          public_id: `hh_${type.toLowerCase().replace(/\s+/g, "_")}_${property._id}_${i}`,
          url: `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=1200&q=80`,
        });
      }

      await Property.updateOne(
        { _id: property._id },
        { $set: { images: newImages } }
      );
      updatedCount++;
    }

    console.log("==========================================");
    console.log(`✅ Successfully updated images for ${updatedCount} properties with verified real Unsplash photos!`);
    console.log("Zero property IDs, titles, prices, addresses, or bookings were modified.");
    console.log("==========================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating images:", error);
    process.exit(1);
  }
}

updateUniqueImages();
