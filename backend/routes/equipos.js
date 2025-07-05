
const express = require("express");
const router = express.Router();
const db = require("../db");

// Crear equipo con sus jugadores
router.post("/con-jugadores", (req, res) => {
  const { torneo_id, nombre, jugadores } = req.body;

  if (!torneo_id || !nombre || !jugadores || jugadores.length === 0) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  // Insertar equipo
  db.query("INSERT INTO equipos (nombre, torneo_id) VALUES (?, ?)", [nombre, torneo_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const equipoId = result.insertId;

    // Insertar jugadores
    const values = jugadores.map(j => [j.nombre, j.apellido, j.dni, j.dorsal, equipoId]);
    db.query(
      "INSERT INTO jugadores (nombre, apellido, dni, dorsal, equipo_id) VALUES ?",
      [values],
      (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.status(201).json({ message: "Equipo y jugadores cargados correctamente." });
      }
    );
  });
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

// Modificar nombre de equipo
router.put("/:id", (req, res) => {
  const { nombre } = req.body;
  db.query("UPDATE equipos SET nombre = ? WHERE id = ?", [nombre, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Equipo actualizado" });
  });
});

// Modificar jugador
router.put("/jugador/:id", (req, res) => {
  const { nombre, apellido, dorsal } = req.body;
  db.query(
    "UPDATE jugadores SET nombre = ?, apellido = ?, dorsal = ? WHERE id = ?",
    [nombre, apellido, dorsal, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Jugador actualizado" });
    }
  );
});

// Agregar jugador nuevo a equipo existente
router.post("/jugador", (req, res) => {
  const { nombre, apellido, dni, dorsal, equipo_id } = req.body;
  db.query(
    "INSERT INTO jugadores (nombre, apellido, dni, dorsal, equipo_id) VALUES (?, ?, ?, ?, ?)",
    [nombre, apellido, dni, dorsal, equipo_id],
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
