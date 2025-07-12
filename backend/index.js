const express = require('express');
const cors = require('cors');
const inscripcionRouter = require('./routes/inscripcion');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/inscripcion', inscripcionRouter);

const torneosRouter = require("./routes/torneos");
app.use("/api/torneos", torneosRouter);

app.use("/uploads", express.static("uploads"));

const equiposRouter = require("./routes/equipos");
app.use("/api/equipos", equiposRouter);

const partidosRouter = require("./routes/partidos");
app.use("/api/partidos", partidosRouter);

const estadisticasRouter = require("./routes/estadisticas");
app.use("/api/estadisticas", estadisticasRouter);

const noticiasRoutes = require('./routes/noticias');
app.use("/api/noticias", noticiasRoutes);

const posicionesRoutes = require('./routes/posiciones');
app.use("/api/posiciones", posicionesRoutes);

const fixtureRoutes = require("./routes/fixture");
app.use("/api/fixture", fixtureRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
