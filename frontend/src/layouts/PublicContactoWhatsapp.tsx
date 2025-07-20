import whatsappIcon from "../assets/wpp.png";
import "../styles/ContactoWhatsapp.css";

export default function PublicContactoWhatsapp() {
  return (
    <a
      href="https://wa.me/5491144172243"
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={whatsappIcon} alt="WhatsApp" />


    </a>
  );
}
