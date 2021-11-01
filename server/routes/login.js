const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const Usuario = require("../models/usuario"); //Importamos el modelo
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      message: "Faltan campos",
    });
  }

  Usuario.findOne({ email: email }, (err, respDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!respDB) {
      return res.status(400).json({
        ok: false,
        message: "Usuario o contraseña incorrectos",
      });
    }

    if (!bcrypt.compareSync(password, respDB.password)) {
      //Compara la contraseña que envia en el (body) POST y la compara con la que busca en la base de datos
      return res.status(400).json({
        ok: false,
        message: "Usuario o contraseña incorrectos",
      });
    }

    //Aqui creamos el Token
    let token = jwt.sign({ usuario: respDB }, process.env.SEED, {
      expiresIn: process.env.CADUCIDAD_TOKEN,
    });

    res.json({
      ok: true,
      usuario: respDB,
      token,
    });
  });
});

//Configuraciones de Google

const verify = async (id_token) => {
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  let payload = ticket.getPayload();
  /* const userid = payload['sub']; */
  /* console.log(payload); */

  payload.google = true;

  return payload;
};

app.post("/google", async (req, res) => {
  const { id_token } = req.body;

  const payload = await verify(id_token).catch((e) => {
    return res.status(400).json({
      ok: false,
      message: e,
    });
  });

  if (!id_token) {
    return res.status(400).json({
      ok: false,
      message: "Falta token",
    });
  }

  Usuario.findOne({ email: payload.email }, (err, respDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (respDB) {
      if (respDB.google === false) {
        return res.status(400).json({
          ok: false,
          message: "Debe de usar su autenticacion normal",
        });
      } else {

        /* Si el usuario se autentico con Google renuevo su token y lo enviamos */
        let token = jwt.sign({ usuario: respDB }, process.env.SEED, {
          expiresIn: process.env.CADUCIDAD_TOKEN,
        });

        return res.json({
          ok: true,
          usuario: respDB,
          token,
        });
      }

    } else {
      //si el usuario no existe en nuestra base de datos (si es primera vez que se autentica)

      let usuario = new Usuario();

      usuario.nombre = payload.name
      usuario.email = payload.email
      usuario.img = payload.picture
      usuario.google = true;
      usuario.password = '...'


      //creamos el usuario en la base de datos con los nuevos datos de Google
      usuario.save((err,respDB)=>{

        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }

        let token = jwt.sign({ usuario: respDB }, process.env.SEED, {
          expiresIn: process.env.CADUCIDAD_TOKEN,
        });

        return res.json({
          ok: true,
          usuario: respDB,
          token,
        });

      })
    }
  });

  /* res.json({
      id_token,
      payload
    }); */
});

module.exports = app;
