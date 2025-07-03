import "../styles/TorneoPage.css";

const AperturaPage = () => {
  return (
    <div className="torneo-page">
      <h2>Apertura 2025</h2>

      <section className="tabla-posiciones">
        <h3>Tabla de Posiciones</h3>
        <table>
          <thead>
            <tr>
              <th>Equipo</th>
              <th>PJ</th>
              <th>G</th>
              <th>E</th>
              <th>P</th>
              <th>GF</th>
              <th>GC</th>
              <th>DG</th>
              <th>PTS</th>
            </tr>
          </thead>
          <tbody>
            {/* Contenido dinámico futuro */}
          </tbody>
        </table>
      </section>

      <section className="partidos">
        <h3>Partidos</h3>
        <ul>
          <li>Fútbol Club vs Atlético Norte - 17/01/2025 - 20:00 - Cancha 2 - Resultado: -</li>
        </ul>
      </section>
    </div>
  );
};

export default AperturaPage;
