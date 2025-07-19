const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/jugadores/:id
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT j.*, e.nombre AS nombre_equipo, e.id AS equipo_id, e.imagen AS imagen_equipo
    FROM jugadores j
    JOIN equipos e ON j.equipo_id = e.id
    WHERE j.id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener jugador:", err);
      return res.status(500).send("Error al obtener el jugador");
    }

    if (results.length === 0) {
      return res.status(404).send("Jugador no encontrado");
    }

    res.json(results[0]);
  });
});

module.exports = router;
