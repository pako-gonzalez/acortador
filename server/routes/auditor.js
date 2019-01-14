const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();
const Auditor = require('../models/auditor');
const Url = require('../models/url');
const mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Mostrar todas las auditorias
app.get('/auditor', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Auditor.find({ usuario: req.usuario._id, })
        .sort('createdAt')
        .populate('url', 'description target')
        .populate('usuario', 'nombre email')
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

// Obtiene los clicks de todas las urls
app.get('/auditor/clicks', verificaToken, (req, res) => {
    let aggregatorOpts = [

        {
            $redact: {
                $cond: {
                    if: { "$eq": ["$usuario", req.usuario._id] },
                    then: "$$KEEP",
                    else: "$$PRUNE"
                }

            }
        },
        {
            $unwind: "$url"
        },
        {
            $group: {
                _id: "$url._id",
                count: { $sum: 1 }
            }
        },
    ];

    Auditor.aggregate(aggregatorOpts).exec((err, clicks) => {
        res.json({ ok: true, clicks: clicks, err });
    });


});

// Mostrar estadisticas por url
app.get('/auditor/:urlId', verificaToken, (req, res) => {
    let urlId = req.params.urlId;

    Auditor.aggregate()
        .match({ url: mongoose.Types.ObjectId(urlId), usuario: mongoose.Types.ObjectId(req.usuario._id) })
        .project({ createdAt: 1, count: 1 })
        .group({
            _id: {
                'url': '$url',
                'usuario': '$usuario',
                'date': {
                    "$dateToString": {
                        "date": "$createdAt",
                        "format": "%Y-%m-%d",
                    }
                },
            },
            count: { $sum: 1 }
        })
        .exec((err, data) => {
            labels = [];
            stats = [];
            data.forEach(element => {
                labels.push(element._id.date);
                stats.push(element.count);
            });

            res.json({
                ok: true,
                labels,
                stats
            });
        });
});




module.exports = app;