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
process.env.MONGO_URI = 'mongodb:/';
// ========
// BBDD
// ========
let urlDB;
urlDB = process.env.MONGO_URI;
// if (process.env.NODE_ENV === 'test') {
//     urlDB = 'mongodb://localhost:32768/acortador-test';
// } else {
//     if (process.env.NODE_ENV === 'dev') {
//         urlDB = 'mongodb://localhost:32768/acortador';
//     } else {
//         urlDB = process.env.MONGO_URI;
//     }
// }

process.env.URL_DB = urlDB;

// ========
// Google Client ID
// ========
process.env.CLIENT_ID = '';
