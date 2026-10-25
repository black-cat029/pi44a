"use client";

import { useState } from "react";

export function PizzaCreateForm({ categories, onCreated }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/pizzas", {
        method: "POST",
        body: new FormData(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Не удалось добавить пиццу.");

      form.reset();
      onCreated(result);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Не удалось добавить пиццу.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="pizza-create-form" onSubmit={handleSubmit}>
      <label>
        Название
        <input name="name" type="text" maxLength={80} required />
      </label>
      <label>
        Категория
        <select name="category" defaultValue="" required>
          <option value="" disabled>Выберите категорию</option>
          {categories.filter((category) => category !== "Все").map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </label>
      <label>
        Цена, ₽
        <input name="price" type="number" min="1" max="100000" step="1" required />
      </label>
      <label>
        Фото пиццы
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp" required />
      </label>
      <button className="pizza-create-submit" type="submit" disabled={saving}>
        {saving ? "Сохраняем…" : "Добавить в меню"}
      </button>
      {error && <p className="pizza-form-error" role="alert">{error}</p>}
    </form>
  );
}
