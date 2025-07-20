import PublicContactoWhatsapp from "../layouts/PublicContactoWhatsapp";

const ReglamentoPage = () => {
  return (
    <div className="reglamento-page">
      
        <h1>Reglamento del Torneo (hacerlo)<br /><br /></h1> 
        
      <section className="descarga-container">
        <a href="/documentos/reglamento.pdf" download className="boton-descarga">
          📄 Descargar Reglamento en PDF
        </a>
      </section>

      {/* Componente flotante de WhatsApp */}
      <PublicContactoWhatsapp />
    </div>
  );
};

export default ReglamentoPage;
