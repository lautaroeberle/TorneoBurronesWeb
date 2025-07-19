const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { nombre, equipo, prefijo, telefono, email, mensaje } = req.body;

  if (!email) {
    return res.status(400).json({ error: "El email es obligatorio." });
  }

  // Primero verificamos si el email ya existe
  const checkSql = 'SELECT COUNT(*) AS count FROM inscripciones WHERE email = ?';
  db.query(checkSql, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    if (results[0].count > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya fue registrado' });
    }

    // Insertamos si no existe
    const insertSql = `INSERT INTO inscripciones (nombre, equipo, prefijo, telefono, email, mensaje)
                       VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(insertSql, [nombre, equipo, prefijo, telefono, email, mensaje], (err2, result) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
      res.status(200).json({ message: 'Inscripción guardada con éxito' });
    });
  });
});

module.exports = router;
