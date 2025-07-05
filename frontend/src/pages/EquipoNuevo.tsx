import { useState, useEffect } from "react";
import "../styles/panel.css";

function EquipoNuevo() {
  const [nombre, setNombre] = useState("");
  const [torneoId, setTorneoId] = useState("");
  const [torneos, setTorneos] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState("");

  const fetchTorneos = () => {
    fetch("http://localhost:3000/api/torneos")
      .then(res => res.json())
      .then(data => setTorneos(data));
  };

  const agregarEquipo = (e: React.FormEvent) => {
    e.preventDefault();

    // Enviamos jugadores vacíos para que backend acepte la creación sin jugadores
    fetch("http://localhost:3000/api/equipos/con-jugadores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, torneo_id: torneoId, jugadores: [] }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Error al crear equipo");
        }
        setMensaje(data.message || "Equipo creado");
        setNombre("");
        setTorneoId("");
      })
      .catch((err) => setMensaje(err.message || "Error al crear equipo"));
  };

  useEffect(() => {
    fetchTorneos();
  }, []);

  return (
    <div className="panel-section">
      <h2 className="section-title">Agregar Equipo</h2>
      <form className="form" onSubmit={agregarEquipo}>
        <input
          type="text"
          placeholder="Nombre del equipo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <select
          value={torneoId}
          onChange={(e) => setTorneoId(e.target.value)}
          required
        >
          <option value="">Seleccionar Torneo</option>
          {torneos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre} ({t.anio})
            </option>
          ))}
        </select>

        <button type="submit" className="btn btn-create">
          Crear
        </button>
      </form>
      <p className="mensaje">{mensaje}</p>
    </div>
  );
}

export default EquipoNuevo;
