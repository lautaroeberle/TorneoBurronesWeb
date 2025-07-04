import { Link } from "react-router-dom";
import NavLinkHero from "./NavLinkHero";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><NavLinkHero to="inicio">Inicio</NavLinkHero></li>
        <li><NavLinkHero to="beneficios">Beneficios</NavLinkHero></li>
        <li><NavLinkHero to="sedes">Sedes</NavLinkHero></li>
        <li><NavLinkHero to="inscripcion">Inscripción</NavLinkHero></li>
        <li><NavLinkHero to="contacto">Contacto</NavLinkHero></li>
        <li><Link to="/reglamento">Reglamento</Link></li>


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
