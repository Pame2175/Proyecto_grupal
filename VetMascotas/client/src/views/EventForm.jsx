import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from 'axios';
import UserContext from '../context/UserContext';
import { useContext } from "react";

const EventForm = ({ event, slotInfo, onDataChange, mascota, horariosVeterinarios}) => {
  const [formData, setFormData] = useState({
    title: event ? event.title : "",
    startDate: event ? moment(event.start).format("YYYY-MM-DD") : "",
    startTime: event ? moment(event.start).format("HH:mm") : "",
    endDate: event ? moment(event.end).format("YYYY-MM-DD") : "",
    endTime: event ? moment(event.end).format("HH:mm") : "",
    veterinario: "",
  });

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (slotInfo) {
      setFormData({
        ...formData,
        startDate: moment(slotInfo.start).format("YYYY-MM-DD"),
        startTime: moment(slotInfo.start).format("HH:mm"),
        endDate: moment(slotInfo.end).format("YYYY-MM-DD"),
        endTime: moment(slotInfo.end).format("HH:mm"),
      });
    }
  }, [slotInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startDateTime = moment(`${formData.startDate} ${formData.startTime}`, "YYYY-MM-DD HH:mm");
    const endDateTime = moment(`${formData.endDate} ${formData.endTime}`, "YYYY-MM-DD HH:mm");
    const eventData = {
      title: formData.title,
      start: startDateTime.toDate(),
      end: endDateTime.toDate(),
      veterinario: formData.veterinario,
    };
    onDataChange(eventData);
  };

  const fechaTexto = moment(formData.startDate).format("DD/MM/YYYY");
  const horaTexto = moment(formData.startTime, "HH:mm").format("hh:mm A");
  const diaTexto = moment(formData.startDate).format("dddd");

  const [veterinariosDisponibles, setVeterinariosDisponibles] = useState([]);
  useEffect(() => {
    const obtenerVeterinariosDisponibles = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/veterinarios`, {
          params: {
            dia: moment(formData.startDate).format("dddd").toLowerCase(),
            hora: formData.startTime
          }
        });
        setVeterinariosDisponibles(response.data);
      } catch (error) {
        console.error('Error al obtener los veterinarios disponibles:', error);
      }
    };
    obtenerVeterinariosDisponibles();
  }, [formData.startDate, formData.startTime]);

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5 className="card-title">Detalles del Evento</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="mascotaNombre" className="form-label">
              Nombre de la Mascota:
            </label>
            <input
              type="text"
              id="mascotaNombre"
              name="mascotaNombre"
              value={mascota.nombre} 
              readOnly
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="mascotaNombre" className="form-label">
              Propietario:
            </label>
            <input
              type="text"
              id="propietario"
              name="mascotaNombre"
              value={mascota.propietarioId.firstName} 
              readOnly
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Título:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="fecha" className="form-label">
              Fecha:
            </label>
            <input
              type="text"
              id="fecha"
              name="fecha"
              value={fechaTexto}
              readOnly
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="hora" className="form-label">
              Hora:
            </label>
            <input
              type="text"
              id="hora"
              name="hora"
              value={horaTexto}
              readOnly
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="dia" className="form-label">
              Día:
            </label>
            <input
              type="text"
              id="dia"
              name="dia"
              value={diaTexto}
              readOnly
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="veterinario" className="form-label">
              Veterinario:
            </label>
            <select
              id="veterinario"
              name="veterinario"
              value={formData.veterinario}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Seleccionar Veterinario</option>
              {veterinariosDisponibles.map(veterinario => (
                <option key={veterinario._id} value={veterinario._id}>{veterinario.nombre}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
