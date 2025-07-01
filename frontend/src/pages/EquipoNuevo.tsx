import { useEffect, useState } from "react";

interface Jugador {
  nombre: string;
  apellido: string;
  dni: string;
  dorsal: number;
}

function EquipoNuevo() {
  const [torneos, setTorneos] = useState([]);
  const [torneoId, setTorneoId] = useState<number | null>(null);
  const [nombreEquipo, setNombreEquipo] = useState("");
  const [jugadores, setJugadores] = useState<Jugador[]>([]);

  const fetchTorneos = () => {
    fetch("http://localhost:3000/api/torneos")
      .then(res => res.json())
      .then(data => setTorneos(data));
  };

  useEffect(() => {
    fetchTorneos();
  }, []);

  const agregarJugador = () => {
    setJugadores([...jugadores, { nombre: "", apellido: "", dni: "", dorsal: 0 }]);
  };

  const actualizarJugador = (index: number, campo: string, valor: string | number) => {
    const nuevos = [...jugadores];
    (nuevos[index] as any)[campo] = valor;
    setJugadores(nuevos);
  };

  const eliminarJugador = (index: number) => {
    const nuevos = [...jugadores];
    nuevos.splice(index, 1);
    setJugadores(nuevos);
  };

  const guardarEquipo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!torneoId || !nombreEquipo || jugadores.length === 0) return alert("Faltan datos");

    fetch("http://localhost:3000/api/equipos/con-jugadores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        torneo_id: torneoId,
        nombre: nombreEquipo,
        jugadores: jugadores,
      }),
    })
      .then(res => res.json())
      .then(data => {
        alert("Equipo y jugadores cargados correctamente");
        setNombreEquipo("");
        setJugadores([]);
      });
  };

  return (
    <div>
      <h2>Cargar nuevo equipo</h2>
      <form onSubmit={guardarEquipo}>
        <select value={torneoId ?? ""} onChange={e => setTorneoId(Number(e.target.value))} required>
          <option value="" disabled>Seleccioná un torneo</option>
          {torneos.map((t: any) => (
            <option key={t.id} value={t.id}>
              {t.nombre} ({t.año})
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nombre del equipo"
          value={nombreEquipo}
          onChange={e => setNombreEquipo(e.target.value)}
          required
        />

        <h3>Jugadores</h3>
        {jugadores.map((j, i) => (
          <div key={i} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Nombre"
              value={j.nombre}
              onChange={e => actualizarJugador(i, "nombre", e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={j.apellido}
              onChange={e => actualizarJugador(i, "apellido", e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="DNI"
              value={j.dni}
              onChange={e => actualizarJugador(i, "dni", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Dorsal"
              value={j.dorsal}
              onChange={e => actualizarJugador(i, "dorsal", Number(e.target.value))}
              required
            />
            <button type="button" onClick={() => eliminarJugador(i)}>Eliminar</button>
          </div>
        ))}

        <button type="button" onClick={agregarJugador}>Agregar jugador</button>
        <br /><br />
        <button type="submit">Guardar equipo</button>
      </form>
    </div>
  );
}

export default EquipoNuevo;
