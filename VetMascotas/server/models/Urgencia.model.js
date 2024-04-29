const mongoose = require('mongoose');
const User = require('./user.model');

const UrgenciaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user_name: {
        type: String,
    },
    mascota: {
        type: String,
        default: ''
    },
    titulo: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    descripcion: {
        type: String,
        required: true
    },
    lat:{
        type: String,
    },
    lng:{
        type: String,
    },
    calle:{
        type: String,
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'Atendida', 'En proceso'],
        default: 'Pendiente'
    }
});




module.exports.UrgenciaModel = mongoose.model('Urgencia', UrgenciaSchema);

