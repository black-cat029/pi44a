const { integer, sqliteTable, text, uniqueIndex } = require("drizzle-orm/sqlite-core");

const pizzas = sqliteTable("pizzas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  image: text("image").notNull(),
}, (table) => [
  uniqueIndex("pizzas_name_unique").on(table.name),
  uniqueIndex("pizzas_image_unique").on(table.image),
]);

module.exports = { pizzas };
