import { getCategories, getPizzas } from "../lib/pizzas";
import { Hero } from "../components/hero";
import { ProductCatalog } from "../components/product-catalog";

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const categories = await getCategories();
  const requestedCategory = typeof params?.category === "string" ? params.category : "Все";
  const category = categories.includes(requestedCategory) ? requestedCategory : "Все";
  const requestedPage = typeof params?.page === "string" ? Number(params.page) : 1;
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const catalog = await getPizzas({ page, category });

  return (
    <main id="top">
      <Hero />
      <ProductCatalog
        pizzas={catalog.items}
        categories={categories}
        activeCategory={category}
        currentPage={catalog.currentPage}
        totalItems={catalog.totalItems}
        totalPages={catalog.totalPages}
      />
      <footer className="site-footer" id="contacts">
        <a className="brand footer-brand" href="#top"><span className="brand-symbol">т</span>тесто<span className="brand-dot">.</span></a>
        <a className="footer-phone" href="tel:+78005553535">8 800 555-35-35</a>
      </footer>
    </main>
  );
}
