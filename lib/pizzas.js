import { count, eq } from "drizzle-orm";
import { db } from "../db";
import { pizzas } from "../db/schema";

const PAGE_SIZE = 4;

export async function getPizzas({ page = 1, pageSize = PAGE_SIZE, category = "Все" } = {}) {
  const filter = category === "Все" ? undefined : eq(pizzas.category, category);
  const [{ total = 0 } = {}] = await db
    .select({ total: count() })
    .from(pizzas)
    .where(filter);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const items = await db
    .select()
    .from(pizzas)
    .where(filter)
    .orderBy(pizzas.id)
    .limit(pageSize)
    .offset((currentPage - 1) * pageSize);

  return { items, currentPage, pageSize, totalItems: total, totalPages };
}

export async function getCategories() {
  const rows = await db.selectDistinct({ name: pizzas.category }).from(pizzas).orderBy(pizzas.category);
  return ["Все", ...rows.map(({ name }) => name)];
}
