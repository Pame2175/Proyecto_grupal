const nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "0e02d21ce27490",
      pass: "4ee721ef2b6a78"
    }
  });
// Función para enviar el correo electrónico a una lista de destinatarios
const enviarCorreo = async ({ destinatarios, subject, text }) => {
    const mailOptions = {
        from: 'pamegonza.98.pg@gmail.com', // Dirección de correo electrónico desde la que se enviará
        to: destinatarios.join(', '), // Convertir la lista de destinatarios a una cadena separada por comas
        subject: subject,
        text: text,
    };

    try {
        await transport.sendMail(mailOptions);
        console.log('Correo electrónico enviado correctamente a:', destinatarios);
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        throw new Error('Error al enviar el correo electrónico');
    }
};

module.exports = {
    enviarCorreo
};
