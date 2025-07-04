import { useState, useEffect } from "react";

const OPCIONES_TORNEOS = [
  "Copa de Verano",
  "Apertura",
  "Copa de Invierno",
  "Clausura",
];

function Torneos() {
  const [nombre, setNombre] = useState("");
  const [año, setAño] = useState(new Date().getFullYear());
  const [torneos, setTorneos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const fetchTorneos = () => {
    fetch("http://localhost:3000/api/torneos")
      .then(res => res.json())
      .then(data => setTorneos(data));
  };

  const agregarTorneo = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/torneos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, año }),
    })
      .then(res => res.json())
      .then(data => {
        setMensaje(data.message || "Torneo creado");
        setNombre("");
        fetchTorneos();
      })
      .catch(() => setMensaje("Error al crear torneo"));
  };

  const eliminarTorneo = (id: number) => {
    fetch(`http://localhost:3000/api/torneos/${id}`, {
      method: "DELETE",
    }).then(() => fetchTorneos());
  };

  useEffect(() => {
    fetchTorneos();
  }, []);

  return (
    <div>
      <h2>Agregar Torneo</h2>
      <form onSubmit={agregarTorneo}>
        <select
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        >
          <option value="">Seleccionar Torneo</option>
          {OPCIONES_TORNEOS.map((nombre) => (
            <option key={nombre} value={nombre}>{nombre}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Año"
          value={año}
          onChange={(e) => setAño(Number(e.target.value))}
          required
        />
        <button type="submit">Crear</button>
      </form>
      <p>{mensaje}</p>

      <h3>Torneos existentes:</h3>
      <ul>
        {torneos.map((t: any) => (
          <li key={t.id}>
            {t.nombre} ({t.año}) {" "}
            <button onClick={() => eliminarTorneo(t.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Torneos;
