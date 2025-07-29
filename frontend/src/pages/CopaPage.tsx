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

type Goleador = {
  jugador_id: number;
  nombre: string;
  apellido: string;
  equipo_id: number;
  equipo: string;
  imagen: string;
  goles: number;
};

type VallaMenosVencida = {
  equipo_id: number;
  equipo: string;
  imagen: string;
  pj: number;
  gc: number;
  promedio_gc: number;
};
type PromedioGoles = {
  equipo_id: number;
  equipo: string;
  imagen: string;
  pj: number;
  gf: number;
  promedio_gf: number;
};

function CopaPage() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [posiciones, setPosiciones] = useState<Posicion[]>([]);
  const [goleadores, setGoleadores] = useState<Goleador[]>([]);
  const [vallas, setVallas] = useState<VallaMenosVencida[]>([]);
  const [fechaActual, setFechaActual] = useState<number>(1);
  const [promediosGoles, setPromediosGoles] = useState<PromedioGoles[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const resPartidos = await fetch(
          "http://localhost:3000/api/partidos/torneo?nombre=Copa de Verano"
        );
        const dataPartidos: Partido[] = await resPartidos.json();
        setPartidos(dataPartidos);

        const fechas = dataPartidos
          .map((p) => p.grupo_fecha || 0)
          .filter((n): n is number => typeof n === "number")
          .sort((a, b) => a - b);
        if (fechas.length > 0) setFechaActual(fechas[0]);
      } catch (error) {
        console.error("Error al cargar partidos:", error);
      }

      try {
        const resEquipos = await fetch("http://localhost:3000/api/equipos");
        const dataEquipos = await resEquipos.json();
        setEquipos(dataEquipos);
      } catch (error) {
        console.warn("No se pudieron cargar los equipos:", error);
      }

      try {
        const resPos = await fetch(
          "http://localhost:3000/api/posiciones?nombre=Copa de Verano"
        );
        const dataPos = await resPos.json();
        setPosiciones(dataPos);
      } catch (error) {
        console.warn("No se pudieron cargar posiciones:", error);
      }

      try {
        const resGoleadores = await fetch(
          "http://localhost:3000/api/goleadores?nombre=Copa de Verano"
        );
        const dataGoleadores: Goleador[] = await resGoleadores.json();
        setGoleadores(dataGoleadores);
      } catch (error) {
        console.warn("No se pudieron cargar goleadores:", error);
      }

      try {
        const resPromGoles = await fetch(
          "http://localhost:3000/api/promediogoles?nombre=Copa de Verano"
        );
        if (!resPromGoles.ok) {
          console.warn(
            "Error al cargar promedio de goles:",
            resPromGoles.status,
            await resPromGoles.text()
          );
          setPromediosGoles([]);
        } else {
          const data: PromedioGoles[] = await resPromGoles.json();
          if (Array.isArray(data)) {
            // Ordenar por promedio_gf descendente para mostrar el más goleador primero
            const ordenados = data.sort(
              (a, b) => b.promedio_gf - a.promedio_gf
            );
            setPromediosGoles(ordenados);
          } else {
            console.warn("Respuesta inesperada promedio goles:", data);
            setPromediosGoles([]);
          }
        }
      } catch (error) {
        console.error("No se pudo cargar el promedio de goles:", error);
        setPromediosGoles([]);
      }

      try {
        const resValla = await fetch(
          "http://localhost:3000/api/valla?nombre=Copa de Verano"
        );
        if (!resValla.ok) {
          console.warn(
            "Error al cargar vallas:",
            resValla.status,
            await resValla.text()
          );
          setVallas([]);
        } else {
          const dataValla: VallaMenosVencida[] = await resValla.json();
          if (Array.isArray(dataValla)) {
            setVallas(dataValla);
          } else {
            console.warn("Respuesta inesperada vallas:", dataValla);
            setVallas([]);
          }
        }
      } catch (error) {
        console.error("No se pudo cargar la valla menos vencida:", error);
        setVallas([]);
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

      {/* Posiciones */}
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

      {/* Goleadores */}
      <section className="tabla-goleadores">
        <h3>Tabla de Goleadores</h3>
        <table>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Equipo</th>
              <th>Jugador</th>
              <th>Goles</th>
            </tr>
          </thead>
          <tbody>
            {goleadores.map((g, index) => (
              <tr key={g.jugador_id}>
                <td>{index + 1}</td>
                <td
                  className="equipo truncar"
                  style={{ cursor: "pointer" }}
                  onClick={() => irAEQUIPO(g.equipo)}
                >
                  <img
                    src={`http://localhost:3000/uploads/${g.imagen}`}
                    alt={g.equipo}
                    className="logo-equipo"
                  />
                  {g.equipo}
                </td>
                <td>
                  {g.nombre} {g.apellido}
                </td>
                <td>{g.goles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Valla Menos Vencida */}
      <section className="tabla-valla">
        <h3>Valla Menos Vencida (Promedio GC)</h3>
        <table>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Equipo</th>
              <th>PJ</th>
              <th>GC</th>
              <th>Promedio</th>
            </tr>
          </thead>
          <tbody>
            {vallas.map((v, index) => (
              <tr key={v.equipo_id}>
                <td>{index + 1}</td>
                <td
                  className="equipo truncar"
                  style={{ cursor: "pointer" }}
                  onClick={() => irAEQUIPO(v.equipo)}
                >
                  <img
                    src={`http://localhost:3000/uploads/${v.imagen}`}
                    alt={v.equipo}
                    className="logo-equipo"
                  />
                  {v.equipo}
                </td>
                <td>{v.pj}</td>
                <td>{v.gc}</td>
                <td>
                  {!isNaN(Number(v.promedio_gc))
                    ? Number(v.promedio_gc).toFixed(2)
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Equipo Más Goleador (Promedio GF) */}
      <section className="tabla-valla">
        <h3>Equipo Más Goleador (Promedio GF)</h3>
        <table>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Equipo</th>
              <th>PJ</th>
              <th>GF</th>
              <th>Promedio</th>
            </tr>
          </thead>
          <tbody>
            {promediosGoles.map((e, index) => (
              <tr key={e.equipo_id}>
                <td>{index + 1}</td>
                <td
                  className="equipo truncar"
                  style={{ cursor: "pointer" }}
                  onClick={() => irAEQUIPO(e.equipo)}
                >
                  <img
                    src={`http://localhost:3000/uploads/${e.imagen}`}
                    alt={e.equipo}
                    className="logo-equipo"
                  />
                  {e.equipo}
                </td>
                <td>{e.pj}</td>
                <td>{e.gf}</td>
                <td>
                  {!isNaN(Number(e.promedio_gf))
                    ? Number(e.promedio_gf).toFixed(2)
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Fixture */}
      <section className="fixture">
        <h3>Fixture</h3>

        <div className="fixture-nav">
          <button
            className="nav-button"
            onClick={retroceder}
            disabled={fechaActual === fechasUnicas[0]}
          >
            Anterior
          </button>
          <span className="nav-label">Fecha {fechaActual}</span>
          <button
            className="nav-button"
            onClick={avanzar}
            disabled={fechaActual === fechasUnicas[fechasUnicas.length - 1]}
          >
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
                    e.stopPropagation();
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
                    e.stopPropagation();
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
