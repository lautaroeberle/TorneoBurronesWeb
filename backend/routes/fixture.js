// routes/fixture.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// Función para mezclar aleatoriamente un array
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function esPotenciaDeDos(n) {
  return (n & (n - 1)) === 0 && n !== 0;
}

router.post("/", (req, res) => {
  const { torneoId, tipo } = req.body;

  if (!torneoId || !tipo) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  db.query("SELECT * FROM equipos WHERE torneo_id = ?", [torneoId], (err, equipos) => {
    if (err) return res.status(500).json({ error: "Error al obtener equipos" });

    if (equipos.length < 2) return res.status(400).json({ error: "Se necesitan al menos 2 equipos." });

    const partidos = [];

    if (tipo === "todos" || tipo === "ida_vuelta") {
  let equiposFixture = [...equipos];

  // Si la cantidad de equipos es impar, agregamos un equipo "libre"
  const cantidadEsImpar = equiposFixture.length % 2 !== 0;
  if (cantidadEsImpar) {
    equiposFixture.push({ id: null, nombre: "LIBRE" });
  }

  const totalFechas = equiposFixture.length - 1;
  const cantidadEquipos = equiposFixture.length;

  let fechaContador = 1;
  const rondas = tipo === "ida_vuelta" ? 2 : 1;

  for (let ronda = 0; ronda < rondas; ronda++) {
    let equiposRonda = [...equiposFixture];

    for (let fecha = 0; fecha < totalFechas; fecha++) {
      for (let i = 0; i < cantidadEquipos / 2; i++) {
        const equipoA = equiposRonda[i];
        const equipoB = equiposRonda[cantidadEquipos - 1 - i];

        // No generamos partidos si hay un "LIBRE"
        if (equipoA.id && equipoB.id) {
          const local = ronda === 0 ? equipoA : equipoB;
          const visitante = ronda === 0 ? equipoB : equipoA;

          partidos.push([
            torneoId,
            local.id,
            visitante.id,
            null,
            null,
            0,
            0,
            "Grupos",
            fechaContador,
            0
          ]);
        }
      }

      // Rotación estilo round robin (excepto el primero)
      const primero = equiposRonda[0];
      const resto = equiposRonda.slice(1);
      const ultimo = resto.pop();
      equiposRonda = [primero, ultimo, ...resto];

      fechaContador++;
    }
  }
}

 else if (tipo === "grupos_eliminacion") {
      const totalEquipos = equipos.length;

      if (!esPotenciaDeDos(totalEquipos)) {
        return res.status(400).json({ error: "Cantidad de equipos debe ser potencia de 2 (8, 16, 32...)." });
      }

      // Dividir en 2 grupos iguales
      const mezclados = shuffle(equipos);
      const mitad = totalEquipos / 2;
      const grupoA = mezclados.slice(0, mitad);
      const grupoB = mezclados.slice(mitad);

      let fecha = 1;

      // Generar partidos de grupo
      const generarPartidosGrupo = (grupo) => {
        for (let i = 0; i < grupo.length; i++) {
          for (let j = i + 1; j < grupo.length; j++) {
            partidos.push([
              torneoId,
              grupo[i].id,
              grupo[j].id,
              null,
              null,
              0,
              0,
              "Grupos",
              fecha++,
              0,
            ]);
          }
        }
      };

      generarPartidosGrupo(grupoA);
      generarPartidosGrupo(grupoB);

      // Simulación de fase final: eliminación directa
      const crearFaseFinal = (fase, equipos, grupoFechaInicial) => {
        for (let i = 0; i < equipos.length; i += 2) {
          partidos.push([
            torneoId,
            equipos[i].id,
            equipos[i + 1].id,
            null,
            null,
            0,
            0,
            fase,
            grupoFechaInicial,
            0,
          ]);
        }
      };

      // Elegimos aleatoriamente los cruces de eliminación directa
      const eliminacion = shuffle(mezclados);

      if (totalEquipos >= 16) {
        crearFaseFinal("Octavos de final", eliminacion, fecha++);
      }
      if (totalEquipos >= 8) {
        crearFaseFinal("Cuartos de final", new Array(totalEquipos / 2).fill({ id: 1 }), fecha++);
        crearFaseFinal("Semifinal", new Array(totalEquipos / 4).fill({ id: 1 }), fecha++);
        crearFaseFinal("Final", [ { id: 1 }, { id: 1 } ], fecha++);
      }
    } else {
      return res.status(400).json({ error: "Tipo de fixture inválido" });
    }

    // Insertar todos los partidos generados
    const insertQuery = `
      INSERT INTO partidos (
        torneo_id, equipo_local_id, equipo_visitante_id, fecha, hora,
        goles_local, goles_visitante, fase, grupo_fecha, jugado
      ) VALUES ?
    `;

    db.query(insertQuery, [partidos], (err2, result) => {
      if (err2) {
        console.error("Error al insertar partidos:", err2);
        return res.status(500).json({ error: "Error al insertar partidos." });
      }

      res.json({ mensaje: `Fixture generado: ${partidos.length} partidos creados.` });
    });
  });
});

module.exports = router;
