require('./config/config')

const express = require("express");
const mongoose = require('mongoose');
const app = express();



app.use( require('./routes/usuario'))

//Conexion a la base de datos MongoDB


mongoose.connect(process.env.URLDB,{useNewUrlParser:true},(err,res)=>{

  if(err)throw err;
  console.log('Database Conected');
});

app.listen(process.env.PORT, () => {
  console.log("Listen in puerto 3000");
});
