// En routes/torneos.js
const express = require("express");
const router = express.Router();
const db = require("../db"); // tu conexión mysql

// Obtener todos los torneos
router.get("/", (req, res) => {
  db.query("SELECT * FROM torneos", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Crear nuevo torneo
router.post("/", (req, res) => {
  const { nombre, año } = req.body;
  db.query("INSERT INTO torneos (nombre, año) VALUES (?, ?)", [nombre, año], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: result.insertId, nombre, año });
  });
});

// Eliminar torneo
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM torneos WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
});

module.exports = router;
