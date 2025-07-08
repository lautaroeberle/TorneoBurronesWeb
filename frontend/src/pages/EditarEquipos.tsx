import { useEffect, useState } from "react";
import "../styles/panel.css";

interface Jugador {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  dorsal: number;
  equipo_id: number;
  fecha_nacimiento: string;
  nuevo?: boolean;
}

interface Equipo {
  id: number;
  nombre: string;
  torneo_id: number;
  imagen: string;
  barrio: string; // Agregamos barrio
  jugadores: Jugador[];
}

function EditarEquipos() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);
  const [imagenNueva, setImagenNueva] = useState<File | null>(null);

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

  const handleBarrioCambio = (nuevoBarrio: string) => {
    if (!equipoSeleccionado) return;
    setEquipoSeleccionado({ ...equipoSeleccionado, barrio: nuevoBarrio });
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
      fecha_nacimiento: "",
      nuevo: true,
    };
    setEquipoSeleccionado({
      ...equipoSeleccionado,
      jugadores: [...equipoSeleccionado.jugadores, nuevoJugador],
    });
  };

  const guardarCambios = async () => {
    if (!equipoSeleccionado) return;

    const formData = new FormData();
    formData.append("nombre", equipoSeleccionado.nombre);
    formData.append("barrio", equipoSeleccionado.barrio); // Incluir barrio en los cambios
    if (imagenNueva) formData.append("imagen", imagenNueva);

    await fetch(`http://localhost:3000/api/equipos/${equipoSeleccionado.id}`, {
      method: "PUT",
      body: formData,
    });

    for (const jugador of equipoSeleccionado.jugadores) {
      const endpoint = jugador.nuevo
        ? "http://localhost:3000/api/equipos/jugador"
        : `http://localhost:3000/api/equipos/jugador/${jugador.id}`;
      const method = jugador.nuevo ? "POST" : "PUT";

      await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jugador),
      });
    }

    alert("Cambios guardados");
    fetchEquipos();
    setEquipoSeleccionado(null);
    setImagenNueva(null);
  };
  const eliminarJugador = async (jugadorId: number) => {
  if (!window.confirm("¿Seguro que querés eliminar este jugador?")) return;

  await fetch(`http://localhost:3000/api/equipos/jugador/${jugadorId}`, {
    method: "DELETE",
  });

  // Actualiza estado local
  if (!equipoSeleccionado) return;
  const jugadoresFiltrados = equipoSeleccionado.jugadores.filter(j => j.id !== jugadorId);
  setEquipoSeleccionado({ ...equipoSeleccionado, jugadores: jugadoresFiltrados });
};

const eliminarEquipo = async () => {
  if (!equipoSeleccionado) return;
  if (!window.confirm("¿Seguro que querés eliminar este equipo y todos sus jugadores?")) return;

  await fetch(`http://localhost:3000/api/equipos/${equipoSeleccionado.id}`, {
    method: "DELETE",
  });

  alert("Equipo eliminado");
  setEquipoSeleccionado(null);
  fetchEquipos();
};


  return (
    <div className="panel-section">
      <h2 className="section-title">Editar Equipos</h2>

      <select
        className="select"
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
        <div className="equipo-edicion">
          <h3>Nombre del equipo</h3>
          <input
            type="text"
            value={equipoSeleccionado.nombre}
            onChange={(e) => handleNombreEquipo(e.target.value)}
          />

          <h3>Logo actual</h3>
          <img
            src={`http://localhost:3000/uploads/${equipoSeleccionado.imagen || "default.png"}`}
            alt="Logo equipo"
            style={{ width: "100px", borderRadius: "5px", marginBottom: "10px" }}
          />
          <input type="file" accept="image/*" onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImagenNueva(e.target.files[0]);
            }
          }} />

          <h3>Barrio</h3>
          <select
            value={equipoSeleccionado.barrio}
            onChange={(e) => handleBarrioCambio(e.target.value)}
          >
            <option value="Agronomía">Agronomía</option>
