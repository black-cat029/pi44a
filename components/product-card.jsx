"use client";

import { Plus } from "lucide-react";
import { useStore } from "./StoreProvider";
import { getPizzaImageSrc } from "../lib/pizza-image";

const formatPrice = (price) => `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;

export function ProductCard({ pizza }) {
  const { addToCart } = useStore();

  return (
    <article className="pizza-card">
      <div className="pizza-photo">
        <img src={getPizzaImageSrc(pizza.image)} alt={`Пицца «${pizza.name}»`} loading="lazy" />
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
