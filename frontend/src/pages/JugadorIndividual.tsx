import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/JugadorIndividual.css";

type Jugador = {
  id: number;
  nombre: string;
  apellido: string;
  dorsal: number;
  goles: number;
  amarillas: number;
  rojas: number;
  azules: number;
  equipo_id: number;
  nombre_equipo: string;
  imagen_equipo: string;
  fecha_nacimiento: string;
};

function JugadorIndividual() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [jugador, setJugador] = useState<Jugador | null>(null);
  const [posicionGeneral, setPosicionGeneral] = useState<number | null>(null);
  const [posicionEquipo, setPosicionEquipo] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;

    // Cargar datos del jugador
    fetch(`http://localhost:3000/api/jugadores/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setJugador(data);

        // Obtener posiciones solo si el jugador fue cargado
        obtenerPosiciones(data.id, data.equipo_id);
      })
      .catch(console.error);
  }, [id]);

  const obtenerPosiciones = (jugadorId: number, equipoId: number) => {
    // Posición general
    fetch("http://localhost:3000/api/goleadores")
      .then((r) => r.json())
      .then((goleadores: any[]) => {
        const index = goleadores.findIndex((j) => j.jugador_id === jugadorId);
        if (index !== -1) setPosicionGeneral(index + 1);
      });

    // Posición en el equipo
    fetch(`http://localhost:3000/api/equipos/${equipoId}/goleadores`)
      .then((r) => r.json())
      .then((goleadoresEquipo: any[]) => {
        const index = goleadoresEquipo.findIndex((j) => j.id === jugadorId);
        if (index !== -1) setPosicionEquipo(index + 1);
      });
  };

  if (!jugador) return <p>Cargando jugador...</p>;

 

  return (
    <div className="jugador-container">
      <div className="volver-btn" onClick={() => navigate(-1)}>← Volver</div>

     <div className="header-jugador">
  <img
    src={`http://localhost:3000/uploads/${jugador.imagen_equipo}`}
    alt={jugador.nombre_equipo}
    className="logo-equipo"
  />
  <div className="info-jugador">
  <div className="info-header">
  <div className="nombre-dorsal">
    <h1>{jugador.nombre} {jugador.apellido}</h1>
    <span className="dorsal-badge">{jugador.dorsal}</span>
  </div>
  <div className="posiciones-container">
    {posicionGeneral && (
      <div className="posicion-tag">#{posicionGeneral} torneo</div>
    )}
    {posicionEquipo && (
      <div className="posicion-tag secundaria">#{posicionEquipo} equipo</div>
    )}
  </div>
</div>
  </div>
</div>


      <h3 className="section-title">Estadísticas</h3>
      <div className="stats-grid">
        <div className="stat-card"><h4>Goles</h4><p>{jugador.goles}</p></div>
        <div className="stat-card"><h4>Amarillas</h4><p>{jugador.amarillas}</p></div>
        <div className="stat-card"><h4>Rojas</h4><p>{jugador.rojas}</p></div>
        <div className="stat-card"><h4>Azules</h4><p>{jugador.azules}</p></div>
      </div>
    </div>
  );
}

export default JugadorIndividual;
