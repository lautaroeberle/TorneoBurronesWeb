import { useState, useEffect } from "react";
import "../styles/panel.css";

function EquipoNuevo() {
  const [nombre, setNombre] = useState("");
  const [torneoId, setTorneoId] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [torneos, setTorneos] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/torneos")
      .then((res) => res.json())
      .then((data) => setTorneos(data));
  }, []);

  const agregarEquipo = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("torneo_id", torneoId);
    formData.append("jugadores", JSON.stringify([])); // Por ahora sin jugadores

    if (imagen) {
      formData.append("imagen", imagen);
    }

    fetch("http://localhost:3000/api/equipos/con-jugadores", {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Error al crear equipo");
        }
        setMensaje(data.message || "Equipo creado");
        setNombre("");
        setTorneoId("");
        setImagen(null);
      })
      .catch((err) => setMensaje(err.message || "Error al crear equipo"));
  };

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

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files?.[0] || null)}
        />

        <button type="submit" className="btn btn-create">
          Crear
        </button>
      </form>
      <p className="mensaje">{mensaje}</p>
    </div>
  );
}

export default EquipoNuevo;
