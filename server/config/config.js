// ========
// Puerto
// ========
process.env.PORT = process.env.PORT || 3000;

// ========
// Entorno
// ========
process.env.NODE_ENV = process.env.NODE_ENV ||  'dev';

// ========
// Vencimiento del token
// ========
process.env.CADUCIDAD_TOKEN = '48h';

// ========
// Seed de autenticación
// ========
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ========
// BBDD
// ========
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/acortador';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URL_DB = urlDB;

// ========
// Google Client ID
// ========
process.env.CLIENT_ID = process.env.CLIENT_ID ||  '809749593357-vraci6oe4dk6q4hgqjngnr2s5ksg395i.apps.googleusercontent.com';