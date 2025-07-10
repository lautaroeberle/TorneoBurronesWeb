import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavLinkHero from "./NavLinkHero";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setIsVisible(false); // scrolleando hacia abajo
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
      <ul>
        <li><NavLinkHero to="inicio">Inicio</NavLinkHero></li>
        <li><NavLinkHero to="beneficios">Beneficios</NavLinkHero></li>
        <li><NavLinkHero to="sedes">Sedes</NavLinkHero></li>
        <li><NavLinkHero to="inscripcion">Inscripción</NavLinkHero></li>
        <li><NavLinkHero to="contacto">Contacto</NavLinkHero></li>
        <li><Link to="/reglamento">Reglamento</Link></li>
        <li><Link to = "/noticias">Periodismo</Link>"</li>
        <li className="dropdown">
          <span>Torneos ▾</span>
          <ul className="dropdown-menu">
            <li><Link to="/copa">Copa</Link></li>
            <li><Link to="/apertura">Apertura</Link></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
