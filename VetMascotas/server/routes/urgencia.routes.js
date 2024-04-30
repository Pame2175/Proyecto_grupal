const express = require("express");
const UrgenciasController = require("../controllers/urgencias.controller");

const UrgenciaRouter = express.Router();



//API/URGENCIA
// registrar una nueva Urgencia 
UrgenciaRouter.post('/registrar-urgencia', UrgenciasController.createUrgencia);
//obtener todas las Urgencias
UrgenciaRouter.get('/lista-urgencias', UrgenciasController.getAllUrgencias);
//obtener una urgencia por id
UrgenciaRouter.get('/urgencia/:id', UrgenciasController.getUrgenciaById);
//actualizar Urgencia
UrgenciaRouter.put('/urgencia/:id', UrgenciasController.updateUrgenciaById);
//eliminar Urgencia
UrgenciaRouter.delete('/urgencia/:id', UrgenciasController.deleteUrgenciaById);



module.exports = UrgenciaRouter