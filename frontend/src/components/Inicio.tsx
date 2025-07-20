// src/pages/Inicio.tsx
import { Carousel } from "react-responsive-carousel";
import Inscripcion from "../components/Inscripcion";
import PublicContactoWhatsapp from "../layouts/PublicContactoWhatsapp";
import tiktokIcon from "../assets/tiktok.png";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/Inicio.css";

const Inicio = () => {


  return (
    <div className="inicio-container">
      {/* 1. Carrusel Hero */}
      <section className="hero-carousel">
        <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
          <div><img src="/assets/hero1.jpg" alt="Hero 1" /></div>
          <div><img src="/assets/hero2.jpg" alt="Hero 2" /></div>
          <div><img src="/assets/hero3.jpg" alt="Hero 3" /></div>
        </Carousel>
      </section>

      {/* 2. Beneficios */}
      <section className="beneficios">
        <div className="beneficio"><span>📸</span><p>Fotografía profesional</p></div>
        <div className="beneficio"><span>⚖️</span><p>Arbitraje local</p></div>
         <div className="beneficio"><span>👨‍⚕️</span><p>Personal médico capacitado</p></div>
        <div className="beneficio"><span>📊</span><p>Tabla de posiciones y resultados online</p></div>
        <div className="beneficio"><span>⏱️</span><p>Minuto a minuto de cada partido online</p></div>
        <div className="beneficio"><span>📰</span><p>Noticias internas online</p></div>
      </section>

      {/* 3. Preview del torneo */}
    
    {/* 4. Inscripción */}
<Inscripcion />
<PublicContactoWhatsapp />

<footer className="footer">
  <div className="footer-content">
    <p>© {new Date().getFullYear()} Torneo de Fútbol Amateur · Todos los derechos reservados</p>
    <div className="footer-links">
      <a
        href="https://wa.me/5491144172243"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        <img src="/icons/whatsapp.svg" alt="WhatsApp" />
      </a>
      <a
        href="https://www.instagram.com/tiba"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
      >
        <img src="/icons/instagram.svg" alt="Instagram" />
      </a>
      <a
        href="https://www.tiktok.com/@tiba"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TikTok"
      >
        <img src={tiktokIcon} alt="TikTok" />
      </a>
    </div>
  </div>
</footer>

    </div>
  );
};

export default Inicio;