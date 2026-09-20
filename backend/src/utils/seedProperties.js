import mongoose from "mongoose";
import dotenv from "dotenv";
import { Property } from "../Models/propertyModel.js";
import { User } from "../Models/userModel.js";

dotenv.config();

const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;

if (!mongoUri) {
  console.error("❌ MONGO_URI or MONGO_URL missing in environment variables.");
  process.exit(1);
}

// ----------------------------------------------------
// REAL UN SPLASH HIGH-QUALITY PROPERTY IMAGES BY CATEGORY
// ----------------------------------------------------
const IMAGES_BY_TYPE = {
  Apartment: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
  ],
  Resort: [
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
  ],
  Cabin: [
    "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
  ],
  Cottage: [
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  ],
  Flat: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
  ],
  Gite: [
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80",
  ],
  "Guest House": [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  ],
  Villa: [
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
  ],
  House: [
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  ],
  Hotel: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
  ],
};

const COMMON_AMENITIES = [
  { name: "Wifi", icon: "wifi" },
  { name: "Kitchen", icon: "kitchen" },
  { name: "AC", icon: "ac_unit" },
  { name: "Washing Machine", icon: "local_laundry_service" },
  { name: "TV", icon: "tv" },
  { name: "Pool", icon: "pool" },
  { name: "Free Parking", icon: "local_parking" },
  { name: "Gym", icon: "fitness_center" },
  { name: "Breakfast", icon: "free_breakfast" },
  { name: "Balcony", icon: "balcony" },
  { name: "Workspace", icon: "desk" },
  { name: "Hot Water", icon: "water_drop" },
];

