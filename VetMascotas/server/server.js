const { PORT } = require("./config/settings");
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser"); // to be able to read cookies

const http = require("http"); // módulo para crear un servidor HTTP
const { Server } = require("socket.io");

//modelo de urgencia
const {UrgenciaModel} = require("./models/Urgencia.model");

const server = http.createServer(app); // Crear servidor HTTP con Express
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cookieParser());

const corsOptions = {
  credentials: true, // Allow credentials (cookies) to be sent to/from origin
  origin: "http://localhost:5173", // Allow only this origin
  methods: "GET, POST, PUT, PATCH, DELETE", // Allow these methods
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./config/mongoose.config");

const PlayerRouter = require("./routes/mascotas.routes");
app.use("/api/mascota", PlayerRouter);

const UserRouter = require("./routes/user.routes");
app.use("/api/auth", UserRouter);

//RUTA PARA URGENCIA
const UrgenciaRouter = require("./routes/urgencia.routes");
app.use("/api/urgencia", UrgenciaRouter);

// Conexiones de Socket.io
io.on("connection", (socket) => {
    console.log("Usuario conectado");
    socket.on("disconnect", () => {
        console.log("Usuario desconectado");
    });

    socket.on("formularioEnviado", (urgencia) => {
        console.log("Formulario enviado:", urgencia);
        io.emit("nuevaSolicitud", {message:"Nueva solicitud recibida", urgencia:urgencia});
    });

    // Agregar evento para actualizar el estado de la Urgencia
    socket.on("actualizarCampo", ({id, estado }) => {
        UrgenciaModel.findOneAndUpdate({ _id: id }, { estado })
            .then((urgenciaActualizada) => {
                console.log("Urgencia actualizada:", urgenciaActualizada);
                io.emit("urgenciaActualizada", urgenciaActualizada);
            })
            .catch((error) => {
                console.error("Error al actualizar la Urgencia:", error);
            });
    });




});



server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
