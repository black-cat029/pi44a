import { unlink } from "node:fs/promises";
import path from "node:path";
import { deletePizza } from "../../../../lib/pizzas";

export async function DELETE(_request, { params }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id < 1) {
    return Response.json({ error: "Некорректный номер пиццы." }, { status: 400 });
  }

  let pizza;
  try {
    pizza = deletePizza(id);
  } catch (error) {
    console.error("Не удалось удалить пиццу из базы данных.", error);
    return Response.json({ error: "Не удалось удалить пиццу из базы данных." }, { status: 500 });
  }

  if (!pizza) return Response.json({ error: "Пицца не найдена." }, { status: 404 });

  let warning;
  if (pizza.image.startsWith("/api/pizza-images/")) {
    const filename = path.basename(pizza.image);
    const filePath = path.join(process.cwd(), "public", "pizzas", "uploads", filename);
    try {
      await unlink(filePath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Пицца удалена, но её фото не удалось удалить.", error);
        warning = "Пицца удалена из меню, но файл фотографии удалить не удалось.";
      }
    }
  }

  return Response.json({ id: pizza.id, warning });
}
