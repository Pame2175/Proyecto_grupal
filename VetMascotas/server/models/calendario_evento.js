const mongoose = require('mongoose');

// Definir el esquema del evento del calendario
const eventoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    direption: {
        type: String,
        trim: true,
    },
    eventType: {
        type: String,
        trim: true,
    },
    color: {
        type: String,
        trim: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});


eventoSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Evento = mongoose.model('Evento', eventoSchema);

module.exports = Evento;
