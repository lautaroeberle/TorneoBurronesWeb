const express = require('express');
const router = express.Router();
const db = require('../db');

// obtiene estadisticas (solo para mostrarlas)
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
// obtiene estadísticas de un partido puntual
router.get("/partido/:id", async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT jugador_id, tipo, tipo_gol, minuto
    FROM estadisticas_partido
    WHERE partido_id = ?
    ORDER BY minuto ASC
  `;
  try {
    const [rows] = await db.promise().query(query, [id]);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener estadísticas del partido:", error);
    res.status(500).json({ error: 'Error al obtener estadísticas del partido' });
  }
});

// Eliminar una estadística individual por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM estadisticas_partido WHERE id = ?";
  try {
    const [result] = await db.promise().query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    res.status(500).json({ error: "Error al eliminar evento" });
  }
});

// GET /api/estadisticas/partido/:id/detalle
router.get("/partido/:id/detalle", async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT ep.id, ep.partido_id, ep.jugador_id, ep.tipo, ep.tipo_gol, ep.minuto,
           j.nombre AS jugador_nombre, j.apellido AS jugador_apellido,
           e.nombre AS equipo_nombre
    FROM estadisticas_partido ep
    JOIN jugadores j ON ep.jugador_id = j.id
    JOIN equipos e ON j.equipo_id = e.id
    WHERE ep.partido_id = ?
    ORDER BY ep.minuto ASC
  `;
  try {
    const [rows] = await db.promise().query(query, [id]);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener estadísticas detalladas del partido:", error);
    res.status(500).json({ error: "Error al obtener estadísticas detalladas del partido" });
  }
});


module.exports = router;
