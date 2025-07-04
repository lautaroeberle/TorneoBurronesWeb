import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Torneos from "./Torneos";
import EquipoNuevo from "./EquipoNuevo";
import EditarEquipos from "./EditarEquipos";
import CargarPartido from "./CargarPartido";
import EditarPartido from "./EditarPartido";

function Panel() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (!isAdmin) navigate("/admin/login");
  }, [navigate]);

  return (
    <div className="panel">
      <h1>Panel de Administración</h1>
      
       <Torneos />
       <EquipoNuevo />
        <EditarEquipos />
        <CargarPartido />
        <EditarPartido />

    </div>
  );
}

export default Panel;
