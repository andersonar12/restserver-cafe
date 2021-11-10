const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;


let categoriaSchema = new Schema({
    descripcion: { type: String, required: true ,unique:true},
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

categoriaSchema.plugin(uniqueValidator,{ message:'{PATH} deb ser unico' })// para configurar por ejemplo que solo se registren Emails unicos o simplemente registros duplicados


module.exports = mongoose.model('Categoria', categoriaSchema);