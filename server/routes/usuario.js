const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const _ = require('underscore')
const Usuario = require("../models/usuario"); //Importamos el modelo

app.get("/usuario", (req, res) => {

  /* if(!req.query.desde){
    return res.status(400).json({
      ok: false,
      message: 'Falta campo desde'
    })
  } */

  let desde = Number(req.query.desde) || 0
  let limite = Number(req.query.limite) || 5

  //en .find() como segundo parametro pasamos los atributos que queremos en los objetos de la respuesta
  Usuario.find({},'').skip(desde).limit(limite).exec((err,respDB)=>{

    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    //con count podemos consultar la cantidad de registros total
    Usuario.count({ estado:true},(err,conteo)=>{
      res.json({ ok:true, usuarios:respDB, total:conteo}) 
    })

  })



});

app.get("/usuario/:id", (req, res) => {

  if(!req.params.id){
    return res.status(400).json({
      ok: false,
      message: 'Falta Id de Usuario'
    })
  }

  let id = req.params.id

  Usuario.findById(id).exec((err,respDB)=>{

    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({ ok:true, usuario:respDB}) 
  

  })

});

app.post("/usuario", (req, res) => {
  const { nombre, email, password, role } = req.body;

  let usuario = new Usuario({
    nombre,
    email,
    password: bcrypt.hashSync(password, 10),
    role,
  });

  //Guardamos en Base de datos y devolvemos una respuesta
  usuario.save((err, respDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    let infoRes = respDB

    delete infoRes['password']
    
    res.json({
      ok: true,
      usuario: infoRes,
    });
  });

 
});

app.put("/usuario/:id", (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body,['nombre','email','img','role','estado']) //_ es para acceder a Underscore.js una libreria que nos facilita otros metodos de Javascript funcionales

  Usuario.findByIdAndUpdate(id,body,{new:true, runValidators:true},(err,respDB)=>{
    
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok:true,
      usuario:respDB
    });
  })
});

app.delete("/usuario/:id", (req, res) => {

  let id = req.params.id

  Usuario.findByIdAndDelete(id,(err,respDB)=>{

    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    if (!respDB) {
      return res.status(400).json({
        ok: false,
        message:'Usuario no Existe'
      });
    }

    res.json({
      ok:true,
      usuario:respDB
    });


  })


});

app.put("/usuario/status/:id", (req, res) => {

  let id = req.params.id
  let cambiaEstado = {
    estado: false
  }

  Usuario.findByIdAndUpdate(id,cambiaEstado,{new:true},(err,respDB)=>{

    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    if (!respDB) {
      return res.status(400).json({
        ok: false,
        message:'Usuario no Existe'
      });
    }

    res.json({
      ok:true,
      usuario:respDB
    });


  })


});

module.exports = app;


user = 'anderson'
password = 'y9xrjSXPTBbTWbkl'
MongoDBUrl =  'mongodb+srv://anderson:y9xrjSXPTBbTWbkl@cluster0.g3gbp.mongodb.net/cafe?retryWrites=true&w=majority'
