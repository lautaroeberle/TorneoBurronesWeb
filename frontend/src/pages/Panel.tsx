import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Torneos from "./Torneos";
import EquipoNuevo from "./EquipoNuevo";
import EditarEquipos from "./EditarEquipos";

function Panel() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (!isAdmin) navigate("/admin/login");
  }, [navigate]);

  return (
    <div className="panel">
      <h1>Panel de Administración</h1>
      <p>Desde aquí vas a poder cargar torneos, equipos y jugadores.</p>
       <Torneos />
       <EquipoNuevo />
        <EditarEquipos />
    </div>
  );
}

export default Panel;
