const { integer, sqliteTable, text } = require("drizzle-orm/sqlite-core");

const pizzas = sqliteTable("pizzas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  image: text("image").notNull(),
});

module.exports = { pizzas };