// Helper to pick random elements from array
const pickRandom = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// ----------------------------------------------------
// PROPERTY SEED DATA DEFINITIONS (70+ REAL PROPERTIES)
// ----------------------------------------------------
const SEED_PROPERTIES = [
  // ================= APARTMENTS (10) =================
  {
    propertyName: "Skyline Luxury Apartment Bandra",
    propertyType: "Apartment",
    roomType: "Entire Home",
    description: "Modern high-rise apartment overlooking the Arabian Sea in Mumbai's prime Bandra location with designer furniture.",
    address: { area: "Bandra West", city: "mumbai", state: "Maharashtra", country: "India", pincode: 400050 },
    price: 6500, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Koregaon Park Glass Suite",
    propertyType: "Apartment",
    roomType: "Entire Home",
    description: "Sleek 2BHK apartment in Koregaon Park with floor-to-ceiling windows, high-speed WiFi and private balcony.",
    address: { area: "Koregaon Park", city: "pune", state: "Maharashtra", country: "India", pincode: 411001 },
    price: 4200, maximumGuest: 3, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Panaji Waterfront Apartment",
    propertyType: "Apartment",
    roomType: "Entire Home",
    description: "Sunlit apartment situated near the Mandovi River walk in Panaji with rooftop pool access and sea breeze.",
    address: { area: "Panaji Riverfront", city: "goa", state: "Goa", country: "India", pincode: 403001 },
    price: 5200, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Indiranagar Penthouse Apartment",
    propertyType: "Apartment",
    roomType: "Entire Home",
    description: "Contemporary penthouse apartment in central Indiranagar, close to top cafes, breweries, and metro line.",
    address: { area: "Indiranagar", city: "bengaluru", state: "Karnataka", country: "India", pincode: 560038 },
    price: 5800, maximumGuest: 4, bedrooms: 2, beds: 3, bathrooms: 2,
  },
  {
    propertyName: "Banjara Hills Executive Residence",
    propertyType: "Apartment",
    roomType: "Entire Home",
    description: "Spacious serviced apartment in prestigious Banjara Hills with private check-in, workspace, and kitchen.",
    address: { area: "Banjara Hills", city: "hyderabad", state: "Telangana", country: "India", pincode: 500034 },
    price: 4900, maximumGuest: 5, bedrooms: 3, beds: 3, bathrooms: 3,
  },
  {
    propertyName: "Connaught Place Heritage Flat",
    propertyType: "Apartment",
    roomType: "Entire Home",
    description: "Charming renovated heritage apartment in central Delhi with high ceilings, plush bedding, and city views.",
    address: { area: "Connaught Place", city: "delhi", state: "Delhi", country: "India", pincode: 110001 },
    price: 5500, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Jaipur Pink City Skyline Loft",
    propertyType: "Apartment",
    roomType: "Entire Home",
    description: "Artistic apartment blending Rajasthani decor with modern amenities in C-Scheme Jaipur.",
    address: { area: "C Scheme", city: "jaipur", state: "Rajasthan", country: "India", pincode: 302001 },
    price: 3800, maximumGuest: 3, bedrooms: 1, beds: 2, bathrooms: 1,
  },
  {
    propertyName: "Manali Alpine View Apartment",
    propertyType: "Apartment",
    roomType: "Entire Home",
    description: "Cozy mountain apartment overlooking snow-capped peaks in Old Manali with heated rooms.",
    address: { area: "Old Manali", city: "manali", state: "Himachal Pradesh", country: "India", pincode: 175131 },
    price: 4600, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Marina Heights Dubai Apartment",
    propertyType: "Apartment",
    roomType: "Entire Home",
    description: "Ultra-luxury apartment in Dubai Marina with infinity pool access and views of the yacht club.",
    address: { area: "Dubai Marina", city: "dubai", state: "Dubai", country: "UAE", pincode: 99999 },
    price: 14500, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Sukhumvit High-Rise Residence",
    propertyType: "Apartment",
    roomType: "Entire Home",
    description: "Modern Bangkok apartment in Sukhumvit near BTS station with rooftop garden and fitness center.",
    address: { area: "Sukhumvit", city: "bangkok", state: "Bangkok", country: "Thailand", pincode: 10110 },
    price: 6800, maximumGuest: 3, bedrooms: 1, beds: 2, bathrooms: 1,
  },

  // ================= RESORTS (10) =================
  {
    propertyName: "Grand Palms Beach Resort Goa",
    propertyType: "Resort",
    roomType: "Room",
    description: "Beachfront tropical resort with private beach access, lagoon pool, beach bar, and spa services.",
    address: { area: "Candolim Beach", city: "goa", state: "Goa", country: "India", pincode: 403515 },
    price: 9500, maximumGuest: 3, bedrooms: 1, beds: 2, bathrooms: 1,
  },
  {
    propertyName: "Kerala Backwaters Eco Resort",
    propertyType: "Resort",
    roomType: "Entire Home",
    description: "Serene lakeside eco-resort in Alleppey featuring Ayurvedic spa packages and private canal tours.",
    address: { area: "Punnamada", city: "kerala", state: "Kerala", country: "India", pincode: 688006 },
    price: 11000, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Jaipur Palace Heritage Resort",
    propertyType: "Resort",
    roomType: "Room",
    description: "Royal 5-star heritage resort with Rajasthani courtyards, folk music evenings, and luxury suites.",
    address: { area: "Amer Road", city: "jaipur", state: "Rajasthan", country: "India", pincode: 302002 },
    price: 12500, maximumGuest: 2, bedrooms: 1, beds: 1, bathrooms: 1,
  },
  {
    propertyName: "Kashmir Valley Snow Resort",
    propertyType: "Resort",
    roomType: "Room",
    description: "Luxury ski resort in Gulmarg offering heated alpine suites and breathtaking valley snowscapes.",
    address: { area: "Gulmarg Heights", city: "kashmir", state: "Jammu and Kashmir", country: "India", pincode: 193403 },
    price: 13500, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Manali Pine Forest Spa Resort",
    propertyType: "Resort",
    roomType: "Room",
    description: "Nestled in pine woods, this mountain resort features cedar wood interiors and outdoor heated jacuzzis.",
    address: { area: "Solang Valley", city: "manali", state: "Himachal Pradesh", country: "India", pincode: 175131 },
    price: 8800, maximumGuest: 3, bedrooms: 1, beds: 2, bathrooms: 1,
  },
  {
    propertyName: "Pune Hills Wellness Resort",
    propertyType: "Resort",
    roomType: "Room",
    description: "Tranquil hill resort in Lonavala offering yoga pavilions, infinity pools, and organic dining.",
    address: { area: "Lonavala Hills", city: "pune", state: "Maharashtra", country: "India", pincode: 410401 },
    price: 7900, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Bangkok Riverside Wellness Resort",
    propertyType: "Resort",
    roomType: "Room",
    description: "5-star luxury riverside resort along Chao Phraya River with floating dining decks and thai massages.",
    address: { area: "Riverside", city: "bangkok", state: "Bangkok", country: "Thailand", pincode: 10600 },
    price: 16000, maximumGuest: 2, bedrooms: 1, beds: 1, bathrooms: 1,
  },
  {
    propertyName: "Boracay Oceanfront Paradise Resort",
    propertyType: "Resort",
    roomType: "Room",
    description: "White sand beach resort in the Philippines with crystal clear waters, infinity pool, and water sports.",
    address: { area: "Station 1 Boracay", city: "philippines", state: "Aklan", country: "Philippines", pincode: 5608 },
    price: 14000, maximumGuest: 3, bedrooms: 1, beds: 2, bathrooms: 1,
  },
  {
    propertyName: "Dubai Desert Safari & Dunes Resort",
    propertyType: "Resort",
    roomType: "Entire Home",
    description: "Ultra-exclusive desert oasis resort offering dune safari adventures, private pool villas, and stargazing.",
    address: { area: "Al Marmoom", city: "dubai", state: "Dubai", country: "UAE", pincode: 99999 },
    price: 24000, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Hyderabad Lakeview Golf Resort",
    propertyType: "Resort",
    roomType: "Room",
    description: "Sprawling golf resort overlooking Hussain Sagar lake with championship golf course and fine dining.",
    address: { area: "Hussain Sagar", city: "hyderabad", state: "Telangana", country: "India", pincode: 500003 },
    price: 8500, maximumGuest: 3, bedrooms: 1, beds: 2, bathrooms: 1,
  },

  // ================= CABINS (10) =================
  {
    propertyName: "Solang Valley Wooden Cabin",
    propertyType: "Cabin",
    roomType: "Entire Home",
    description: "Rustic log cabin built with cedar wood in Manali, featuring a fireplace and panoramic Himalayan mountain views.",
    address: { area: "Solang Nallah", city: "manali", state: "Himachal Pradesh", country: "India", pincode: 175131 },
    price: 5200, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 1,
  },
  {
    propertyName: "Pahalgam Pine Tree Cabin",
    propertyType: "Cabin",
    roomType: "Entire Home",
    description: "Cozy timber cabin surrounded by pine forests and snow-capped peaks in Pahalgam valley.",
    address: { area: "Aru Valley", city: "kashmir", state: "Jammu and Kashmir", country: "India", pincode: 192126 },
    price: 6800, maximumGuest: 5, bedrooms: 2, beds: 3, bathrooms: 2,
  },
  {
    propertyName: "Munnar Tea Garden Cabin",
    propertyType: "Cabin",
    roomType: "Entire Home",
    description: "Charming wooden cabin perched on tea plantation slopes in Kerala with morning fog views.",
    address: { area: "Munnar Hills", city: "kerala", state: "Kerala", country: "India", pincode: 685612 },
    price: 4500, maximumGuest: 3, bedrooms: 1, beds: 2, bathrooms: 1,
  },
  {
    propertyName: "Mahabaleshwar Forest Cabin",
    propertyType: "Cabin",
    roomType: "Entire Home",
    description: "Private wooden cabin tucked away in Western Ghats greenery near strawberry farms.",
    address: { area: "Venna Lake Side", city: "pune", state: "Maharashtra", country: "India", pincode: 412806 },
    price: 4800, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 1,
  },
  {
    propertyName: "Wayanad Treehouse Cabin",
    propertyType: "Cabin",
    roomType: "Entire Home",
    description: "Unique wooden treehouse cabin elevated 30ft in rainforest canopy with natural bird song surroundings.",
    address: { area: "Vythiri Forest", city: "kerala", state: "Kerala", country: "India", pincode: 673576 },
    price: 7500, maximumGuest: 2, bedrooms: 1, beds: 1, bathrooms: 1,
  },
  {
    propertyName: "Goa Coconut Grove Wooden Cabin",
    propertyType: "Cabin",
    roomType: "Entire Home",
    description: "Beachside wooden eco-cabin nestled under coconut palms just 100 meters from Mandrem beach.",
    address: { area: "Mandrem Beach", city: "goa", state: "Goa", country: "India", pincode: 403527 },
    price: 3900, maximumGuest: 3, bedrooms: 1, beds: 2, bathrooms: 1,
  },
  {
    propertyName: "Chiang Mai Jungle Cabin",
    propertyType: "Cabin",
    roomType: "Entire Home",
    description: "Tranquil bamboo & teakwood cabin in mountain jungles near waterfalls outside Chiang Mai.",
    address: { area: "Mae Rim", city: "bangkok", state: "Chiang Mai", country: "Thailand", pincode: 50180 },
    price: 5900, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Palawan Eco Pine Cabin",
    propertyType: "Cabin",
    roomType: "Entire Home",
    description: "Rustic island cabin in Palawan with outdoor hammock deck and private beach access.",
    address: { area: "El Nido", city: "philippines", state: "Palawan", country: "Philippines", pincode: 5313 },
    price: 6200, maximumGuest: 3, bedrooms: 1, beds: 2, bathrooms: 1,
  },
  {
    propertyName: "Shimla Snow Peak Timber Cabin",
    propertyType: "Cabin",
    roomType: "Entire Home",
    description: "Authentic wooden mountain cabin with indoor wood stove and snow valley views.",
    address: { area: "Kufri", city: "manali", state: "Himachal Pradesh", country: "India", pincode: 171012 },
    price: 5400, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Nandi Hills Sunset Cabin",
    propertyType: "Cabin",
    roomType: "Entire Home",
    description: "Peaceful hill cabin on Nandi Hills foothills just 1 hour drive from Bengaluru city.",
    address: { area: "Nandi Hills", city: "bengaluru", state: "Karnataka", country: "India", pincode: 562101 },
    price: 4300, maximumGuest: 3, bedrooms: 1, beds: 2, bathrooms: 1,
  },

  // ================= COTTAGES (10) =================
  {
    propertyName: "Heritage French Cottage Pondicherry",
    propertyType: "Cottage",
    roomType: "Entire Home",
    description: "Colonial style yellow-plastered French cottage with private courtyard garden and cobblestone path.",
    address: { area: "White Town", city: "kerala", state: "Tamil Nadu", country: "India", pincode: 605001 },
    price: 4900, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Anjuna Beachside Stone Cottage",
    propertyType: "Cottage",
    roomType: "Entire Home",
    description: "Portuguese style stone cottage near Anjuna flea market with veranda and garden hammocks.",
    address: { area: "Anjuna Beach", city: "goa", state: "Goa", country: "India", pincode: 403509 },
    price: 4200, maximumGuest: 3, bedrooms: 1, beds: 2, bathrooms: 1,
  },
  {
    propertyName: "Old Manali Apple Orchard Cottage",
    propertyType: "Cottage",
    roomType: "Entire Home",
    description: "Charming stone and wood cottage surrounded by blooming apple orchards and mountain streams.",
    address: { area: "Manalsu River", city: "manali", state: "Himachal Pradesh", country: "India", pincode: 175131 },
    price: 5100, maximumGuest: 5, bedrooms: 2, beds: 3, bathrooms: 2,
  },
  {
    propertyName: "Srinagar Shikara Lakeside Cottage",
    propertyType: "Cottage",
    roomType: "Entire Home",
    description: "Traditional Kashmir cottage on Dal Lake shores with hand-carved walnut furniture and fireplace.",
    address: { area: "Dal Lake Boulevard", city: "kashmir", state: "Jammu and Kashmir", country: "India", pincode: 190001 },
    price: 7200, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Coorg Coffee Estate Cottage",
    propertyType: "Cottage",
    roomType: "Entire Home",
    description: "Rustic cottage situated inside a 50-acre coffee and spice plantation with private trekking trails.",
    address: { area: "Madikeri", city: "bengaluru", state: "Karnataka", country: "India", pincode: 571201 },
    price: 4600, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Jaipur Peacock Garden Cottage",
    propertyType: "Cottage",
    roomType: "Entire Home",
    description: "Rajasthani heritage cottage in a lush peacock garden with traditional fresco paintings.",
    address: { area: "Bani Park", city: "jaipur", state: "Rajasthan", country: "India", pincode: 302016 },
    price: 3900, maximumGuest: 3, bedrooms: 1, beds: 2, bathrooms: 1,
  },
  {
    propertyName: "Lonavala Lakeview Hill Cottage",
    propertyType: "Cottage",
    roomType: "Entire Home",
    description: "Hilltop cottage overlooking Pawna Lake with private lawn, BBQ setup, and sunset deck.",
    address: { area: "Pawna Lake", city: "pune", state: "Maharashtra", country: "India", pincode: 410401 },
    price: 5800, maximumGuest: 6, bedrooms: 3, beds: 4, bathrooms: 3,
  },
  {
    propertyName: "Alibaug Sea Breeze Cottage",
    propertyType: "Cottage",
    roomType: "Entire Home",
    description: "Coastal cottage 5 minutes walk from Varsoli beach with lush coconut palm yard and outdoor shower.",
    address: { area: "Varsoli Beach", city: "mumbai", state: "Maharashtra", country: "India", pincode: 402201 },
    price: 4700, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Phuket Hillside Tropical Cottage",
    propertyType: "Cottage",
    roomType: "Entire Home",
    description: "Private tropical cottage overlooking Patong Bay with sea view terrace and outdoor plunge bath.",
    address: { area: "Patong Hill", city: "bangkok", state: "Phuket", country: "Thailand", pincode: 83150 },
    price: 8200, maximumGuest: 3, bedrooms: 1, beds: 2, bathrooms: 1,
  },
  {
    propertyName: "Cebu Beachfront Palm Cottage",
    propertyType: "Cottage",
    roomType: "Entire Home",
    description: "Relaxing beachfront bamboo cottage in Cebu with turquoise ocean front views and private pier.",
    address: { area: "Moalboal", city: "philippines", state: "Cebu", country: "Philippines", pincode: 6032 },
    price: 6100, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 1,
  },

  // ================= FLATS (10) =================
  {
    propertyName: "Juhu Beach Sea Facing Flat",
    propertyType: "Flat",
    roomType: "Entire Home",
    description: "Premium 3BHK flat on Juhu Tara Road with unobstructed Arabian sea sunset views.",
    address: { area: "Juhu", city: "mumbai", state: "Maharashtra", country: "India", pincode: 400049 },
    price: 8900, maximumGuest: 6, bedrooms: 3, beds: 3, bathrooms: 3,
  },
  {
    propertyName: "Viman Nagar Modern 2BHK Flat",
    propertyType: "Flat",
    roomType: "Entire Home",
    description: "Fully furnished 2BHK flat near Pune airport and Phoenix Mall with modern kitchen and high-speed Wi-Fi.",
    address: { area: "Viman Nagar", city: "pune", state: "Maharashtra", country: "India", pincode: 411014 },
    price: 3600, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Batalim Green View Flat Goa",
    propertyType: "Flat",
    roomType: "Entire Home",
    description: "Spacious holiday flat surrounded by paddy fields in South Goa, close to Majorda beach.",
    address: { area: "Majorda", city: "goa", state: "Goa", country: "India", pincode: 403713 },
    price: 3400, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "HSR Layout Techie Studio Flat",
    propertyType: "Flat",
    roomType: "Entire Home",
    description: "Smart studio flat in HSR Layout with ergonomic desk, superfast fiber internet and smart TV.",
    address: { area: "HSR Layout", city: "bengaluru", state: "Karnataka", country: "India", pincode: 560102 },
    price: 3100, maximumGuest: 2, bedrooms: 1, beds: 1, bathrooms: 1,
  },
  {
    propertyName: "Gachibowli Highrise Luxury Flat",
    propertyType: "Flat",
    roomType: "Entire Home",
    description: "3BHK flat in Gachibowli IT Corridor with clubhouse access, tennis court, and gym.",
    address: { area: "Gachibowli", city: "hyderabad", state: "Telangana", country: "India", pincode: 500032 },
    price: 4500, maximumGuest: 6, bedrooms: 3, beds: 3, bathrooms: 3,
  },
  {
    propertyName: "South Ext Metro View Flat",
    propertyType: "Flat",
    roomType: "Entire Home",
    description: "Air-conditioned 2BHK flat in South Extension Delhi with modern amenities and elevator.",
    address: { area: "South Extension", city: "delhi", state: "Delhi", country: "India", pincode: 110049 },
    price: 4200, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Malviya Nagar Designer Flat",
    propertyType: "Flat",
    roomType: "Entire Home",
    description: "Chic modern flat near World Trade Park Jaipur with vibrant interiors and balcony.",
    address: { area: "Malviya Nagar", city: "jaipur", state: "Rajasthan", country: "India", pincode: 302017 },
    price: 3200, maximumGuest: 3, bedrooms: 2, beds: 2, bathrooms: 1,
  },
  {
    propertyName: "Downtown Dubai Skyline Flat",
    propertyType: "Flat",
    roomType: "Entire Home",
    description: "Luxury flat walking distance from Burj Khalifa and Dubai Mall with skyline pool.",
    address: { area: "Downtown", city: "dubai", state: "Dubai", country: "UAE", pincode: 99999 },
    price: 16500, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Asoke Bangkok Central Flat",
    propertyType: "Flat",
    roomType: "Entire Home",
    description: "Prime downtown flat next to Asoke BTS station with rooftop gym, pool, and city views.",
    address: { area: "Asoke", city: "bangkok", state: "Bangkok", country: "Thailand", pincode: 10110 },
    price: 5400, maximumGuest: 2, bedrooms: 1, beds: 1, bathrooms: 1,
  },
  {
    propertyName: "Kochi Marine Drive Harbour Flat",
    propertyType: "Flat",
    roomType: "Entire Home",
    description: "Waterfront flat on Marine Drive Kochi with panoramic views of backwater shipping channels.",
    address: { area: "Marine Drive", city: "kerala", state: "Kerala", country: "India", pincode: 682031 },
    price: 4100, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },

  // ================= GITES (10) =================
  {
    propertyName: "Kashmir Meadow Country Gite",
    propertyType: "Gite",
    roomType: "Entire Home",
    description: "Traditional countryside vacation gite in Sonamarg surrounded by alpine wildflower meadows.",
    address: { area: "Sonamarg Valley", city: "kashmir", state: "Jammu and Kashmir", country: "India", pincode: 191203 },
    price: 6500, maximumGuest: 5, bedrooms: 3, beds: 3, bathrooms: 2,
  },
  {
    propertyName: "Goan Countryside Heritage Gite",
    propertyType: "Gite",
    roomType: "Entire Home",
    description: "Restored 19th century Indo-Portuguese countryside gite with tiled roof, lush lawn, and well water.",
    address: { area: "Saligao", city: "goa", state: "Goa", country: "India", pincode: 403511 },
    price: 5800, maximumGuest: 6, bedrooms: 3, beds: 4, bathrooms: 3,
  },
  {
    propertyName: "Kerala Spice Farm Rural Gite",
    propertyType: "Gite",
    roomType: "Entire Home",
    description: "Peaceful rural farm gite in Thekkady surrounded by cardamom and pepper plantations.",
    address: { area: "Thekkady", city: "kerala", state: "Kerala", country: "India", pincode: 685509 },
    price: 4900, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Panchgani Valley Farmhouse Gite",
    propertyType: "Gite",
    roomType: "Entire Home",
    description: "Scenic hill country gite with organic vegetable patch, outdoor dining gazebo, and mountain vistas.",
    address: { area: "Panchgani", city: "pune", state: "Maharashtra", country: "India", pincode: 412805 },
    price: 5300, maximumGuest: 6, bedrooms: 3, beds: 3, bathrooms: 2,
  },
  {
    propertyName: "Manali Deodar Forest Gite",
    propertyType: "Gite",
    roomType: "Entire Home",
    description: "Secluded Himalayan gite tucked inside deodar forests with stone fireplace and outdoor firepit.",
    address: { area: "Naggar Village", city: "manali", state: "Himachal Pradesh", country: "India", pincode: 175130 },
    price: 6200, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Jaipur Rural Village Gite",
    propertyType: "Gite",
    roomType: "Entire Home",
    description: "Rustic Rajasthani mud-and-thatch design gite offering authentic cultural stay and home-cooked thali.",
    address: { area: "Chokhi Dhani Vicinity", city: "jaipur", state: "Rajasthan", country: "India", pincode: 302022 },
    price: 3600, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Chiang Rai Riverside Gite",
    propertyType: "Gite",
    roomType: "Entire Home",
    description: "Peaceful country gite along Kok River in Northern Thailand surrounded by organic rice fields.",
    address: { area: "Chiang Rai Rural", city: "bangkok", state: "Chiang Rai", country: "Thailand", pincode: 57000 },
    price: 5100, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },
  {
    propertyName: "Bohol Countryside Farm Gite",
    propertyType: "Gite",
    roomType: "Entire Home",
    description: "Serene vacation gite near Chocolate Hills Bohol with organic fruit garden and mountain breeze.",
    address: { area: "Carmen", city: "philippines", state: "Bohol", country: "Philippines", pincode: 6319 },
    price: 4800, maximumGuest: 5, bedrooms: 2, beds: 3, bathrooms: 2,
  },
  {
    propertyName: "Karjat Riverbank Country Gite",
    propertyType: "Gite",
    roomType: "Entire Home",
    description: "Lush green countryside retreat along Pej River with outdoor plunge pool and star gazing lawn.",
    address: { area: "Karjat", city: "mumbai", state: "Maharashtra", country: "India", pincode: 410201 },
    price: 5600, maximumGuest: 6, bedrooms: 3, beds: 4, bathrooms: 3,
  },
  {
    propertyName: "Sakleshpur Coffee Estate Gite",
    propertyType: "Gite",
    roomType: "Entire Home",
    description: "Western Ghats plantation gite surrounded by streams, misty hills, and coffee blossom scents.",
    address: { area: "Sakleshpur", city: "bengaluru", state: "Karnataka", country: "India", pincode: 573134 },
    price: 4700, maximumGuest: 4, bedrooms: 2, beds: 2, bathrooms: 2,
  },

  // ================= GUEST HOUSES (10) =================
  {
    propertyName: "Colaba Heritage Guest House",
    propertyType: "Guest House",
    roomType: "Room",
    description: "Warm family-run guest house near Gateway of India in South Mumbai with vintage decor and breakfast.",
    address: { area: "Colaba", city: "mumbai", state: "Maharashtra", country: "India", pincode: 400005 },
    price: 2800, maximumGuest: 2, bedrooms: 1, beds: 1, bathrooms: 1,
  },
  {
    propertyName: "Goa Vagator Guest House",
    propertyType: "Guest House",
    roomType: "Room",
    description: "Friendly beachside guest house in Vagator with garden cafe, motorcycle rentals, and outdoor terrace.",
    address: { area: "Vagator", city: "goa", state: "Goa", country: "India", pincode: 403509 },
    price: 2200, maximumGuest: 2, bedrooms: 1, beds: 1, bathrooms: 1,
  },
  {
    propertyName: "Kashmir Shalimar Guest House",
    propertyType: "Guest House",
    roomType: "Room",
    description: "Hospitable Kashmiri family guest house near Shalimar Bagh gardens serving authentic Kahwa tea.",
    address: { area: "Shalimar", city: "kashmir", state: "Jammu and Kashmir", country: "India", pincode: 190025 },
    price: 3100, maximumGuest: 3, bedrooms: 1, beds: 2, bathrooms: 1,
  },
  {
    propertyName: "Jaipur Haveli Guest House",
    propertyType: "Guest House",
    roomType: "Room",
    description: "Traditional Haveli guest house with rooftop restaurant overlooking Hawa Mahal in Jaipur Old City.",
    address: { area: "Johari Bazaar", city: "jaipur", state: "Rajasthan", country: "India", pincode: 302003 },
    price: 2600, maximumGuest: 2, bedrooms: 1, beds: 1, bathrooms: 1,
  },
  {
    propertyName: "Kochi Fort Heritage Guest House",
    propertyType: "Guest House",
    roomType: "Room",
    description: "Charming Dutch-influenced guest house in Fort Kochi walking distance to Chinese fishing nets.",
    address: { area: "Fort Kochi", city: "kerala", state: "Kerala", country: "India", pincode: 682001 },
    price: 2400, maximumGuest: 2, bedrooms: 1, beds: 1, bathrooms: 1,
  },
  {
    propertyName: "Old Manali Riverside Guest House",
    propertyType: "Guest House",
    roomType: "Room",
    description: "Budget-friendly traveler guest house on Beas riverbank with rooftop balcony and mountain views.",
    address: { area: "Old Manali Village", city: "manali", state: "Himachal Pradesh", country: "India", pincode: 175131 },
    price: 1900, maximumGuest: 2, bedrooms: 1, beds: 1, bathrooms: 1,
  },
  {
    propertyName: "Koramangala Traveler Guest House",
    propertyType: "Guest House",
    roomType: "Room",
    description: "Clean & quiet guest house in Koramangala Bengaluru near tech hubs and food streets.",
    address: { area: "Koramangala 5th Block", city: "bengaluru", state: "Karnataka", country: "India", pincode: 560095 },
    price: 2500, maximumGuest: 2, bedrooms: 1, beds: 1, bathrooms: 1,
  },
  {
    propertyName: "Paharganj City Central Guest House",
    propertyType: "Guest House",
    roomType: "Room",
    description: "Convenient guest house near New Delhi Railway Station with 24h reception, AC rooms and airport shuttle.",
    address: { area: "Paharganj", city: "delhi", state: "Delhi", country: "India", pincode: 110055 },
    price: 2100, maximumGuest: 2, bedrooms: 1, beds: 1, bathrooms: 1,
  },
  {
    propertyName: "Bangkok Khao San Traveler Guest House",
    propertyType: "Guest House",
    roomType: "Room",
    description: "Cozy backpacker guest house 2 minutes from Khao San Road with aircon rooms and tour desk.",
    address: { area: "Khao San", city: "bangkok", state: "Bangkok", country: "Thailand", pincode: 10200 },
    price: 2800, maximumGuest: 2, bedrooms: 1, beds: 1, bathrooms: 1,
  },
  {
    propertyName: "Manila Intramuros Heritage Guest House",
    propertyType: "Guest House",
    roomType: "Room",
    description: "Spanish colonial style guest house inside historic Intramuros walled city in Manila.",
    address: { area: "Intramuros", city: "philippines", state: "Manila", country: "Philippines", pincode: 1002 },
    price: 3200, maximumGuest: 2, bedrooms: 1, beds: 1, bathrooms: 1,
  },
];

