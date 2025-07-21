import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavLinkHero from "./NavLinkHero";
import { FaInstagram} from "react-icons/fa";
import "../styles/navbar.css";
import LOGO from "../assets/logo.png";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setIsVisible(false); // hacia abajo
    } else {
      setIsVisible(true); // hacia arriba
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`navbar ${!isVisible ? "navbar-hidden" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <img src={LOGO} alt="Logo TIBA" className="logo-img" />
            <span className="tiba-text">TIBA</span>
          </Link>
        </div>

        <ul className="navbar-menu">
          <li><NavLinkHero to="inscripcion">Inscripción</NavLinkHero></li>
          <li><Link to="/reglamento">Reglamento</Link></li>
          <li><Link to="/noticias">Noticias</Link></li>
          <li className="dropdown">
            <span>Torneos ▾</span>
            <ul className="dropdown-menu">
              <li><Link to="/copa">Copa</Link></li>
              <li><Link to="/apertura">Apertura</Link></li>
            </ul>
          </li>
        </ul>

        <div className="navbar-right">
          <a
            href="https://wa.me/5491141723184"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-text"
            title="WhatsApp"
          >
            +5491141723182
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-button"
            title="Instagram"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
