import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { createPizza } from "../../../lib/pizzas";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const imageTypes = new Map([
  ["image/jpeg", { extension: "jpg", signature: (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff }],
  ["image/png", { extension: "png", signature: (bytes) => bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) }],
  ["image/webp", { extension: "webp", signature: (bytes) => bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP" }],
]);

function validateText(value, maxLength) {
  return typeof value === "string"
    && value.trim().length > 0
    && value.trim().length <= maxLength
    && !/[\u0000-\u001f\u007f]/.test(value);
}

export async function POST(request) {
  let form;
  try {
    form = await request.formData();
  } catch (error) {
    return Response.json({ error: "Форма заполнена неверно." }, { status: 400 });
  }

  const name = form.get("name");
  const category = form.get("category");
  const priceValue = form.get("price");
  const image = form.get("image");
  const price = typeof priceValue === "string" ? Number(priceValue) : NaN;

  if (!validateText(name, 80) || !validateText(category, 40)) {
    return Response.json({ error: "Укажите название и категорию." }, { status: 400 });
  }
  if (!Number.isSafeInteger(price) || price < 1 || price > 100000) {
    return Response.json({ error: "Цена должна быть целым числом от 1 до 100 000 ₽." }, { status: 400 });
  }
  if (!image || typeof image === "string" || image.size < 1 || image.size > MAX_IMAGE_SIZE) {
    return Response.json({ error: "Загрузите фото размером не более 5 МБ." }, { status: 400 });
  }

  const imageType = imageTypes.get(image.type);
  if (!imageType) {
    return Response.json({ error: "Поддерживаются только изображения JPG, PNG и WebP." }, { status: 400 });
  }

  const imageBuffer = Buffer.from(await image.arrayBuffer());
  if (!imageType.signature(imageBuffer)) {
    return Response.json({ error: "Файл не соответствует указанному формату изображения." }, { status: 400 });
  }

  const filename = `${randomUUID()}.${imageType.extension}`;
  const imagePath = `/api/pizza-images/${filename}`;
  const uploadDirectory = path.join(process.cwd(), "public", "pizzas", "uploads");
  const filePath = path.join(uploadDirectory, filename);

  try {
    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(filePath, imageBuffer, { flag: "wx" });

    const pizza = createPizza({
      name: name.trim(),
      category: category.trim(),
      price,
      image: imagePath,
    });
    return Response.json(pizza, { status: 201 });
  } catch (error) {
    try {
      await unlink(filePath);
    } catch (cleanupError) {
      if (cleanupError.code !== "ENOENT") console.error("Не удалось удалить временное фото пиццы.", cleanupError);
    }

    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return Response.json({ error: "Пицца с таким названием уже есть в меню." }, { status: 409 });
    }

    console.error("Не удалось сохранить пиццу.", error);
    return Response.json({ error: "Не удалось сохранить пиццу в базе данных." }, { status: 500 });
  }
}
