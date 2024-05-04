import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";
import axios from "axios";

// Add to Cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/v1/product/${id}`);

  dispatch({
    type: ADD_TO_CART,
    payload: {
      product: data.product._id,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images[0].url,
      stock: data.product.Stock,
      quantity,
    },
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};


export const addProductToCart = (productData) => async (dispatch) => {
  console.log('cart items')
  let cartItems = JSON.parse(localStorage.getItem("cartItemsCustom")) || [];

  // Check if cartItems is an array, if not, initialize it as an empty array
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }

  // Add the new product to the cart items array
  cartItems.push(productData);

  // Update the cart items in local storage
  await localStorage.setItem("cartItemsCustom", JSON.stringify(productData));
  console.log(cartItems);
};



// REMOVE FROM CART
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// SAVE SHIPPING INFO
export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });

  localStorage.setItem("shippingInfo", JSON.stringify(data));
};