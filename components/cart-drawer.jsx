"use client";

import { Minus, Plus, X } from "lucide-react";
import { useEffect } from "react";
import { useStore } from "./StoreProvider";

const formatPrice = (price) => `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, changeQuantity, showToast } = useStore();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (!cartOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setCartOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [cartOpen, setCartOpen]);

  return (
    <div className="cart-overlay" hidden={!cartOpen} onMouseDown={(event) => {
      if (event.target === event.currentTarget) setCartOpen(false);
    }}>
      <section className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="cart-heading">
          <h2 id="cart-title">Твоя корзина</h2>
          <button type="button" onClick={() => setCartOpen(false)} aria-label="Закрыть корзину"><X size={21} /></button>
        </div>
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=160&q=75`} alt="" />
              <div className="cart-item-info"><strong>{item.name}</strong><span>{formatPrice(item.price)}</span>
                <div className="quantity-control">
                  <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={`Уменьшить количество пиццы «${item.name}»`}><Minus size={12} /></button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Увеличить количество пиццы «${item.name}»`}><Plus size={12} /></button>
                </div>
              </div>
              <strong className="cart-item-total">{formatPrice(item.price * item.quantity)}</strong>
            </div>
          ))}
        </div>
        {!cart.length && <div className="cart-empty">Пока здесь пусто — самое время выбрать пиццу.</div>}
        {!!cart.length && (
          <>
            <div className="cart-total"><span>Итого · {itemCount} шт.</span><strong>{formatPrice(total)}</strong></div>
            <button className="checkout-button" type="button" onClick={() => {
              showToast("Спасибо! Скоро мы добавим оформление заказа.");
              setCartOpen(false);
            }}>Оформить заказ <span>↗</span></button>
          </>
        )}
      </section>
    </div>
  );
}
