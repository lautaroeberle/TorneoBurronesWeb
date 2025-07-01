const express = require('express');
const cors = require('cors');
const inscripcionRouter = require('./routes/inscripcion');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/inscripcion', inscripcionRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
