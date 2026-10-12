const path = require("node:path");
const Database = require("better-sqlite3");
const { drizzle } = require("drizzle-orm/better-sqlite3");
const { sql } = require("drizzle-orm");
const { pizzas } = require("./schema");

const products = [
  ["Маргарита", "Овощная", 590, "photo-1604382354936-07c5d9983bd3"],
  ["Пепперони", "Мясная", 690, "photo-1628840042765-356cda07504e"],
  ["Четыре сыра", "Сырная", 750, "photo-1593504049359-74330189a345"],
  ["Грибная", "Овощная", 650, "photo-1574071318508-1cdbab80d002"],
  ["Ветчина и грибы", "Мясная", 720, "photo-1571997478779-2adcbbe9ab2f"],
  ["Овощная", "Овощная", 620, "photo-1611915365928-565c527a0590"],
  ["Дьябло", "Мясная", 760, "photo-1565299624946-b28f40a0ae38"],
  ["Гавайская", "Мясная", 710, "photo-1604382355076-af4b0eb60143"],
  ["Мясная", "Мясная", 790, "photo-1594007654729-407eedc4be65"],
  ["Карбонара", "Сырная", 740, "photo-1571407970349-bc81e7e96d47"],
  ["Тоскана", "Овощная", 680, "photo-1534308983496-4fabb1a015ee"],
  ["Барбекю", "Мясная", 770, "photo-1593560708920-61dd98c46a4e"],
  ["Моцарелла", "Сырная", 700, "photo-1579751626657-72bc17010498"],
  ["Острая салями", "Мясная", 730, "photo-1546993641-097e8366bba0"],
  ["Шпинат и сыр", "Сырная", 710, "photo-1584365685547-9a5fb6f3a70c"],
  ["Цезарь", "Мясная", 760, "photo-1555072956-7758afb20e8f"],
  ["Мексиканская", "Мясная", 790, "photo-1541745537411-b8046dc6d66c"],
  ["Четыре сезона", "Авторская", 780, "photo-1700760934249-93efbb574d23"],
  ["Неаполитана", "Классика", 680, "photo-1571066811602-716837d681de"],
  ["Сырный цыплёнок", "Мясная", 750, "photo-1613564834361-9436948817d1"],
  ["Морская", "Морская", 890, "photo-1544982503-9f984c14501a"],
  ["Капричоза", "Авторская", 740, "photo-1520201163981-8cc95007dd2a"],
  ["Песто", "Овощная", 710, "photo-1600028068383-ea11a7a101f3"],
  ["Груша и горгонзола", "Сырная", 820, "photo-1542834369-f10ebf06d3e0"],
  ["Формаджи", "Сырная", 770, "photo-1542018508502-daaee0fb76c2"],
  ["Пикантная", "Мясная", 760, "photo-1558138838-76294be30005"],
  ["Сицилийская", "Классика", 720, "photo-1489564239502-7a532064e1c2"],
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

const db = drizzle(sqlite);
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

sqlite.close();
console.log(`Готово: в базе данных ${products.length} пицц.`);
