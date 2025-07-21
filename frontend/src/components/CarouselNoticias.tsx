import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/CarouselNoticias.css";

type Noticia = {
  id: number;
  titulo: string;
  copete: string;
  imagen_url: string;
};

const CarouselNoticias = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/noticias?publicadas=true")
      .then((res) => res.json())
      .then((data) => setNoticias(data.slice(0, 5)))
      .catch((err) => console.error("Error al cargar noticias:", err));
  }, []);

  return (
    <div className="carousel-noticias">
      <h3>Últimas Noticias</h3>
      {noticias.length > 0 && (
        <Carousel
  autoPlay
  infiniteLoop
  showThumbs={false}
  showStatus={false}
  showIndicators={true}
  interval={6000}
  swipeable={false}
  emulateTouch={false}
  renderArrowPrev={(onClickHandler, hasPrev, label) =>
    hasPrev && (
      <button className="carousel-arrow left" onClick={onClickHandler} title={label}>
        ‹
      </button>
    )
  }
  renderArrowNext={(onClickHandler, hasNext, label) =>
    hasNext && (
      <button className="carousel-arrow right" onClick={onClickHandler} title={label}>
        ›
      </button>
    )
  }
>

          {noticias.map((n) => (
            <div
              key={n.id}
              className="noticia-slide"
              onClick={() => navigate(`/noticias/${n.id}`)}
            >
              <img src={`http://localhost:3000${n.imagen_url}`} alt={n.titulo} />
              <div className="texto-slide-destacado">
                <h4>{n.titulo}</h4>
                <p>{n.copete}</p>
              </div>
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default CarouselNoticias;
