import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/JugadorIndividual.css";

type Jugador = {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
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

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3000/api/jugadores/${id}`)
      .then((r) => r.json())
      .then(setJugador)
      .catch(console.error);
  }, [id]);

  if (!jugador) return <p>Cargando jugador...</p>;

  const edad = jugador.fecha_nacimiento
    ? Math.floor((Date.now() - new Date(jugador.fecha_nacimiento).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null;

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
          <h1>{jugador.nombre} {jugador.apellido}</h1>
          <h2>Dorsal #{jugador.dorsal}</h2>
          <p>
            Equipo:{" "}
            <span
              className="enlace-equipo"
              onClick={() => navigate(`/equipos/${jugador.equipo_id}`)}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              {jugador.nombre_equipo}
            </span>
          </p>
          {edad && <p>Edad: {edad} años</p>}
          <p>DNI: {jugador.dni}</p>
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
