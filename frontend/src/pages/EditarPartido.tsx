import { useEffect, useState } from "react";

interface Jugador {
  id: number;
  nombre: string;
}

interface Estadistica {
  jugador_id: number;
  goles: number;
  amarillas: number;
  rojas: number;
}

function EditarPartido() {
  const [torneos, setTorneos] = useState<any[]>([]);
  const [partidos, setPartidos] = useState<any[]>([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState('');
  const [partidoSeleccionado, setPartidoSeleccionado] = useState<any>(null);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadistica[]>([]);
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

  
  data = data.map((p: any) => ({
    ...p,
    jugado: Number(p.jugado)
  }));

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
    setEstadisticas([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValue = name === "jugado" ? Number(value) : value;
    setPartidoSeleccionado({ ...partidoSeleccionado, [name]: newValue });
  };

  const agregarEstadistica = () => {
    setEstadisticas([...estadisticas, { jugador_id: 0, goles: 0, amarillas: 0, rojas: 0 }]);
  };

  const actualizarEstadistica = (index: number, campo: keyof Estadistica, valor: any) => {
    const nuevas = [...estadisticas];
    nuevas[index][campo] = Number(valor);
    setEstadisticas(nuevas);
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

    for (const est of estadisticas) {
      await fetch(`http://localhost:3000/api/partidos/${partidoSeleccionado.id}/estadisticas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(est)
      });
    }

    setMensaje('Partido y estadísticas actualizados');
    setPartidoSeleccionado(null);
    setEstadisticas([]);
    cargarPartidos(torneoSeleccionado);
  };

  return (
    <div className="panel">
      <h2>Editar Partido</h2>

      <select onChange={e => cargarPartidos(e.target.value)} defaultValue="">
        <option value="">Seleccionar Torneo</option>
        {torneos.map((t: any) => (
          <option key={t.id} value={t.id}>{t.nombre} {t.anio}</option>
        ))}
      </select>

      <ul>
        {partidos.map((p: any) => (
          <li key={p.id}>
            {p.equipo_local} vs {p.equipo_visitante} - {p.fecha} {p.hora} - 
            Resultado: {p.jugado === 1 ? `${p.goles_local} - ${p.goles_visitante}` : 'Pendiente'}
            <button onClick={() => handleEdit(p)}>Editar</button>
          </li>
        ))}
      </ul>

      {partidoSeleccionado && (
        <form onSubmit={handleSubmit}>
          <h3>Editando: {partidoSeleccionado.equipo_local} vs {partidoSeleccionado.equipo_visitante}</h3>
          <input type="number" name="goles_local" value={partidoSeleccionado.goles_local} onChange={handleChange} />
          <input type="number" name="goles_visitante" value={partidoSeleccionado.goles_visitante} onChange={handleChange} />
          <label>
            ¿Jugado?
            <select name="jugado" value={partidoSeleccionado.jugado} onChange={handleChange}>
              <option value={0}>No</option>
              <option value={1}>Sí</option>
            </select>
          </label>

          <h4>Estadísticas por jugador</h4>
          {estadisticas.map((est, index) => (
            <div key={index} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
              <select value={est.jugador_id} onChange={(e) => actualizarEstadistica(index, 'jugador_id', e.target.value)}>
                <option value="">Seleccionar jugador</option>
                {jugadores.map(j => (
                  <option key={j.id} value={j.id}>{j.nombre}</option>
                ))}
              </select>
              <input type="number" placeholder="Goles" value={est.goles} onChange={e => actualizarEstadistica(index, 'goles', e.target.value)} />
              <input type="number" placeholder="Amarillas" value={est.amarillas} onChange={e => actualizarEstadistica(index, 'amarillas', e.target.value)} />
              <input type="number" placeholder="Rojas" value={est.rojas} onChange={e => actualizarEstadistica(index, 'rojas', e.target.value)} />
            </div>
          ))}
          <button type="button" onClick={agregarEstadistica}>Agregar Estadística</button>
          <br />
          <button type="submit">Guardar cambios</button>
        </form>
      )}

      <p>{mensaje}</p>
    </div>
  );
}

export default EditarPartido;
