import { useState, useEffect } from "react";

const prefijos = [
  { code: "+54", label: "Argentina (+54)" },
  { code: "+1", label: "USA (+1)" },
  { code: "+34", label: "España (+34)" },
  { code: "+44", label: "Reino Unido (+44)" },
];

const Inscripcion = () => {
  const [form, setForm] = useState({
    nombre: "",
    equipo: "",
    prefijo: "+54",
    telefono: "",
    email: "",
    mensaje: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Validación en tiempo real solo para el teléfono
    if (name === "telefono") {
      // Aceptar solo números
      const soloNumeros = value.replace(/\D/g, "");
      setForm({ ...form, [name]: soloNumeros });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setMensaje("");
    setError("");

    // Validación de campos requeridos
    if (!form.nombre || !form.equipo || !form.telefono || !form.email) {
      setError("Todos los campos deben estar completos (excepto el mensaje)");
      setEnviando(false);
      return;
    }

    // Validación de email
    if (!form.email.includes("@")) {
      setError("El correo electrónico debe contener '@'");
      setEnviando(false);
      return;
    }

    // Validación del teléfono: solo números y longitud aceptable
    if (!/^[0-9]{6,15}$/.test(form.telefono)) {
      setError("El teléfono debe contener solo números (entre 6 y 15 dígitos)");
      setEnviando(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/inscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al enviar inscripción");
      } else {
        setMensaje(data.message || "Inscripción exitosa");
        setForm({
          nombre: "",
          equipo: "",
          prefijo: "+54",
          telefono: "",
          email: "",
          mensaje: "",
        });
      }
    } catch (err) {
      console.error(err);
      setError("Error al enviar inscripción");
    } finally {
      setEnviando(false);
    }
  };

  useEffect(() => {
    if (mensaje || error) {
      const timer = setTimeout(() => {
        setMensaje("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje, error]);

  return (
    <section id="inscripcion" className="inscripcion">
      <div className="inscripcion-contenido">
        <h2>Inscribite al torneo</h2>
        <form onSubmit={handleSubmit} className="form-inscripcion" noValidate>
          <input
            type="text"
            name="nombre"
            placeholder="Tu nombre completo"
            value={form.nombre}
            onChange={handleChange}
            required
            autoComplete="name"
          />

          <input
            type="text"
            name="equipo"
            placeholder="Nombre del equipo"
            value={form.equipo}
            onChange={handleChange}
            required
            autoComplete="organization"
          />

          <div className="telefono-grupo">
            <select name="prefijo" value={form.prefijo} onChange={handleChange} required>
              {prefijos.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.label}
                </option>
              ))}
            </select>
            <input
              type="tel"
              name="telefono"
              placeholder="Número de teléfono"
              value={form.telefono}
              onChange={handleChange}
              required
              pattern="^[0-9]{6,15}$"
              title="Solo se permiten números (sin espacios ni guiones)"
              autoComplete="tel"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          <textarea
            name="mensaje"
            placeholder="Mensaje adicional (opcional)"
            value={form.mensaje}
            onChange={handleChange}
            rows={3}
          />

          <button type="submit" className="btn" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar inscripción"}
          </button>
        </form>
        {mensaje && <p className="mensaje">{mensaje}</p>}
        {error && <p className="mensaje error">{error}</p>}
      </div>
    </section>
  );
};

export default Inscripcion;
