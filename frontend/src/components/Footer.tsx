import tiktokIcon from "../assets/tiktok.png";
import whatsappIcon from "../assets/wpp.png";
import instagramIcon from "../assets/instagram.jpeg";


const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          © {year} Torneo de Fútbol Amateur · Todos los derechos reservados
        </p>
        <div className="social-icons">
          <a
            href="https://wa.me/5491144172243"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <img src={whatsappIcon} alt="WhatsApp" />
          </a>
          <a
            href="https://www.instagram.com/tiba"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <img src={instagramIcon} alt="Instagram" />
          </a>
          <a
            href="https://www.tiktok.com/@tiba"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <img src={tiktokIcon} alt="TikTok" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