// ----------------------------------------------------
// SEED DATABASE SCRIPT RUNNER
// ----------------------------------------------------
const seedDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log("Connected to MongoDB for property seeding...");

    // Find a host user to assign as owner
    let hostUser = await User.findOne({ role: "host" });
    if (!hostUser) {
      hostUser = await User.findOne({});
    }
    if (!hostUser) {
      console.log("Creating default host user...");
      hostUser = await User.create({
        name: "HomelyHub Superhost",
        email: "host@homelyhub.com",
        password: "Password123!",
        role: "host",
        phoneNumber: "9876543210",
      });
    }

    console.log(`Assigning properties to Host User: ${hostUser.name} (${hostUser._id})`);

    let insertedCount = 0;
    let skippedCount = 0;

    for (const prop of SEED_PROPERTIES) {
      const existing = await Property.findOne({ propertyName: prop.propertyName });
      if (existing) {
        skippedCount++;
        continue;
      }

      // Pick images matching category
      const categoryImages = IMAGES_BY_TYPE[prop.propertyType] || IMAGES_BY_TYPE["Apartment"];
      const imagesPayload = categoryImages.map((url) => ({ url }));

      // Pick random amenities
      const pickedAmenities = pickRandom(COMMON_AMENITIES, 6);

      await Property.create({
        propertyName: prop.propertyName,
        description: prop.description,
        propertyType: prop.propertyType,
        roomType: prop.roomType || "Entire Home",
        maximumGuest: prop.maximumGuest || 4,
        bedrooms: prop.bedrooms || 2,
        beds: prop.beds || 2,
        bathrooms: prop.bathrooms || 2,
        price: prop.price,
        address: prop.address,
        images: imagesPayload,
        amenities: pickedAmenities,
        userId: hostUser._id,
        isVerified: true,
        isFeatured: Math.random() > 0.6,
        isAvailable: true,
        status: "Active",
        rating: +(4.2 + Math.random() * 0.7).toFixed(1),
        totalReviews: Math.floor(10 + Math.random() * 40),
      });

      insertedCount++;
    }

    console.log("==========================================");
    console.log(`✅ Property Seeding Completed!`);
    console.log(`New Properties Added: ${insertedCount}`);
    console.log(`Already Existed (Skipped): ${skippedCount}`);
    console.log("==========================================");

    // Print breakdown by propertyType
    const breakdown = await Property.aggregate([
      { $group: { _id: "$propertyType", count: { $sum: 1 } } },
    ]);
    console.log("Property Count Breakdown by Type in DB:");
    breakdown.forEach((b) => console.log(` - ${b._id}: ${b.count} properties`));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding properties:", error);
    process.exit(1);
  }
};

seedDB();
