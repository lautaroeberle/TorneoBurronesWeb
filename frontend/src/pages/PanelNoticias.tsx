import { useState, useEffect } from "react";
import "../styles/PanelNoticias.css";

function PanelNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [copete, setCopete] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [autor, setAutor] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [noticiaEnEdicion, setNoticiaEnEdicion] = useState<number | null>(null);

  const fetchNoticias = () => {
    fetch("http://localhost:3000/api/noticias")
      .then(res => res.json())
      .then(data => setNoticias(data));
  };

  const limpiarFormulario = () => {
    setTitulo("");
    setCopete("");
    setCuerpo("");
    setImagen(null);
    setAutor("");
    setNoticiaEnEdicion(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("copete", copete);
    formData.append("cuerpo", cuerpo);
    formData.append("autor", autor);
    if (imagen) formData.append("imagen", imagen);

    const url = noticiaEnEdicion
      ? `http://localhost:3000/api/noticias/${noticiaEnEdicion}`
      : "http://localhost:3000/api/noticias";

    const method = noticiaEnEdicion ? "PUT" : "POST";

    fetch(url, { method, body: formData })
      .then(res => res.json())
      .then(data => {
        setMensaje(data.message || (noticiaEnEdicion ? "Noticia actualizada" : "Noticia creada"));
        setTimeout(() => setMensaje(""), 3000);
        limpiarFormulario();
        fetchNoticias();
      })
      .catch(() => setMensaje("Error al procesar la noticia"));
  };

  const eliminarNoticia = (id: number) => {
    const confirmar = window.confirm("¿Seguro que querés eliminar esta noticia?");
    if (!confirmar) return;

    fetch(`http://localhost:3000/api/noticias/${id}`, { method: "DELETE" })
      .then(() => fetchNoticias())
      .catch(() => {
        setMensaje("Error al eliminar noticia");
        setTimeout(() => setMensaje(""), 3000);
      });
  };
  const alternarPublicacion = (id: number) => {
  fetch(`http://localhost:3000/api/noticias/publicar/${id}`, {
    method: "PUT"
  })
    .then(() => fetchNoticias())
    .catch(() => {
      setMensaje("Error al cambiar estado");
      setTimeout(() => setMensaje(""), 3000);
    });
};


  const cargarNoticiaParaEditar = (n: any) => {
    setTitulo(n.titulo);
    setCopete(n.copete);
    setCuerpo(n.cuerpo);
    setAutor(n.autor);
    setImagen(null);
    setNoticiaEnEdicion(n.id);
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (!isAdmin) window.location.href = "/admin/login";
    fetchNoticias();
  }, []);

  return (
    <div className="panel-noticias-container">
      <h2>{noticiaEnEdicion ? "Editar Noticia" : "Agregar Noticia"}</h2>

      <form className="noticia-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required />
        <input type="text" placeholder="Copete" value={copete} onChange={e => setCopete(e.target.value)} />
        <textarea placeholder="Cuerpo" value={cuerpo} onChange={e => setCuerpo(e.target.value)} rows={6} required />
        <input type="file" accept="image/*" onChange={e => setImagen(e.target.files?.[0] || null)} />
        <input type="text" placeholder="Autor" value={autor} onChange={e => setAutor(e.target.value)} required />

        <div className="botones-formulario">
          <button type="submit" className="btn-primary">
            {noticiaEnEdicion ? "Guardar cambios" : "Publicar"}
          </button>
          {noticiaEnEdicion && (
            <button type="button" onClick={limpiarFormulario} className="btn-secondary">
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      <h3>Noticias existentes</h3>
      <div className="noticias-grid">
        {noticias.map((n: any) => (
          <div key={n.id} className="noticia-item">
            <img src={`http://localhost:3000${n.imagen_url}`} alt={n.titulo} />
            <div className="info">
              <h4>{n.titulo}</h4>
              <p>{n.autor} — {new Date(n.fecha_publicacion).toLocaleDateString()}</p>
              <div className="acciones">
                <button className="btn-editar" onClick={() => cargarNoticiaParaEditar(n)}>Editar</button>
                <button className="btn-eliminar" onClick={() => eliminarNoticia(n.id)}>Eliminar</button>
                <button className={`btn-toggle ${n.publicada ? "publica" : "privada"}`} onClick={() => alternarPublicacion(n.id)}>{n.publicada ? "Pública" : "Privada"}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PanelNoticias;
