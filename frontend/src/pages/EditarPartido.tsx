// src/EditarPartido.tsx
import { useEffect, useState } from "react";
import "../styles/panel.css";

interface Jugador {
  id: number;
  nombre: string;
}

interface Evento {
  jugador_id: number;
  tipo: 'gol' | 'amarilla' | 'roja';
  minuto: number;
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

  const handleEdit = (partido: any) => {
    setPartidoSeleccionado({ ...partido });
    cargarJugadores(partido.equipo_local_id, partido.equipo_visitante_id);
    setEventos([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValue = name === "jugado" ? Number(value) : value;
    setPartidoSeleccionado({ ...partidoSeleccionado, [name]: newValue });
  };

  const agregarEvento = () => {
    setEventos([...eventos, { jugador_id: 0, tipo: 'gol', minuto: 0 }]);
  };

  const actualizarEvento = (index: number, campo: keyof Evento, valor: any) => {
  const nuevosEventos = [...eventos];
  nuevosEventos[index] = {
    ...nuevosEventos[index],
    [campo]: valor
  };
  setEventos(nuevosEventos);
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      body: JSON.stringify(eventos)
    });

    setMensaje('Partido y estadísticas actualizados');
    setPartidoSeleccionado(null);
    setEventos([]);
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
            <button className="btn btn-modify" onClick={() => handleEdit(p)}>Editar</button>
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
          />
          <input
            type="number"
            name="goles_visitante"
            value={partidoSeleccionado.goles_visitante}
            onChange={handleChange}
            className="input"
            placeholder="Goles Visitante"
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
                onChange={(e) => actualizarEvento(index, 'jugador_id', e.target.value)}
                className="select"
              >
                <option value="">Seleccionar jugador</option>
                {jugadores.map(j => (
                  <option key={j.id} value={j.id}>{j.nombre}</option>
                ))}
              </select>

              <select
                value={evento.tipo}
                onChange={e => actualizarEvento(index, 'tipo', e.target.value)}
                className="select"
              >
                <option value="gol">⚽ Gol</option>
                <option value="amarilla">🟡 Amarilla</option>
                <option value="roja">🔴 Roja</option>
              </select>

              <input
                type="number"
                placeholder="Minuto"
                value={evento.minuto}
                onChange={e => actualizarEvento(index, 'minuto', e.target.value)}
                className="input"
              />
            </div>
          ))}

          <button type="button" className="btn btn-create" onClick={agregarEvento}>
            Agregar Evento
          </button>
          <br />
          <button type="submit" className="btn btn-save">Guardar cambios</button>
        </form>
      )}

      <p className="mensaje">{mensaje}</p>
    </div>
  );
}

export default EditarPartido;
