const express = require('express');

const fs = require('fs')
const path = require('path')
const { verificaToken } =  require('../middlewares/autenticacion.js');
let app = express()

app.get('/imagen/:tipo/:img',verificaToken,(req,res)=>{

    const {tipo, img} = req.params

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
     return res.sendFile(pathImagen)
    }

    let noImagePath = path.resolve(__dirname,'../assets/no-image.jpg' )
    res.sendFile(noImagePath)
})

module.exports = app