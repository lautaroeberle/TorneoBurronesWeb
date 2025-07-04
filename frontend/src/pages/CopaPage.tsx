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

function CopaPage() {
  const [partidos, setPartidos] = useState<Partido[]>([]);

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/partidos/torneo?nombre=Copa de Verano");
        const data = await res.json();
        setPartidos(data);
      } catch (error) {
        console.error("Error al cargar partidos:", error);
      }
    };
    fetchPartidos();
  }, []);

  return (
    <div className="torneo-page">
      <h2>Copa de Verano {new Date().getFullYear()}</h2>

      <section className="partidos">
        <h3>Partidos</h3>
        <ul>
          {partidos.map((p) => (
            <li key={p.id}>
              {p.equipo_local} vs {p.equipo_visitante} - {p.fecha} {p.hora} - {p.fase} - Resultado: {p.jugado ? `${p.goles_local} - ${p.goles_visitante}` : "Pendiente"}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default CopaPage;
