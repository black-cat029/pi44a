export function getPizzaImageSrc(image) {
  if (typeof image !== "string") return "/pizzas/margherita.jpg";
  if (image.startsWith("/") || image.startsWith("https://")) return image;
  return "/pizzas/margherita.jpg";
}
