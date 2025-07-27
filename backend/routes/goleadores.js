// routes/goleadores.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/goleadores?nombre=Copa de Verano
router.get("/", (req, res) => {
  const { nombre } = req.query;
  if (!nombre) return res.status(400).json({ error: "Falta el nombre del torneo" });

  const query = `
    SELECT 
      j.id AS jugador_id,
      j.nombre,
      j.apellido,
      j.equipo_id,
      e.nombre AS equipo,
      e.imagen AS imagen,
      COUNT(*) AS goles
    FROM estadisticas_partido ep
    JOIN jugadores j ON ep.jugador_id = j.id
    JOIN equipos e ON j.equipo_id = e.id
    JOIN torneos t ON e.torneo_id = t.id
    WHERE ep.tipo = 'gol'
      AND (ep.tipo_gol IS NULL OR ep.tipo_gol != 'en_contra')
      AND t.nombre = ?
    GROUP BY j.id
    ORDER BY goles DESC, j.apellido ASC
    LIMIT 20
  `;

  db.query(query, [nombre], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
