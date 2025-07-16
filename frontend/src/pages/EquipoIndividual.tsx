import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/EquipoIndividual.css";

type Jugador = { id: number; nombre: string; apellido: string; };
type Partido = { id: number; nombre_local: string; nombre_visitante: string; goles_local: number; goles_visitante: number; fecha: string; jugado: boolean; };
type Equipo = { id: number; nombre: string; imagen: string; barrio: string; };
type Posicion = { pj: number; pg: number; pe: number; pp: number; gf: number; gc: number; };
type Tarjetas = { amarilla: number; roja: number; azul: number; };

function EquipoIndividual() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [posicion, setPosicion] = useState<Posicion | null>(null);
  const [tarjetas, setTarjetas] = useState<Tarjetas>({ amarilla: 0, roja: 0, azul: 0 });

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3000/api/equipos/${id}/detalle`).then(r => r.json()).then(setEquipo).catch(console.error);
    fetch(`http://localhost:3000/api/equipos/${id}/jugadores`).then(r => r.json()).then(setJugadores).catch(console.error);
    fetch(`http://localhost:3000/api/equipos/${id}/partidos`).then(r => r.json()).then(setPartidos).catch(console.error);
    fetch(`http://localhost:3000/api/equipos/${id}/posicion`).then(r => r.json()).then(setPosicion).catch(console.error);
    fetch(`http://localhost:3000/api/equipos/${id}/tarjetas`).then(r => r.json()).then(setTarjetas).catch(console.error);
  }, [id]);

  if (!equipo || !posicion) return <p>Cargando equipo...</p>;

  const porcentajeVictorias = posicion.pj ? ((posicion.pg / posicion.pj) * 100).toFixed(1) : "0";

  return (
    <div className="equipo-container">
      <div className="volver-btn" onClick={() => navigate(-1)}>← Volver</div>
      <div className="header-equipo">
        <img src={`http://localhost:3000/uploads/${equipo.imagen}`} alt={equipo.nombre} />
        <div>
          <h1>{equipo.nombre}</h1>
          <h2>{equipo.barrio}</h2>
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

      <h3 className="section-title">Jugadores</h3>
      <div className="jugadores-lista">{jugadores.map(j => <div key={j.id} className="jugador-item">#{j.id} – {j.nombre} {j.apellido}</div>)}</div>

      <h3 className="section-title">Partidos Jugados</h3>
      <div className="partidos-lista">{partidos.map(p => (
        <div key={p.id} className="partido-item">
          <span>{p.nombre_local} {p.jugado ? p.goles_local : "-"} – {p.jugado ? p.goles_visitante : "-"} {p.nombre_visitante}</span>
          <span>{new Date(p.fecha).toLocaleDateString("es-AR")}</span>
        </div>
      ))}</div>
    </div>
  );
}

export default EquipoIndividual;
