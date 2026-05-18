import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import api from "../utils/api";

import { useCart } from "../context/CartContext";

import { toast } from "react-toastify";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);

  const [qty, setQty] = useState(1);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/products/${id}`)

      .then((res) => setProduct(res.data))

      .catch(() => toast.error("Product not found"))

      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );

  if (!product)
    return (
      <div
        className="container"
        style={{
          padding: "80px 0",
          textAlign: "center",
        }}
      >
        Product not found
      </div>
    );

  const handleAdd = () => {
    addToCart(product, qty);

    toast.success(`${product.name} added to cart`);
  };

  const handleBuy = () => {
    addToCart(product, qty);

    navigate("/checkout");
  };

  return (
    <div className="product-details fade-in">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="pd-grid">
          {/* IMAGE */}
          <div className="pd-image">
            <img src={product.image} alt={product.name} />
          </div>

          {/* INFO */}
          <div className="pd-info">
            <span className="pd-category">{product.category}</span>

            <h1 className="pd-name">{product.name}</h1>

            <div className="pd-meta">
              <span className="pd-rating">
                ★ {product.rating?.toFixed(1) || "0.0"}
              </span>

              <span className="pd-reviews">
                ({product.numReviews || 0} reviews)
              </span>

              <span
                className={`pd-stock ${
                  product.countInStock > 0 ? "in" : "out"
                }`}
              >
                {product.countInStock > 0
                  ? `${product.countInStock} in stock`
                  : "Out of stock"}
              </span>
            </div>

            {/* PRICE */}
            <div className="pd-price">₹{product.price?.toFixed(2)}</div>

            {/* DESCRIPTION */}
            <div className="pd-desc-card">
              <h3>Product Description</h3>
              <div className="pd-desc-scroll">
                <p className="pd-desc">{product.description}</p>
              </div>
            </div>

            {/* ACTIONS */}
            {product.countInStock > 0 && (
              <div className="pd-actions">
                <div className="qty-selector">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}>
                    −
                  </button>

                  <span>{qty}</span>

                  <button
                    onClick={() =>
                      setQty(Math.min(product.countInStock, qty + 1))
                    }
                  >
                    +
                  </button>
                </div>

                <button className="btn btn-primary btn-lg" onClick={handleAdd}>
                  Add to Cart
                </button>

                <button className="btn btn-accent btn-lg" onClick={handleBuy}>
                  Buy Now
                </button>
              </div>
            )}

            {/* PERKS */}
            <div className="pd-perks">
              <div>
                <strong>Free shipping</strong>

                <small>on orders over ₹5000</small>
              </div>

              <div>
                <strong>30-day returns</strong>

                <small>hassle-free</small>
              </div>

              <div>
                <strong>Secure checkout</strong>

                <small>encrypted payment</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
