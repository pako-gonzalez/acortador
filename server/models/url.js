const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let urlSchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'La descripción es necesaria']
    },
    target: {
        type: String,
        unique: true,
        required: [true, 'La URL de destino es necesaria']
    },
    short: {
        type: String,
        unique: true,
        required: [true, 'La URL corta de destino es necesaria']
    },
    active: {
        type: Boolean,
        default: true,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    clicks: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Url', urlSchema);