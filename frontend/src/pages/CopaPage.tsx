import "../styles/TorneoPage.css";

const CopaPage = () => {
  return (
    <div className="torneo-page">
      <h2>Copa de Verano 2025</h2>

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
            {/* Futuro contenido dinámico */}
          </tbody>
        </table>
      </section>

      <section className="partidos">
        <h3>Partidos</h3>
        <ul>
          <li>Los Pibes vs El Rejunte - 15/01/2025 - 21:00 - Cancha 1 - Resultado: -</li>
        </ul>
      </section>
    </div>
  );
};

export default CopaPage;
