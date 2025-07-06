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
  tipo: "gol" | "amarilla" | "roja";
  minuto: number;
  equipo: string;
  partido_id: number;
};

function AperturaPage() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
   const fetchDatos = async () => {
  try {
    const [resPartidos, resEventos] = await Promise.all([
      fetch("http://localhost:3000/api/partidos/torneo?nombre=Apertura"),
      fetch("http://localhost:3000/api/estadisticas/torneo?nombre=Apertura")
    ]);

    const dataPartidos = await resPartidos.json();
    const dataEventos = await resEventos.json();

    console.log("Partidos recibidos:", dataPartidos);
    console.log("Eventos recibidos:", dataEventos);

    setPartidos(dataPartidos);
    setEventos(dataEventos);
  } catch (error) {
    console.error("Error al cargar datos del torneo Apertura:", error);
  }
};

    fetchDatos();
  }, []);

  const renderEventos = (partidoId: number) => {
    const eventosDelPartido = eventos
      .filter(e => e.partido_id === partidoId)
      .sort((a, b) => a.minuto - b.minuto);

    if (eventosDelPartido.length === 0) return null;

    return (
      <ul className="minuto-a-minuto">
        {eventosDelPartido.map((e, i) => (
          <li key={i}>
            <strong>{e.minuto}'</strong> - {e.tipo === "gol" ? "⚽" : e.tipo === "amarilla" ? "🟡" : "🔴"}{" "}
            {e.nombre} ({e.equipo}) - {e.tipo === "gol" ? "Gol" : e.tipo === "amarilla" ? "Amarilla" : "Roja"}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="torneo-page">
      <h2>Apertura {new Date().getFullYear()}</h2>

      <section className="partidos">
        <h3>Partidos</h3>
        <ul>
          {partidos.map((p) => {
  const esJugado = !!p.jugado; // fuerza booleano
  return (
    <li key={p.id}>
      <strong>{p.equipo_local}</strong> vs <strong>{p.equipo_visitante}</strong> - {p.fecha} {p.hora} - {p.fase}
      <br />
      Resultado: {esJugado ? `${p.goles_local} - ${p.goles_visitante}` : "Pendiente"}
      {esJugado && renderEventos(p.id)}
    </li>
  );
})}

        </ul>
      </section>
    </div>
  );
}

export default AperturaPage;
