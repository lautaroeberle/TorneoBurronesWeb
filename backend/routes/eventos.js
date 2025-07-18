const express = require('express');
const router = express.Router();
const db = require('../db');

// GET: obtener eventos de un partido
router.get('/:partidoId', (req, res) => {
  const { partidoId } = req.params;

  const query = `
    SELECT ep.id, ep.jugador_id, ep.tipo, ep.minuto, ep.tipo_gol,
           j.nombre AS jugador_nombre, j.apellido AS jugador_apellido,
           e.nombre AS equipo_nombre
    FROM estadisticas_partido ep
    JOIN jugadores j ON ep.jugador_id = j.id
    JOIN equipos e ON j.equipo_id = e.id
    WHERE ep.partido_id = ?
    ORDER BY ep.minuto ASC
  `;

  db.query(query, [partidoId], (err, results) => {
    if (err) {
      console.error('Error al obtener eventos:', err);
      return res.status(500).json({ error: 'Error al obtener eventos del partido' });
    }
    res.json(results);
  });
});

module.exports = router;
