
const express = require('express');
const { verificaToken,verificaRole } = require('../middlewares/autenticacion')
const _ = require('underscore')
let app = express()

let Categoria = require('../models/categoria');


/* Mostrar todas las categorias */
app.get("/categoria", verificaToken, (req, res) => {
  let desde = Number(req.query.desde) || 0;
  let limite = Number(req.query.limite) || 5;

  //en .find() como segundo parametro pasamos los atributos que queremos en los objetos de la respuesta
  Categoria.find({}, "")
    .skip(desde)
    .limit(limite)
    .sort('descripcion')
    .populate('usuario','nombre email')
    .exec((err, respDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      //con count podemos consultar la cantidad de registros total
      Categoria.count({ estado: true }, (err, conteo) => {
        res.json({ ok: true, categorias: respDB, total: conteo });
      });
    });
});

/* Consultar una categoria */
app.get("/categoria/:id", verificaToken, (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      ok: false,
      message: "Falta Id de Categoria",
    });
  }

  let id = req.params.id;

  Categoria.findById(id).exec((err, respDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({ ok: true, categoria: respDB });
  });
});

/* Crear una Categoria */
app.post("/categoria", [verificaToken, verificaRole], (req, res) => {
  const { usuario,descripcion } = req.body;

  let categoria = new Categoria({
    descripcion,
    usuario,
  });

  //Guardamos en Base de datos y devolvemos una respuesta
  categoria.save((err, respDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    let infoRes = respDB;

    res.json({
      ok: true,
      categoria: infoRes,
    });
  });
});

/* Crear una categoria */
app.put("/categoria/:id", [verificaToken, verificaRole], (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["descripcion"]); 

  
  Categoria.findByIdAndUpdate(
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
        categoria: respDB,
      });
    }
  );
});

/* Borrar una categoria */
app.delete("/categoria/:id", [verificaToken, verificaRole], (req, res) => {
  let id = req.params.id;

  Categoria.findByIdAndDelete(id, (err, respDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    if (!respDB) {
      return res.status(400).json({
        ok: false,
        message: "Categoria no Existe",
      });
    }

    res.json({
      ok: true,
      categoria: respDB,
    });
  });
});

module.exports = app;



  