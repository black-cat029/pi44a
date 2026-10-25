import { getCategories, getPizzas } from "../lib/pizzas";
import { Hero } from "../components/hero";
import { ProductCatalog } from "../components/product-catalog";

export default async function HomePage() {
  const [categories, catalog] = await Promise.all([
    getCategories(),
    getPizzas(),
  ]);

  return (
    <main id="top">
      <Hero />
      <ProductCatalog
        pizzas={catalog}
        categories={categories}
      />
      <footer className="site-footer" id="contacts">
        <a className="brand footer-brand" href="#top"><span className="brand-symbol">т</span>тесто<span className="brand-dot">.</span></a>
        <a className="footer-phone" href="tel:+78005553535">8 800 555-35-35</a>
      </footer>
    </main>
  );
}
