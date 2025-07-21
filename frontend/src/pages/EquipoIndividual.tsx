import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/EquipoIndividual.css";

type Jugador = { id: number; nombre: string; apellido: string };
type Partido = {
  id: number;
  equipo_local_id: number;
  equipo_visitante_id: number;
  nombre_local: string;
  nombre_visitante: string;
  goles_local: number;
  goles_visitante: number;
  fecha: string;
  hora: string;
  jugado: boolean;
};
type Equipo = { id: number; nombre: string; imagen: string; barrio: string };
type Posicion = { pj: number; pg: number; pe: number; pp: number; gf: number; gc: number };
type Tarjetas = { amarilla: number; roja: number; azul: number };

function EquipoIndividual() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [posicion, setPosicion] = useState<Posicion | null>(null);
  const [tarjetas, setTarjetas] = useState<Tarjetas>({ amarilla: 0, roja: 0, azul: 0 });
  const [equiposDict, setEquiposDict] = useState<Record<number, Equipo>>({});

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/api/equipos/${id}/detalle`).then(r => r.json()).then(setEquipo).catch(console.error);
    fetch(`http://localhost:3000/api/equipos/${id}/jugadores`).then(r => r.json()).then(setJugadores).catch(console.error);
    fetch(`http://localhost:3000/api/equipos/${id}/partidos`).then(r => r.json()).then(setPartidos).catch(console.error);
    fetch(`http://localhost:3000/api/equipos/${id}/posicion`).then(r => r.json()).then(setPosicion).catch(console.error);
    fetch(`http://localhost:3000/api/equipos/${id}/tarjetas`).then(r => r.json()).then(setTarjetas).catch(console.error);

    fetch(`http://localhost:3000/api/equipos`)
      .then(r => r.json())
      .then((equipos: Equipo[]) => {
        const dict: Record<number, Equipo> = {};
        equipos.forEach(eq => dict[eq.id] = eq);
        setEquiposDict(dict);
      })
      .catch(console.error);
  }, [id]);

  if (!equipo || !posicion) return <p>Cargando equipo...</p>;

  const porcentajeVictorias = posicion.pj ? ((posicion.pg / posicion.pj) * 100).toFixed(1) : "0";

  const obtenerResultado = (p: Partido): 'V' | 'E' | 'P' | null => {
    if (!p.jugado) return null;
    const esLocal = p.nombre_local === equipo.nombre;
    const golesPropios = esLocal ? p.goles_local : p.goles_visitante;
    const golesRivales = esLocal ? p.goles_visitante : p.goles_local;
    if (golesPropios > golesRivales) return 'V';
    if (golesPropios === golesRivales) return 'E';
    return 'P';
  };

  const ultimosResultados = [...partidos]
    .filter(p => p.jugado)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5)
    .map(obtenerResultado);

  const obtenerHoraLegible = (fecha: string, hora: string) => {
    if (!fecha || !hora) return "";
    const [h, m] = hora.split(":");
    const dateObj = new Date(fecha);
    dateObj.setHours(parseInt(h, 10));
    dateObj.setMinutes(parseInt(m, 10));
    return dateObj.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="equipo-container">
      <div className="volver-btn" onClick={() => navigate(-1)}>← Volver</div>

      <div className="header-equipo">
        <img src={`http://localhost:3000/uploads/${equipo.imagen}`} alt={equipo.nombre} />
        <div className="header-info">
          <h1>{equipo.nombre}</h1>
          <h2>{equipo.barrio}</h2>
        </div>
        <div className="ultimos-resultados">
          {ultimosResultados.map((res, i) => (
            <span key={i} className={`resultado-${res}`}>{res}</span>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><h4>Partidos jugados</h4><p>{posicion.pj}</p></div>
        <div className="stat-card"><h4>Ganados</h4><p>{posicion.pg}</p></div>
        <div className="stat-card"><h4>Empatados</h4><p>{posicion.pe}</p></div>
        <div className="stat-card"><h4>Perdidos</h4><p>{posicion.pp}</p></div>
        <div className="stat-card"><h4>Goles a favor</h4><p>{posicion.gf}</p></div>
        <div className="stat-card"><h4>Goles en contra</h4><p>{posicion.gc}</p></div>
        <div className="stat-card"><h4>% Victorias</h4><p>{porcentajeVictorias}%</p></div>
        <div className="stat-card"><h4>Amarillas</h4><p>{tarjetas.amarilla}</p></div>
        <div className="stat-card"><h4>Rojas</h4><p>{tarjetas.roja}</p></div>
        <div className="stat-card"><h4>Azules</h4><p>{tarjetas.azul}</p></div>
      </div>

      <div className="jugadores-lista">
        {jugadores.map(j => (
          <div
            key={j.id}
            className="jugador-item"
            onClick={() => navigate(`/jugadores/${j.id}`)}
          >
            #{j.id} – {j.nombre} {j.apellido}
          </div>
        ))}
      </div>

      <h3 className="section-title">Partidos Jugados</h3>
      <div className="partidos-lista">
        {[...partidos]
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
          .map(p => {
            const resultado = obtenerResultado(p);
            const esLocal = p.nombre_local === equipo.nombre;
            const rivalId = esLocal ? p.equipo_visitante_id : p.equipo_local_id;
            const rival = equiposDict[rivalId];

            const diaMes = new Date(p.fecha).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "short",
            });

            const hora = p.jugado ? "" : obtenerHoraLegible(p.fecha, p.hora);

            const resultadoTexto = p.jugado
              ? `${p.goles_local} - ${p.goles_visitante}`
              : hora;

            return (
              <div
                key={p.id}
                className={`partido-line resultado-${resultado}`}
                onClick={() => navigate(`/partidos/${p.id}`)}
              >
                <div className="fecha">{diaMes}</div>
                <div className="localidad">{esLocal ? "Local" : "Visitante"}</div>
                <div className="rival">
                  {rival && (
                    <>
                      <img src={`http://localhost:3000/uploads/${rival.imagen}`} alt={rival.nombre} />
                      <span>{rival.nombre}</span>
                    </>
                  )}
                </div>
                <div className="resultado">{resultadoTexto}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default EquipoIndividual;
