const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const Usuario = require("../models/usuario"); //Importamos el modelo
const jwt = require('jsonwebtoken');


app.post("/login", (req, res) => {

    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({
          ok: false,
          message: 'Faltan campos'
        })
      }
  

    Usuario.findOne({ email:email },(err, respDB) => {

      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if(!respDB) {
        return res.status(400).json({
          ok: false,
          message:"Usuario o contraseña incorrectos"
        });
      }

  
      if ( !bcrypt.compareSync(password,respDB.password) ){ //Compara la contraseña que envia en el (body) POST y la compara con la que busca en la base de datos
        return res.status(400).json({
            ok: false,
            message:"Usuario o contraseña incorrectos"
          });
      }


      //Aqui creamos el Token
      let token = jwt.sign({ usuario: respDB }, process.env.SEED , { expiresIn: process.env.CADUCIDAD_TOKEN  });

      res.json({
        ok: true,
        usuario:respDB,
        token
      });

    });
  
   
  });

module.exports = app;