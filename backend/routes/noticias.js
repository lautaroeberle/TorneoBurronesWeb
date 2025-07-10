const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // <== carpeta sin "public/"
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});


const upload = multer({ storage });

// POST con imagen
router.post("/", upload.single("imagen"), (req, res) => {
  const { titulo, copete, cuerpo, autor } = req.body;

  if (!titulo || !cuerpo || !autor) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;

  const query = `
    INSERT INTO noticias (titulo, copete, cuerpo, imagen_url, autor)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [titulo, copete, cuerpo, imagen_url, autor], (err, result) => {
    if (err) {
      console.error("Error al insertar noticia:", err);
      return res.status(500).send(err);
    }
    res.status(201).json({ message: "Noticia creada", id: result.insertId });
  });
});

// GET: obtener noticias
router.get("/", (req, res) => {
  db.query("SELECT * FROM noticias ORDER BY fecha_publicacion DESC", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


// Eliminar una noticia por ID
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM noticias WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar noticia:", err);
      return res.status(500).send("Error al eliminar noticia");
    }
    res.sendStatus(204); // Sin contenido
  });
});


router.put("/:id", upload.single("imagen"), (req, res) => {
  const id = req.params.id;
  const { titulo, copete, cuerpo, autor } = req.body;
  const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;

  const campos = [];
  const valores = [];

  if (titulo) { campos.push("titulo = ?"); valores.push(titulo); }
  if (copete) { campos.push("copete = ?"); valores.push(copete); }
  if (cuerpo) { campos.push("cuerpo = ?"); valores.push(cuerpo); }
  if (autor) { campos.push("autor = ?"); valores.push(autor); }
  if (imagen_url) { campos.push("imagen_url = ?"); valores.push(imagen_url); }

  if (campos.length === 0) return res.status(400).json({ error: "No hay campos para actualizar" });

  valores.push(id);
  const query = `UPDATE noticias SET ${campos.join(", ")} WHERE id = ?`;

  db.query(query, valores, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Noticia actualizada correctamente" });
  });
});



// Obtener una noticia individual por ID
router.get("/:id", (req, res) => {
  const noticiaId = req.params.id;
  db.query("SELECT * FROM noticias WHERE id = ?", [noticiaId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Noticia no encontrada" });
    res.json(results[0]);
  });
});





module.exports = router;
