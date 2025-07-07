const express = require('express');
const router = express.Router();
const db = require('../db');


router.get("/torneo", async (req, res) => {
  const { nombre } = req.query;
  const query = `
    SELECT ep.partido_id, ep.jugador_id, ep.tipo, ep.tipo_gol, ep.minuto,
           j.nombre AS nombre, j.apellido AS apellido, e.nombre AS equipo
    FROM estadisticas_partido ep
    JOIN jugadores j ON ep.jugador_id = j.id
    JOIN equipos e ON j.equipo_id = e.id
    JOIN partidos p ON ep.partido_id = p.id
    JOIN torneos t ON p.torneo_id = t.id
    WHERE t.nombre = ?
    ORDER BY ep.partido_id, ep.minuto
  `;
  try {
    const [rows] = await db.promise().query(query, [nombre]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});


module.exports = router;
