import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const GUEST_CART_KEY = "cart:guest";
const LEGACY_CART_KEY = "cart";

const getCartStorageKey = (user) => {
  return user?._id ? `cart:user:${user._id}` : GUEST_CART_KEY;
};

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      return JSON.parse(storedUser);
    }
  } catch (error) {
    localStorage.removeItem("user");
  }

  return null;
};

const readCart = (key) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    localStorage.removeItem(key);
    return [];
  }
};

export function CartProvider({ children }) {
  const { user, loading } = useAuth();
  const [cartKey, setCartKey] = useState(() =>
    getCartStorageKey(getStoredUser()),
  );
  const [cart, setCart] = useState(() =>
    readCart(getCartStorageKey(getStoredUser())),
  );

  useEffect(() => {
    if (loading) return;

    const nextCartKey = getCartStorageKey(user);

    setCartKey(nextCartKey);
    setCart(readCart(nextCartKey));

    // Remove the old shared cart key so one account's cart cannot leak into
    // guest mode or another user's session.
    localStorage.removeItem(LEGACY_CART_KEY);
  }, [user, loading]);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, cartKey]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === product._id);
      if (exists) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) => prev.map((i) => (i._id === id ? { ...i, qty } : i)));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
