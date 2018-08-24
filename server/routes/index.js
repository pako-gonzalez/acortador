const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./upload'));
app.use(require('./imagenes'));
app.use(require('./auditor'));
app.use(require('./url'));

module.exports = app;