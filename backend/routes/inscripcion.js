const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { nombre, equipo, telefono } = req.body;
  const sql = 'INSERT INTO inscripciones (nombre, equipo, telefono) VALUES (?, ?, ?)';
  db.query(sql, [nombre, equipo, telefono], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    res.status(200).json({ message: 'Inscripción guardada con éxito' });
  });
});

module.exports = router;
