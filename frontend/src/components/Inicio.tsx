import inicioImg from "../assets/inicio.jpg";

const Inicio = () => (
  <section id="inicio" className="inicio" style={{ backgroundImage: `url(${inicioImg})` }}>
    <div id="titulo">
      <h1>TPyB Torneos</h1>
      <p>Jugá con tu equipo en el mejor torneo de Buenos Aires </p>
      <a href="#inscripcion">
        <button className="btn">Inscribirse ahora</button>
      </a>
    </div>
  </section>
);

export default Inicio;
