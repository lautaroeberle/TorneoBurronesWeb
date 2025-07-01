// routes/equipos.js
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

module.exports = router;
