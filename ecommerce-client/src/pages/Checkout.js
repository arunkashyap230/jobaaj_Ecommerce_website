import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";
import "./Checkout.css";

function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();

  const { user } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Razorpay");

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  // Redirect if cart empty
  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  // Prices in Rupees
  const shippingCost = 0;

  const tax = 0;

  const grandTotal = totalPrice + shippingCost + tax;

  // Razorpay Payment
  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create Razorpay Order
      const { data } = await api.post("/payment/create-order", {
        amount: grandTotal,
      });

      const options = {
        key: "rzp_test_SqL9w2TxJlNFnL",

        amount: data.amount,

        currency: data.currency,

        name: "Shoply",

        description: "Order Payment",

        order_id: data.id,

        handler: async function (response) {
          try {
            // Save Order After Payment Success
            await api.post("/orders", {
              orderItems: cart.map((i) => ({
                product: i._id,
                name: i.name,
                image: i.image,
                price: i.price,
                qty: i.qty,
              })),

              shippingAddress: shipping,

              paymentMethod: "Razorpay",

              paymentResult: {
                id: response.razorpay_payment_id,
                status: "Paid",
                update_time: new Date(),
                email_address: user.email,
              },

              itemsPrice: totalPrice,

              shippingPrice: shippingCost,

              taxPrice: tax,

              totalPrice: grandTotal,

              isPaid: true,

              paidAt: new Date(),
            });

            clearCart();

            toast.success("Payment Successful");

            navigate("/orders");
          } catch (error) {
            console.log(error);

            toast.error("Order save failed");
          }
        },

        prefill: {
          name: user.name,
          email: user.email,
        },

        theme: {
          color: "#000000",
        },
      };

      const razor = new window.Razorpay(options);

      razor.open();
    } catch (error) {
      console.log(error);

      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // COD Order
  const handleCODOrder = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/orders", {
        orderItems: cart.map((i) => ({
          product: i._id,
          name: i.name,
          image: i.image,
          price: i.price,
          qty: i.qty,
        })),

        shippingAddress: shipping,

        paymentMethod: "COD",

        itemsPrice: totalPrice,

        shippingPrice: shippingCost,

        taxPrice: tax,

        totalPrice: grandTotal,
      });

      clearCart();

      toast.success("Order placed successfully!");

      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page fade-in">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <form onSubmit={handleCODOrder} className="checkout-grid">
          {/* LEFT */}
          <div className="checkout-form">
            {/* SHIPPING */}
            <div className="checkout-section">
              <h3>Shipping Address</h3>

              <div className="form-group">
                <label className="form-label">Address</label>

                <input
                  className="form-input"
                  required
                  value={shipping.address}
                  onChange={(e) =>
                    setShipping({
                      ...shipping,
                      address: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>

                  <input
                    className="form-input"
                    required
                    value={shipping.city}
                    onChange={(e) =>
                      setShipping({
                        ...shipping,
                        city: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Postal Code</label>

                  <input
                    className="form-input"
                    required
                    value={shipping.postalCode}
                    onChange={(e) =>
                      setShipping({
                        ...shipping,
                        postalCode: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Country</label>

                <input
                  className="form-input"
                  required
                  value={shipping.country}
                  onChange={(e) =>
                    setShipping({
                      ...shipping,
                      country: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* PAYMENT */}
            <div className="checkout-section">
              <h3>Payment Method</h3>

              <div className="payment-options">
                {["Razorpay", "COD"].map((m) => (
                  <label
                    key={m}
                    className={`payment-option ${
                      paymentMethod === m ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="pay"
                      value={m}
                      checked={paymentMethod === m}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />

                    <span>{m === "COD" ? "Cash on Delivery" : "Razorpay"}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <aside className="cart-summary">
            <h3>Order Summary</h3>

            {cart.map((i) => (
              <div key={i._id} className="checkout-item">
                <img src={`http://localhost:5000${i.image}`} alt={i.name} />

                <div>
                  <strong>{i.name}</strong>

                  <small>Qty: {i.qty}</small>
                </div>

                <span>₹{(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>

              <span>₹{totalPrice.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>

              <span>
                {shippingCost === 0 ? "Free" : `₹${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="summary-row">
              <span>GST</span>

              <span>Free</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total</span>

              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            {/* BUTTON */}
            {paymentMethod === "Razorpay" ? (
              <button
                type="button"
                className="btn btn-primary btn-block btn-lg"
                disabled={loading}
                onClick={handlePayment}
              >
                {loading ? "Processing..." : "Pay with Razorpay"}
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={loading}
              >
                {loading ? "Placing order..." : "Place COD Order"}
              </button>
            )}
          </aside>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
