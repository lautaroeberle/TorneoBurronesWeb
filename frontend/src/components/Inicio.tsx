import { Carousel } from "react-responsive-carousel";
import Inscripcion from "../components/Inscripcion";
import PublicContactoWhatsapp from "../layouts/PublicContactoWhatsapp";
import Footer from "./Footer";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/Inicio.css";
import Beneficios from "./Beneficios";
import ResumenFixture from "../components/ResumenFixture";
import CarouselNoticias from "../components/CarouselNoticias";
import TablaPosicionesResumida from "../components/TablaPosicionesResumida";

const Inicio = () => {
  return (
    <div className="inicio-container">
      {/* 1. Hero Carousel */}
      <section className="hero-carousel">
       <Carousel
  autoPlay
  infiniteLoop
  showThumbs={false}
  showStatus={false}
  swipeable={false}
  emulateTouch={false}
  showIndicators={false}
  renderArrowPrev={(onClickHandler, hasPrev, label) =>
    hasPrev && (
      <button className="hero-carousel-arrow left" onClick={onClickHandler} title={label}>
        ‹
      </button>
    )
  }
  renderArrowNext={(onClickHandler, hasNext, label) =>
    hasNext && (
      <button className="hero-carousel-arrow right" onClick={onClickHandler} title={label}>
        ›
      </button>
    )
  }
>
  <div><img src="/assets/hero1.jpg" alt="Hero 1" /></div>
  <div><img src="/assets/hero2.jpg" alt="Hero 2" /></div>
  <div><img src="/assets/hero3.jpg" alt="Hero 3" /></div>
</Carousel>

      </section>

      {/* 2. Beneficios */}
      <Beneficios />

      {/* 3. Bloque informativo central */}
      <section className="bloque-torneo-resumen">
        <div className="bloque-izquierda">
          <ResumenFixture />
          <CarouselNoticias />
        </div>
        <div className="bloque-derecha">
          <TablaPosicionesResumida />
        </div>
      </section>

      {/* 4. Inscripción + Footer */}
      <Inscripcion />
      <PublicContactoWhatsapp />
      <Footer />
    </div>
  );
};

export default Inicio;
