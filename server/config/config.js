/* Puerto */
process.env.PORT= process.env.PORT || 3000;


/* Base de datos */

let urlDB;

if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/cafe"
} else {
    urlDB = 'mongodb+srv://anderson:y9xrjSXPTBbTWbkl@cluster0.g3gbp.mongodb.net/cafe?retryWrites=true&w=majority'
}
process.env.URLDB = urlDB;