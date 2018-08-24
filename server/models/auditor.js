const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let auditorSchema = new Schema({
    ip: {
        type: String
    },
    url: {
        type: Schema.Types.ObjectId,
        ref: 'Url'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Auditor', auditorSchema);