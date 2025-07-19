import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TorneoPage.css";

type Partido = {
  grupo_fecha: number;
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
  const [, setEventos] = useState<Evento[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [posiciones, setPosiciones] = useState<Posicion[]>([]);
  const [fechaActual, setFechaActual] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const resPartidos = await fetch("http://localhost:3000/api/partidos/torneo?nombre=Copa de Verano");
        const dataPartidos: Partido[] = await resPartidos.json();
        setPartidos(dataPartidos);

        const fechas = dataPartidos
          .map((p) => p.grupo_fecha || 0)
          .filter((n): n is number => typeof n === "number")
          .sort((a, b) => a - b);
        if (fechas.length > 0) setFechaActual(fechas[0]);
      } catch (error) {
        console.error("Error al cargar partidos de la Copa de Verano:", error);
      }

      try {
        const resEventos = await fetch("http://localhost:3000/api/estadisticas/torneo?nombre=Copa de Verano");
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
      } catch (error) {
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

  const irAEQUIPO = (nombre: string) => {
    const equipo = equipos.find((e) => e.nombre === nombre);
    if (equipo) {
      navigate(`/equipos/${equipo.id}`);
    }
  };
 

  const fechasUnicas: number[] = Array.from(
    new Set(partidos.map((p) => p.grupo_fecha || 0))
  )
    .filter((n): n is number => typeof n === "number")
    .sort((a, b) => a - b);

  const avanzar = () => {
    const idx = fechasUnicas.indexOf(fechaActual);
    if (idx < fechasUnicas.length - 1) {
      setFechaActual(fechasUnicas[idx + 1]);
    }
  };

  const retroceder = () => {
    const idx = fechasUnicas.indexOf(fechaActual);
    if (idx > 0) {
      setFechaActual(fechasUnicas[idx - 1]);
    }
  };

  const partidosPorFecha = partidos.filter(
    (p) => (p.grupo_fecha || 0) === fechaActual
  );

  function formatearFechaHora(fecha: string, hora: string) {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate().toString().padStart(2, "0");
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, "0");
    const horaStr = hora?.slice(0, 5);
    return `${dia}/${mes} ${horaStr} hs`;
  }

  return (
    <div className="torneo-page">
      <h2>Copa de Verano {new Date().getFullYear()}</h2>

      <section className="tabla-posiciones">
        <h3>Tabla de Posiciones</h3>
        <table>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Equipo</th>
              <th>PJ</th>
              <th>PG</th>
              <th>PE</th>
              <th>PP</th>
              <th>GF</th>
              <th>GC</th>
              <th>DG</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {posiciones.map((pos, index) => (
              <tr key={pos.equipo_id}>
                <td>{index + 1}</td>
                <td
                  className="equipo truncar"
                  style={{ cursor: "pointer" }}
                  onClick={() => irAEQUIPO(pos.equipo)}
                >
                  <img
                    src={`http://localhost:3000/uploads/${pos.imagen}`}
                    alt={pos.equipo}
                    className="logo-equipo"
                  />
                  {pos.equipo}
                </td>
                <td>{pos.pj}</td>
                <td>{pos.pg}</td>
                <td>{pos.pe}</td>
                <td>{pos.pp}</td>
                <td>{pos.gf}</td>
                <td>{pos.gc}</td>
                <td>{pos.gf - pos.gc}</td>
                <td>{pos.puntos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="fixture">
        <h3>Fixture</h3>

        <div className="fixture-nav">
          <button className="nav-button" onClick={retroceder} disabled={fechaActual === fechasUnicas[0]}>
            Anterior
          </button>
          <span className="nav-label">Fecha {fechaActual}</span>
          <button className="nav-button" onClick={avanzar} disabled={fechaActual === fechasUnicas[fechasUnicas.length - 1]}>
            Siguiente
          </button>
        </div>
        <table className="fixture-table">
          <colgroup>
            <col style={{ width: "100px" }} />
            <col />
            <col style={{ width: "30px" }} />
            <col style={{ width: "30px" }} />
            <col style={{ width: "30px" }} />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th>Estado</th>
              <th>Local</th>
              <th></th>
              <th style={{ color: "transparent" }}>-</th>
              <th></th>
              <th>Visitante</th>
            </tr>
          </thead>
          <tbody>
  {partidosPorFecha.map((p) => (
    <tr
      key={p.id}
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/partidos/${p.id}`)}
    >
      <td className="estado">
        {p.jugado ? "Final" : formatearFechaHora(p.fecha, p.hora)}
      </td>
      <td
        className="equipo truncar"
        onClick={(e) => {
          e.stopPropagation(); // evita redirección general
          irAEQUIPO(p.equipo_local);
        }}
      >
        <img
          src={obtenerLogo(p.equipo_local)}
          alt={p.equipo_local}
          className="logo-equipo"
        />
        {p.equipo_local}
      </td>
      <td>{p.jugado ? p.goles_local : ""}</td>
      <td>-</td>
      <td>{p.jugado ? p.goles_visitante : ""}</td>
      <td
        className="equipo truncar"
        onClick={(e) => {
          e.stopPropagation(); // evita redirección general
          irAEQUIPO(p.equipo_visitante);
        }}
      >
        <img
          src={obtenerLogo(p.equipo_visitante)}
          alt={p.equipo_visitante}
          className="logo-equipo"
        />
        {p.equipo_visitante}
      </td>
    </tr>
  ))}
    </tbody>

        </table>
      </section>
    </div>
  );
}

export default CopaPage;
