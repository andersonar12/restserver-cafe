const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario.js')
const Producto = require('../models/producto.js')

const fs = require('fs')
const path = require('path')
// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let { tipo, id } = req.params

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            message: "No se ha seleccionado ningun archivo"
        })
    }

    /* Validar Tipo */
    let tiposValidos = ['productos', 'usuarios']


    if (tiposValidos.indexOf(tipo) == -1) {
        return res.status(400).json({
            ok: false,
            message: `Los tipos validos son ${tiposValidos.join(', ')}`,
        })
    }

    /* Validamos los formatos de imagenes */
    let mimeType = req.files.archivo.mimetype
    if (mimeType !== 'image/png' && mimeType !== 'image/jpg' && mimeType !== 'image/jpeg') {
        return res.status(400).json({
            ok: false,
            message: "Only supported image files are JPEG, JPG, and PNG",
            extension: mimeType
        })
    }


    let sampleFile = req.files.archivo;
    let fileName = `${id}-${new Date().valueOf()}.jpg`
    let uploadPath = `uploads/${tipo}/${fileName}`;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, (err) => {
        if (err)
            return res.status(500).send(err);

        /* Imagen ya esta cargada */

        if (tipo ==='productos') {
          imagenProducto(id, res, fileName)
        }

        if (tipo ==='usuarios') {
          imagenUsuario(id, res, fileName)
        }


        /* res.json({
            ok: true,
            message: "Archivo Subido"
        }) */
    });
})


const imagenUsuario = (id, res, fileName) => {
  
  Usuario.findById(id, (err, respDB) => {
    
    borrarArchivo('productos',respDB["img"])
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!respDB) {
        return res.status(400).json({
          ok: false,
          message: "Usuario no existe",
        });
      }

    

      respDB["img"] = fileName;
  
      Usuario.findByIdAndUpdate(id,respDB,(err, usuarioGuardado) => {
        
        return res.json({
          ok: true,
          usuario: usuarioGuardado,
          img: fileName,
        });
      });

    });

}

const imagenProducto = (id, res, fileName) => {

  Producto.findById(id, (err, respDB) => {
    borrarArchivo('productos',respDB["img"])
    if (err) {
    
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!respDB) {

      return res.status(400).json({
        ok: false,
        message: "Producto no existe",
      });
    }
    

    respDB["img"] = fileName;

    Producto.findByIdAndUpdate(id,respDB,(err, productoGuardado) => {
      
      return res.json({
        ok: true,
        producto: productoGuardado,
        img: fileName,
      });
    });

  });

}

const borrarArchivo = (tipo, imagen) => {
  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${imagen}`);

  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
};

module.exports = app