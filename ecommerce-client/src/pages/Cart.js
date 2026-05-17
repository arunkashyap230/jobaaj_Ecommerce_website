import React from "react";

import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

import { useAuth } from "../context/AuthContext";

import "./Cart.css";

function Cart() {
  const { cart, removeFromCart, updateQty, totalPrice, totalItems } = useCart();

  const { user } = useAuth();

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) navigate("/login");
    else navigate("/checkout");
  };

  // EMPTY CART
  if (cart.length === 0) {
    return (
      <div className="cart-empty fade-in">
        <div className="container">
          <div className="empty-card">
            <div className="empty-icon">🛍</div>

            <h2>Your cart is empty</h2>

            <p>Looks like you haven't added anything yet.</p>

            <Link to="/" className="btn btn-primary btn-lg">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // RUPEES
  const shipping = 0;

  const tax = 0;

  const grandTotal = totalPrice + shipping + tax;

  return (
    <div className="cart-page fade-in">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>

        <p className="page-subtitle">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </p>

        <div className="cart-grid">
          {/* CART ITEMS */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={product.image} alt={item.name} />

                <div className="cart-item-info">
                  <span className="cart-item-cat">{item.category}</span>

                  <Link to={`/product/${item._id}`} className="cart-item-name">
                    {item.name}
                  </Link>

                  <div className="cart-item-price">
                    ₹{item.price.toFixed(2)}
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="qty-selector">
                    <button onClick={() => updateQty(item._id, item.qty - 1)}>
                      −
                    </button>

                    <span>{item.qty}</span>

                    <button onClick={() => updateQty(item._id, item.qty + 1)}>
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item._id)}
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <aside className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>

              <span>₹{totalPrice.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>

              <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
            </div>

            <div className="summary-row">
              <span>Tax (10%)</span>

              <span>₹{tax.toFixed(2)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total</span>

              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>

            <Link to="/" className="continue-link">
              ← Continue shopping
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Cart;
