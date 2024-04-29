const Evento = require('../models/calendario_evento');

// Controlador para crear un nuevo evento
exports.createEvent = async (req, res) => {
    try {
        const { title, start, end, description, eventType, color } = req.body;
        const newEvent = new Evento({
            title,
            start,
            end,
            description,
            eventType,
            color
        });
        await newEvent.save();
        res.status(201).json({ message: 'Evento creado exitosamente', event: newEvent });
    } catch (error) {
        console.error('Error al crear el evento:', error);
        res.status(500).json({ error: 'Hubo un problema al crear el evento' });
    }
};

// Controlador para obtener todos los eventos
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Evento.find();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        res.status(500).json({ error: 'Hubo un problema al obtener los eventos' });
    }
};
exports.deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id; // Obtener el ID del evento de los parámetros de la solicitud
        const deletedEvent = await Evento.findByIdAndDelete(eventId); // Buscar y eliminar el evento por su ID
        if (!deletedEvent) {
            return res.status(404).json({ error: 'Evento no encontrado' }); // Si no se encuentra el evento, devolver un error 404
        }
        res.status(200).json({ message: 'Evento eliminado exitosamente', event: deletedEvent });
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
        res.status(500).json({ error: 'Hubo un problema al eliminar el evento' });
    }
};