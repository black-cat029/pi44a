"use client";

import { useCallback, useEffect, useState } from "react";
import { ProductCard } from "./product-card";
import { Pagination } from "./pagination";

const PAGE_SIZE = 4;

function readCatalogLocation(categories, totalPagesFor) {
  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get("category") || "Все";
  const category = categories.includes(requestedCategory) ? requestedCategory : "Все";
  const requestedPage = Number(params.get("page"));
  const pageCount = totalPagesFor(category);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, pageCount)
    : 1;
  return { category, page };
}

function catalogHref(category, page) {
  const params = new URLSearchParams();
  if (category !== "Все") params.set("category", category);
  if (page !== 1) params.set("page", String(page));
  const query = params.size ? `?${params.toString()}` : "";
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/${query}#menu`;
}

function openCatalogPage(event, category, page, setCategory, setPage) {
  event.preventDefault();
  window.history.pushState(null, "", catalogHref(category, page));
  setCategory(category);
  setPage(page);
}

export function ProductCatalog({ pizzas, categories }) {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [selectedPage, setSelectedPage] = useState(1);
  const categoryPizzas = activeCategory === "Все"
    ? pizzas
    : pizzas.filter((pizza) => pizza.category === activeCategory);
  const totalPages = Math.max(1, Math.ceil(categoryPizzas.length / PAGE_SIZE));
  const currentPage = Math.min(selectedPage, totalPages);
  const visiblePizzas = categoryPizzas.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  const syncLocation = useCallback(() => {
    const { category, page } = readCatalogLocation(categories, (selectedCategory) => {
      const filteredPizzas = selectedCategory === "Все"
        ? pizzas
        : pizzas.filter((pizza) => pizza.category === selectedCategory);
      return Math.max(1, Math.ceil(filteredPizzas.length / PAGE_SIZE));
    });
    setActiveCategory(category);
    setSelectedPage(page);
  }, [categories, pizzas]);

  useEffect(() => {
    syncLocation();
    window.addEventListener("popstate", syncLocation);
    return () => window.removeEventListener("popstate", syncLocation);
  }, [syncLocation]);

  const handleNavigate = useCallback((event, category, page) => {
    openCatalogPage(event, category, page, setActiveCategory, setSelectedPage);
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
              const href = category === "Все"
                ? `${basePath}/#menu`
                : `${basePath}/?category=${encodeURIComponent(category)}#menu`;
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
