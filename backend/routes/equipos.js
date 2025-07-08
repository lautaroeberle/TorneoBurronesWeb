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

// Crear equipo con imagen (y jugadores vacíos por ahora)
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

      if (!jugadores || jugadores.length === 0) {
        return res.status(201).json({ message: "Equipo creado sin jugadores." });
      }

      const values = jugadores.map(j => [j.nombre, j.apellido, j.dni, j.dorsal, equipoId]);
      db.query(
        "INSERT INTO jugadores (nombre, apellido, dni, dorsal, equipo_id) VALUES ?",
        [values],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.status(201).json({ message: "Equipo y jugadores cargados correctamente." });
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
  db.query("SELECT id, nombre FROM jugadores WHERE equipo_id = ?", [equipoId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});



module.exports = router;
