require('./config/config')
const autoImport = require('auto-import')
const express = require("express");
const mongoose = require('mongoose');
const path = require('path')
const app = express();


/* Configuracion de Rutas */
app.use( require('./routes/index'))

//Habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public') ))



//Conexion a la base de datos MongoDB
mongoose.connect(process.env.URLDB,{useNewUrlParser:true},(err,res)=>{

  if(err)throw err;
  console.log('Database Conected');

  //Una vez conectada la base de datos abrir puerto del servidor
  app.listen(process.env.PORT, () => {
    console.log("Listen in puerto 3000");
  });
});

