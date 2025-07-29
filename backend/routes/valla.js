const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/valla?nombre=Copa de Verano
router.get("/", (req, res) => {
  const { nombre } = req.query;

  if (!nombre) {
    return res.status(400).json({ error: "Falta el nombre del torneo" });
  }

  const torneoQuery = `
    SELECT id FROM torneos WHERE nombre = ? LIMIT 1
  `;

  db.query(torneoQuery, [nombre], (err, torneoResult) => {
    if (err) {
      console.error("Error al obtener torneo:", err);
      return res.status(500).json({ error: "Error al obtener torneo" });
    }

    if (torneoResult.length === 0) {
      return res.status(404).json({ error: "Torneo no encontrado" });
    }

    const torneoId = torneoResult[0].id;

    const vallaQuery = `
      SELECT 
        e.id AS equipo_id,
        e.nombre AS equipo,
        e.imagen,
        p.pj,
        p.gc,
        ROUND(p.gc / p.pj, 2) AS promedio_gc
      FROM posiciones p
      JOIN equipos e ON p.equipo_id = e.id
      WHERE p.torneo_id = ? AND p.pj > 0
      ORDER BY promedio_gc ASC, p.gc ASC, p.pj DESC
    `;

    db.query(vallaQuery, [torneoId], (err2, result) => {
      if (err2) {
        console.error("Error al obtener valla menos vencida:", err2);
        return res.status(500).json({ error: "Error al obtener valla menos vencida" });
      }

      res.json(result);
    });
  });
});

module.exports = router;
