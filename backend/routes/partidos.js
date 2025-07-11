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
// Editar partido (actualizar resultado y tabla de posiciones)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { goles_local, goles_visitante, jugado } = req.body;

  try {
    const jugadoEntero = jugado === "true" || jugado === true || jugado === "1" || jugado === 1 ? 1 : 0;

    // 1. Obtener datos actuales del partido antes de editarlo
    const [[partidoAnterior]] = await db.promise().query(
      `SELECT equipo_local_id, equipo_visitante_id, goles_local, goles_visitante, jugado FROM partidos WHERE id = ?`,
      [id]
    );

    // 2. Actualizar el resultado del partido
    const [resultado] = await db.promise().query(
      `UPDATE partidos SET goles_local = ?, goles_visitante = ?, jugado = ? WHERE id = ?`,
      [goles_local, goles_visitante, jugadoEntero, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Partido no encontrado' });
    }

    const { equipo_local_id, equipo_visitante_id } = partidoAnterior;

    // Función para restar estadísticas anteriores si el partido ya había sido jugado
    const restarPosiciones = async (equipoId, golesFavor, golesContra) => {
      let puntos = 0, pg = 0, pe = 0, pp = 0;
      if (golesFavor > golesContra) { puntos = 3; pg = 1; }
      else if (golesFavor === golesContra) { puntos = 1; pe = 1; }
      else { pp = 1; }

      await db.promise().query(`
        UPDATE posiciones
        SET pj = pj - 1,
            pg = pg - ?,
            pe = pe - ?,
            pp = pp - ?,
            gf = gf - ?,
            gc = gc - ?,
            puntos = puntos - ?
        WHERE equipo_id = ?
      `, [pg, pe, pp, golesFavor, golesContra, puntos, equipoId]);
    };

    // Función para sumar estadísticas nuevas
    const sumarPosiciones = async (equipoId, golesFavor, golesContra) => {
      let puntos = 0, pg = 0, pe = 0, pp = 0;
      if (golesFavor > golesContra) { puntos = 3; pg = 1; }
      else if (golesFavor === golesContra) { puntos = 1; pe = 1; }
      else { pp = 1; }

      await db.promise().query(`
        INSERT INTO posiciones (equipo_id, pj, pg, pe, pp, gf, gc, puntos)
        VALUES (?, 1, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          pj = pj + 1,
          pg = pg + VALUES(pg),
          pe = pe + VALUES(pe),
          pp = pp + VALUES(pp),
          gf = gf + VALUES(gf),
          gc = gc + VALUES(gc),
          puntos = puntos + VALUES(puntos)
      `, [equipoId, pg, pe, pp, golesFavor, golesContra, puntos]);
    };

    // 3. Revertir datos anteriores si ya estaba jugado
    if (partidoAnterior.jugado === 1) {
      await restarPosiciones(equipo_local_id, partidoAnterior.goles_local, partidoAnterior.goles_visitante);
      await restarPosiciones(equipo_visitante_id, partidoAnterior.goles_visitante, partidoAnterior.goles_local);
    }

    // 4. Aplicar nuevos datos si ahora está jugado
    if (jugadoEntero === 1) {
      await sumarPosiciones(equipo_local_id, goles_local, goles_visitante);
      await sumarPosiciones(equipo_visitante_id, goles_visitante, goles_local);
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
// Controlador: POST /:id/estadisticas
router.post('/:id/estadisticas', async (req, res) => {
  const partidoId = req.params.id;
  const eventos = req.body;

  try {
    for (const ev of eventos) {
      const { jugador_id, tipo, minuto, tipo_gol } = ev;

      if (tipo === 'gol' && !['penal','jugada','en_contra'].includes(tipo_gol)) {
        return res.status(400).json({ error: 'tipo_gol inválido' });
      }

      await db.promise().query(
        `INSERT INTO estadisticas_partido
         (partido_id, jugador_id, tipo, tipo_gol, minuto)
         VALUES (?, ?, ?, ?, ?)`,
        [partidoId, jugador_id, tipo, tipo === 'gol' ? tipo_gol : null, minuto]
      );

      if (tipo === 'gol' && tipo_gol !== 'en_contra') {
        await db.promise().query(`UPDATE jugadores SET goles = goles + 1 WHERE id = ?`, [jugador_id]);
      } else if (tipo === 'amarilla') {
        await db.promise().query(`UPDATE jugadores SET amarillas = amarillas + 1 WHERE id = ?`, [jugador_id]);
      } else if (tipo === 'roja') {
        await db.promise().query(`UPDATE jugadores SET rojas = rojas + 1 WHERE id = ?`, [jugador_id]);
      } else if (tipo === 'azul') {
        await db.promise().query(`UPDATE jugadores SET azules = azules + 1 WHERE id = ?`, [jugador_id]);
      }
    }

    // Marcar partido como jugado
    await db.promise().query(
      `UPDATE partidos SET jugado = 1 WHERE id = ?`,
      [partidoId]
    );

    res.status(201).json({ message: 'Estadísticas guardadas' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar estadísticas' });
  }
});

// Eliminar partido
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM partidos WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      console.error("Error al eliminar partido:", err);
      return res.status(500).send("Error al eliminar partido");
    }
    res.sendStatus(204);
  });
});












module.exports = router;