<option value="Almagro">Almagro</option>
<option value="Balvanera">Balvanera</option>
<option value="Barracas">Barracas</option>
<option value="Belgrano">Belgrano</option>
<option value="Boedo">Boedo</option>
<option value="Caballito">Caballito</option>
<option value="Chacarita">Chacarita</option>
<option value="Coghlan">Coghlan</option>
<option value="Colegiales">Colegiales</option>
<option value="Constitución">Constitución</option>
<option value="Flores">Flores</option>
<option value="Floresta">Floresta</option>
<option value="La Boca">La Boca</option>
<option value="La Paternal">La Paternal</option>
<option value="Liniers">Liniers</option>
<option value="Mataderos">Mataderos</option>
<option value="Monte Castro">Monte Castro</option>
<option value="Montserrat">Montserrat</option>
<option value="Nueva Pompeya">Nueva Pompeya</option>
<option value="Núñez">Núñez</option>
<option value="Palermo">Palermo</option>
<option value="Parque Avellaneda">Parque Avellaneda</option>
<option value="Parque Chacabuco">Parque Chacabuco</option>
<option value="Parque Chas">Parque Chas</option>
<option value="Parque Patricios">Parque Patricios</option>
<option value="Puerto Madero">Puerto Madero</option>
<option value="Recoleta">Recoleta</option>
<option value="Retiro">Retiro</option>
<option value="Saavedra">Saavedra</option>
<option value="San Cristóbal">San Cristóbal</option>
<option value="San Nicolás">San Nicolás</option>
<option value="San Telmo">San Telmo</option>
<option value="Vélez Sársfield">Vélez Sársfield</option>
<option value="Versalles">Versalles</option>
<option value="Villa Crespo">Villa Crespo</option>
<option value="Villa del Parque">Villa del Parque</option>
<option value="Villa Devoto">Villa Devoto</option>
<option value="Villa General Mitre">Villa General Mitre</option>
<option value="Villa Lugano">Villa Lugano</option>
<option value="Villa Luro">Villa Luro</option>
<option value="Villa Ortúzar">Villa Ortúzar</option>
<option value="Villa Pueyrredón">Villa Pueyrredón</option>
<option value="Villa Real">Villa Real</option>
<option value="Villa Riachuelo">Villa Riachuelo</option>
<option value="Villa Santa Rita">Villa Santa Rita</option>
<option value="Villa Soldati">Villa Soldati</option>
<option value="Villa Urquiza">Villa Urquiza</option>
<option value="Vicente López">Vicente López</option>
<option value="Olivos">Olivos</option>
<option value="Florida">Florida</option>
<option value="La Lucila">La Lucila</option>
<option value="Villa Martelli">Villa Martelli</option>
<option value="Florida Oeste">Florida Oeste</option>
<option value="Munro">Munro</option>
<option value="Carapachay">Carapachay</option>
<option value="Villa Adelina">Villa Adelina</option>
<option value="San Isidro">San Isidro</option>
<option value="San Fernando">San Fernando</option>
<option value="Tigre">Tigre</option>
<option value="Escobar">Escobar</option>
<option value="Pilar">Pilar</option>
<option value="José C. Paz">José C. Paz</option>
<option value="Malvinas Argentinas">Malvinas Argentinas</option>
<option value="Tres de Febrero">Tres de Febrero</option>
<option value="Morón">Morón</option>
<option value="Hurlingham">Hurlingham</option>
<option value="Ituzaingó">Ituzaingó</option>
<option value="Merlo">Merlo</option>
<option value="Moreno">Moreno</option>
<option value="La Matanza">La Matanza</option>
<option value="Lomas de Zamora">Lomas de Zamora</option>
<option value="Lanús">Lanús</option>
<option value="Avellaneda">Avellaneda</option>
<option value="Quilmes">Quilmes</option>
<option value="Berazategui">Berazategui</option>
<option value="Florencio Varela">Florencio Varela</option>
<option value="Ezeiza">Ezeiza</option>
<option value="San Martín">San Martín</option>
<option value="Villa Ballester">Villa Ballester</option>
<option value="Villa Lynch">Villa Lynch</option>

          </select>
          

          <h3>Jugadores</h3>
          {equipoSeleccionado.jugadores.map((jug, i) => (
            <div key={i} className="jugador-form">
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
              <input
  type="date"
  placeholder="Fecha de Nacimiento"
  value={jug.fecha_nacimiento}
  onChange={(e) => actualizarJugador(i, "fecha_nacimiento", e.target.value)}
/>

{!jug.nuevo && (
  <button
    className="botonEliminar"
    onClick={() => eliminarJugador(jug.id)}
    style={{ marginLeft: "10px" }}
  >
    Eliminar
  </button>
)}
<br />

            </div>
          ))}

          <button type="button" className="botonCrear" onClick={agregarJugadorNuevo}>
            Agregar jugador
          </button>
          <br /><br />
          <button className="botonEliminar" onClick={eliminarEquipo}>
  Eliminar equipo
</button>
<br /><br />
          <button className="botonGuardar" onClick={guardarCambios}>Guardar cambios</button>
        </div>
      )}
    </div>
  );
}

export default EditarEquipos;
