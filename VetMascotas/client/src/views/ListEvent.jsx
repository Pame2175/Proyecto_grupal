import React, { useState, useEffect, useContext } from "react";
import { Card, Form, FormControl, Button, Row, Col, Modal } from "react-bootstrap";
import moment from "moment";

import UserContext from "../context/UserContext";

const EventList = () => {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

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
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Filtrar eventos según el término de búsqueda
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

  const getCardColor = (color) => {
    return {
      backgroundColor: color,
      borderRadius: "5px",
      marginBottom: "10px",
    };
  };

  return (
    <div className="event-list-container">
      <Row>
        <Col>
          <Form inline className="mb-3">
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
        {filteredEvents.map(event => (
          <Col key={event._id} xs={12} sm={6} md={4} lg={3}>
            <Card className="mb-3" >
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
    </div>
  );
};

export default EventList;
