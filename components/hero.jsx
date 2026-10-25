export function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <h1>Хороший вечер<br />начинается <em>с теста.</em></h1>
        <a className="primary-button" href="#menu">Выбрать пиццу <span>↘</span></a>
      </div>
      <div className="hero-image-wrap">
        <img className="hero-image" src="/pizzas/margherita.jpg" alt="Свежая пицца «Маргарита» с томатами и базиликом" />
      </div>
    </section>
  );
}
