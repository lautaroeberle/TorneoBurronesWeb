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


// Recalcular tabla de posiciones desde cero
router.post('/recalcular', async (req, res) => {
  const { nombre } = req.query;

  if (!nombre) return res.status(400).json({ error: 'Falta el nombre del torneo' });

  try {
    // Obtener ID del torneo
    const [[torneo]] = await db.promise().query(
      `SELECT id FROM torneos WHERE nombre = ?`,
      [nombre]
    );
    const torneoId = torneo?.id;
    if (!torneoId) return res.status(404).json({ error: 'Torneo no encontrado' });

    // Borrar posiciones anteriores de ese torneo
    await db.promise().query(
      `DELETE FROM posiciones WHERE torneo_id = ?`,
      [torneoId]
    );

    // Obtener todos los partidos jugados del torneo
    const [partidos] = await db.promise().query(
      `SELECT * FROM partidos WHERE torneo_id = ? AND jugado = 1`,
      [torneoId]
    );

    const acumuladas = {};

    for (const p of partidos) {
      const { equipo_local_id, equipo_visitante_id, goles_local, goles_visitante } = p;

      const procesar = (equipoId, gf, gc) => {
        if (!acumuladas[equipoId]) {
          acumuladas[equipoId] = { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, puntos: 0 };
        }

        acumuladas[equipoId].pj += 1;
        acumuladas[equipoId].gf += gf;
        acumuladas[equipoId].gc += gc;

        if (gf > gc) {
          acumuladas[equipoId].pg += 1;
          acumuladas[equipoId].puntos += 3;
        } else if (gf === gc) {
          acumuladas[equipoId].pe += 1;
          acumuladas[equipoId].puntos += 1;
        } else {
          acumuladas[equipoId].pp += 1;
        }
      };

      procesar(equipo_local_id, goles_local, goles_visitante);
      procesar(equipo_visitante_id, goles_visitante, goles_local);
    }

    // Insertar posiciones
    for (const equipoId in acumuladas) {
      const pos = acumuladas[equipoId];
      await db.promise().query(
        `INSERT INTO posiciones (torneo_id, equipo_id, pj, pg, pe, pp, gf, gc, puntos)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [torneoId, equipoId, pos.pj, pos.pg, pos.pe, pos.pp, pos.gf, pos.gc, pos.puntos]
      );
    }

    res.json({ message: 'Tabla de posiciones recalculada correctamente' });
  } catch (error) {
    console.error('Error al recalcular posiciones:', error);
    res.status(500).json({ error: 'Error al recalcular posiciones' });
  }
});



module.exports = router;
