import slugify from "slugify";
import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    propertyName: {
      type: String,
      required: [true, "Please enter your property name"],
      trim: true,
      maxlength: [100, "Property name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Please add information about your property"],
      trim: true,
    },

    extraInfo: {
      type: String,
      default: "Checking on time",
      trim: true,
    },

    propertyType: {
      type: String,
      enum: [
        "House",
        "Flat",
        "Guest House",
        "Hotel",
        "Villa",
        "Apartment",
        "Cottage",
        "Resort",
        "Cabin",
        "Gite",
      ],
      default: "House",
    },


    roomType: {
      type: String,
      enum: ["Anytype", "Room", "Entire Home", "Shared Room"],
      default: "Anytype",
    },

    maximumGuest: {
      type: Number,
      required: [true, "Please give the maximum number of guests"],
      min: [1, "There must be at least 1 guest"],
    },

    bedrooms: {
      type: Number,
      required: [true, "Please enter number of bedrooms"],
      min: 0,
    },

    beds: {
      type: Number,
      required: [true, "Please enter number of beds"],
      min: 1,
    },

    bathrooms: {
      type: Number,
      required: [true, "Please enter number of bathrooms"],
      min: 1,
    },

    amenities: [
      {
        name: {
          type: String,
          required: true,
          enum: [
            "Wifi",
            "Kitchen",
            "AC",
            "Washing Machine",
            "TV",
            "Pool",
            "Free Parking",
            "Gym",
            "Breakfast",
            "Balcony",
            "Garden",
            "Pet Friendly",
            "Hot Water",
            "Workspace",
            "Elevator",
          ],
        },

        icon: {
          type: String,
          required: true,
        },
      },
    ],

    images: {
      type: [
        {
          public_id: {
            type: String,
          },

          url: {
            type: String,
            required: true,
          },
        },
      ],

      validate: {
        validator: function (arr) {
          return arr.length >= 6;
        },
        message: "The images must contain at least 6 images",
      },
    },

    price: {
      type: Number,
      required: [true, "Please enter the price per night"],
      default: 500,
      min: [1, "Price must be greater than 0"],
    },

    cleaningFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    serviceFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    securityDeposit: {
      type: Number,
      default: 0,
      min: 0,
    },

    address: {
      area: {
        type: String,
        required: [true, "Please enter the area"],
        trim: true,
      },

      city: {
        type: String,
        required: [true, "Please enter the city"],
        trim: true,
      },

      state: {
        type: String,
        required: [true, "Please enter the state"],
        trim: true,
      },

      country: {
        type: String,
        default: "India",
        trim: true,
      },

      pincode: {
        type: Number,
        required: [true, "Please enter the pincode"],
      },
    },

    location: {
      latitude: {
        type: Number,
      },

      longitude: {
        type: Number,
      },
    },

    houseRules: [
      {
        type: String,
        trim: true,
      },
    ],

    cancellationPolicy: {
      type: String,
      enum: ["Flexible", "Moderate", "Strict"],
      default: "Flexible",
    },

    checkInTime: {
      type: String,
      default: "11:00",
    },

    checkOutTime: {
      type: String,
      default: "13:00",
    },

    // ================= CURRENT BOOKINGS =================

    currentBookings: [
      {
        bookingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Booking",
        },

        fromDate: {
          type: Date,
          required: true,
        },

        toDate: {
          type: Date,
          required: true,
        },

        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],

    // ================= PROPERTY OWNER =================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Property owner is required"],
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },

        comment: {
          type: String,
          trim: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isVerified: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending", "Blocked"],
      default: "Pending",
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },

  {
    timestamps: true,
  }
);


// ================= SLUG MIDDLEWARE =================

propertySchema.pre("save", function () {
  if (this.isModified("propertyName") || !this.slug) {
    this.slug = slugify(this.propertyName, {
      lower: true,
      strict: true,
    });
  }
});


// ================= CITY LOWERCASE =================

propertySchema.pre("save", function () {
  if (this.address && this.address.city) {
    this.address.city = this.address.city.toLowerCase().trim();
  }
});


const Property = mongoose.model.Property || mongoose.model("Property", propertySchema);

export { Property };

