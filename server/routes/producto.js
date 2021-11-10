
const express = require('express');
const { verificaToken,verificaRole } = require('../middlewares/autenticacion')
const _ = require('underscore')
let app = express()

let Producto = require('../models/producto.js');


/* Mostrar todos lps productos o por termino*/

app.get("/producto", verificaToken, (req, res) => {

  /* Si el usuario esta aplicando un Query Param ejecutar una sola busqueda */
  if (req.query.termino) {
    let termino = req.query.termino;
    let regex = new RegExp(termino,'i')
  
    Producto.find({nombre:regex}).exec((err, respDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
  
       return res.json({ ok: true, producto: respDB });
    });

  } /* Si el usuario esta aplicando un Query Param ejecutar una sola busqueda */

  else{

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
  
    //en .find() como segundo parametro pasamos los atributos que queremos en los objetos de la respuesta
    Producto.find({}, "")
      .skip(desde)
      .limit(limite)
      .sort('descripcion')
      .populate('usuario','nombre email').populate('categoria','descripcion')
      .exec((err, respDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        //con count podemos consultar la cantidad de registros total
        Producto.count({ estado: true }, (err, conteo) => {
          res.json({ ok: true, productos: respDB, total: conteo });
        });
      });
  }

});

/* Consultar un producto por ID*/
app.get("/producto/:id", verificaToken, (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      ok: false,
      message: "Falta Id de Producto",
    });
  }

  let id = req.params.id;

  Producto.findById(id).populate('categoria','descripcion').exec((err, respDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({ ok: true, producto: respDB });
  });
});


/* Crear un Producto */
app.post("/producto", [verificaToken, verificaRole], (req, res) => {


  const { nombre, precioUni, descripcion, disponible, categoria, usuario } = req.body;

  if (!nombre|| !precioUni|| !descripcion|| !disponible|| !categoria|| !usuario) {
    return res.status(400).json({
      ok: false,
      message: 'Faltan campos',
    });
  }

  let producto = new Producto({
    nombre, precioUni, descripcion, disponible, categoria, usuario,
  });

  //Guardamos en Base de datos y devolvemos una respuesta
  producto.save((err, respDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    let infoRes = respDB;

    res.json({
      ok: true,
      producto: infoRes,
    });
  });
});

/* Crear una producto */
app.put("/producto/:id", [verificaToken, verificaRole], (req, res) => {

  const { nombre, precioUni, descripcion, disponible } = req.body;

  if (!nombre|| !precioUni|| !descripcion|| !disponible) {
    return res.status(400).json({
      ok: false,
      message: 'Faltan campos',
    });
  }


  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "precioUni", "descripcion", "disponible"]); 

  
  Producto.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, respDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        producto: respDB,
      });
    }
  );
});

/* Borrar una producto */
app.delete("/producto/:id", [verificaToken, verificaRole], (req, res) => {
  let id = req.params.id;

  Producto.findByIdAndDelete(id, (err, respDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    if (!respDB) {
      return res.status(400).json({
        ok: false,
        message: "Producto no Existe",
      });
    }

    res.json({
      ok: true,
      producto: respDB,
    });
  });
});

module.exports = app;

