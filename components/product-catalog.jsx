"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "./product-card";
import { Pagination } from "./pagination";
import { PizzaCreateForm } from "./pizza-create-form";

const PAGE_SIZE = 4;

function catalogHref(category, page) {
  const params = new URLSearchParams();
  if (category !== "Все") params.set("category", category);
  if (page !== 1) params.set("page", String(page));
  const query = params.size ? `?${params.toString()}` : "";
  return `/${query}#menu`;
}

export function ProductCatalog({
  pizzas,
  categories,
  activeCategory,
  currentPage,
  totalItems,
  totalPages,
}) {
  const router = useRouter();
  const [managementOpen, setManagementOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [managementMessage, setManagementMessage] = useState("");

  const handleNavigate = useCallback((event, category, page) => {
    event.preventDefault();
    router.push(catalogHref(category, page));
  }, [router]);

  const handleCreated = useCallback((pizza) => {
    setManagementMessage(`«${pizza.name}» добавлена в меню.`);
    if (activeCategory === "Все" || pizza.category === activeCategory) {
      const destination = catalogHref(activeCategory, Math.ceil((totalItems + 1) / PAGE_SIZE));
      const currentLocation = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (currentLocation === destination) router.refresh();
      else router.push(destination);
    } else {
      router.refresh();
    }
  }, [activeCategory, router, totalItems]);

  const handleDelete = useCallback(async (pizza) => {
    if (!window.confirm(`Удалить пиццу «${pizza.name}» из меню?`)) return;
    setDeletingId(pizza.id);
    setManagementMessage("");

    try {
      const response = await fetch(`/api/pizzas/${pizza.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Не удалось удалить пиццу.");

      setManagementMessage(result.warning || `«${pizza.name}» удалена из меню.`);
      router.refresh();
    } catch (error) {
      setManagementMessage(error instanceof Error ? error.message : "Не удалось удалить пиццу.");
    } finally {
      setDeletingId(null);
    }
  }, [router]);

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
                ? catalogHref("Все", 1)
                : catalogHref(category, 1);
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
          <button
            className={`management-toggle${managementOpen ? " active" : ""}`}
            type="button"
            aria-expanded={managementOpen}
            aria-controls="pizza-management"
            onClick={() => {
              setManagementOpen((open) => !open);
              setManagementMessage("");
            }}
          >
            {managementOpen ? "Закрыть управление" : "Управление меню"}
          </button>
        </div>
        {managementOpen && (
          <section className="pizza-management" id="pizza-management" aria-label="Управление меню">
            <h3>Добавить пиццу</h3>
            <PizzaCreateForm categories={categories} onCreated={handleCreated} />
            {managementMessage && <p className="management-message" role="status">{managementMessage}</p>}
          </section>
        )}
        {pizzas.length ? (
          <div className="pizza-grid">
            {pizzas.map((pizza) => (
              <ProductCard
                key={pizza.id}
                pizza={pizza}
                managementMode={managementOpen}
                deleting={deletingId === pizza.id}
                onDelete={handleDelete}
              />
            ))}
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
