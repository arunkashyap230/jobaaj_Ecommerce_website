import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-mark">S</span>
          <span className="logo-text">Shop</span>
        </Link>

        <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Shop
          </Link>
          <Link to="/?category=Electronics" onClick={() => setMenuOpen(false)}>
            Electronics
          </Link>
          <Link to="/?category=Fashion" onClick={() => setMenuOpen(false)}>
            Fashion
          </Link>
          <Link to="/?category=Home" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
        </nav>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-icon" aria-label="Cart">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <button
                className="user-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </button>
              {dropdownOpen && (
                <div className="dropdown">
                  <div className="dropdown-header">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/orders" onClick={() => setDropdownOpen(false)}>
                    My Orders
                  </Link>
                  {user.isAdmin && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)}>
                      Admin
                    </Link>
                  )}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
          )}

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
