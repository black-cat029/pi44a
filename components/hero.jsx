"use client";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function Hero() {
  function handleChoosePizza(event) {
    const menu = document.getElementById("menu");
    if (!menu) return;

    event.preventDefault();
    window.history.replaceState(null, "", "#menu");
    menu.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="hero">
      <div className="hero-copy">
        <h1>Хороший вечер<br />начинается <em>с теста.</em></h1>
        <a className="primary-button" href="#menu" onClick={handleChoosePizza}>Выбрать пиццу <span>↘</span></a>
      </div>
      <div className="hero-image-wrap">
        <img className="hero-image" src={`${basePath}/pizzas/margherita.jpg`} alt="Свежая пицца «Маргарита» с томатами и базиликом" />
      </div>
    </section>
  );
}
