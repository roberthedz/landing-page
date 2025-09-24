import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner, Badge, Table, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import apiConfig from '../config/apiConfig';

const AdminSection = styled.section`
  padding: 2rem 0;
  background-color: #f8f9fa;
  min-height: 100vh;
  margin-top: 70px;
`;

const AdminTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
  font-weight: 700;
`;

const LoginCard = styled(Card)`
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const AdminCard = styled(Card)`
  margin-bottom: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const ClickableCard = styled(Card)`
  margin-bottom: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const QuickActionButton = styled(Button)`
  margin: 0.25rem;
  min-width: 120px;
`;

const TimeButton = styled(Button)`
  margin: 0.25rem;
  min-width: 80px;
  font-size: 0.85rem;
`;

const StatusBadge = styled(Badge)`
  font-size: 0.75rem;
`;

const AdminPanel = () => {
  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Estados del panel admin
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [blockReason, setBlockReason] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  
  // Estados de datos
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState({});
  
  // Estados para modales de detalles
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

  const availableTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  // Verificar si ya hay token guardado
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      loadAdminData();
    }
  }, []);

  // Formatear fecha para API
  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Login de admin
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      console.log('🔐 Intentando login admin a:', apiConfig.endpoints.adminLogin);
      const response = await fetch(apiConfig.endpoints.adminLogin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      console.log('📡 Respuesta login:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📋 Datos login:', data);

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        loadAdminData();
      } else {
        setLoginError(data.error || 'Error de login');
      }
    } catch (error) {
      console.error('Error de login:', error);
      setLoginError(`Error de conexión: ${error.message}`);
    } finally {
      setLoginLoading(false);
    }
  };

  // Cargar datos administrativos
  const loadAdminData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('📋 Cargando datos admin desde:', apiConfig.endpoints.adminBookings);
      const response = await fetch(apiConfig.endpoints.adminBookings, {
        headers: {
          'Authorization': `Basic ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📊 Datos admin cargados:', data);
      
      if (data.success) {
        setBookings(data.bookings);
        setBookedSlots(data.bookedSlots);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error cargando datos admin:', error);
      setMessage(`Error cargando datos: ${error.message}`);
      setMessageType('danger');
    }
  };

  // Bloquear fecha completa
  const blockFullDate = async () => {
    if (!blockReason.trim()) {
      setMessage('Por favor ingresa una razón para el bloqueo');
      setMessageType('danger');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(apiConfig.endpoints.adminBlockDate, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`
        },
        body: JSON.stringify({
          date: formatDate(selectedDate),
          reason: blockReason
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ ${data.message} (${data.blockedSlots} horarios bloqueados)`);
        setMessageType('success');
        setBlockReason('');
        loadAdminData();
      } else {
        setMessage(`❌ ${data.error}`);
        setMessageType('danger');
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  // Bloquear horarios específicos
  const blockSelectedTimes = async () => {
    if (selectedTimes.length === 0) {
      setMessage('Por favor selecciona al menos un horario');
      setMessageType('danger');
      return;
    }

    if (!blockReason.trim()) {
      setMessage('Por favor ingresa una razón para el bloqueo');
      setMessageType('danger');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(apiConfig.endpoints.adminBlockTimes, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`
        },
        body: JSON.stringify({
          date: formatDate(selectedDate),
          times: selectedTimes,
          reason: blockReason
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ ${data.message}`);
        setMessageType('success');
        setSelectedTimes([]);
        setBlockReason('');
        loadAdminData();
      } else {
        setMessage(`❌ ${data.error}`);
        setMessageType('danger');
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  // Desbloquear fecha
  const unblockDate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const unblockUrl = `${apiConfig.endpoints.adminUnblockDate}/${formatDate(selectedDate)}`;
      const response = await fetch(unblockUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ ${data.message} (${data.unblockedSlots} horarios liberados)`);
        setMessageType('success');
        loadAdminData();
      } else {
        setMessage(`❌ ${data.error}`);
        setMessageType('danger');
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  // Toggle selección de horario
  const toggleTimeSelection = (time) => {
    setSelectedTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setLoginData({ username: '', password: '' });
  };

  // Funciones para manejar clicks en cards del resumen
  const handleCardClick = (type) => {
    let data = [];
    let title = '';
    
    switch (type) {
      case 'total':
        data = bookings;
        title = `Todas las Reservas (${bookings.length})`;
        break;
      case 'pending':
        data = bookings.filter(b => b.status === 'pending');
        title = `Reservas Pendientes (${data.length})`;
        break;
      case 'confirmed':
        data = bookings.filter(b => b.status === 'confirmed');
        title = `Reservas Confirmadas (${data.length})`;
        break;
      case 'slots':
        data = bookedSlots;
        title = `Horarios Bloqueados (${bookedSlots.length})`;
        break;
      default:
        return;
    }
    
    setModalData(data);
    setModalTitle(title);
    setShowModal(true);
  };

  // Obtener horarios ocupados para la fecha seleccionada
  const getOccupiedTimesForDate = () => {
    const dateStr = formatDate(selectedDate);
    return bookedSlots
      .filter(slot => slot.date === dateStr)
      .map(slot => ({
        time: slot.time,
        reason: slot.reason,
        isAdmin: slot.reason.startsWith('ADMIN:')
      }));
  };

  // Pantalla de login
  if (!isAuthenticated) {
    return (
      <AdminSection>
        <Container>
          <AdminTitle>🔐 Panel Administrativo</AdminTitle>
          <LoginCard>
            <Card.Body>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    placeholder="Ingresa tu usuario"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                </Form.Group>
                {loginError && (
                  <Alert variant="danger" className="mb-3">
                    {loginError}
                  </Alert>
                )}
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-100"
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </LoginCard>
        </Container>
      </AdminSection>
    );
  }

  const occupiedTimes = getOccupiedTimesForDate();

  // Panel administrativo principal
  return (
    <AdminSection>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <AdminTitle>🛠️ Panel Administrativo</AdminTitle>
          <Button variant="outline-danger" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>

        {/* Resumen */}
        <Row className="mb-4">
          <Col md={3}>
            <ClickableCard onClick={() => handleCardClick('total')} title="Ver todas las reservas">
              <Card.Body className="text-center">
                <h4 className="text-primary">{summary.totalBookings || 0}</h4>
                <p className="mb-0">Total Reservas</p>
                <small className="text-muted">Click para ver detalles</small>
              </Card.Body>
            </ClickableCard>
          </Col>
          <Col md={3}>
            <ClickableCard onClick={() => handleCardClick('pending')} title="Ver reservas pendientes">
              <Card.Body className="text-center">
                <h4 className="text-warning">{summary.pendingBookings || 0}</h4>
                <p className="mb-0">Pendientes</p>
                <small className="text-muted">Click para ver detalles</small>
              </Card.Body>
            </ClickableCard>
          </Col>
          <Col md={3}>
            <ClickableCard onClick={() => handleCardClick('confirmed')} title="Ver reservas confirmadas">
              <Card.Body className="text-center">
                <h4 className="text-success">{summary.confirmedBookings || 0}</h4>
                <p className="mb-0">Confirmadas</p>
                <small className="text-muted">Click para ver detalles</small>
              </Card.Body>
            </ClickableCard>
          </Col>
          <Col md={3}>
            <ClickableCard onClick={() => handleCardClick('slots')} title="Ver horarios bloqueados">
              <Card.Body className="text-center">
                <h4 className="text-info">{summary.totalSlots || 0}</h4>
                <p className="mb-0">Horarios Bloqueados</p>
                <small className="text-muted">Click para ver detalles</small>
              </Card.Body>
            </ClickableCard>
          </Col>
        </Row>

        {/* Herramienta de bloqueo de fechas */}
        <AdminCard>
          <Card.Header>
            <h5 className="mb-0">🗓️ Herramienta de Bloqueo de Fechas</h5>
          </Card.Header>
          <Card.Body>
            {message && (
              <Alert variant={messageType} className="mb-3">
                {message}
              </Alert>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Seleccionar Fecha</Form.Label>
                  <div>
                    <DatePicker
                      selected={selectedDate}
                      onChange={setSelectedDate}
                      dateFormat="MM/dd/yyyy"
                      minDate={new Date()}
                      className="form-control"
                      placeholderText="Seleccionar fecha"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Razón del Bloqueo</Form.Label>
                  <Form.Control
                    type="text"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="Ej: Vacaciones, Mantenimiento, etc."
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <QuickActionButton 
                    variant="danger" 
                    onClick={blockFullDate}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : '🚫'} Bloquear Fecha Completa
                  </QuickActionButton>
                  
                  <QuickActionButton 
                    variant="warning" 
                    onClick={blockSelectedTimes}
                    disabled={loading || selectedTimes.length === 0}
                  >
                    {loading ? <Spinner size="sm" /> : '⚠️'} Bloquear Horarios Seleccionados ({selectedTimes.length})
                  </QuickActionButton>
                  
                  <QuickActionButton 
                    variant="success" 
                    onClick={unblockDate}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : '✅'} Desbloquear Fecha
                  </QuickActionButton>
                </div>
              </Col>

              <Col md={6}>
                <h6>Seleccionar Horarios Específicos:</h6>
                <div className="mb-3">
                  {availableTimes.map(time => {
                    const occupied = occupiedTimes.find(ot => ot.time === time);
                    const isSelected = selectedTimes.includes(time);
                    
                    return (
                      <TimeButton
                        key={time}
                        variant={
                          occupied ? (occupied.isAdmin ? 'secondary' : 'danger') :
                          isSelected ? 'primary' : 'outline-primary'
                        }
                        onClick={() => !occupied && toggleTimeSelection(time)}
                        disabled={!!occupied}
                        title={occupied ? `Ocupado: ${occupied.reason}` : 'Clic para seleccionar'}
                      >
                        {time}
                        {occupied && (occupied.isAdmin ? ' 🔒' : ' 👤')}
                      </TimeButton>
                    );
                  })}
                </div>

                <h6>Estado para {formatDate(selectedDate)}:</h6>
                {occupiedTimes.length > 0 ? (
                  <div>
                    {occupiedTimes.map((slot, index) => (
                      <div key={index} className="mb-1">
                        <StatusBadge variant={slot.isAdmin ? 'secondary' : 'danger'}>
                          {slot.time}
                        </StatusBadge>
                        <small className="ms-2 text-muted">{slot.reason}</small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert variant="success" className="py-2">
                    ✅ Todos los horarios están disponibles
                  </Alert>
                )}
              </Col>
            </Row>
          </Card.Body>
        </AdminCard>

        {/* Lista de reservas recientes */}
        <AdminCard>
          <Card.Header>
            <h5 className="mb-0">📋 Reservas Recientes</h5>
          </Card.Header>
          <Card.Body>
            {bookings.length > 0 ? (
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Servicio</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Estado</th>
                    <th>Creada</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 10).map(booking => (
                    <tr key={booking.id}>
                      <td>
                        <div>
                          <strong>{booking.clientName}</strong>
                          <br />
                          <small className="text-muted">{booking.clientEmail}</small>
                        </div>
                      </td>
                      <td>{booking.service}</td>
                      <td>{booking.date}</td>
                      <td>{booking.time}</td>
                      <td>
                        <StatusBadge variant={
                          booking.status === 'confirmed' ? 'success' :
                          booking.status === 'pending' ? 'warning' :
                          booking.status === 'rejected' ? 'danger' : 'secondary'
                        }>
                          {booking.status}
                        </StatusBadge>
                      </td>
                      <td>
                        <small>{new Date(booking.createdAt).toLocaleDateString()}</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Alert variant="info">No hay reservas disponibles</Alert>
            )}
          </Card.Body>
        </AdminCard>

        {/* Modal para mostrar detalles */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalData.length > 0 ? (
              modalTitle.includes('Horarios Bloqueados') ? (
                // Vista para horarios bloqueados
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Motivo</th>
                      <th>ID Bloqueo</th>
                      <th>Creado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalData.map((slot, index) => (
                      <tr key={index}>
                        <td>{slot.date}</td>
                        <td>
                          <Badge variant="secondary">{slot.time}</Badge>
                        </td>
                        <td>
                          <span className={slot.reason.startsWith('ADMIN:') ? 'text-danger' : 'text-info'}>
                            {slot.reason}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">{slot.bookingId}</small>
                        </td>
                        <td>
                          <small>{new Date(slot.createdAt).toLocaleString()}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                // Vista para reservas
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Servicio</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Estado</th>
                      <th>Tipo</th>
                      <th>Creada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalData.map(booking => (
                      <tr key={booking.id}>
                        <td>
                          <div>
                            <strong>{booking.clientName}</strong>
                            <br />
                            <small className="text-muted">{booking.clientEmail}</small>
                            <br />
                            <small className="text-muted">{booking.clientPhone}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            {booking.service}
                            {booking.servicePrice && (
                              <div><small className="text-success">{booking.servicePrice}</small></div>
                            )}
                          </div>
                        </td>
                        <td>{booking.date}</td>
                        <td>
                          <Badge variant="primary">{booking.time}</Badge>
                        </td>
                        <td>
                          <StatusBadge variant={
                            booking.status === 'confirmed' ? 'success' :
                            booking.status === 'pending' ? 'warning' :
                            booking.status === 'rejected' ? 'danger' : 'secondary'
                          }>
                            {booking.status}
                          </StatusBadge>
                        </td>
                        <td>
                          <small className="text-muted">{booking.type}</small>
                        </td>
                        <td>
                          <small>{new Date(booking.createdAt).toLocaleString()}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )
            ) : (
              <Alert variant="info">No hay datos para mostrar</Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </AdminSection>
  );
};

export default AdminPanel;
