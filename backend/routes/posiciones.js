// routes/posiciones.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/posiciones?nombre=Copa de Verano
router.get('/', (req, res) => {
  const { nombre } = req.query;

  if (!nombre) return res.status(400).json({ error: 'Falta el nombre del torneo' });

  const query = `
    SELECT pos.*, e.nombre AS equipo, e.imagen
    FROM posiciones pos
    JOIN equipos e ON pos.equipo_id = e.id
    JOIN torneos t ON pos.torneo_id = t.id
    WHERE t.nombre = ?
    ORDER BY puntos DESC, gf - gc DESC, gf DESC
  `;

  db.query(query, [nombre], (err, rows) => {
    if (err) {
      console.error('Error al obtener posiciones:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(rows);
  });
});

module.exports = router;
