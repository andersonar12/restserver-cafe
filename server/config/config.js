/* Puerto */
process.env.PORT= process.env.PORT || 3000;

/* Base de datos */
let urlDB;

/* SEED de Autenticacion */
process.env.SEED = 'secret-cafe'

/* Google Client Id */
process.env.CLIENT_ID = '870659008324-61k50m5hbua4t2t4socg5cji99j2575b.apps.googleusercontent.com'


/* Vencimiento del Token */
//60segundos * 60minutos * 24horas * 30dias
process.env.CADUCIDAD_TOKEN = 60 * 60* 24 * 30 

if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/cafe"
} else {
    urlDB = 'mongodb+srv://anderson:y9xrjSXPTBbTWbkl@cluster0.g3gbp.mongodb.net/cafe?retryWrites=true&w=majority'
}
process.env.URLDB = urlDB;