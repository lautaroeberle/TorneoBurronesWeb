const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/promediogoles?nombre=Copa de Verano
router.get("/promediogoles", (req, res) => {
  const nombreTorneo = req.query.nombre;

  if (!nombreTorneo) {
    return res.status(400).json({ error: "Falta el nombre del torneo" });
  }

  db.query("SELECT id FROM torneos WHERE nombre = ?", [nombreTorneo], (err, torneos) => {
    if (err) return res.status(500).json({ error: err.message });
    if (torneos.length === 0) return res.status(404).json({ error: "Torneo no encontrado" });

    const torneoId = torneos[0].id;


    db.query("SELECT id, nombre, imagen FROM equipos WHERE torneo_id = ?", [torneoId], (err, equipos) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const sql = `
        SELECT 
          p.goles_local, p.goles_visitante,
          el.id AS equipo_local_id, el.nombre AS equipo_local_nombre, el.imagen AS equipo_local_imagen,
          ev.id AS equipo_visitante_id, ev.nombre AS equipo_visitante_nombre, ev.imagen AS equipo_visitante_imagen
        FROM partidos p
        JOIN equipos el ON p.equipo_local_id = el.id
        JOIN equipos ev ON p.equipo_visitante_id = ev.id
        WHERE p.torneo_id = ? AND p.jugado = 1
      `;

      db.query(sql, [torneoId], (err, partidos) => {
        if (err) return res.status(500).json({ error: err.message });

        const stats = {};
        equipos.forEach((eq) => {
          stats[eq.id] = {
            equipo_id: eq.id,
            equipo: eq.nombre,
            imagen: eq.imagen,
            pj: 0,
            gf: 0,
          };
        });

      
        partidos.forEach((p) => {
          if (stats[p.equipo_local_id]) {
            stats[p.equipo_local_id].pj += 1;
            stats[p.equipo_local_id].gf += p.goles_local;
          }

          if (stats[p.equipo_visitante_id]) {
            stats[p.equipo_visitante_id].pj += 1;
            stats[p.equipo_visitante_id].gf += p.goles_visitante;
          }
        });

        const resultado = Object.values(stats).map((e) => ({
          ...e,
          promedio_gf: e.pj > 0 ? e.gf / e.pj : 0,
        }));

        resultado.sort((a, b) => b.promedio_gf - a.promedio_gf);

        res.json(resultado);
      });
    });
  });
});
// GET /api/equipos/:id/goleadores
router.get("/equipos/:id/goleadores", (req, res) => {
  const equipoId = req.params.id;

  const sql = `
    SELECT 
      j.id, j.nombre, j.apellido, j.dorsal,
      COUNT(CASE WHEN ep.tipo = 'gol' AND ep.tipo_gol != 'en_contra' THEN 1 END) AS goles
    FROM jugadores j
    LEFT JOIN estadisticas_partido ep ON j.id = ep.jugador_id AND ep.tipo = 'gol' AND ep.tipo_gol != 'en_contra'
    WHERE j.equipo_id = ?
    GROUP BY j.id
    ORDER BY goles DESC, j.apellido ASC
  `;

  db.query(sql, [equipoId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
