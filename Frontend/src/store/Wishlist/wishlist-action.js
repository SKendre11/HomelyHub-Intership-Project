import { wishlistActions } from "./wishlist-slice.js";
import { axiosInstance } from "../../utils/axios.js";

// FETCH WISHLIST
export const fetchWishlist = () => async (dispatch) => {
  try {
    dispatch(wishlistActions.getRequest());

    const { data } = await axiosInstance.get("/v1/rent/user/wishlist");

    dispatch(wishlistActions.getWishlist(data.wishlist));
  } catch (error) {
    dispatch(
      wishlistActions.getError(
        error.response?.data?.message || "Failed to fetch wishlist"
      )
    );
  }
};

// ADD TO WISHLIST
export const addToWishlist = (propertyId) => async (dispatch) => {
  try {
    dispatch(wishlistActions.getRequest());

    const { data } = await axiosInstance.post(
      `/v1/rent/user/wishlist/${propertyId}`
    );

    dispatch(wishlistActions.addToWishlistSuccess(data.wishlist));
  } catch (error) {
    dispatch(
      wishlistActions.getError(
        error.response?.data?.message || "Failed to add to wishlist"
      )
    );
  }
};

// REMOVE FROM WISHLIST
export const removeFromWishlist = (propertyId) => async (dispatch) => {
  try {
    dispatch(wishlistActions.getRequest());

    const { data } = await axiosInstance.delete(
      `/v1/rent/user/wishlist/${propertyId}`
    );

    dispatch(wishlistActions.removeFromWishlistSuccess(data.wishlist));
  } catch (error) {
    dispatch(
      wishlistActions.getError(
        error.response?.data?.message || "Failed to remove from wishlist"
      )
    );
  }
};
