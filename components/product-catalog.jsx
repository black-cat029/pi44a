"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ProductCard } from "./product-card";
import { Pagination } from "./pagination";

const PAGE_SIZE = 4;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

function catalogHref(category, page) {
  const params = new URLSearchParams();
  if (category !== "Все") params.set("category", category);
  if (page !== 1) params.set("page", String(page));
  const query = params.size ? `?${params.toString()}` : "";
  return `${basePath}/${query}#menu`;
}

export function ProductCatalog({
  pizzas,
  categories,
}) {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [selectedPage, setSelectedPage] = useState(1);
  const filteredPizzas = useMemo(
    () => activeCategory === "Все" ? pizzas : pizzas.filter((pizza) => pizza.category === activeCategory),
    [activeCategory, pizzas],
  );
  const totalPages = Math.max(1, Math.ceil(filteredPizzas.length / PAGE_SIZE));
  const currentPage = Math.min(selectedPage, totalPages);
  const visiblePizzas = filteredPizzas.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const syncLocation = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get("category") || "Все";
    const category = categories.includes(requestedCategory) ? requestedCategory : "Все";
    const categoryItems = category === "Все" ? pizzas : pizzas.filter((pizza) => pizza.category === category);
    const pageCount = Math.max(1, Math.ceil(categoryItems.length / PAGE_SIZE));
    const requestedPage = Number(params.get("page"));
    const page = Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, pageCount)
      : 1;
    setActiveCategory(category);
    setSelectedPage(page);
  }, [categories, pizzas]);

  useEffect(() => {
    syncLocation();
    window.addEventListener("popstate", syncLocation);
    return () => window.removeEventListener("popstate", syncLocation);
  }, [syncLocation]);

  const handleNavigate = useCallback((event, category, page) => {
    event.preventDefault();
    window.history.pushState(null, "", catalogHref(category, page));
    setActiveCategory(category);
    setSelectedPage(page);
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      <section className="menu-section" id="menu">
        <div className="section-heading">
          <h2>Наша <em>пицца</em></h2>
        </div>
        <div className="menu-toolbar">
          <nav className="category-tabs" aria-label="Категории пиццы">
            {categories.map((category) => {
              const href = catalogHref(category, 1);
              return (
                <a
                  key={category}
                  className={`category-tab${activeCategory === category ? " active" : ""}`}
                  href={href}
                  aria-current={activeCategory === category ? "page" : undefined}
                  onClick={(event) => handleNavigate(event, category, 1)}
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
          onNavigate={handleNavigate}
        />
      </section>
    </>
  );
}
