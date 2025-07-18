router.get("/jugadores/:id", (req, res) => {
  const jugadorId = req.params.id;

  const query = `
    SELECT j.apellido, e.nombre AS equipo
    FROM jugadores j
    JOIN equipos e ON j.equipo_id = e.id
    WHERE j.id = ?
  `;

  db.query(query, [jugadorId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Jugador no encontrado" });
    res.json(results[0]);
  });
});
