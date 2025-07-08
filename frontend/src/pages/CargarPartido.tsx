import { useEffect, useState } from "react";
import "../styles/panel.css";

function CargarPartido() {
  const [torneos, setTorneos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [form, setForm] = useState({
    torneo_id: '',
    equipo_local_id: '',
    equipo_visitante_id: '',
    fecha: '',
    hora: '',
    fase: '',
    grupo_fecha: ''
  });

  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const torneosRes = await fetch("http://localhost:3000/api/torneos");
      const equiposRes = await fetch("http://localhost:3000/api/equipos");
      const torneosData = await torneosRes.json();
      const equiposData = await equiposRes.json();
      setTorneos(torneosData);
      setEquipos(equiposData);
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      ...form,
      grupo_fecha: form.fase === "Grupos" ? form.grupo_fecha : null
    };

    try {
      const res = await fetch("http://localhost:3000/api/partidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      setMensaje(data.message || "Partido agregado");
      setTimeout(() => setMensaje(""), 3000);
    } catch (err) {
      console.error(err);
      setMensaje("Error al guardar partido");
    }
  };

  return (
    <div className="panel-section">
      <h2 className="section-title">Cargar Partido</h2>
      <form className="form" onSubmit={handleSubmit}>
        <select className="select" name="torneo_id" value={form.torneo_id} onChange={handleChange} required>
          <option value="">Seleccionar Torneo</option>
          {torneos.map((t: any) => (
            <option key={t.id} value={t.id}>{t.nombre} {t.anio}</option>
          ))}
        </select>

        <select className="select" name="equipo_local_id" value={form.equipo_local_id} onChange={handleChange} required>
          <option value="">Equipo Local</option>
          {equipos.map((e: any) => (
            <option key={e.id} value={e.id}>{e.nombre}</option>
          ))}
        </select>

        <select className="select" name="equipo_visitante_id" value={form.equipo_visitante_id} onChange={handleChange} required>
          <option value="">Equipo Visitante</option>
          {equipos.map((e: any) => (
            <option key={e.id} value={e.id}>{e.nombre}</option>
          ))}
        </select>

        <input className="input" type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
        <input className="input" type="time" name="hora" value={form.hora} onChange={handleChange} required />

        <select className="select" name="fase" value={form.fase} onChange={handleChange} required>
          <option value="">Seleccionar Fase</option>
          <option value="Grupos">Grupos</option>
          <option value="Octavos de final">Octavos de final</option>
          <option value="Cuartos de final">Cuartos de final</option>
          <option value="Semifinal">Semifinal</option>
          <option value="Final">Final</option>
        </select>

        {form.fase === "Grupos" && (
          <input
            className="input"
            type="number"
            name="grupo_fecha"
            value={form.grupo_fecha}
            placeholder="Fecha de grupos (ej: 1, 2, 3...)"
            onChange={handleChange}
            required
          />
        )}

        <button type="submit" className="botonGuardar">Guardar Partido</button>
      </form>
      <p className="mensaje">{mensaje}</p>
    </div>
  );
}

export default CargarPartido;
