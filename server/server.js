require('./config/config')

const express = require("express");
const mongoose = require('mongoose');
const app = express();


/* Configuracion de Rutas */
app.use( require('./routes/index'))


//Conexion a la base de datos MongoDB


mongoose.connect(process.env.URLDB,{useNewUrlParser:true},(err,res)=>{

  if(err)throw err;
  console.log('Database Conected');
});

app.listen(process.env.PORT, () => {
  console.log("Listen in puerto 3000");
});
