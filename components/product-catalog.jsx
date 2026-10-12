import { ProductCard } from "./product-card";
import { Pagination } from "./pagination";

export function ProductCatalog({ pizzas, categories, activeCategory, pagination }) {
  return (
    <section className="menu-section" id="menu">
      <div className="section-heading">
        <h2>Наша <em>пицца</em></h2>
      </div>
      <div className="menu-toolbar">
        <nav className="category-tabs" aria-label="Категории пиццы">
          {categories.map((category) => {
            const params = new URLSearchParams();
            if (category !== "Все") params.set("category", category);
            const href = params.size ? `/?${params.toString()}#menu` : "/#menu";
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
      {pizzas.length ? (
        <div className="pizza-grid">
          {pizzas.map((pizza) => <ProductCard key={pizza.id} pizza={pizza} />)}
        </div>
      ) : (
        <p className="empty-category">В этой категории пока нет пиццы.</p>
      )}
      <Pagination {...pagination} category={activeCategory} />
    </section>
  );
}
