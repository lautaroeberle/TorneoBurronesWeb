
import { useEffect, useState } from "react";
import "../styles/panel.css";

function GenerarFixture() {
  const [torneos, setTorneos] = useState([]);
  const [form, setForm] = useState({
    torneo_id: '',
    tipo: 'todos' // 'todos' o 'grupos_eliminacion'
  });
  const [mensaje, setMensaje] = useState('');

  // Cargar torneos al iniciar
  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/torneos");
        const data = await res.json();
        setTorneos(data);
      } catch (err) {
        console.error("Error al cargar torneos:", err);
      }
    };
    fetchTorneos();
  }, []);

  // Manejar cambios del formulario
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enviar generación del fixture
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.torneo_id) {
      setMensaje("Seleccioná un torneo");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/fixture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          torneoId: form.torneo_id,
          tipo: form.tipo
        })
      });

      const data = await res.json();
      setMensaje(data.mensaje || data.error || "Resultado desconocido");
      setTimeout(() => setMensaje(""), 3000);
    } catch (err) {
      console.error("Error al generar fixture:", err);
      setMensaje("Error al generar fixture");
    }
  };

  return (
    <div className="panel-section">
      <h2 className="section-title">Generar Fixture</h2>
      <form className="form" onSubmit={handleSubmit}>
        <select className="select" name="torneo_id" value={form.torneo_id} onChange={handleChange} required>
          <option value="">Seleccionar Torneo</option>
          {torneos.map((t: any) => (
            <option key={t.id} value={t.id}>{t.nombre} {t.año}</option>
          ))}
        </select>

        <select className="select" name="tipo" value={form.tipo} onChange={handleChange} required>
          <option value="todos">Todos contra todos</option>
         
            <option value="ida_vuelta">Todos contra todos ida y vuelta</option>
        </select>
          
        <button type="submit" className="botonGuardar">Generar Fixture</button>
      </form>

      <p className="mensaje">{mensaje}</p>
    </div>
  );
}

export default GenerarFixture;
