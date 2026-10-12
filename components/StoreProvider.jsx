"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CartDrawer } from "./cart-drawer";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }, []);

  const addToCart = useCallback((pizza) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === pizza.id);
      if (existing) {
        return items.map((item) => item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...items, { ...pizza, quantity: 1 }];
    });
    showToast(`«${pizza.name}» добавлена в корзину`);
  }, [showToast]);

  const changeQuantity = useCallback((id, change) => {
    setCart((items) => items
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + change } : item)
      .filter((item) => item.quantity > 0));
  }, []);

  const value = useMemo(() => ({
    cart,
    addToCart,
    changeQuantity,
    cartOpen,
    setCartOpen,
    showToast,
  }), [cart, addToCart, changeQuantity, cartOpen, showToast]);

  return (
    <StoreContext.Provider value={value}>
      {children}
      <CartDrawer />
      <div className={`toast${toast ? " visible" : ""}`} role="status" aria-live="polite">{toast}</div>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore должен использоваться внутри StoreProvider");
  return context;
}
