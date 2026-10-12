export function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <h1>Хороший вечер<br />начинается <em>с теста.</em></h1>
        <a className="primary-button" href="#menu">Выбрать пиццу <span>↘</span></a>
      </div>
      <div className="hero-image-wrap">
        <img className="hero-image" src="https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1100&q=85" alt="Свежая пицца с томатами и базиликом" />
      </div>
    </section>
  );
}
