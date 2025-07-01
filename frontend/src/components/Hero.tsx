import "../styles/global.css";
import inicioImg from "../assets/inicio.jpg";
import beneficiosImg from "../assets/beneficios.jpg";
import sedesImg from "../assets/sedes.jpg";
import inscripcionImg from "../assets/inscripcion.jpg";
import contactoImg from "../assets/contacto.jpg";


function Hero() {
  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <ul>
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#beneficios">Beneficios</a></li>
          <li><a href="#sedes">Sedes</a></li>
          <li><a href="#inscripcion">Inscripción</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
      </nav>

      {/* Sección INICIO */}
      <section id="inicio" className="inicio" style={{ backgroundImage: `url(${inicioImg})` }}>
        <div id ="titulo">
          <h1>Torneo de Fútbol 5 y 8</h1>
          <p>Jugá con tu equipo en las mejores canchas de Buenos Aires</p>
          <a href="#inscripcion">
            <button className="btn">Inscribirse ahora</button>
          </a>
        </div>
      </section>

      {/* Sección BENEFICIOS */}
      <section id="beneficios" className="beneficios" style={{ backgroundImage: `url(${beneficiosImg})` }}>
        <div>
          <h2>Beneficios</h2>
          <ul>
            <li>Árbitros profesionales</li>
            <li>Premios por etapa</li>
            <li>Hidratación y cobertura médica</li>
          </ul>
        </div>
      </section>

      {/* Sección SEDES */}
      <section id="sedes" className="sedes" style={{ backgroundImage: `url(${sedesImg})` }}>
        <div>
          <h2>Sedes</h2>
          <p>Jugamos en canchas de primera categoría ubicadas en CABA y GBA Norte.</p>
        </div>
      </section>

      {/* Sección INSCRIPCIÓN */}
      <section id="inscripcion" className="inscripcion" style={{ backgroundImage: `url(${inscripcionImg})` }}>
        <div>
          <h2>Formulario de Inscripción</h2>
          <form method="POST" action="http://localhost:3000/api/inscripcion">
            <input type="text" name="nombre" placeholder="Nombre del jugador" required />
            <input type="text" name="equipo" placeholder="Nombre del equipo" required />
            <input type="text" name="telefono" placeholder="Teléfono de contacto" required />
            <button type="submit" className="btn">Enviar</button>
          </form>
        </div>
      </section>

      {/* Sección CONTACTO */}
      <section id="contacto" className="contacto" style={{ backgroundImage: `url(${contactoImg})` }}>
        <div>
          <h2>Contacto</h2>
          <p>¿Dudas o consultas? Escribinos directamente por WhatsApp.</p>
          <a href="https://wa.me/5491122334455" target="_blank">
            <button className="btn">Contactar por WhatsApp</button>
          </a>
        </div>
      </section>
    </>
  );
}

export default Hero;
