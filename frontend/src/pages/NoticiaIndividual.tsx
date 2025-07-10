import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/NoticiaIndividual.css";

type Noticia = {
  id: number;
  titulo: string;
  copete: string;
  cuerpo: string;
  autor: string;
  imagen_url: string;
  fecha_publicacion: string;
};

function NoticiaIndividual() {
  const { id } = useParams<{ id: string }>();
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/api/noticias/${id}`)
      .then(res => res.json())
      .then(data => setNoticia(data))
      .catch(err => console.error("Error al cargar noticia:", err));
  }, [id]);

  if (!noticia) return <p>Cargando noticia...</p>;

  return (
    <div id="noticia" className="recuadro-blanco">
      <div className="contenedor-atras" onClick={() => navigate(-1)}>
        <span>&#8592; Atrás</span>
      </div>

      <h1>{noticia.titulo}</h1>
      <h2>{noticia.copete}</h2>

      <a id="enlace-autor">
       
        <h4>Por <span>{noticia.autor}</span></h4>
      </a>

      <div id="fechas">
        <span className="fecha">
          Publicado: {new Date(noticia.fecha_publicacion).toLocaleDateString()}
        </span>
      </div>

      <img
        id="imagen-noticia"
        src={`http://localhost:3000${noticia.imagen_url}`}
        alt="Imagen de la noticia"
      />

      <div id="cuerpo-noticia">{noticia.cuerpo}</div>
    </div>
  );
}

export default NoticiaIndividual;
