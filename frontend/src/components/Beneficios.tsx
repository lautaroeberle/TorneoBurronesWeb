import beneficiosImg from "../assets/beneficios.jpg";

const Beneficios = () => (
  <section id="beneficios" className="beneficios" style={{ backgroundImage: `url(${beneficiosImg})` }}>
    <div>
      <h2>Beneficios</h2>
      <ul>
        <li>Cobertura de partidos y fotos</li>
        <li>Árbitros profesionales</li>
        <li>Cobertura médica</li>
      </ul>
    </div>
  </section>
);

export default Beneficios;
