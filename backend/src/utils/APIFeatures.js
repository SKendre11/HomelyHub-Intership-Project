// ---- APIFeatures: builds the search query, 
// The listings page has filters, a search box and pages. Doing
// all that inside the controller would make it 100 lines long.
// So we keep it here, and the controller stays clean:
//     new APIFeatures(Property.find(), req.query)
//       .filter().search().paginate()
//
// A class is a blueprint. 'new' makes one copy to work with.
class APIFeatures {
  // constructor runs once, when we say 'new APIFeatures(...)'
  // query       = the unfinished mongoose search
  // queryString = what the user asked for (req.query), the
  //               part of the address after the ? mark
  constructor(query, queryString) {
    (this.query = query), (this.queryString = queryString);
  }

  // FILTER - price, type, room, amenities, bedrooms, bathrooms
  filter() {
    let filterQuery = {};
    let queryObj = { ...this.queryString };

    // PRICE RANGE
    if (queryObj.minPrice || queryObj.maxPrice) {
      filterQuery.price = {};
      if (queryObj.minPrice) {
        filterQuery.price.$gte = Number(queryObj.minPrice);
      }
      if (queryObj.maxPrice) {
        const maxStr = String(queryObj.maxPrice);
        if (!maxStr.includes(">")) {
          filterQuery.price.$lte = Number(queryObj.maxPrice);
        }
      }
    }

    // PROPERTY TYPE
    if (queryObj.propertyType) {
      let propertyTypeArray = queryObj.propertyType
        .split(",")
        .map((value) => new RegExp(value.trim(), "i"));
      filterQuery.propertyType = { $in: propertyTypeArray };
    }

    // ROOM TYPE
    if (queryObj.roomType && queryObj.roomType !== "Anytype") {
      filterQuery.roomType = new RegExp(queryObj.roomType.trim(), "i");
    }

    // BEDROOMS
    if (queryObj.bedrooms) {
      filterQuery.bedrooms = { $gte: Number(queryObj.bedrooms) };
    }

    // BATHROOMS
    if (queryObj.bathrooms) {
      filterQuery.bathrooms = { $gte: Number(queryObj.bathrooms) };
    }

    // AMENITIES
    if (queryObj.amenities) {
      const amenitiesArray = Array.isArray(queryObj.amenities)
        ? queryObj.amenities
        : String(queryObj.amenities).split(",");

      const regexArray = amenitiesArray.map(a => new RegExp(a.trim(), "i"));
      filterQuery["amenities.name"] = { $all: regexArray };
    }

    this.query = this.query.find(filterQuery);
    return this;
  }


  // SEARCH - city/location, guests, dates
  search() {
    let searchQuery = {};
    let queryObj = { ...this.queryString };

    // CITY / LOCATION REGEX SEARCH
    if (queryObj.city && queryObj.city.trim() !== "") {
      const cityRegex = new RegExp(queryObj.city.trim(), "i");
      searchQuery.$or = [
        { "address.city": cityRegex },
        { "address.state": cityRegex },
        { "address.area": cityRegex },
        { propertyName: cityRegex },
      ];
    }

    // GUESTS
    if (queryObj.guests && Number(queryObj.guests) > 0) {
      searchQuery.maximumGuest = { $gte: Number(queryObj.guests) };
    }

    // DATES AVAILABILITY CHECK
    if (queryObj.dateIn && queryObj.dateOut) {
      searchQuery.$and = [
        {
          currentBookings: {
            $not: {
              $elemMatch: {
                $or: [
                  {
                    fromDate: { $lt: queryObj.dateOut },
                    toDate: { $gt: queryObj.dateIn },
                  },
                  {
                    fromDate: { $lt: queryObj.dateIn },
                    toDate: { $gt: queryObj.dateIn },
                  },
                ],
              },
            },
          },
        },
      ];
    }

    this.query = this.query.find(searchQuery);
    return this;
  }


  // SORT - price_asc, price_desc, rating_desc
  sort() {
    if (this.queryString.sortBy) {
      const sortBy = this.queryString.sortBy;
      if (sortBy === "price_asc") {
        this.query = this.query.sort({ price: 1 });
      } else if (sortBy === "price_desc") {
        this.query = this.query.sort({ price: -1 });
      } else if (sortBy === "rating_desc") {
        this.query = this.query.sort({ rating: -1 });
      } else {
        this.query = this.query.sort({ createdAt: -1 });
      }
    } else {
      this.query = this.query.sort({ createdAt: -1 });
    }
    return this;
  }


  // PAGINATE - show 12 at a time
  paginate() {
    let page = this.queryString.page * 1 || 1;
    let limit = this.queryString.limit * 1 || 12;
    let skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}


// propertyController imports this to build the listings search
export { APIFeatures };
