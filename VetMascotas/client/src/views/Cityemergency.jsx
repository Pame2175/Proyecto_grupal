import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Swal from 'sweetalert2';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [eventModalIsOpen, setEventModalIsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('week');
  const initialDate = new Date(2024, 5, 1);
  const [formData, setFormData] = useState({
    title: "", 
    date: "",
    time: "",
    day: "",
    description: "",
    eventType: "",
    eventColor: "",
  });
  const [selectableTimes, setSelectableTimes] = useState([]);
  const [isDayView, setIsDayView] = useState(true); // Variable de estado para controlar si estás en la vista de día o de hora

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/mascota/events/list');
        if (!response.ok) {
          throw new Error('Error al obtener los eventos');
        }
        const data = await response.json();
        const eventsWithId = data.map((event, index) => ({
          ...event,
          id: index,
        }));
        setEvents(eventsWithId);
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
      }
    };

    fetchEvents();
  }, []);

 
  const handleSlotSelect = (slotInfo) => {
    const selectedDay = moment(slotInfo.start).startOf('day'); // Fecha seleccionada sin horas
  
    // Obtener la fecha actual sin horas
    const today = moment().startOf('day');
  
    // Verificar si la fecha seleccionada es anterior al día actual
    if (selectedDay.isBefore(today)) {
      Swal.fire({
        icon: 'error',
        title: 'Fecha no permitida',
        text: 'No puedes seleccionar fechas pasadas.',
      });
      return;
    }
  
    const selectedDayOfWeek = moment(slotInfo.start).isoWeekday();
  
    // Verificar si es domingo
    if (selectedDayOfWeek === 7) {
      Swal.fire({
        icon: 'error',
        title: 'Día no permitido',
        text: 'No puedes agendar eventos los domingos.',
      });
      return;
    }
  
    setSelectedSlot(slotInfo);
    setIsDayView(moment(slotInfo.start).hours() === 0); // Establece la vista como de día si la hora es 00:00
    setCreateModalIsOpen(true);
    setFormData({
      title: "", 
      date: moment(slotInfo.start).format("LL"),
      time: moment(slotInfo.start).format("HH:mm"), 
      day: moment(slotInfo.start).format("dddd"),
      description: "",
      eventType: "",
      eventColor: "",
    });
  
    setSelectableTimes(getSelectableTimes(moment(slotInfo.start).format("dddd")));
  };
  
  
  const handleCloseCreateModal = () => {
    setCreateModalIsOpen(false);
  };

  const handleCloseEventModal = () => {
    setEventModalIsOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/mascota/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          start: selectedSlot.start,
          end: selectedSlot.end,
          description: formData.description,
          eventType: formData.eventType,
          color: formData.eventColor,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error al enviar el evento');
      }
  
      const data = await response.json();
      console.log('Evento enviado exitosamente:', data);
  
      setEvents([...events, data.event]);
  
      setCreateModalIsOpen(false);
  
      // Mostrar el mensaje de éxito con un botón OK y redireccionar al usuario
      Swal.fire({
        icon: 'success',
        title: 'Evento enviado exitosamente',
        showConfirmButton: true,
        allowOutsideClick: false, // Habilitar clics fuera del diálogo
      }).then((result) => {
        if (result.isConfirmed) {
          // Redireccionar al usuario a la vista deseada al hacer clic en OK
          window.location.reload();// Cambiar '/mi-vista' por la URL de la vista deseada
        }
      });
    } catch (error) {
      console.error('Error al enviar el evento:', error);
    }
  };
  

  
  
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setEventModalIsOpen(true);
    
    console.log("ID del evento seleccionado:", event._id);
  };
  
  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/mascota/events/${selectedEvent._id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el evento');
      }
  
      setEvents(events.filter(ev => ev._id !== selectedEvent._id));
      setEventModalIsOpen(false);
  
      Swal.fire({
        icon: 'success',
        title: 'Evento eliminado exitosamente',
        showConfirmButton: false,
        timer: 1500 
      });
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
    }
  };

  const getSelectableTimes = (day) => {
    if (day === 'domingo') {
      return [];
    } else {
      const times = [];
      for (let i = 9; i <= 23; i++) {
        times.push(moment().set('hour', i).set('minute', 0).toDate());
      }
      return times;
    }
  };

  return (
    <div>
      <div style={{ height: 500 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSlotSelect}
          onSelectEvent={handleEventSelect}
          eventPropGetter={(event, start, end, isSelected) => ({
            style: {
              backgroundColor: event.color,
            },
          })}
          selectableTimes={selectableTimes}
          defaultDate={initialDate}
         
          
        />
      </div>
      <Modal show={!isDayView && createModalIsOpen} onHide={handleCloseCreateModal}> {/* Mostrar el modal solo si no estás en la vista de día */}
        <Modal.Header closeButton>
          <Modal.Title>Crear Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Título del Evento:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Descripción:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div>
              <label>Tipo de Evento:</label>
              <input
                type="text"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Color del Evento:</label>
              <input
                type="color"
                name="eventColor"
                value={formData.eventColor}
                onChange={handleChange}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={eventModalIsOpen} onHide={handleCloseEventModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              <p><strong>Título:</strong> {selectedEvent.title}</p>
              <p><strong>Inicio:</strong> {moment(selectedEvent.start).format("LLL")}</p>
              <p><strong>Fin:</strong> {moment(selectedEvent.end).format("LLL")}</p>
              <p><strong>Descripción:</strong> {selectedEvent.description}</p>
              <p><strong>Tipo de Evento:</strong> {selectedEvent.eventType}</p>
              <p><strong>Color del Evento:</strong> {selectedEvent.color}</p>
              <Button variant="danger" onClick={() => {
                Swal.fire({
                  title: '¿Estás seguro?',
                  text: "No podrás revertir esto",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Sí, eliminarlo!'
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleDeleteEvent();
                  }
                })
              }}>Eliminar</Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEventModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyCalendar;
