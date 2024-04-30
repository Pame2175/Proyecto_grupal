// sendEmail.js
const nodemailer = require("nodemailer");

async function sendEmail(toList, subject, text) {
  try {
    // Configuración del transporte de correo para Gmail
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'pamegonza.98.pg@gmail.com', // Tu dirección de correo electrónico de Gmail
        pass: '' // Tu contraseña de Gmail
      }
    });

    // Opciones del mensaje
    let mailOptions = {
      from: '"Tu Nombre" <tu_correo@gmail.com>', // Nombre y dirección de correo electrónico del remitente
      to: toList.join(', '), // Lista de destinatarios separados por coma
      subject: subject, // Línea de asunto
      text: text // Cuerpo del correo electrónico en formato de texto
    };

    // Enviar el correo electrónico
    let info = await transporter.sendMail(mailOptions);
    console.log("Correo electrónico enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
    throw new Error("Error al enviar el correo electrónico");
  }
}

module.exports = sendEmail;
