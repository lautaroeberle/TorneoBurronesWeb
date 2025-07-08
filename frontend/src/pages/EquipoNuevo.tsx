import { useState, useEffect } from "react";
import "../styles/panel.css";

function EquipoNuevo() {
  const [nombre, setNombre] = useState("");
  const [torneoId, setTorneoId] = useState("");
  const [barrio, setBarrio] = useState("Palermo");
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
    formData.append("barrio", barrio); // Agregar barrio
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
        setTimeout(() => setMensaje(""), 3000);
        setNombre("");
        setTorneoId("");
        setBarrio("Palermo");
        setImagen(null);
        // window.location.reload();
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

        <select
          value={barrio}
          onChange={(e) => setBarrio(e.target.value)}
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

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files?.[0] || null)}
        />

        <button type="submit" className="botonCrear">
          Crear
        </button>
      </form>
      <p className="mensaje">{mensaje}</p>
    </div>
  );
}

export default EquipoNuevo;
