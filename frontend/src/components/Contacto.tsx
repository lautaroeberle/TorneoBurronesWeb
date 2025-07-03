import contactoImg from "../assets/contacto.jpg";

const Contacto = () => (
  <section id="contacto" className="contacto" style={{ backgroundImage: `url(${contactoImg})` }}>
    <div>
      <h2>Contacto</h2>
      <p>¿Dudas o consultas? Escribinos directamente por WhatsApp.</p>
      <a href="https://wa.me/5491132263988" target="_blank" rel="noopener noreferrer">
        <button className="btn">Contactar por WhatsApp</button>
      </a>
    </div>
  </section>
);

export default Contacto;
