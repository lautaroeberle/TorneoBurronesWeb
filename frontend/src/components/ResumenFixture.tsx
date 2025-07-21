import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ResumenFixture.css";

type Partido = {
  id: number;
  equipo_local: string;
  equipo_visitante: string;
  goles_local: number;
  goles_visitante: number;
  fecha: string;
  hora: string;
  grupo_fecha: number;
  jugado: boolean;
};

type Equipo = {
  id: number;
  nombre: string;
  imagen: string;
};

const ResumenFixture = () => {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const resPartidos = await fetch("http://localhost:3000/api/partidos/torneo?nombre=Apertura");
        const dataPartidos = await resPartidos.json();
        setPartidos(dataPartidos.filter((p: Partido) => p.jugado));
      } catch (err) {
        console.error("Error cargando partidos:", err);
      }

      try {
        const resEquipos = await fetch("http://localhost:3000/api/equipos");
        const dataEquipos = await resEquipos.json();
        setEquipos(dataEquipos);
      } catch (err) {
        console.error("Error cargando equipos:", err);
      }
    };

    fetchDatos();
  }, []);

  const obtenerLogo = (nombre: string) => {
    const equipo = equipos.find((e) => e.nombre === nombre);
    return equipo
      ? `http://localhost:3000/uploads/${equipo.imagen}`
      : "http://localhost:3000/uploads/default.png";
  };

  const ultimaFecha = Math.max(...partidos.map((p) => p.grupo_fecha || 0));
  const partidosUltimaFecha = partidos.filter((p) => p.grupo_fecha === ultimaFecha);

  return (
    <div className="rf-container">
      <h3 className="rf-titulo">Última Fecha - Fecha {ultimaFecha}</h3>
      <ul className="rf-lista">
        {partidosUltimaFecha.map((p) => (
          <li key={p.id} onClick={() => navigate(`/partidos/${p.id}`)} className="rf-partido">
            <div className="rf-equipo">
              <img src={obtenerLogo(p.equipo_local)} alt={p.equipo_local} />
              <span>{p.equipo_local}</span>
            </div>
            <span className="rf-resultado">{p.goles_local} - {p.goles_visitante}</span>
            <div className="rf-equipo visitante">
  <img src={obtenerLogo(p.equipo_visitante)} alt={p.equipo_visitante} />
  <span>{p.equipo_visitante}</span>
</div>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResumenFixture;
