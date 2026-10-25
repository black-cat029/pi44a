export function getPizzaImageSrc(image) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (typeof image !== "string" || !image.startsWith("/pizzas/")) {
    return `${basePath}/pizzas/margherita.jpg`;
  }
  return `${basePath}${image}`;
}
