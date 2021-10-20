const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator')

let rolesValidos={
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "EL nombre es necesario"],
  },
  email: {
    type: String,
    unique:true,
    required: [true, "El correo es Necesario"],
  },
  password: {
    type: String,
    required: [true, "La clave es Necesaria"],
  },
  img: { type: String, required: false },
  role: {
    type: String, 
    default: "USER_ROLE",
    enum: rolesValidos
  },
  estado: { type: Boolean, default: true },
  google: { type: Boolean, default: false },
});

usuarioSchema.methods.toJSON = function () {
  let user = this
  let userObject = user.toObject()

  delete userObject.password

  return userObject
} // es para modificar en la resp de cuando creamos un usuario no nos retorne el Password

usuarioSchema.plugin(uniqueValidator,{ message:'{PATH} deb ser unico' })// para configurar por ejemplo que solo se registren Emails unicos o simplemente registros duplicados

module.exports = mongoose.model('Usuario', usuarioSchema)