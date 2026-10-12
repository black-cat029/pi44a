"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "./product-card";
import { Pagination } from "./pagination";

const PAGE_SIZE = 4;

export function ProductCatalog({ pizzas, categories }) {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [requestedPage, setRequestedPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get("category") || "Все";
    const parsedPage = Number(params.get("page"));
    setActiveCategory(categories.includes(requestedCategory) ? requestedCategory : "Все");
    setRequestedPage(Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1);
  }, [categories]);

  const categoryPizzas = activeCategory === "Все"
    ? pizzas
    : pizzas.filter((pizza) => pizza.category === activeCategory);
  const totalPages = Math.max(1, Math.ceil(categoryPizzas.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const visiblePizzas = categoryPizzas.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    <>
      <section className="menu-section" id="menu">
        <div className="section-heading">
          <h2>Наша <em>пицца</em></h2>
        </div>
        <div className="menu-toolbar">
          <nav className="category-tabs" aria-label="Категории пиццы">
            {categories.map((category) => {
              const params = new URLSearchParams();
              if (category !== "Все") params.set("category", category);
              const href = params.size ? `${basePath}/?${params.toString()}#menu` : `${basePath}/#menu`;
              return (
                <a
                  key={category}
                  className={`category-tab${activeCategory === category ? " active" : ""}`}
                  href={href}
                  aria-current={activeCategory === category ? "page" : undefined}
                >
                  {category}
                </a>
              );
            })}
          </nav>
        </div>
        {visiblePizzas.length ? (
          <div className="pizza-grid">
            {visiblePizzas.map((pizza) => <ProductCard key={pizza.id} pizza={pizza} />)}
          </div>
        ) : (
          <p className="empty-category">В этой категории пока нет пиццы.</p>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          category={activeCategory}
        />
      </section>
    </>
  );
}
