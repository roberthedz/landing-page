import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge, Table, Modal, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import apiConfig from '../config/apiConfig';
import axios from 'axios';

const DashboardSection = styled.section`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 0;
`;

const DashboardHeader = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const HeaderTitle = styled.h1`
  color: #2c3e50;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const HeaderSubtitle = styled.p`
  color: #7f8c8d;
  margin: 0;
  font-size: 1.1rem;
`;

const StatsCard = styled(Card)`
  border: none;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StatsIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  background: ${props => props.bgColor || '#3498db'};
  color: white;
`;

const StatsNumber = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #2c3e50;
`;

const StatsLabel = styled.p`
  color: #7f8c8d;
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
`;

const ActionButton = styled(Button)`
  border-radius: 8px;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  margin: 0.25rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const BookingsTable = styled(Table)`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  thead th {
    background: #2c3e50;
    color: white;
    border: none;
    font-weight: 600;
    padding: 1rem;
  }
  
  tbody td {
    padding: 1rem;
    border-color: #f8f9fa;
    vertical-align: middle;
  }
  
  tbody tr:hover {
    background-color: #f8f9fa;
  }
`;

const StatusBadge = styled(Badge)`
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
`;

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  // Verificar autenticación
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  // Cargar reservas
  useEffect(() => {
    console.log('🔧 DEBUG AdminDashboard - Configuración:');
    console.log('  - apiConfig.endpoints.adminBlockSlot:', apiConfig.endpoints.adminBlockSlot);
    console.log('  - apiConfig.endpoints.adminUnblockSlot:', apiConfig.endpoints.adminUnblockSlot);
    console.log('  - selectedDate inicial:', selectedDate);
    console.log('  - selectedSlot inicial:', selectedSlot);
    loadBookings();
  }, []);


  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiConfig.endpoints.adminBookings);
      
      if (response.data.success) {
        setBookings(response.data.bookings || []);
      } else {
        setError('Error al cargar las reservas');
      }
    } catch (error) {
      console.error('Error cargando reservas:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };



  const handleBlockSlot = async () => {
    if (!selectedSlot) {
      alert('Por favor selecciona un horario');
      return;
    }

    try {
      setActionLoading(true);
      
      const formattedDate = selectedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      console.log('🔧 DEBUG AdminDashboard - handleBlockSlot:');
      console.log('  - selectedDate:', selectedDate);
      console.log('  - formattedDate:', formattedDate);
      console.log('  - selectedSlot:', selectedSlot);
      console.log('  - endpoint:', apiConfig.endpoints.adminBlockSlot);
      
      const requestData = {
        date: formattedDate,
        time: selectedSlot
      };
      console.log('  - requestData:', requestData);
      
      const response = await axios.post(apiConfig.endpoints.adminBlockSlot, requestData);
      
      console.log('  - response:', response);
      console.log('  - response.data:', response.data);
      
      if (response.data.success) {
        alert(`Horario ${selectedSlot} bloqueado exitosamente`);
        setShowBlockModal(false);
        setSelectedSlot('');
        loadBookings();
      } else {
        alert(response.data.error || 'Error al bloquear el horario');
      }
    } catch (error) {
      console.error('❌ Error bloqueando horario:', error);
      console.error('  - error.response:', error.response);
      console.error('  - error.message:', error.message);
      console.error('  - error.config:', error.config);
      
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Error al bloquear el horario');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblockSlot = async () => {
    if (!selectedSlot) {
      alert('Por favor selecciona un horario');
      return;
    }

    try {
      setActionLoading(true);
      
      const formattedDate = selectedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      console.log('🔧 DEBUG AdminDashboard - handleUnblockSlot:');
      console.log('  - selectedDate:', selectedDate);
      console.log('  - formattedDate:', formattedDate);
      console.log('  - selectedSlot:', selectedSlot);
      console.log('  - endpoint:', apiConfig.endpoints.adminUnblockSlot);
      
      const requestData = {
        date: formattedDate,
        time: selectedSlot
      };
      console.log('  - requestData:', requestData);
      
      const response = await axios.post(apiConfig.endpoints.adminUnblockSlot, requestData);
      
      console.log('  - response:', response);
      console.log('  - response.data:', response.data);
      
      if (response.data.success) {
        alert(`Horario ${selectedSlot} desbloqueado exitosamente`);
        setShowUnblockModal(false);
        setSelectedSlot('');
        loadBookings();
      } else {
        alert(response.data.error || 'Error al desbloquear el horario');
      }
    } catch (error) {
      console.error('❌ Error desbloqueando horario:', error);
      console.error('  - error.response:', error.response);
      console.error('  - error.message:', error.message);
      console.error('  - error.config:', error.config);
      
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Error al desbloquear el horario');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta reserva? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await axios.delete(apiConfig.endpoints.adminDeleteBooking(bookingId));
      
      if (response.data.success) {
        alert('Reserva eliminada exitosamente');
        loadBookings();
      } else {
        alert('Error al eliminar la reserva');
      }
    } catch (error) {
      console.error('Error eliminando reserva:', error);
      alert('Error al eliminar la reserva');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    const statusText = {
      'pending': 'pendiente',
      'confirmed': 'confirmada',
      'rejected': 'rechazada'
    };

    if (!window.confirm(`¿Estás seguro de que quieres cambiar el estado de esta reserva a ${statusText[newStatus]}?`)) {
      return;
    }

    try {
      const response = await axios.put(apiConfig.endpoints.adminUpdateBookingStatus(bookingId), {
        status: newStatus
      });
      
      if (response.data.success) {
        alert(`Reserva actualizada a ${statusText[newStatus]}`);
        loadBookings();
      } else {
        alert('Error al actualizar la reserva');
      }
    } catch (error) {
      console.error('Error actualizando reserva:', error);
      alert('Error al actualizar la reserva');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', text: 'Pendiente' },
      confirmed: { variant: 'success', text: 'Confirmada' },
      rejected: { variant: 'danger', text: 'Rechazada' },
      cancelled: { variant: 'secondary', text: 'Cancelada' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <StatusBadge bg={config.variant}>{config.text}</StatusBadge>;
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    rejected: bookings.filter(b => b.status === 'rejected').length
  };

  // Horarios disponibles (deben coincidir con Booking.js y server.js)
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  if (loading) {
    return (
      <DashboardSection>
        <Container>
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
            <p className="mt-3">Cargando dashboard...</p>
          </div>
        </Container>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection>
      <Container>
        <DashboardHeader>
          <Row className="align-items-center">
            <Col md={8}>
              <HeaderTitle>📊 Panel de Administración</HeaderTitle>
              <HeaderSubtitle>Gestión de reservas y horarios - DEdecor</HeaderSubtitle>
            </Col>
            <Col md={4} className="text-end">
              <Button variant="outline-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </Button>
            </Col>
          </Row>
        </DashboardHeader>

        {error && (
          <Alert variant="danger" className="mb-4">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        {/* Estadísticas */}
        <Row className="mb-4">
          <Col md={3}>
            <StatsCard className="text-center p-4">
              <StatsIcon bgColor="#3498db">
                <i className="bi bi-calendar-check"></i>
              </StatsIcon>
              <StatsNumber>{stats.total}</StatsNumber>
              <StatsLabel>Total Reservas</StatsLabel>
            </StatsCard>
          </Col>
          <Col md={3}>
            <StatsCard className="text-center p-4">
              <StatsIcon bgColor="#f39c12">
                <i className="bi bi-clock"></i>
              </StatsIcon>
              <StatsNumber>{stats.pending}</StatsNumber>
              <StatsLabel>Pendientes</StatsLabel>
            </StatsCard>
          </Col>
          <Col md={3}>
            <StatsCard className="text-center p-4">
              <StatsIcon bgColor="#27ae60">
                <i className="bi bi-check-circle"></i>
              </StatsIcon>
              <StatsNumber>{stats.confirmed}</StatsNumber>
              <StatsLabel>Confirmadas</StatsLabel>
            </StatsCard>
          </Col>
          <Col md={3}>
            <StatsCard className="text-center p-4">
              <StatsIcon bgColor="#e74c3c">
                <i className="bi bi-x-circle"></i>
              </StatsIcon>
              <StatsNumber>{stats.rejected}</StatsNumber>
              <StatsLabel>Rechazadas</StatsLabel>
            </StatsCard>
          </Col>
        </Row>

        {/* Acciones de Gestión */}
        <Row className="mb-4">
          <Col>
            <Card className="p-4">
              <h5 className="mb-3">
                <i className="bi bi-gear me-2"></i>
                Gestión de Horarios
              </h5>
              <div className="d-flex flex-wrap justify-content-center">
                <ActionButton 
                  variant="warning" 
                  size="lg"
                  onClick={() => setShowBlockModal(true)}
                  className="me-3 mb-2"
                >
                  <i className="bi bi-clock-fill me-2"></i>
                  Bloquear Horario
                </ActionButton>
                <ActionButton 
                  variant="success" 
                  size="lg"
                  onClick={() => setShowUnblockModal(true)}
                  className="mb-2"
                >
                  <i className="bi bi-clock me-2"></i>
                  Desbloquear Horario
                </ActionButton>
              </div>
              <div className="text-center mt-3">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Selecciona una fecha y un horario específico para bloquear/desbloquear
                </small>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Lista de Reservas */}
        <Row>
          <Col>
            <Card className="p-4">
              <h5 className="mb-3">
                <i className="bi bi-list-ul me-2"></i>
                Últimas Reservas
              </h5>
              <BookingsTable responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Email</th>
                    <th>Servicio</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <code>{booking.id}</code>
                      </td>
                      <td>{booking.clientName}</td>
                      <td>{booking.clientEmail}</td>
                      <td>{booking.service}</td>
                      <td>{booking.date}</td>
                      <td>{booking.time}</td>
                      <td>{getStatusBadge(booking.status)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline-primary"
                            onClick={() => window.open(`/booking-confirmation/${booking._id}`, '_blank')}
                            title="Ver detalles"
                          >
                            <i className="bi bi-eye"></i>
                          </Button>
                          
                          {booking.status !== 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline-warning"
                              onClick={() => handleUpdateBookingStatus(booking._id, 'pending')}
                              title="Poner en pendiente"
                            >
                              <i className="bi bi-clock"></i>
                            </Button>
                          )}
                          
                          {booking.status !== 'confirmed' && (
                            <Button 
                              size="sm" 
                              variant="outline-success"
                              onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}
                              title="Confirmar reserva"
                            >
                              <i className="bi bi-check"></i>
                            </Button>
                          )}
                          
                          {booking.status !== 'rejected' && (
                            <Button 
                              size="sm" 
                              variant="outline-danger"
                              onClick={() => handleUpdateBookingStatus(booking._id, 'rejected')}
                              title="Rechazar reserva"
                            >
                              <i className="bi bi-x"></i>
                            </Button>
                          )}
                          
                          <Button 
                            size="sm" 
                            variant="outline-dark"
                            onClick={() => handleDeleteBooking(booking._id)}
                            title="Eliminar reserva"
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </BookingsTable>
            </Card>
          </Col>
        </Row>

        {/* Modal para Bloquear Horario */}
        <Modal show={showBlockModal} onHide={() => setShowBlockModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="bi bi-clock-fill me-2"></i>
              Bloquear Horario
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="MM/dd/yyyy"
                  className="form-control"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Horario</Form.Label>
                <Form.Select 
                  value={selectedSlot} 
                  onChange={(e) => setSelectedSlot(e.target.value)}
                >
                  <option value="">Selecciona un horario</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Selecciona el horario específico que deseas bloquear
                </Form.Text>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowBlockModal(false)}>
              Cancelar
            </Button>
            <Button 
              variant="warning" 
              onClick={handleBlockSlot}
              disabled={actionLoading || !selectedSlot}
            >
              {actionLoading ? 'Procesando...' : 'Bloquear Horario'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para Desbloquear Horario */}
        <Modal show={showUnblockModal} onHide={() => setShowUnblockModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="bi bi-clock me-2"></i>
              Desbloquear Horario
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="MM/dd/yyyy"
                  className="form-control"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Horario</Form.Label>
                <Form.Select 
                  value={selectedSlot} 
                  onChange={(e) => setSelectedSlot(e.target.value)}
                >
                  <option value="">Selecciona un horario</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Selecciona el horario específico que deseas desbloquear
                </Form.Text>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUnblockModal(false)}>
              Cancelar
            </Button>
            <Button 
              variant="success" 
              onClick={handleUnblockSlot}
              disabled={actionLoading || !selectedSlot}
            >
              {actionLoading ? 'Procesando...' : 'Desbloquear Horario'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </DashboardSection>
  );
};

export default AdminDashboard;
