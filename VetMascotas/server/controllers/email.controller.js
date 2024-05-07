const User = require('../models/user.model');
const { enviarCorreo } = require('../config/email.config');

exports.enviarCorreosUsuarios = async (req, res) => {
    try {
        const users = await User.find();
        
        console.log("Lista de usuarios:", users); 
        for (const user of users) {
            await enviarCorreo({
                destinatarios: [user.email], // Aquí solo necesitas el correo del usuario como destinatario
                subject: 'Asunto del correo',
                text: 'Cuerpo del correo electrónico aquí'
            });
        }
    
        return res.status(200).json({ msg: 'Emails enviados' });
    } catch (error) {
        console.error('Error al enviar los correos electrónicos:', error);
        return res.status(500).json({ error: 'Hubo un problema al enviar los correos electrónicos' });
    }
};
