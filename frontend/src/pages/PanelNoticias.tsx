import { useState, useEffect } from "react";
import "../styles/panel.css";

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

    if (noticiaEnEdicion) {
      fetch(`http://localhost:3000/api/noticias/${noticiaEnEdicion}`, {
        method: "PUT",
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          setMensaje(data.message || "Noticia actualizada");
          setTimeout(() => setMensaje(""), 3000);
          limpiarFormulario();
          fetchNoticias();
        })
        .catch(() => setMensaje("Error al actualizar noticia"));
    } else {
      fetch("http://localhost:3000/api/noticias", {
        method: "POST",
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          setMensaje(data.message || "Noticia creada");
          setTimeout(() => setMensaje(""), 3000);
          limpiarFormulario();
          fetchNoticias();
        })
        .catch(() => setMensaje("Error al crear noticia"));
    }
  };

  const eliminarNoticia = (id: number) => {
    const confirmar = window.confirm("¿Seguro que querés eliminar esta noticia?");
    if (!confirmar) return;

    fetch(`http://localhost:3000/api/noticias/${id}`, {
      method: "DELETE",
    })
      .then(() => fetchNoticias())
      .catch(() => {
        setMensaje("Error al eliminar noticia");
        setTimeout(() => setMensaje(""), 3000);
      });
  };

  const cargarNoticiaParaEditar = (n: any) => {
    setTitulo(n.titulo);
    setCopete(n.copete);
    setCuerpo(n.cuerpo);
    setAutor(n.autor);
    setImagen(null); // no cargamos archivo previo, solo si se cambia
    setNoticiaEnEdicion(n.id);
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (!isAdmin) window.location.href = "/admin/login";
    fetchNoticias();
  }, []);

  return (
    <div className="panel-section">
      <h2 className="section-title">{noticiaEnEdicion ? "Editar Noticia" : "Agregar Noticia"}</h2>
      <form className="form" onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Copete"
          value={copete}
          onChange={(e) => setCopete(e.target.value)}
        />
        <textarea
          placeholder="Cuerpo"
          value={cuerpo}
          onChange={(e) => setCuerpo(e.target.value)}
          rows={5}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files?.[0] || null)}
        />
        <input
          type="text"
          placeholder="Autor"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          required
        />
        <button type="submit" className="botonCrear">
          {noticiaEnEdicion ? "Guardar cambios" : "Publicar"}
        </button>
        {noticiaEnEdicion && (
          <button type="button" onClick={limpiarFormulario} className="botonCancelar">
            Cancelar edición
          </button>
        )}
      </form>

      <p className="mensaje">{mensaje}</p>

      <h3 className="section-subtitle">Noticias existentes:</h3>
      <ul className="listado">
        {noticias.map((n: any) => (
          <li key={n.id} className="item">
            <strong>{n.titulo}</strong> - {n.autor} ({new Date(n.fecha_publicacion).toLocaleDateString()})
            {n.imagen_url && (
              <div>
                <img
                  src={`http://localhost:3000${n.imagen_url}`}
                  alt="Imagen noticia"
                  width={100}
                />
              </div>
            )}
            <button className="botonEliminar" onClick={() => eliminarNoticia(n.id)}>Eliminar</button>
            <button className="botonEditar" onClick={() => cargarNoticiaParaEditar(n)}>Editar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PanelNoticias;
