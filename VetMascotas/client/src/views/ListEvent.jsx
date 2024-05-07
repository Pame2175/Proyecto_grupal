import React, { useState, useEffect, useContext } from "react";
import { Card, Form, FormControl, Button, Row, Col, Modal, Badge } from "react-bootstrap";
import moment from "moment";
import Swal from "sweetalert2"; // Importa SweetAlert

import UserContext from "../context/UserContext";

const EventList = () => {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvents, setNewEvents] = useState(0); // Estado para la cantidad de eventos nuevos
  const [showNewEventsModal, setShowNewEventsModal] = useState(false); // Estado para controlar la visibilidad del modal de eventos nuevos
  const [newEventsList, setNewEventsList] = useState([]); // Estado para almacenar los eventos nuevos

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/mascota/events/list');
        if (!response.ok) {
          throw new Error('Error al obtener los eventos');
        }
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data); // Inicialmente, mostrar todos los eventos

        // Filtrar eventos nuevos (creados en los últimos 2 horas)
        const twoHoursAgo = moment().subtract(30, 'seconds');
        const newEvents = data.filter(event => moment(event.createdAt).isAfter(twoHoursAgo));
        setNewEventsList(newEvents);
        setNewEvents(newEvents.length);
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
      }
    };

    fetchEvents();

    // Configura el polling para verificar nuevos eventos cada 10 segundos
    const intervalId = setInterval(fetchEvents, 10000);

    // Limpia el intervalo cuando el componente se desmonta para evitar fugas de memoria
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  // Función para mostrar una notificación usando SweetAlert
  const showNotification = () => {
    Swal.fire({
      icon: 'success',
      title: 'Nuevo Evento',
      text: 'Se ha agregado un nuevo evento',
      timer: 3000, // Desaparece después de 3 segundos
      timerProgressBar: true,
      toast: true,
      position: 'top-end',
      showConfirmButton: false
    });
  };

  // Función para abrir el modal de eventos nuevos
  const handleShowNewEvents = () => {
    setShowNewEventsModal(true);
  };

  // Función para cerrar el modal de eventos nuevos
  const handleCloseNewEventsModal = () => {
    setShowNewEventsModal(false);
  };

  return (
    <div className="event-list-container">
      <Row className="mb-3">
        <Col>
          <Form inline>
            <div className="input-group">
              <FormControl
                type="text"
                placeholder="Buscar evento..."
                className="mr-sm-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="input-group-append">
                <Button variant="outline-primary">Buscar</Button>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="d-flex justify-content-between mb-3">
            <span>Eventos nuevos: <Badge variant="info">{newEvents}</Badge></span>
            <Button variant="primary" onClick={handleShowNewEvents}>Eventos nuevos</Button>
          </div>
        </Col>
      </Row>
      <Row>
        {filteredEvents.map(event => (
          <Col key={event._id} xs={12} sm={6} md={4} lg={3}>
            <Card className="mb-3" style={{ backgroundColor: event.color }}>
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Text>
                  <strong>Inicio:</strong> {moment(event.start).format("LLL")}<br />
                  <strong>Fin:</strong> {moment(event.end).format("LLL")}<br />
                  <strong>Tipo de Evento:</strong> {event.eventType}<br />
                  <Button variant="btn btn-outline-dark" onClick={() => handleEventSelect(event)}>Ver Detalles</Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal para mostrar detalles del evento */}
      <Modal show={selectedEvent !== null} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Descripción:</strong> {selectedEvent?.description}</p>
          <p><strong>Dirección:</strong> {selectedEvent?.direption}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
      {/* Modal para mostrar eventos nuevos */}

      <Modal show={showNewEventsModal} onHide={handleCloseNewEventsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Eventos Nuevos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {newEventsList.map(event => (
            <Card key={event._id} className="mb-3">
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Text>
                  <strong>Inicio:</strong> {moment(event.start).format("LLL")}<br />
                  <strong>Fin:</strong> {moment(event.end).format("LLL")}<br />
                  <strong>Tipo de Evento:</strong> {event.eventType}<br />
                  <Button variant="primary" onClick={() => handleEventSelect(event)}>Ver Detalles</Button>
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseNewEventsModal}>Cerrar</Button>
        </Modal.Footer>
      </Modal>







    </div>
  );
};

export default EventList;
