import { configureStore } from "@reduxjs/toolkit";

import propertyReducer from "./Property/property-slice.js";
import propertyDetailsReducer from "./PropertyDetails/propertyDetails-slice.js";
import userReducer from "./User/user-slice.js";
import wishlistReducer from "./Wishlist/wishlist-slice.js";
import bookingReducer from "./Booking/booking-slice.js";
import notificationReducer from "./Notification/notification-slice.js";
import hostReducer from "./Host/host-slice.js";
import adminReducer from "./Admin/admin-slice.js";


const store = configureStore({
  reducer: {
    property: propertyReducer,
    propertyDetails: propertyDetailsReducer,
    user: userReducer,
    wishlist: wishlistReducer,
    booking: bookingReducer,
    notifications: notificationReducer,
    host: hostReducer,
    admin: adminReducer,
  },
});

export default store;


