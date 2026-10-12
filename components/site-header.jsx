"use client";

import { ShoppingCart } from "lucide-react";
import { useStore } from "./StoreProvider";

export function SiteHeader() {
  const { cart, setCartOpen } = useStore();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Тесто — на главную"><span className="brand-symbol">т</span>тесто<span className="brand-dot">.</span></a>
      <nav className="main-nav" aria-label="Навигация">
        <a href="#menu">Меню</a>
        <a href="#contacts">Контакты</a>
      </nav>
      <div className="header-right">
        <a className="phone-link" href="tel:+78005553535">8 800 555-35-35</a>
        <button className="cart-button" type="button" onClick={() => setCartOpen(true)} aria-label={`Открыть корзину, товаров: ${itemCount}`}>
          <ShoppingCart aria-hidden="true" />
          <span>Корзина</span><b>{itemCount}</b>
        </button>
      </div>
    </header>
  );
}
