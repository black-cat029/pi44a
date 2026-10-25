const path = require("node:path");
const { randomUUID } = require("node:crypto");
const Database = require("better-sqlite3");
const { drizzle } = require("drizzle-orm/better-sqlite3");
const { sql } = require("drizzle-orm");
const { pizzas } = require("./schema");

const products = [
  ["Маргарита", "Овощная", 590, "/pizzas/margherita.jpg"],
  ["Пепперони", "Мясная", 690, "/pizzas/pepperoni.jpg"],
  ["Четыре сыра", "Сырная", 750, "/pizzas/four-cheese.jpg"],
  ["Грибная", "Овощная", 650, "/pizzas/mushroom.jpg"],
  ["Ветчина и грибы", "Мясная", 720, "/pizzas/ham-mushroom.jpg"],
  ["Овощная", "Овощная", 620, "/pizzas/vegetable.jpg"],
  ["Дьябло", "Мясная", 760, "/pizzas/diablo.jpg"],
  ["Гавайская", "Мясная", 710, "/pizzas/hawaiian.jpg"],
  ["Мясная", "Мясная", 790, "/pizzas/meat-lovers.jpg"],
  ["Карбонара", "Сырная", 740, "/pizzas/carbonara.jpg"],
  ["Тоскана", "Овощная", 680, "/pizzas/tuscany.jpg"],
  ["Барбекю", "Мясная", 770, "/pizzas/barbecue.jpg"],
  ["Моцарелла", "Сырная", 700, "/pizzas/mozzarella.jpg"],
  ["Острая салями", "Мясная", 730, "/pizzas/spicy-salami.jpg"],
  ["Шпинат и сыр", "Сырная", 710, "/pizzas/spinach-cheese.jpg"],
  ["Цезарь", "Мясная", 760, "/pizzas/cheesy-chicken.jpg"],
  ["Мексиканская", "Мясная", 790, "/pizzas/mexican.jpg"],
  ["Четыре сезона", "Авторская", 780, "/pizzas/four-seasons.jpg"],
  ["Неаполитана", "Классика", 680, "/pizzas/neapolitan.jpg"],
  ["Сырный цыплёнок", "Мясная", 750, "/pizzas/caesar.jpg"],
  ["Морская", "Морская", 890, "/pizzas/seafood.jpg"],
  ["Капричоза", "Авторская", 740, "/pizzas/capricciosa.jpg"],
  ["Песто", "Овощная", 710, "/pizzas/pesto.jpg"],
  ["Груша и горгонзола", "Сырная", 820, "/pizzas/pear-gorgonzola.jpg"],
  ["Формаджи", "Сырная", 770, "/pizzas/formaggi.jpg"],
  ["Пикантная", "Мясная", 760, "/pizzas/spicy.jpg"],
  ["Сицилийская", "Классика", 720, "/pizzas/sicilian.jpg"],
].map(([name, category, price, image], index) => ({
  id: index + 1,
  name,
  category,
  price,
  image,
}));

const directory = path.join(process.cwd(), "data");
require("node:fs").mkdirSync(directory, { recursive: true });
const sqlite = new Database(path.join(directory, "pizzeria.db"));
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS pizzas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price INTEGER NOT NULL,
    image TEXT NOT NULL
  )
`);
sqlite.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS pizzas_name_unique ON pizzas (name);
  CREATE UNIQUE INDEX IF NOT EXISTS pizzas_image_unique ON pizzas (image);
`);

const db = drizzle(sqlite);
const moveImagesTemporarily = sqlite.prepare("UPDATE pizzas SET image = ? WHERE id = ?");
sqlite.transaction(() => {
  for (const { id } of products) {
    moveImagesTemporarily.run(`/seed-swap/${randomUUID()}`, id);
  }

  db.insert(pizzas)
    .values(products)
    .onConflictDoUpdate({
      target: pizzas.id,
      set: {
        name: sql`excluded.name`,
        category: sql`excluded.category`,
        price: sql`excluded.price`,
        image: sql`excluded.image`,
      },
    })
    .run();
})();

sqlite.close();
console.log(`Готово: в базе данных ${products.length} пицц.`);
