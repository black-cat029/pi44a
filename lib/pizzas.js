import { db } from "../db";
import { pizzas } from "../db/schema";

export async function getPizzas() {
  return db.select().from(pizzas).orderBy(pizzas.id);
}

export async function getCategories() {
  const rows = await db.selectDistinct({ name: pizzas.category }).from(pizzas).orderBy(pizzas.category);
  return ["Все", ...rows.map(({ name }) => name)];
}
