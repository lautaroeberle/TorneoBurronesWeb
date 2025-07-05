const express = require('express');
const router = express.Router();
const db = require('../db');

// Crear un partido
router.post('/', (req, res) => {
  const {
    torneo_id,
    equipo_local_id,
    equipo_visitante_id,
    fecha,
    hora,
    fase,
    grupo_fecha
  } = req.body;

  const query = `
    INSERT INTO partidos (
      torneo_id,
      equipo_local_id,
      equipo_visitante_id,
      fecha,
      hora,
      fase,
      grupo_fecha
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    torneo_id,
    equipo_local_id,
    equipo_visitante_id,
    fecha,
    hora,
    fase,
    grupo_fecha || null
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al agregar partido:', err);
      return res.status(500).json({ error: 'Error al guardar el partido' });
    }

    res.status(201).json({
      message: 'Partido agregado correctamente',
      partidoId: result.insertId
    });
  });
});

// Editar partido (actualizar resultado y jugado)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { goles_local, goles_visitante, jugado } = req.body;

  try {
    const jugadoEntero = jugado === "true" || jugado === true || jugado === "1" || jugado === 1 ? 1 : 0;


const [resultado] = await db.promise().query(
  `UPDATE partidos SET goles_local = ?, goles_visitante = ?, jugado = ? WHERE id = ?`,
  [goles_local, goles_visitante, jugadoEntero, id]
);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Partido no encontrado' });
    }

    res.json({ message: 'Partido actualizado correctamente' });
  } catch (error) {
    console.error('Error al editar partido:', error);
    res.status(500).json({ error: 'Error al editar el partido' });
  }
});

// Obtener partidos por ID de torneo (para EditarPartido)
router.get('/torneo/:id', (req, res) => {
  const torneoId = req.params.id;
  const query = `
    SELECT p.*, 
           el.nombre AS equipo_local, 
           ev.nombre AS equipo_visitante 
    FROM partidos p
    JOIN equipos el ON p.equipo_local_id = el.id
    JOIN equipos ev ON p.equipo_visitante_id = ev.id
    WHERE p.torneo_id = ?
    ORDER BY p.fecha, p.hora
  `;

  db.query(query, [torneoId], (err, rows) => {
    if (err) {
      console.error('Error al obtener partidos por torneo:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(rows);
  });
});

// Obtener partidos por nombre de torneo (para páginas públicas como CopaPage)
router.get('/torneo', (req, res) => {
  const { nombre } = req.query;

  const query = `
    SELECT p.*, 
           el.nombre AS equipo_local, 
           ev.nombre AS equipo_visitante 
    FROM partidos p
    JOIN torneos t ON p.torneo_id = t.id
    JOIN equipos el ON p.equipo_local_id = el.id
    JOIN equipos ev ON p.equipo_visitante_id = ev.id
    WHERE t.nombre = ?
    ORDER BY p.fecha, p.hora
  `;

  db.query(query, [nombre], (err, rows) => {
    if (err) {
      console.error('Error al obtener partidos por nombre de torneo:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(rows);
  });
});
// Guardar estadísticas por jugador (formato flexible: goles, amarillas, rojas)
router.post('/:id/estadisticas', async (req, res) => {
  const partidoId = req.params.id;
  const { jugador_id, goles, amarillas, rojas } = req.body;

  try {
    const insertEvento = async (tipo, cantidad) => {
      if (cantidad > 0) {
        await db.promise().query(
          `INSERT INTO estadisticas_partido (partido_id, jugador_id, tipo_evento, cantidad)
           VALUES (?, ?, ?, ?)`,
          [partidoId, jugador_id, tipo, cantidad]
        );

        // Opcional: actualizar estadísticas acumuladas del jugador
        await db.promise().query(
          `UPDATE jugadores SET ${tipo === 'gol' ? 'goles' : tipo + 's'} = ${tipo === 'gol' ? 'goles' : tipo + 's'} + ? WHERE id = ?`,
          [cantidad, jugador_id]
        );
      }
    };

    await insertEvento('gol', goles);
    await insertEvento('amarilla', amarillas);
    await insertEvento('roja', rojas);

    res.status(201).json({ message: 'Estadísticas guardadas correctamente' });
  } catch (error) {
    console.error("Error al guardar estadística:", error);
    res.status(500).json({ error: 'Error al guardar estadística' });
  }
});







module.exports = router;
