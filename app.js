const pizzas = [
  { id: 1, name: "Маргарита", category: "Овощная", price: 590, image: "photo-1579751626657-72bc17010498" },
  { id: 2, name: "Пепперони", category: "Мясная", price: 690, image: "photo-1628840042765-356cda07504e" },
  { id: 3, name: "Четыре сыра", category: "Сырная", price: 750, image: "photo-1571407970349-bc81e7e96d47" },
  { id: 4, name: "Грибная", category: "Овощная", price: 650, image: "photo-1574071318508-1cdbab80d002" },
  { id: 5, name: "Ветчина и грибы", category: "Мясная", price: 720, image: "photo-1593560708920-61dd98c46a4e" },
  { id: 6, name: "Овощная", category: "Овощная", price: 620, image: "photo-1513104890138-7c749659a591" },
  { id: 7, name: "Дьябло", category: "Мясная", price: 760, image: "photo-1579751626657-72bc17010498" },
  { id: 8, name: "Гавайская", category: "Мясная", price: 710, image: "photo-1628840042765-356cda07504e" },
  { id: 9, name: "Мясная", category: "Мясная", price: 790, image: "photo-1593560708920-61dd98c46a4e" },
  { id: 10, name: "Карбонара", category: "Сырная", price: 740, image: "photo-1571407970349-bc81e7e96d47" },
  { id: 11, name: "Тоскана", category: "Овощная", price: 680, image: "photo-1574071318508-1cdbab80d002" },
  { id: 12, name: "Барбекю", category: "Мясная", price: 770, image: "photo-1513104890138-7c749659a591" },
  { id: 13, name: "Моцарелла", category: "Сырная", price: 700, image: "photo-1579751626657-72bc17010498" },
  { id: 14, name: "Острая салями", category: "Мясная", price: 730, image: "photo-1628840042765-356cda07504e" },
  { id: 15, name: "Шпинат и сыр", category: "Сырная", price: 710, image: "photo-1571407970349-bc81e7e96d47" },
  { id: 16, name: "Цезарь", category: "Мясная", price: 760, image: "photo-1593560708920-61dd98c46a4e" },
  { id: 17, name: "Мексиканская", category: "Мясная", price: 790, image: "photo-1628840042765-356cda07504e" },
  { id: 18, name: "Четыре сезона", category: "Авторская", price: 780, image: "photo-1513104890138-7c749659a591" },
  { id: 19, name: "Неаполитана", category: "Классика", price: 680, image: "photo-1579751626657-72bc17010498" },
  { id: 20, name: "Сырный цыплёнок", category: "Мясная", price: 750, image: "photo-1571407970349-bc81e7e96d47" },
  { id: 21, name: "Морская", category: "Морская", price: 890, image: "photo-1574071318508-1cdbab80d002" },
  { id: 22, name: "Капричоза", category: "Авторская", price: 740, image: "photo-1593560708920-61dd98c46a4e" },
  { id: 23, name: "Песто", category: "Овощная", price: 710, image: "photo-1513104890138-7c749659a591" },
  { id: 24, name: "Груша и горгонзола", category: "Сырная", price: 820, image: "photo-1571407970349-bc81e7e96d47" },
  { id: 25, name: "Формаджи", category: "Сырная", price: 770, image: "photo-1579751626657-72bc17010498" },
  { id: 26, name: "Пикантная", category: "Мясная", price: 760, image: "photo-1628840042765-356cda07504e" },
  { id: 27, name: "Сицилийская", category: "Классика", price: 720, image: "photo-1574071318508-1cdbab80d002" },
];
const categories = ["Все", "Мясная", "Сырная", "Овощная", "Классика", "Морская", "Авторская"];
const cart = new Map();
let activeCategory = "Все";
let toastTimer;

const formatPrice = (price) => `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;

function renderMenu() {
  const visible = pizzas.filter((pizza) => activeCategory === "Все" || pizza.category === activeCategory);
  document.querySelector("#category-tabs").innerHTML = categories.map((category) =>
    `<button class="category-tab ${activeCategory === category ? "active" : ""}" data-category="${category}" aria-pressed="${activeCategory === category}">${category}</button>`
  ).join("");
  document.querySelector("#pizza-grid").innerHTML = visible.map((pizza) => `
    <article class="pizza-card">
      <div class="pizza-photo">
        <img src="https://images.unsplash.com/${pizza.image}?auto=format&fit=crop&w=720&q=80" alt="Пицца «${pizza.name}»" loading="lazy" />
      </div>
      <div class="pizza-info">
        <div class="pizza-title-row"><h3>${pizza.name}</h3><span class="pizza-price">${formatPrice(pizza.price)}</span></div>
        <div class="pizza-card-bottom"><button data-add="${pizza.id}">Добавить <b>+</b></button></div>
      </div>
    </article>`).join("");
}

function renderCart() {
  const items = [...cart.entries()].map(([id, quantity]) => ({ pizza: pizzas.find((pizza) => pizza.id === id), quantity }));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.pizza.price * item.quantity, 0);
  document.querySelector("#cart-count").textContent = itemCount;
  document.querySelector("#cart-empty").hidden = items.length > 0;
  document.querySelector("#cart-total").hidden = items.length === 0;
  document.querySelector("#checkout-button").hidden = items.length === 0;
  document.querySelector("#total-price").textContent = formatPrice(total);
  document.querySelector("#cart-items").innerHTML = items.map(({ pizza, quantity }) => `
    <div class="cart-item">
      <img src="https://images.unsplash.com/${pizza.image}?auto=format&fit=crop&w=160&q=75" alt="" />
      <div class="cart-item-info"><strong>${pizza.name}</strong><span>${formatPrice(pizza.price)}</span>
        <div class="quantity-control">
          <button data-quantity="${pizza.id}" data-change="-1" aria-label="Уменьшить количество">−</button>
          <span>${quantity}</span>
          <button data-quantity="${pizza.id}" data-change="1" aria-label="Увеличить количество">+</button>
        </div>
      </div>
      <strong class="cart-item-total">${formatPrice(pizza.price * quantity)}</strong>
    </div>`).join("");
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2200);
}

document.querySelector("#category-tabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderMenu();
});
document.querySelector("#pizza-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const id = Number(button.dataset.add);
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  showToast(`«${pizzas.find((pizza) => pizza.id === id).name}» добавлена в корзину`);
});
document.querySelector("#cart-items").addEventListener("click", (event) => {
  const button = event.target.closest("[data-quantity]");
  if (!button) return;
  const id = Number(button.dataset.quantity);
  const quantity = (cart.get(id) || 0) + Number(button.dataset.change);
  if (quantity <= 0) cart.delete(id);
  else cart.set(id, quantity);
  renderCart();
});

const overlay = document.querySelector("#cart-overlay");
document.querySelector("#open-cart").addEventListener("click", () => {
  overlay.hidden = false;
  document.querySelector("#close-cart").focus();
});
document.querySelector("#close-cart").addEventListener("click", () => { overlay.hidden = true; });
overlay.addEventListener("click", (event) => { if (event.target === overlay) overlay.hidden = true; });
document.addEventListener("keydown", (event) => { if (event.key === "Escape") overlay.hidden = true; });
document.querySelector("#checkout-button").addEventListener("click", () => {
  showToast("Спасибо! Скоро мы добавим оформление заказа.");
  overlay.hidden = true;
});

renderMenu();
renderCart();
