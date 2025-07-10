import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/NoticiasPage.css";

type Noticia = {
  id: number;
  titulo: string;
  copete: string;
  cuerpo: string;
  autor: string;
  imagen_url: string;
  fecha_publicacion: string;
};

function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/noticias")
      .then(res => res.json())
      .then(data => setNoticias(data))
      .catch(err => console.error("Error al cargar noticias:", err));
  }, []);

  if (noticias.length === 0) return <p>Cargando noticias...</p>;

  const noticiaDestacada = noticias[0];
  const noticiasRestantes = noticias.slice(1);

  return (
    <div className="noticias-page-container" style={{ paddingTop: "80px" }}>
      <h1 className="titulo-seccion">Noticias</h1>

      <section className="noticia-destacada">
        <Link to={`/noticias/${noticiaDestacada.id}`} className="link-noticia">
          <img
            src={`http://localhost:3000${noticiaDestacada.imagen_url}`}
            alt={noticiaDestacada.titulo}
            className="imagen-destacada"
          />
          <div className="contenido-destacada">
            <h2>{noticiaDestacada.titulo}</h2>
            <p className="copete">{noticiaDestacada.copete}</p>
            <p className="fecha-autor">
              {new Date(noticiaDestacada.fecha_publicacion).toLocaleDateString()} — Por {noticiaDestacada.autor}
            </p>
          </div>
        </Link>
      </section>

      <section className="noticias-lista">
        {noticiasRestantes.map(n => (
          <Link to={`/noticias/${n.id}`} key={n.id} className="noticia-card link-noticia">
            <img src={`http://localhost:3000${n.imagen_url}`} alt={n.titulo} className="imagen-noticia" />
            <div className="contenido-noticia">
              <h3>{n.titulo}</h3>
              <p className="copete">{n.copete}</p>
              <p className="fecha-autor">
                {new Date(n.fecha_publicacion).toLocaleDateString()} — Por {n.autor}
              </p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default NoticiasPage;
