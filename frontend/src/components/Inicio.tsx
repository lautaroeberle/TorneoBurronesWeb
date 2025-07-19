// src/pages/Inicio.tsx
import { Carousel } from "react-responsive-carousel";
import Inscripcion from "../components/Inscripcion";

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
        <div className="beneficio"><span>📸</span><p>cambiar</p></div>
        <div className="beneficio"><span>📊</span><p>cambiar</p></div>
        <div className="beneficio"><span>🎥</span><p>cambiar</p></div>
        <div className="beneficio"><span>⚖️</span><p>cambiar</p></div>
      </section>

      {/* 3. Preview del torneo */}
    
    {/* 4. Inscripción */}
<Inscripcion />

    </div>
  );
};

export default Inicio;