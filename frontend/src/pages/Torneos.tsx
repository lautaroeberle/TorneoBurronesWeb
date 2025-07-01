import { useState, useEffect } from "react";

function Torneos() {
  const [nombre, setNombre] = useState("");
  const [año, setAño] = useState(new Date().getFullYear());
  const [torneos, setTorneos] = useState([]);

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
      .then(() => {
        setNombre("");
        fetchTorneos();
      });
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
        <input
          type="text"
          placeholder="Nombre del torneo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Año"
          value={año}
          onChange={(e) => setAño(Number(e.target.value))}
          required
        />
        <button type="submit">Crear</button>
      </form>

      <h3>Torneos existentes:</h3>
      <ul>
        {torneos.map((t: any) => (
          <li key={t.id}>
            {t.nombre} ({t.año}){" "}
            <button onClick={() => eliminarTorneo(t.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Torneos;
