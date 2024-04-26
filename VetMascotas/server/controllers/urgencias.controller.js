const {UrgenciaModel} = require('../models/Urgencia.model');
const { UserModel } = require('../models/user.model')
const { MascotaModel } = require('../models/mascota.model')


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
        // //buscar mascota del usuario
        // const mascotasDelUsuario = await MascotaModel.find({ propietarioId: userExist._id });
        // if (!mascotasDelUsuario) {
        //     return res.status(404).json({ error: 'Mascotas no encontradas' });
        // }
        //  // Obtener nombres de mascotas del usuario
        //  const nombresDeMascotas = mascotasDelUsuario.map(mascota => mascota.nombre);

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
            //mascotas: nombresDeMascotas
        });
        await nuevaUrgencia.save();
        res.status(201).json({ message: 'Urgencia creada correctamente' });
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
       }

