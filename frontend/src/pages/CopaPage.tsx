import { useEffect, useState } from "react";
import "../styles/TorneoPage.css";

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
  apellido: string;
  tipo: "gol" | "amarilla" | "roja" | "azul";
  tipo_gol?: "penal" | "en_contra" | "jugada";
  minuto: number;
  equipo: string;
  partido_id: number;
};
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


type Equipo = {
  id: number;
  nombre: string;
  imagen: string;
};

function CopaPage() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [posiciones, setPosiciones] = useState<Posicion[]>([]);


  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const resPartidos = await fetch(
          "http://localhost:3000/api/partidos/torneo?nombre=Copa de Verano"
        );
        const dataPartidos = await resPartidos.json();
        setPartidos(dataPartidos);
      } catch (error) {
        console.error("Error al cargar partidos de la Copa de Verano:", error);
      }

      try {
        const resEventos = await fetch(
          "http://localhost:3000/api/estadisticas/torneo?nombre=Copa de Verano"
        );
        const dataEventos = await resEventos.json();
        setEventos(dataEventos);
      } catch (error) {
        console.warn("No se pudieron cargar eventos de la Copa de Verano:", error);
      }

      try {
        const resEquipos = await fetch("http://localhost:3000/api/equipos");
        const dataEquipos = await resEquipos.json();
        setEquipos(dataEquipos);
      } catch (error) {
        console.warn("No se pudieron cargar los equipos:", error);
      }
      try {
      const resPos = await fetch("http://localhost:3000/api/posiciones?nombre=Copa de Verano");
      const dataPos = await resPos.json();
      setPosiciones(dataPos);
}     catch (error) {
     console.warn("No se pudieron cargar las posiciones:", error);
}

    };

    fetchDatos();
  }, []);

  const obtenerLogo = (nombreEquipo: string) => {
    const equipo = equipos.find((e) => e.nombre === nombreEquipo);
    return equipo
      ? `http://localhost:3000/uploads/${equipo.imagen}`
      : "http://localhost:3000/uploads/default.png";
  };

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
            {e.tipo === "gol"
              ? "⚽"
              : e.tipo === "amarilla"
              ? "🟡"
              : e.tipo === "roja"
              ? "🔴"
              : "🔵"}{" "}
            {e.apellido} ({e.equipo}) -{" "}
            {e.tipo === "gol"
              ? `Gol${
                  e.tipo_gol === "en_contra"
                    ? " en contra"
                    : e.tipo_gol === "penal"
                    ? " de penal"
                    : ""
                }`
              : e.tipo === "amarilla"
              ? "Amarilla"
              : e.tipo === "roja"
              ? "Roja"
              : "Azul"}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="torneo-page">
      <h2>Copa de Verano {new Date().getFullYear()}</h2>

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
              <img
                src={obtenerLogo(p.equipo_local)}
                alt={p.equipo_local}
                className="logo-equipo"
              />
              <strong>{p.equipo_local}</strong> vs{" "}
              <img
                src={obtenerLogo(p.equipo_visitante)}
                alt={p.equipo_visitante}
                className="logo-equipo"
              />
              <strong>{p.equipo_visitante}</strong> - {p.fecha} {p.hora} - {p.fase}
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

export default CopaPage;
