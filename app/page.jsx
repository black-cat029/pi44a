import { getCategories, getPizzas } from "../lib/pizzas";
import { Hero } from "../components/hero";
import { ProductCatalog } from "../components/product-catalog";

function getPositivePage(value) {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const [categories, requestedCategory] = await Promise.all([
    getCategories(),
    Promise.resolve(typeof params.category === "string" ? params.category : "Все"),
  ]);
  const activeCategory = categories.includes(requestedCategory) ? requestedCategory : "Все";
  const { items, currentPage, totalItems, totalPages } = await getPizzas({
    page: getPositivePage(params.page),
    category: activeCategory,
  });

  return (
    <main id="top">
      <Hero />
      <ProductCatalog
        pizzas={items}
        categories={categories}
        activeCategory={activeCategory}
        pagination={{ currentPage, totalPages, totalItems }}
      />
      <footer className="site-footer" id="contacts">
        <a className="brand footer-brand" href="#top"><span className="brand-symbol">т</span>тесто<span className="brand-dot">.</span></a>
        <a className="footer-phone" href="tel:+78005553535">8 800 555-35-35</a>
      </footer>
    </main>
  );
}
