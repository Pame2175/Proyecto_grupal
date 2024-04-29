const {UrgenciaModel} = require('../models/Urgencia.model');
const { UserModel } = require('../models/user.model')
const Mascota = require('../models/mascota.model')



module.exports = {

    createUrgencia: async (req, res) => {
       try {
        const {descripcion, lat, lng, calle, estado, titulo, user } = req.body;
        
        if (!descripcion || !lat || !lng || !calle || !titulo || !user) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        //validar que el usuario exista
        const userExist = await UserModel.findById(user);
        if (!userExist) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        console.log('user data:',userExist)
    // Obtener el nombre de la mascota del usuario
    const obtenerNombreMascotaPorUserId = async (userId) => {
        try {
            const mascota = await Mascota.findOne({ propietarioId: userId }, 'nombre');
            if (!mascota) {
                return null;
            }
            //console.log('mascota data:',mascota)
            return mascota.nombre;
        } catch (error) {
            console.error('Error al obtener el nombre de la mascota:', error);
            return null;
        }
    }
    //obtener el nombre de la mascota del usuario
    const mascotaNombre = await obtenerNombreMascotaPorUserId(userExist._id);

    if (!mascotaNombre) {
        return res.status(404).json({ error: 'Mascota no encontrada' });
    }

        // Crear nueva Urgencia
        const nuevaUrgencia = new UrgenciaModel({
            user: userExist._id,
            descripcion,
            lat,
            lng,
            calle,
            estado,
            titulo,
            user_name: `${userExist.firstName} ${userExist.lastName}`,
            mascota: mascotaNombre
        });
        console.log('urgencia data:',nuevaUrgencia)
        await nuevaUrgencia.save();
        res.status(201).json({ message: 'Urgencia creada correctamente', urgencia: nuevaUrgencia });
       } catch (error) {
        console.error('Error al crear la Urgencia:', error);
        res.status(500).json({ error: 'Error interno del servidor al crear la Urgencia' });
       }
    },

    //obtener todas las urgencias
    getAllUrgencias: async (req, res) => {
        try {
            const urgencias = await UrgenciaModel.find();
            res.status(200).json(urgencias);
        } catch (error) {
            console.error('Error al obtener las Urgencias:', error);
            res.status(500).json({ error: 'Error interno del servidor al obtener las Urgencias' });
        }
    },

    //obtener Urgencia por ID
    getUrgenciaById: async (req, res) => {
        try {
            const { id } = req.params;
            const urgencia = await UrgenciaModel.findById(id);
            if (!urgencia) {
                return res.status(404).json({ error: 'Urgencia no encontrada' });
            }
            res.status(200).json(urgencia);
        } catch (error) {
            console.error('Error al obtener la Urgencia por ID:', error);
            res.status(500).json({ error: 'Error interno del servidor al obtener la Urgencia' });
        }
    },

    //actualizar Urgencia 
    updateUrgenciaById: async (req, res) => {
        try {
            const { id } = req.params;
            const { user, descripcion, lat, lng, calle, estado, titulo, user_name, mascota } = req.body;
            const urgenciaActualizada = await UrgenciaModel.findByIdAndUpdate(
                id,
                { user, descripcion, lat, lng, calle, estado, titulo, user_name, mascota },
                { new: true }
            );
            if (!urgenciaActualizada) {
                return res.status(404).json({ error: 'Urgencia no encontrada' });
            }
            res.status(200).json(urgenciaActualizada);
        } catch (error) {
            console.error('Error al actualizar la Urgencia por ID:', error);
            res.status(500).json({ error: 'Error interno del servidor al actualizar la Urgencia' });
        }
    },

    //eliminar Urgencia por ID
    deleteUrgenciaById: async (req, res) => {
        try {
            const { id } = req.params;
            const urgenciaEliminada = await UrgenciaModel.findByIdAndDelete(id);
            if (!urgenciaEliminada) {
                return res.status(404).json({ error: 'Urgencia no encontrada' });
            }
            res.status(200).json({ message: 'Urgencia eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar la Urgencia por ID:', error);
            res.status(500).json({ error: 'Error interno del servidor al eliminar la Urgencia' });
        }
    }
}


