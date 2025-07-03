import { useState } from "react";
import inscripcionImg from "../assets/inscripcion.jpg";

function Inscripcion() {
  const [form, setForm] = useState({
    nombre: "",
    equipo: "",
    telefono: "",
  });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/inscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMensaje(data.message || "Inscripción exitosa");
      setForm({ nombre: "", equipo: "", telefono: "" });
    } catch (err) {
      console.error(err);
      setMensaje("Error al enviar inscripción");
    }
  };

  return (
    <section
      id="inscripcion"
      className="inscripcion"
      style={{ backgroundImage: `url(${inscripcionImg})` }}
    >
      <div>
        <h2>Inscribite al torneo</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="equipo"
            placeholder="Nombre del equipo"
            value={form.equipo}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn">
            Enviar inscripción
          </button>
        </form>
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </section>
  );
}

export default Inscripcion;
