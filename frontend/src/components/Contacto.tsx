function Contacto() {
  const mensaje = encodeURIComponent('¡Hola! Quiero más info sobre el torneo.');
  const link = `https://wa.me/5491132263988?text=${mensaje}`;

  return (
    <section id = "contacto">
      <h2>Contacto</h2>
      <p>Si tenés dudas o querés más info, escribinos por WhatsApp:</p>
      <a href={link} target="_blank">
        <button>Enviar mensaje</button>
      </a>
    </section>
  );
}

export default Contacto;
