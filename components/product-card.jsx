"use client";

import { Plus } from "lucide-react";
import { useStore } from "./StoreProvider";

const formatPrice = (price) => `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;

export function ProductCard({ pizza }) {
  const { addToCart } = useStore();
  const imageUrl = `https://images.unsplash.com/${pizza.image}?auto=format&fit=crop&w=720&q=80`;

  return (
    <article className="pizza-card">
      <div className="pizza-photo">
        <img src={imageUrl} alt={`Пицца «${pizza.name}»`} loading="lazy" />
      </div>
      <div className="pizza-info">
        <div className="pizza-title-row"><h3>{pizza.name}</h3><span className="pizza-price">{formatPrice(pizza.price)}</span></div>
        <div className="pizza-card-bottom">
          <button type="button" onClick={() => addToCart(pizza)}>Добавить <b><Plus size={13} aria-hidden="true" /></b></button>
        </div>
      </div>
    </article>
  );
}
