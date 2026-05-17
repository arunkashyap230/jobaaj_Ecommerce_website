# Shoply - Frontend (React + Plain CSS)

A modern, beautifully designed e-commerce frontend built with React (JavaScript, not TypeScript) and plain CSS.

## Features

- 🎨 Premium magazine-style design with Playfair Display + Inter typography
- 🛍️ Product catalog with search & category filters
- 🛒 Shopping cart with localStorage persistence
- 👤 User auth (login/register) with JWT
- 📦 Order placement & history
- 👨‍💼 Admin dashboard (CRUD products, manage orders)
- 📱 Fully responsive

## Setup

```bash
npm install
npm start
```

Runs on http://localhost:3000 — proxies API to http://localhost:5000

## Environment

Optional `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Structure

```
src/
  components/     Navbar, Footer, ProductCard
  pages/          Home, ProductDetails, Cart, Checkout, Login, Register, Orders, Profile, AdminDashboard
  context/        AuthContext, CartContext
  utils/          api.js (axios instance)
  styles/         global.css
```

Each component/page has its own `.css` file (no CSS-in-JS, no Tailwind).

## Backend

Pair with `ecommerce-server` running on port 5000.

To make yourself admin: in MongoDB, set `isAdmin: true` on your user document.
