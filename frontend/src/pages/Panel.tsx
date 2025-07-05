import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Torneos from "./Torneos";
import EquipoNuevo from "./EquipoNuevo";
import EditarEquipos from "./EditarEquipos";
import CargarPartido from "./CargarPartido";
import EditarPartido from "./EditarPartido";
import "../styles/panel.css";

function Panel() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (!isAdmin) navigate("/admin/login");
  }, [navigate]);

  return (
    <div className="admin-panel">
      <header>
        <h1>Panel de Administración</h1>
      </header>
      <main>
        <section className="panel-section"><Torneos /></section>
        <section className="panel-section"><EquipoNuevo /></section>
        <section className="panel-section"><EditarEquipos /></section>
        <section className="panel-section"><CargarPartido /></section>
        <section className="panel-section"><EditarPartido /></section>
      </main>
    </div>
  );
}

export default Panel;
