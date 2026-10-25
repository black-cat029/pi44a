import { readFile } from "node:fs/promises";
import path from "node:path";

const imageTypes = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(_request, { params }) {
  const { filename } = await params;
  const match = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.(jpg|png|webp)$/.exec(filename);
  if (!match) return new Response("Фото не найдено.", { status: 404 });

  const [, , extension] = match;
  const filePath = path.join(process.cwd(), "public", "pizzas", "uploads", filename);
  try {
    const image = await readFile(filePath);
    return new Response(image, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(image.length),
        "Content-Type": imageTypes[extension],
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error.code === "ENOENT") return new Response("Фото не найдено.", { status: 404 });
    console.error("Не удалось прочитать фото пиццы.", error);
    return new Response("Не удалось загрузить фото.", { status: 500 });
  }
}
