import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/PartidoIndividual.css";

type Evento = {
  id: number;
  partido_id: number;
  jugador_id: number;
  tipo: string;
  tipo_gol: string | null;
  minuto: number;
  jugador_nombre: string;
  jugador_apellido: string;
  equipo_nombre: string;
};

type Partido = {
  id: number;
  torneo_id: number;
  equipo_local_id: number;
  equipo_visitante_id: number;
  equipo_local: string;
  equipo_visitante: string;
  goles_local: number;
  goles_visitante: number;
  jugado: boolean;
  fecha: string;
  hora: string;
  nombre_torneo: string;
  logo_local?: string;
  logo_visitante?: string;
};

function PartidoIndividual() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [partido, setPartido] = useState<Partido | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/api/partidos/${id}`)
      .then((r) => r.json())
      .then((data: Partido) => {
        setPartido(data);

        fetch(`http://localhost:3000/api/estadisticas/partido/${id}/detalle`)
          .then(res => res.json())
          .then((eventosConDetalle: Evento[]) => {
            eventosConDetalle.sort((a, b) => a.minuto - b.minuto);
            setEventos(eventosConDetalle);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }, [id]);

  if (!partido) return <p>Cargando partido...</p>;

  const iconoPorTipo = (tipo: string) => {
    switch (tipo) {
      case "gol": return "⚽";
      case "amarilla": return "🟡";
      case "roja": return "🔴";
      case "azul": return "🔵";
      default: return "";
    }
  };

  const eventosAgrupados: { [minuto: number]: Evento[] } = {};
  eventos.forEach((evento) => {
    if (!eventosAgrupados[evento.minuto]) {
      eventosAgrupados[evento.minuto] = [];
    }
    eventosAgrupados[evento.minuto].push(evento);
  });

  const minutos = Object.keys(eventosAgrupados).map(Number).sort((a, b) => a - b);

  return (
    <div className="partido-container">
      <div className="volver-btn" onClick={() => navigate(-1)}>← Volver</div>

      <div className="header-partido">
        <div className="equipo-local equipo-header">
          <img
            src={`http://localhost:3000/uploads/${partido.logo_local ?? 'default.png'}`}
            alt={partido.equipo_local}
            className="logo-equipo"
          />
          <div className="nombre-equipo">{partido.equipo_local}</div>
        </div>

        <div className="resultado-partido">
          {partido.jugado
            ? `${partido.goles_local} – ${partido.goles_visitante}`
            : "Partido aún no jugado"}
          <div className="fecha-hora">{new Date(partido.fecha).toLocaleDateString("es-AR")} – {partido.hora}</div>
          <div className="nombre-torneo">{partido.nombre_torneo}</div>
        </div>

        <div className="equipo-visitante equipo-header">
          <img
            src={`http://localhost:3000/uploads/${partido.logo_visitante ?? 'default.png'}`}
            alt={partido.equipo_visitante}
            className="logo-equipo"
          />
          <div className="nombre-equipo">{partido.equipo_visitante}</div>
        </div>
      </div>

      <h3 className="section-title">Minuto a Minuto</h3>

      <div className="minuto-minuto-container">
        {minutos.map((minuto) => {
          const eventosDelMinuto = eventosAgrupados[minuto];
          const locales = eventosDelMinuto.filter(e => e.equipo_nombre === partido.equipo_local);
          const visitantes = eventosDelMinuto.filter(e => e.equipo_nombre === partido.equipo_visitante);

          return (
  <div key={minuto} className="fila-minuto">
    <div className="columna-eventos local">
      {locales.map(e => (
        <div key={e.id} className="evento-minuto">
          <span className="icono">{iconoPorTipo(e.tipo)}</span>
          {e.tipo === "gol" && (e.tipo_gol === "en_contra" || e.tipo_gol === "penal") && (
            <span className="detalle-gol">
              {e.tipo_gol === "en_contra" ? "EC" : "P"}
            </span>
          )}
          <span className="nombre"> {e.jugador_apellido}</span>
        </div>
      ))}
    </div>

    <div className="minuto-centro">{minuto}'</div>

    <div className="columna-eventos visitante">
      {visitantes.map(e => (
        <div key={e.id} className="evento-minuto">
          <span className="nombre"> {e.jugador_apellido}</span>
          {e.tipo === "gol" && (e.tipo_gol === "en_contra" || e.tipo_gol === "penal") && (
            <span className="detalle-gol">
              {e.tipo_gol === "en_contra" ? " EC " : " P "}
            </span>
          )}
          <span className="icono">{iconoPorTipo(e.tipo)}</span>
        </div>
      ))}
    </div>
  </div>
);

        })}
      </div>
    </div>
  );
}

export default PartidoIndividual;
