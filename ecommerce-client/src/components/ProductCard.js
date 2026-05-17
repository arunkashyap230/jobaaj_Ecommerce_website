import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();

    addToCart(product);

    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image-wrap">
        <img
          src={
            product.image?.startsWith("http")
              ? product.image
              : "https://via.placeholder.com/400x400/f1f5f9/64748b?text=No+Image"
          }
          alt={product.name}
          loading="lazy"
        />

        {product.countInStock === 0 && (
          <span className="badge-out">Sold out</span>
        )}

        <button
          className="quick-add"
          onClick={handleAdd}
          aria-label="Quick add"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>

        <h3 className="product-name">{product.name}</h3>

        <div className="product-footer">
          <span className="product-price">₹{product.price?.toFixed(2)}</span>

          {product.rating > 0 && (
            <span className="product-rating">
              ★ {product.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
