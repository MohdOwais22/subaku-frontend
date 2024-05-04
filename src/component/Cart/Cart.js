import React, { Fragment, useEffect, useState } from "react";
import "./Cart.css";
import CartItemCard from "./CartItemCard";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart, removeItemsFromCart } from "../../actions/cartAction";
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link } from "react-router-dom";

const Cart = ({ history }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const [cartItemsCustom, setCartItemsCustom] = useState(null);

  useEffect(() => {
    const fetchCustomCartItems = async () => {
      try {
        const cartItemsC = await localStorage.getItem("cartItemsCustom");
        setCartItemsCustom(JSON.parse(cartItemsC));
      } catch (error) {
        console.error("Error fetching custom cart items:", error);
      }
    };

    fetchCustomCartItems();
  }, []);

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (newQty < 1) {
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };

  const deleteCartItems = (id) => {
    dispatch(removeItemsFromCart(id));
  };

  const deleteCartItemsCustom = async () => {
    await localStorage.removeItem("cartItemsCustom");
    setCartItemsCustom(null); // Clear custom cart items from state
  };

  const checkoutHandler = () => {
    history.push("/login?redirect=shipping");
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
  };

  const subtotal = calculateSubtotal();
  const customSubtotal =
    cartItemsCustom?.Quantity && cartItemsCustom?.price
      ? Number(cartItemsCustom.Quantity) * Number(cartItemsCustom.price)
      : 0;

  const grossTotal = subtotal + customSubtotal;

  return (
    <Fragment>
      {cartItems.length === 0 && !cartItemsCustom ? (
        <div className="emptyCart">
          <RemoveShoppingCartIcon />
          <Typography>No Product in Your Cart</Typography>
          <Link to="/products">View Products</Link>
        </div>
      ) : (
        <Fragment>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>Subtotal</p>
            </div>

            {cartItems.map((item) => (
              <div className="cartContainer" key={item.product}>
                <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                <div className="cartInput">
                  <button onClick={() => decreaseQuantity(item.product, item.quantity)}>-</button>
                  <input type="number" value={item.quantity} readOnly />
                  <button onClick={() => increaseQuantity(item.product, item.quantity, item.stock)}>+</button>
                </div>
                <p className="cartSubtotal">₹{item.price * item.quantity}</p>
              </div>
            ))}

            {cartItemsCustom && (
              <div className="cartContainer" key={cartItemsCustom.product}>
                <CartItemCard item={cartItemsCustom} deleteCartItems={deleteCartItemsCustom} />
                <div className="cartInput">
                  <input type="number" value={cartItemsCustom?.Quantity || 0} readOnly />
                </div>
                <p className="cartSubtotal">₹{customSubtotal}</p>
              </div>
            )}
            <div className="cartGrossProfit">
              <div></div>
              <div className="cartGrossProfitBox">
                <p>Gross Total</p>
                <p>₹{grossTotal}</p>
              </div>
              <div></div>
              <div className="checkOutBtn">
                <button onClick={checkoutHandler}>Check Out</button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;
