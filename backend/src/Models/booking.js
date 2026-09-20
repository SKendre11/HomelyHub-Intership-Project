import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Booking must belong to a Property"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Booking must belong to a User"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Booking must belong to a Property Owner"],
    },

    price: {
      type: Number,
      required: [true, "Booking must have a price"],
    },

    paid: {
      type: Boolean,
      default: false,
    },

    bookingStatus: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Payment Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    fromDate: {
      type: Date,
      required: [true, "Booking must have a start date"],
    },

    toDate: {
      type: Date,
      required: [true, "Booking must have an end date"],
    },

    guests: {
      type: Number,
      required: true,
    },

    numberOfNights: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


// Populate user, owner, and property automatically
bookingSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "name email phoneNumber avatar",
  })
  .populate({
    path: "owner",
    select: "name email phoneNumber avatar",
  })
  .populate({
    path: "property",
  });  
});


const Booking = mongoose.model("Booking", bookingSchema);

export { Booking };


