import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Alert, Card, Button, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';
import apiConfig from '../config/apiConfig';

const ConfirmationSection = styled.section`
  padding: 5rem 0;
  background-color: var(--background-color);
  min-height: 100vh;
  display: flex;
  align-items: center;
  margin-top: 70px;
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: none;
`;

const CardHeader = styled(Card.Header)`
  background-color: ${props => props.status === 'confirmed' ? 'var(--success)' : 
    props.status === 'rejected' ? 'var(--danger)' : 'var(--primary-color)'};
  padding: 1.5rem;
  color: white;
  text-align: center;
`;

const CardBody = styled(Card.Body)`
  padding: 2.5rem;
`;

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, confirmed, rejected, error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  
  const bookingId = searchParams.get('id');
  const action = searchParams.get('action');
  
  useEffect(() => {
    const processBooking = async () => {
      if (!bookingId || !action) {
        setStatus('error');
        setError('Enlace de confirmación inválido. Faltan parámetros requeridos.');
        setLoading(false);
        return;
      }
      
      try {
        // Llamar a la API para actualizar el estado de la reserva
        const response = await axios.post(`${apiConfig.API_BASE_URL}/bookings/${bookingId}/status`, { action });
        
        if (!response.data.success) {
          throw new Error(response.data.error || 'Error al procesar la reserva');
        }
        
        // Obtener los datos de la reserva desde el servidor
        const bookingResponse = await axios.get(`${apiConfig.API_BASE_URL}/bookings/${bookingId}`);
        
        if (bookingResponse.data.success && bookingResponse.data.booking) {
          setBookingData(bookingResponse.data.booking);
        }
        
        setStatus(action === 'confirm' ? 'confirmed' : 'rejected');
        
      } catch (err) {
        console.error('Error al procesar la reserva:', err);
        setStatus('error');
        setError('Hubo un problema al procesar la reserva. Por favor, inténtalo de nuevo o contacta con soporte.');
      } finally {
        setLoading(false);
      }
    };
    
    processBooking();
  }, [bookingId, action]);
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" className="mb-4" />
          <h3>Procesando solicitud...</h3>
          <p className="text-muted">Por favor, espera mientras procesamos tu solicitud.</p>
        </div>
      );
    }
    
    if (status === 'error') {
      return (
        <Alert variant="danger" className="mb-0">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error || 'Ha ocurrido un error desconocido.'}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={() => navigate('/')}>
              Volver al inicio
            </Button>
          </div>
        </Alert>
      );
    }
    
    if (status === 'confirmed') {
      return (
        <>
          <CardHeader status="confirmed">
            <h3 className="m-0">
              <i className="bi bi-check-circle-fill me-2"></i>
              Reserva Confirmada
            </h3>
          </CardHeader>
          <CardBody>
            <div className="text-center mb-4">
              <div className="display-1 text-success mb-3">
                <i className="bi bi-calendar-check"></i>
              </div>
              <h4>Has confirmado exitosamente esta reserva</h4>
              <p className="text-muted">
                Se ha enviado un correo electrónico de confirmación al cliente.
              </p>
            </div>
            
            {bookingData && (
              <Card className="bg-light border-0 mb-4">
                <Card.Body>
                  <h5 className="mb-3">Detalles de la reserva:</h5>
                  <p><strong>Cliente:</strong> {bookingData.clientName}</p>
                  <p><strong>Email:</strong> {bookingData.clientEmail}</p>
                  <p><strong>Teléfono:</strong> {bookingData.clientPhone}</p>
                  <p><strong>Servicio:</strong> {bookingData.service} ({bookingData.servicePrice})</p>
                  <p><strong>Fecha:</strong> {bookingData.date}</p>
                  <p><strong>Hora:</strong> {bookingData.time}</p>
                  <p><strong>Tipo:</strong> {bookingData.type}</p>
                  {bookingData.notes && (
                    <p><strong>Notas:</strong> {bookingData.notes}</p>
                  )}
                </Card.Body>
              </Card>
            )}
            
            <div className="d-flex justify-content-center">
              <Button variant="primary" onClick={() => navigate('/')}>
                Volver al inicio
              </Button>
            </div>
          </CardBody>
        </>
      );
    }
    
    if (status === 'rejected') {
      return (
        <>
          <CardHeader status="rejected">
            <h3 className="m-0">
              <i className="bi bi-x-circle-fill me-2"></i>
              Reserva Rechazada
            </h3>
          </CardHeader>
          <CardBody>
            <div className="text-center mb-4">
              <div className="display-1 text-danger mb-3">
                <i className="bi bi-calendar-x"></i>
              </div>
              <h4>Has rechazado esta reserva</h4>
              <p className="text-muted">
                Se ha enviado un correo electrónico al cliente informando que la reserva no pudo ser confirmada.
              </p>
            </div>
            
            {bookingData && (
              <Card className="bg-light border-0 mb-4">
                <Card.Body>
                  <h5 className="mb-3">Detalles de la reserva rechazada:</h5>
                  <p><strong>Cliente:</strong> {bookingData.clientName}</p>
                  <p><strong>Email:</strong> {bookingData.clientEmail}</p>
                  <p><strong>Servicio:</strong> {bookingData.service}</p>
                  <p><strong>Fecha:</strong> {bookingData.date}</p>
                  <p><strong>Hora:</strong> {bookingData.time}</p>
                </Card.Body>
              </Card>
            )}
            
            <div className="d-flex justify-content-center">
              <Button variant="primary" onClick={() => navigate('/')}>
                Volver al inicio
              </Button>
            </div>
          </CardBody>
        </>
      );
    }
  };
  
  return (
    <ConfirmationSection>
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <StyledCard>
              {renderContent()}
            </StyledCard>
          </div>
        </div>
      </Container>
    </ConfirmationSection>
  );
};

export default BookingConfirmation; 