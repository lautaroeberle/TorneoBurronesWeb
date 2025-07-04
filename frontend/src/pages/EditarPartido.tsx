// frontend/src/components/EditarPartido.tsx
import { useEffect, useState } from "react";

function EditarPartido() {
  const [torneos, setTorneos] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState('');
  const [partidoSeleccionado, setPartidoSeleccionado] = useState<any>(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch("http://localhost:3000/api/torneos")
      .then(res => res.json())
      .then(data => setTorneos(data));
  }, []);

  const cargarPartidos = async (torneoId: string) => {
    setTorneoSeleccionado(torneoId);
    const res = await fetch(`http://localhost:3000/api/partidos/torneo/${torneoId}`)

    const data = await res.json();
    setPartidos(data);
  };

  const handleEdit = (partido: any) => {
    setPartidoSeleccionado({ ...partido });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPartidoSeleccionado({ ...partidoSeleccionado, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3000/api/partidos/${partidoSeleccionado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partidoSeleccionado)
    });
    const data = await res.json();
    setMensaje(data.message || 'Partido actualizado');
    setPartidoSeleccionado(null);
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
            {p.equipo_local} vs {p.equipo_visitante} - {p.fecha} {p.hora} - Resultado: {p.jugado ? `${p.goles_local} - ${p.goles_visitante}` : 'Pendiente'}
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
              <option value="false">No</option>
              <option value="true">Sí</option>
            </select>
          </label>
          <button type="submit">Guardar cambios</button>
        </form>
      )}

      <p>{mensaje}</p>
    </div>
  );
}

export default EditarPartido;
