import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TablaPosicionesResumida.css";

type Posicion = {
  equipo_id: number;
  equipo: string;
  imagen: string;
  pj: number;
  puntos: number;
};

const TablaPosicionesResumida = () => {
  const [posiciones, setPosiciones] = useState<Posicion[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/posiciones?nombre=Copa de Verano")
      .then((res) => res.json())
      .then((data) => setPosiciones(data))
      .catch((err) => console.error("Error al cargar posiciones:", err));
  }, []);

  return (
    <div className="tabla-resumida">
      <h3>Posiciones - Copa de Verano</h3>
      <table>
        <thead>
          <tr>
            <th>Equipo</th>
            <th>PJ</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {posiciones.map((pos) => (
            <tr key={pos.equipo_id} onClick={() => navigate(`/equipos/${pos.equipo_id}`)}>
             <td className="tp-equipo">
  <img
    src={`http://localhost:3000/uploads/${pos.imagen}`}
    alt={pos.equipo}
    className="logo-equipo"
  />
  <span>{pos.equipo}</span>
</td>

              <td>{pos.pj}</td>
              <td>{pos.puntos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaPosicionesResumida;
