import { useEffect, useState } from "react";
import "../styles/TorneoPage.css";

type Posicion = {
  equipo_id: number;
  equipo: string;
  imagen: string;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  puntos: number;
};


type Partido = {
  id: number;
  equipo_local: string;
  equipo_visitante: string;
  goles_local: number;
  goles_visitante: number;
  fecha: string;
  hora: string;
  fase: string;
  jugado: boolean;
};

type Evento = {
  jugador_id: number;
  nombre: string;
  apellido:string;
  tipo: "gol" | "amarilla" | "roja";
  minuto: number;
  equipo: string;
  partido_id: number;
};

function AperturaPage() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [posiciones, setPosiciones] = useState<Posicion[]>([]);


useEffect(() => {
  const fetchDatos = async () => {
    try {
      const resPartidos = await fetch("http://localhost:3000/api/partidos/torneo?nombre=Apertura");
      const dataPartidos = await resPartidos.json();
      setPartidos(dataPartidos);
    } catch (error) {
      console.error("Error al cargar partidos del Apertura:", error);
    }

    try {
      const resEventos = await fetch("http://localhost:3000/api/estadisticas/torneo?nombre=Apertura");
      const dataEventos = await resEventos.json();
      setEventos(dataEventos);
    } catch (error) {
      console.warn("No se pudieron cargar eventos del Apertura:", error);
    }

    try {
  const resPos = await fetch("http://localhost:3000/api/posiciones?nombre=Apertura");
  const dataPos = await resPos.json();
  setPosiciones(dataPos);
} catch (error) {
  console.warn("No se pudieron cargar las posiciones del Apertura:", error);
}

  };

  fetchDatos();
}, []);


  const renderEventos = (partidoId: number) => {
    const eventosDelPartido = eventos
      .filter((e) => e.partido_id === partidoId)
      .sort((a, b) => a.minuto - b.minuto);

    if (eventosDelPartido.length === 0) return null;

    return (
      <ul className="minuto-a-minuto">
        {eventosDelPartido.map((e, i) => (
          <li key={i}>
            <strong>{e.minuto}'</strong>{" "}
            {e.tipo === "gol" ? "⚽" : e.tipo === "amarilla" ? "🟡" : "🔴"}{" "}
            {e.nombre} ({e.equipo}) -{" "}
            {e.tipo === "gol"
              ? "Gol"
              : e.tipo === "amarilla"
              ? "Amarilla"
              : "Roja"}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="torneo-page">
      <h2>Torneo Apertura {new Date().getFullYear()}</h2>


      <section className="tabla-posiciones">
  <h3>Tabla de Posiciones</h3>
  <table>
    <thead>
      <tr>
        <th>Equipo</th>
        <th>PJ</th>
        <th>PG</th>
        <th>PE</th>
        <th>PP</th>
        <th>GF</th>
        <th>GC</th>
        <th>Pts</th>
      </tr>
    </thead>
    <tbody>
      {posiciones.map((pos) => (
        <tr key={pos.equipo_id}>
          <td>
            <img
              src={`http://localhost:3000/uploads/${pos.imagen}`}
              alt={pos.equipo}
              className="logo-equipo"
            />{" "}
            {pos.equipo}
          </td>
          <td>{pos.pj}</td>
          <td>{pos.pg}</td>
          <td>{pos.pe}</td>
          <td>{pos.pp}</td>
          <td>{pos.gf}</td>
          <td>{pos.gc}</td>
          <td>{pos.puntos}</td>
        </tr>
      ))}
    </tbody>
  </table>
</section>


      <section className="partidos">
        <h3>Partidos</h3>
        <ul>
          {partidos.map((p) => (
            <li key={p.id}>
              <strong>{p.equipo_local}</strong> vs{" "}
              <strong>{p.equipo_visitante}</strong> - {p.fecha} {p.hora} -{" "}
              {p.fase}
              <br />
              Resultado:{" "}
              {p.jugado
                ? `${p.goles_local} - ${p.goles_visitante}`
                : "Pendiente"}
              {p.jugado && renderEventos(p.id)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AperturaPage;
