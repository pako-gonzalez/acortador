const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();
const Url = require('../models/url');
const Auditor = require('../models/auditor');
const shortid = require('shortid');
const requestIp = require('request-ip');

// Mostrar todas las urls
app.get('/url', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Url.find({ usuario: req.usuario._id, })
        .sort('description')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, urls) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            Url.countDocuments(null, (err, cont) => {
                res.json({
                    ok: true,
                    urls,
                    num: cont
                });
            })
        });
});

// Mostrar una url por ID
app.get('/url/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Url.find({ _id: id, usuario: req.usuario._id }, (err, urlDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }
        if (!urlDB) {
            return res.status(404).json({ ok: false, err: { message: 'URL no encontrada' } });
        }
        res.json({
            ok: true,
            url: urlDB
        });
    });

});

// Crear nueva URL
app.post('/url', verificaToken, (req, res) => {

    let body = req.body;

    var short = shortid.generate();

    let url = new Url({
        description: body.description,
        target: body.target,
        short: short,
        usuario: req.usuario._id,
        activa: true
    });

    url.save((err, urlDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!urlDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            url: urlDB
        });
    });
});

// Actualiza una URL
app.put('/url/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let updatedUrl = {
        description: body.description,
        target: body.target,
    };

    Url.findOneAndUpdate({ _id: id, usuario: req.usuario._id }, updatedUrl, { new: true, runValidators: true }, (err, urlDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!urlDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'URL no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            url: urlDB
        });
    });
});

// Elimina una URL
app.delete('/url/:id', [verificaToken], (req, res) => {
    let id = req.params.id;
    Url.findOneAndRemove({ _id: id, usuario: req.usuario._id }, (err, urlDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!urlDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        res.json({
            ok: true,
            url: urlDB,
            message: 'URL eliminada'
        });
    });
});

app.get('/*', (req, res) => {

    const clientIp = requestIp.getClientIp(req)

    let termino = req.params[0];
    var regex = new RegExp('^[a-zA-Z0-9_\-]*$', 'g');

    if (!regex.test(termino)) {
        return res.status(500).json({
            ok: false,
            message: 'Cadena de texto incorrecta'
        });
    }

    Url.find({ short: termino, active: true }, (err, urls) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (urls.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'URL corta no encontrada'
            });
        }

        let audit = new Auditor({
            ip: clientIp,
            url: urls[0]
        });

        audit.save();

        res.redirect(urls[0].target);
    });

});

module.exports = app;