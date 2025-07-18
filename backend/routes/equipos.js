const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento para las imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/con-jugadores", upload.single("imagen"), (req, res) => {
  const { torneo_id, nombre, barrio } = req.body;
  const jugadores = req.body.jugadores ? JSON.parse(req.body.jugadores) : [];
  const imagen = req.file ? req.file.filename : "default.png";

  if (!torneo_id || !nombre || !barrio) {
    return res.status(400).json({ error: "Datos incompletos: torneo_id, nombre y barrio son requeridos" });
  }

  db.query(
    "INSERT INTO equipos (nombre, torneo_id, imagen, barrio) VALUES (?, ?, ?, ?)",
    [nombre, torneo_id, imagen, barrio],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const equipoId = result.insertId;

      // Insertar en tabla de posiciones con torneo_id incluido
      db.query(
        `INSERT INTO posiciones (equipo_id, torneo_id, pj, pg, pe, pp, gf, gc, puntos)
         VALUES (?, ?, 0, 0, 0, 0, 0, 0, 0)`,
        [equipoId, torneo_id],
        (err2) => {
          if (err2) return res.status(500).json({ error: "Error al insertar en posiciones: " + err2.message });

          // Si no hay jugadores, terminar
          if (!jugadores || jugadores.length === 0) {
            return res.status(201).json({ message: "Equipo creado sin jugadores." });
          }

          const values = jugadores.map(j => [j.nombre, j.apellido, j.dni, j.dorsal, equipoId]);
          db.query(
            "INSERT INTO jugadores (nombre, apellido, dni, dorsal, equipo_id) VALUES ?",
            [values],
            (err3) => {
              if (err3) return res.status(500).json({ error: err3.message });
              res.status(201).json({ message: "Equipo y jugadores cargados correctamente." });
            }
          );
        }
      );
    }
  );
});



// Obtener todos los equipos y sus jugadores
router.get("/", (req, res) => {
  db.query("SELECT * FROM equipos", (err, equipos) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query("SELECT * FROM jugadores", (err2, jugadores) => {
      if (err2) return res.status(500).json({ error: err2.message });

      const equiposConJugadores = equipos.map(eq => ({
        ...eq,
        jugadores: jugadores.filter(j => j.equipo_id === eq.id)
      }));

      res.json(equiposConJugadores);
    });
  });
});

// Modificar equipo (nombre, imagen y barrio)
router.put("/:id", upload.single("imagen"), (req, res) => {
  const equipoId = req.params.id;
  const { nombre, barrio } = req.body;
  const imagen = req.file ? req.file.filename : null;

  if (!nombre || !barrio) return res.status(400).json({ error: "Nombre y barrio son requeridos" });

  const campos = [];
  const valores = [];

  campos.push("nombre = ?");
  valores.push(nombre);
  
  campos.push("barrio = ?");
  valores.push(barrio);

  if (imagen) {
    campos.push("imagen = ?");
    valores.push(imagen);
  }

  valores.push(equipoId);

  const query = `UPDATE equipos SET ${campos.join(", ")} WHERE id = ?`;
  db.query(query, valores, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Equipo actualizado correctamente" });
  });
});



// Modificar jugador
router.put("/jugador/:id", (req, res) => {
  const { nombre, apellido, dorsal, fecha_nacimiento } = req.body;
  db.query(
    "UPDATE jugadores SET nombre = ?, apellido = ?, dorsal = ?, fecha_nacimiento = ? WHERE id = ?",
    [nombre, apellido, dorsal, fecha_nacimiento, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Jugador actualizado" });
    }
  );
});


// Agregar jugador nuevo a equipo existente
router.post("/jugador", (req, res) => {
  const { nombre, apellido, dni, dorsal, equipo_id, fecha_nacimiento } = req.body;
  db.query(
    "INSERT INTO jugadores (nombre, apellido, dni, dorsal, equipo_id, fecha_nacimiento) VALUES (?, ?, ?, ?, ?, ?)",
    [nombre, apellido, dni, dorsal, equipo_id, fecha_nacimiento],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Jugador agregado" });
    }
  );
});

// Obtener jugadores de un equipo específico
router.get("/:id/jugadores", (req, res) => {
  const equipoId = req.params.id;
  db.query("SELECT id, nombre,apellido FROM jugadores WHERE equipo_id = ?", [equipoId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
// Eliminar equipo
// Eliminar equipo
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM equipos WHERE id = ?", [req.params.id], (err, result) => {
    if (err) {
      console.error("Error al eliminar equipo:", err);
      return res.status(500).send("Error al eliminar equipo");
    }
    res.sendStatus(204);
  });
});


// Eliminar jugador
router.delete("/jugador/:id", (req, res) => {
  db.query("DELETE FROM jugadores WHERE id = ?", [req.params.id], (err, result) => {
    if (err) {
      console.error("Error al eliminar jugador:", err);
      return res.status(500).send("Error al eliminar jugador");
    }
    res.sendStatus(204);
  });
});



// GET /api/equipos/torneo/:torneoId
router.get("/torneo/:torneoId", (req, res) => {
  const { torneoId } = req.params;

  db.query("SELECT * FROM equipos WHERE torneo_id = ?", [torneoId], (err, rows) => {
    if (err) {
      console.error("Error al obtener equipos por torneo:", err);
      return res.status(500).json({ error: "Error al obtener equipos del torneo" });
    }
    res.json(rows);
  });
});

router.get("/:id/detalle", (req, res) => {
  const equipoId = req.params.id;
  db.query("SELECT * FROM equipos WHERE id = ?", [equipoId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: "Equipo no encontrado" });
    res.json(rows[0]);
  });
});
router.get("/:id/partidos", (req, res) => {
  const equipoId = req.params.id;
  const query = `
    SELECT p.*, el.nombre AS nombre_local, ev.nombre AS nombre_visitante
    FROM partidos p
    JOIN equipos el ON p.equipo_local_id = el.id
    JOIN equipos ev ON p.equipo_visitante_id = ev.id
    WHERE p.equipo_local_id = ? OR p.equipo_visitante_id = ?
    ORDER BY p.fecha DESC
  `;
  db.query(query, [equipoId, equipoId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get("/:id/tarjetas", (req, res) => {
  const equipoId = req.params.id;
  const query = `
    SELECT ep.tipo, COUNT(*) as cantidad
    FROM estadisticas_partido ep
    JOIN jugadores j ON ep.jugador_id = j.id
    WHERE j.equipo_id = ?
    GROUP BY ep.tipo
  `;

  db.query(query, [equipoId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const tarjetas = { amarilla: 0, roja: 0, azul: 0 };
    results.forEach((row) => {
      if (row.tipo === "amarilla") tarjetas.amarilla = row.cantidad;
      if (row.tipo === "roja") tarjetas.roja = row.cantidad;
      if (row.tipo === "azul") tarjetas.azul = row.cantidad;
    });

    res.json(tarjetas);
  });
});




// crear endpoint para traer posición de un equipo
router.get("/:id/posicion", (req, res) => {
  const equipoId = req.params.id;
  db.query(
    "SELECT pj, pg, pe, pp, gf, gc FROM posiciones WHERE equipo_id = ?",
    [equipoId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0) return res.status(404).json({ error: "Posición no encontrada" });
      res.json(rows[0]);
    }
  );
});

module.exports = router;
