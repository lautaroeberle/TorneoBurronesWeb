import { useEffect, useState } from "react";

interface Jugador {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  dorsal: number;
  equipo_id: number;
  nuevo?: boolean;
}

interface Equipo {
  id: number;
  nombre: string;
  torneo_id: number;
  jugadores: Jugador[];
}

function EditarEquipos() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);

  const fetchEquipos = () => {
    fetch("http://localhost:3000/api/equipos")
      .then(res => res.json())
      .then(data => setEquipos(data));
  };

  useEffect(() => {
    fetchEquipos();
  }, []);

  const handleNombreEquipo = (nuevoNombre: string) => {
    if (!equipoSeleccionado) return;
    setEquipoSeleccionado({ ...equipoSeleccionado, nombre: nuevoNombre });
  };

  const actualizarJugador = (index: number, campo: string, valor: string | number) => {
    if (!equipoSeleccionado) return;
    const jugadoresActualizados = [...equipoSeleccionado.jugadores];
    (jugadoresActualizados[index] as any)[campo] = valor;
    setEquipoSeleccionado({ ...equipoSeleccionado, jugadores: jugadoresActualizados });
  };

  const agregarJugadorNuevo = () => {
    if (!equipoSeleccionado) return;
    const nuevoJugador: Jugador = {
      id: 0,
      nombre: "",
      apellido: "",
      dni: "",
      dorsal: 0,
      equipo_id: equipoSeleccionado.id,
      nuevo: true,
    };
    setEquipoSeleccionado({
      ...equipoSeleccionado,
      jugadores: [...equipoSeleccionado.jugadores, nuevoJugador],
    });
  };

  const guardarCambios = async () => {
    if (!equipoSeleccionado) return;

    // Actualizar equipo
    await fetch(`http://localhost:3000/api/equipos/${equipoSeleccionado.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: equipoSeleccionado.nombre }),
    });

    // Guardar jugadores
    for (const jugador of equipoSeleccionado.jugadores) {
      if (jugador.nuevo) {
        await fetch("http://localhost:3000/api/equipos/jugador", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jugador),
        });
      } else {
        await fetch(`http://localhost:3000/api/equipos/jugador/${jugador.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jugador),
        });
      }
    }

    alert("Cambios guardados");
    fetchEquipos();
    setEquipoSeleccionado(null);
  };

  return (
    <div>
      <h2>Editar equipos</h2>

      <select
        onChange={(e) => {
          const eq = equipos.find(eq => eq.id === Number(e.target.value));
          if (eq) setEquipoSeleccionado(eq);
        }}
        defaultValue=""
      >
        <option value="" disabled>Seleccioná un equipo</option>
        {equipos.map(eq => (
          <option key={eq.id} value={eq.id}>{eq.nombre}</option>
        ))}
      </select>

      {equipoSeleccionado && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Nombre del equipo</h3>
          <input
            type="text"
            value={equipoSeleccionado.nombre}
            onChange={(e) => handleNombreEquipo(e.target.value)}
          />

          <h3>Jugadores</h3>
          {equipoSeleccionado.jugadores.map((jug, i) => (
            <div key={i} style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Nombre"
                value={jug.nombre}
                onChange={(e) => actualizarJugador(i, "nombre", e.target.value)}
              />
              <input
                type="text"
                placeholder="Apellido"
                value={jug.apellido}
                onChange={(e) => actualizarJugador(i, "apellido", e.target.value)}
              />
              <input
                type="number"
                placeholder="Dorsal"
                value={jug.dorsal}
                onChange={(e) => actualizarJugador(i, "dorsal", Number(e.target.value))}
              />
            </div>
          ))}

          <button type="button" onClick={agregarJugadorNuevo}>Agregar jugador</button>
          <br /><br />
          <button onClick={guardarCambios}>Guardar cambios</button>
        </div>
      )}
    </div>
  );
}

export default EditarEquipos;
