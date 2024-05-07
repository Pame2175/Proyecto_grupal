import React, { useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import Swal from 'sweetalert2';
import { Form, Button, Row, Col } from "react-bootstrap";
import "../css_calendar/MyCalendar.css"; // Importa tu archivo CSS personalizado
import UserContext from "../context/UserContext";
import "../css_calendar/MyCalendar.css"; // Importar estilos personalizados

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const { user } = useContext(UserContext);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    direction: "",
    direption: "",
    eventType: "",
    eventColor: "",
    ownerId: user._id,
    startTime: "",
    endTime: ""

  });


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/mascota/events/list');
        if (!response.ok) {
          throw new Error('Error al obtener los eventos');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
      }
    };

    fetchEvents();
  }, []);

  const enviarCorreo = async () => {
    try {
      const correoResponse = await fetch('http://localhost:8000/api/mascota/enviar-correos', {
        method: 'POST',
      });

      if (!correoResponse.ok) {
        throw new Error('Error al enviar correos electrónicos');
      }
    } catch (error) {
      console.error('Error al enviar correos electrónicos:', error);
    }
  };


  const handleSlotSelect = (slotInfo) => {
    const selectedDay = moment(slotInfo.start).startOf('day');
    const today = moment().startOf('day');

    if (selectedDay.isBefore(today)) {
      Swal.fire({
        icon: 'error',
        title: 'Fecha no permitida',
        text: 'No puedes seleccionar fechas pasadas.',
      });
      return;
    }

    const selectedDayOfWeek = moment(slotInfo.start).isoWeekday();

    if (selectedDayOfWeek === 7) {
      Swal.fire({
        icon: 'error',
        title: 'Día no permitido',
        text: 'No puedes agendar eventos los domingos.',
      });
      return;
    }

    // Verificar si ya hay dos eventos en el día seleccionado
    const eventsInSelectedDay = events.filter(event => moment(event.start).isSame(selectedDay, 'day'));
    if (eventsInSelectedDay.length >= 2) {
      Swal.fire({
        icon: 'error',
        title: 'Máximo de eventos alcanzado',
        text: 'Solo se permiten dos eventos por día.',
      });
      return;
    }

    setSelectedSlot(slotInfo);
    setFormData({
      ...formData,
      startTime: moment(slotInfo.start).format("YYYY-MM-DDTHH:mm"),
      endTime: moment(slotInfo.end).format("YYYY-MM-DDTHH:mm")
    });
  };



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Alerta de confirmación antes de enviar el evento
    const confirmation = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas enviar este evento y notificar por correo electrónico?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmation.isConfirmed) return; // Si el usuario cancela, no se envía el evento

    try {
      const response = await fetch('http://localhost:8000/api/mascota/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          start: formData.startTime,
          end: formData.endTime,
          description: formData.description,
          direption: formData.direption,
          eventType: formData.eventType,
          color: formData.eventColor,
          ownerId: user._id,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el evento');
      }
         // Envía el correo electrónico después de enviar el evento
       
     

      const data = await response.json();
      console.log('Evento enviado exitosamente:', data);
      window.location.reload();
      await enviarCorreo();
      setEvents([...events, data.event]);
      setSelectedSlot(null); // Desaparecer el formulario

      // Mostrar alerta de éxito
      Swal.fire({
        icon: 'success',
        title: 'Evento enviado exitosamente',
        showConfirmButton: false,
        timer: 1500 // Cerrar automáticamente después de 1.5 segundos
      });

     

    } catch (error) {
      console.error('Error al enviar el evento:', error);
    }
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    Swal.fire({
      title: 'Detalles del Evento',
      html: `
        <p><strong>Título:</strong> ${event.title}</p>
        <p><strong>Inicio:</strong> ${moment(event.start).format("LLL")}</p>
        <p><strong>Fin:</strong> ${moment(event.end).format("LLL")}</p>
        <p><strong>Descripción:</strong> ${event.description}</p>
        <p><strong>Tipo de Evento:</strong> ${event.eventType}</p>
        <p><strong>Color del Evento:</strong> <span style="color:${event.color}">${event.color}</span></p>
      `,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cerrar'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteConfirmation(event._id);
      }
    });
  };

  const handleDeleteConfirmation = (eventId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez eliminado, no podrás recuperar este evento.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteEvent(eventId);
      }
    });
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/mascota/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el evento');
      }

      setEvents(events.filter(ev => ev.id !== eventId));

      // Mostrar alerta de éxito
      Swal.fire({
        icon: 'success',
        title: 'Evento eliminado exitosamente',
        showConfirmButton: false,
        timer: 1500 // Cerrar automáticamente después de 1.5 segundos
      });
      window.location.reload();
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
    }
  };

  // Función para obtener el estilo de cada evento en el calendario
  const eventStyleGetter = (event, start, end, isSelected) => {
    return {
      style: {
        backgroundColor: event.color, // Establecer el color de fondo del evento
        borderRadius: "5px",
        opacity: 0.8,
        color: "black",
        border: "none",
        display: "block",
      },
    };
  };

  return (
    <div className="calendar-container">
    <Row>
  <Col sm={12} md={6}>
    <div className="calendar-wrapper">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSlotSelect}
        onSelectEvent={handleEventSelect}
        eventPropGetter={eventStyleGetter}
        style={{ height: 500, width: "100%" }}
      />
    </div>
  </Col>
  <Col sm={12} md={6}>
    <div className="form-wrapper">
      {selectedSlot && (
        <Form onSubmit={handleSubmit} className="my-form">
          <Form.Label className="title-label">Agregar Evento:</Form.Label>

          <Form.Group controlId="title" className="mb-3">
            <Form.Label>Título del Evento:</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="description">
                <Form.Label>Descripción:</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="direption">
                <Form.Label>Dirección:</Form.Label>
                <Form.Control
                  type="text"
                  name="direption"
                  value={formData.direption}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="eventType" className="mb-3">
            <Form.Label>Tipo de Evento:</Form.Label>
            <Form.Control
              as="select"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona el tipo de evento</option>
              <option value="Reunión">Reunión</option>
              <option value="Conferencia">Conferencia</option>
              <option value="Fiesta">Fiesta</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="eventColor" className="mb-3">
            <Form.Label>Color del Evento:</Form.Label>
            <Form.Control
              type="color"
              name="eventColor"
              value={formData.eventColor}
              onChange={handleChange}
            />
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="startTime">
                <Form.Label>Hora de inicio:</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  min="09:00"
                  max="22:00"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="endTime">
                <Form.Label>Hora de fin:</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  min="09:00"
                  max="22:00"
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Form>
      )}
    </div>
  </Col>
</Row>

    </div>
  );
};

export default MyCalendar;
