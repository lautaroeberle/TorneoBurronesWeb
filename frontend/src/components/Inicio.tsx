// src/pages/Inicio.tsx
import { Carousel } from "react-responsive-carousel";
import Inscripcion from "../components/Inscripcion";
import PublicContactoWhatsapp from "../layouts/PublicContactoWhatsapp";
import Footer from "./Footer";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/Inicio.css";
import Beneficios from "./Beneficios";


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

    <Beneficios/>
<Inscripcion />
<PublicContactoWhatsapp />
<Footer/>

    </div>
  );
};

export default Inicio;