const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();
const Auditor = require('../models/auditor');

// Mostrar todas las auditorias
app.get('/auditor', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Auditor.find({})
        .sort('createdAt')
        .populate('url', 'description target')
        .skip(desde)
        .limit(limite)
        .exec((err, auditors) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            Auditor.countDocuments(null, (err, cont) => {
                res.json({
                    ok: true,
                    auditors,
                    num: cont
                });
            })
        });
});



module.exports = app;