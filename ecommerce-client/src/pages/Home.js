import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import "./Home.css";

const CATEGORIES = ["All", "Electronics", "Fashion", "Home", "Books", "Sports"];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "All";

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", {
        params: { search, category: category === "All" ? "" : category },
      })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, category]);

  const setCategory = (cat) => {
    if (cat === "All") setSearchParams({});
    else setSearchParams({ category: cat });
  };

  return (
    <div className="home fade-in">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="hero-eyebrow">New Season · 2025</span>
            <h1 className="hero-title">
              Curated essentials
              <br />
              <em>for modern living.</em>
            </h1>
            <p className="hero-desc">
              Premium products, thoughtfully selected. Free shipping on orders
              over ₹5000.
            </p>
            <div className="hero-actions">
              <a href="#products" className="btn btn-accent btn-lg">
                Shop Collection
              </a>
              <a href="#products" className="btn btn-outline btn-lg">
                Browse Categories
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <strong>10k+</strong>
                <span>Happy customers</span>
              </div>
              <div>
                <strong>500+</strong>
                <span>Products</span>
              </div>
              <div>
                <strong>4.9★</strong>
                <span>Avg rating</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card hero-card-1">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
                alt="Headphones"
              />
            </div>
            <div className="hero-card hero-card-2">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
                alt="Sneakers"
              />
            </div>
            <div className="hero-card hero-card-3">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
                alt="Watch"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="features-strip">
        <div className="container features-grid">
          <div className="feature-item">
            <span className="feature-icon">⊕</span>
            <div>
              <strong>Free Shipping</strong>
              <small>On orders over $50</small>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">↻</span>
            <div>
              <strong>Easy Returns</strong>
              <small>30-day guarantee</small>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">◈</span>
            <div>
              <strong>Secure Payment</strong>
              <small>SSL encrypted</small>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">★</span>
            <div>
              <strong>Premium Quality</strong>
              <small>Hand-picked items</small>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="products-section" id="products">
        <div className="container">
          <h2 className="section-title">Shop the Collection</h2>
          <p className="section-subtitle">
            Discover our handpicked selection of premium products
          </p>

          <div className="filters">
            <div className="search-box">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="category-pills">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`pill ${category === cat ? "active" : ""}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loader">
              <div className="spinner"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
