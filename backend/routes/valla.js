const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  const { nombre } = req.query;
  if (!nombre) return res.status(400).json({ error: "Falta el nombre del torneo" });

  const query = `
    SELECT
      e.id AS equipo_id,
      e.nombre AS equipo,
      e.imagen AS imagen,
      COUNT(p.id) AS partidos,
      SUM(
        CASE WHEN p.equipo_local_id = e.id THEN p.goles_local_else_else END
        WHEN p.equipo_local_id = e.id THEN p.goles_visitante
        WHEN p.equipo_visitante_id = e.id THEN p.goles_local
        ELSE 0 END
      ) AS goles_encajados
    FROM equipos e
    JOIN torneos t ON e.torneo_id = t.id
    LEFT JOIN partidos p ON t.id = p.torneo_id AND p.jugado = 1 AND (p.equipo_local_id = e.id OR p.equipo_visitante_id = e.id)
    WHERE t.nombre = ?
    GROUP BY e.id
    HAVING partidos > 0
    ORDER BY (goles_encajados / partidos) ASC
    LIMIT 10
  `;

  db.query(query, [nombre], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const result = rows.map(r => ({
      equipo_id: r.equipo_id,
      equipo: r.equipo,
      imagen: r.imagen,
      partidos: r.partidos,
      goles_encajados: r.goles_encajados,
      promedio: parseFloat((r.goles_encajados / r.partidos).toFixed(2))
    }));
    res.json(result);
  });
});

module.exports = router;
