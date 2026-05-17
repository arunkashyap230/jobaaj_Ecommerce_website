import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <div className="footer-logo">
            <span className="logo-mark">S</span>
            <span>Shop</span>
          </div>
          <p>Premium products, thoughtfully curated. Delivered with care.</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/">All Products</Link>
          <Link to="/?category=Electronics">Electronics</Link>
          <Link to="/?category=Fashion">Fashion</Link>
        </div>
        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/login">Sign In</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/cart">Cart</Link>
        </div>
        <div className="footer-col">
          <h4>Stay updated</h4>
          <p>Get exclusive offers and new arrivals.</p>
          <form className="newsletter" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email" />
            <button type="submit">→</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Shoply. Crafted with care.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
