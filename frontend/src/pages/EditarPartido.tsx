// src/EditarPartido.tsx
import { useEffect, useState } from "react";
import "../styles/panel.css";

interface Jugador {
  id: number;
  nombre: string;
}

interface Evento {
  jugador_id: number | string;
  tipo: 'gol' | 'amarilla' | 'roja' | 'azul';
  minuto: number | string;
  tipo_gol?: 'penal' | 'en_contra' | 'jugada';
  existente?: boolean; // Nuevo campo para distinguir eventos existentes
}

function EditarPartido() {
  const [torneos, setTorneos] = useState<any[]>([]);
  const [partidos, setPartidos] = useState<any[]>([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState('');
  const [partidoSeleccionado, setPartidoSeleccionado] = useState<any>(null);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch("http://localhost:3000/api/torneos")
      .then(res => res.json())
      .then(data => setTorneos(data));
  }, []);

  const cargarPartidos = async (torneoId: string) => {
    setTorneoSeleccionado(torneoId);
    const res = await fetch(`http://localhost:3000/api/partidos/torneo/${torneoId}`);
    let data = await res.json();
    data = data.map((p: any) => ({ ...p, jugado: Number(p.jugado) }));
    setPartidos(data);
  };

  const cargarJugadores = async (equipoLocalId: number, equipoVisitanteId: number) => {
    try {
      const [resLocal, resVisitante] = await Promise.all([
        fetch(`http://localhost:3000/api/equipos/${equipoLocalId}/jugadores`),
        fetch(`http://localhost:3000/api/equipos/${equipoVisitanteId}/jugadores`)
      ]);
      const [jugadoresLocal, jugadoresVisitante] = await Promise.all([
        resLocal.json(),
        resVisitante.json()
      ]);
      setJugadores([...(jugadoresLocal || []), ...(jugadoresVisitante || [])]);
    } catch (error) {
      console.error("Error al cargar jugadores:", error);
      setJugadores([]);
    }
  };

  const cargarEstadisticas = async (partidoId: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/estadisticas/partido/${partidoId}`);
      const data = await res.json();
      const eventosFormateados = data.map((ev: any) => ({
        jugador_id: ev.jugador_id,
        tipo: ev.tipo,
        tipo_gol: ev.tipo_gol,
        minuto: ev.minuto,
        existente: true,
      }));
      setEventos(eventosFormateados);
    } catch (err) {
      console.error("Error al cargar estadísticas existentes:", err);
    }
  };

  const handleEdit = (partido: any) => {
    setPartidoSeleccionado({ ...partido });
    cargarJugadores(partido.equipo_local_id, partido.equipo_visitante_id);
    cargarEstadisticas(partido.id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValue = name === "jugado" || name.startsWith("goles_") ? Number(value) : value;
    setPartidoSeleccionado({ ...partidoSeleccionado, [name]: newValue });
  };

  const agregarEvento = () => {
    setEventos([...eventos, { jugador_id: "", tipo: 'gol', minuto: 0, tipo_gol: 'jugada' }]);
  };

  const actualizarEvento = (index: number, campo: keyof Evento, valor: any) => {
    const nuevosEventos = [...eventos];
    nuevosEventos[index] = {
      ...nuevosEventos[index],
      [campo]: valor
    };

    if (campo === "tipo" && valor !== "gol") {
      delete nuevosEventos[index].tipo_gol;
    }
    if (campo === "tipo" && valor === "gol" && !nuevosEventos[index].tipo_gol) {
      nuevosEventos[index].tipo_gol = 'jugada';
    }

    setEventos(nuevosEventos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventosFiltrados = eventos.filter((ev) => {
      return ev.jugador_id !== "" && ev.jugador_id !== null && ev.jugador_id !== undefined && !ev.existente;
    });

    await fetch(`http://localhost:3000/api/partidos/${partidoSeleccionado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        goles_local: Number(partidoSeleccionado.goles_local),
        goles_visitante: Number(partidoSeleccionado.goles_visitante),
        jugado: Number(partidoSeleccionado.jugado)
      })
    });

    await fetch(`http://localhost:3000/api/partidos/${partidoSeleccionado.id}/estadisticas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventosFiltrados)
    });

    setMensaje('Partido y estadísticas actualizados');
    setTimeout(() => setMensaje(""), 3000);
    setPartidoSeleccionado(null);
    setEventos([]);
    cargarPartidos(torneoSeleccionado);
  };

  const eliminarPartido = async (partidoId: number) => {
    if (!window.confirm("¿Seguro que querés eliminar este partido y sus estadísticas?")) return;

    await fetch(`http://localhost:3000/api/partidos/${partidoId}`, {
      method: "DELETE",
    });

    alert("Partido eliminado");
    cargarPartidos(torneoSeleccionado);
  };

  return (
    <div className="panel-section">
      <h2 className="section-title">Editar Partido</h2>

      <select className="select" onChange={e => cargarPartidos(e.target.value)} defaultValue="">
        <option value="">Seleccionar Torneo</option>
        {torneos.map((t: any) => (
          <option key={t.id} value={t.id}>{t.nombre} {t.anio}</option>
        ))}
      </select>

      <ul className="lista-partidos">
        {partidos.map((p: any) => (
          <li key={p.id}>
            {p.equipo_local} vs {p.equipo_visitante} - {p.fecha} {p.hora} - 
            Resultado: {p.jugado === 1 ? `${p.goles_local} - ${p.goles_visitante}` : 'Pendiente'}
            <button className="botonEditar" onClick={() => handleEdit(p)}>Editar</button>
            <button className="botonEliminar" onClick={() => eliminarPartido(p.id)} style={{ marginLeft: "8px" }}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {partidoSeleccionado && (
        <form className="formulario" onSubmit={handleSubmit}>
          <h3>
            Editando: {partidoSeleccionado.equipo_local} vs {partidoSeleccionado.equipo_visitante}
          </h3>

          <input
            type="number"
            name="goles_local"
            value={partidoSeleccionado.goles_local}
            onChange={handleChange}
            className="input"
            placeholder="Goles Local"
            min={0}
          />
          <input
            type="number"
            name="goles_visitante"
            value={partidoSeleccionado.goles_visitante}
            onChange={handleChange}
            className="input"
            placeholder="Goles Visitante"
            min={0}
          />

          <label className="label">
            ¿Jugado?
            <select name="jugado" value={partidoSeleccionado.jugado} onChange={handleChange} className="select">
              <option value={0}>No</option>
              <option value={1}>Sí</option>
            </select>
          </label>

          <h4>Eventos del partido (minuto a minuto)</h4>
          {eventos.map((evento, index) => (
            <div key={index} className="estadistica-linea">
              <select
                value={evento.jugador_id}
                onChange={(e) => actualizarEvento(index, 'jugador_id', Number(e.target.value))}
                className="select"
              >
                <option value="">Seleccionar jugador</option>
                {jugadores.map(j => (
                  <option key={j.id} value={j.id}>{j.nombre}</option>
                ))}
              </select>

              <select
                className="select"
                value={evento.tipo}
                onChange={e => actualizarEvento(index, 'tipo', e.target.value)}
              >
                <option value="gol">⚽ Gol</option>
                <option value="amarilla">🟡 Amarilla</option>
                <option value="roja">🔴 Roja</option>
                <option value="azul">🔵 Azul</option>
              </select>

              {evento.tipo === 'gol' && (
                <select
                  className="select"
                  value={evento.tipo_gol || 'jugada'}
                  onChange={e => actualizarEvento(index, 'tipo_gol', e.target.value)}
                >
                  <option value="jugada">Jugada</option>
                  <option value="penal">Penal</option>
                  <option value="en_contra">En contra</option>
                </select>
              )}

              <input
                type="number"
                value={evento.minuto}
                onChange={e => actualizarEvento(index, 'minuto', Number(e.target.value))}
                className="input"
                min={0}
                max={120}
                placeholder="Minuto"
              />
            </div>
          ))}

          <button type="button" className="botonCrear" onClick={agregarEvento}>
            Agregar Evento
          </button>
          <br />
          <button type="submit" className="botonGuardar">Guardar cambios</button>
        </form>
      )}

      <p className="mensaje">{mensaje}</p>
    </div>
  );
}

export default EditarPartido;
