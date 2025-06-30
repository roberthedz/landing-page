import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Container, Row, Col, Form, Button, Card, Alert, Spinner, Badge } from 'react-bootstrap';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import emailConfig from '../config/emailTemplates';
import apiConfig from '../config/apiConfig';
import axios from 'axios';

const BookingSection = styled.section`
  padding: 5rem 0;
  background-color: var(--background-color);
  background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  margin-top: 70px;
`;

const BookingTitle = styled.h2`
  text-align: center;
  font-size: 2.8rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-weight: 700;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: var(--secondary-color);
    border-radius: 2px;
  }
`;

const BookingSubtitle = styled.p`
  text-align: center;
  max-width: 700px;
  margin: 2rem auto 3rem;
  font-size: 1.1rem;
  color: var(--text-color);
  line-height: 1.6;
`;

const StyledForm = styled(Form)`
  background-color: var(--white);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  }
`;

const FormSection = styled.div`
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border-left: 4px solid var(--secondary-color);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const FormSectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const FormSectionIcon = styled.span`
  font-size: 1.5rem;
  color: var(--secondary-color);
  margin-right: 1rem;
`;

const FormSectionTitle = styled.h4`
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.3rem;
  margin: 0;
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
`;

const FormLabelIcon = styled.span`
  font-size: 1.2rem;
  color: var(--secondary-color);
  margin-right: 0.5rem;
`;

const StyledInput = styled(Form.Control)`
  border-radius: 8px;
  padding: 0.75rem 1rem;
  border: 1px solid #ced4da;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: var(--secondary-color);
    box-shadow: 0 0 0 0.25rem rgba(74, 97, 99, 0.25);
  }
`;

const StyledTextArea = styled(Form.Control)`
  border-radius: 8px;
  padding: 0.75rem 1rem;
  border: 1px solid #ced4da;
  transition: all 0.3s ease;
  min-height: 180px;
  width: 100%;
  resize: vertical;
  font-size: 1.05rem;
  
  &:focus {
    border-color: var(--secondary-color);
    box-shadow: 0 0 0 0.25rem rgba(74, 97, 99, 0.25);
  }
`;

const ServiceCard = styled(Card)`
  cursor: pointer;
  transition: all 0.3s ease;
  border: ${props => props.selected ? `2px solid var(--secondary-color)` : '1px solid #dee2e6'};
  background-color: ${props => props.selected ? 'rgba(74, 97, 99, 0.1)' : 'var(--white)'};
  border-radius: 10px;
  overflow: hidden;
  height: 100%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .card-body {
    padding: 1.5rem;
  }
`;

const ServiceCardHeader = styled.div`
  background-color: ${props => props.selected ? 'var(--secondary-color)' : '#f8f9fa'};
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: ${props => props.id === 'chaircraft-revive' 
      ? 'url(/images/chair-service.jpg)'
      : props.id === 'vase-visionaries'
      ? 'url(/images/vase-service.jpg)'
      : props.id === 'timeless-tablecraft'
      ? 'url(/images/table-service.jpg)'
      : 'url(/images/lighting-service.jpg)'};
    background-size: cover;
    background-position: center;
    opacity: ${props => props.selected ? '0.2' : '0.1'};
    z-index: 0;
  }
  
  h5 {
    margin: 0;
    color: ${props => props.selected ? 'white' : 'var(--primary-color)'};
    font-weight: 600;
    position: relative;
    z-index: 1;
  }
`;

const ServicePrice = styled.p`
  font-weight: 700;
  color: var(--secondary-color);
  font-size: 1.5rem;
  margin: 1rem 0;
  text-align: center;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 2px;
    background-color: var(--secondary-color);
    border-radius: 2px;
  }
`;

const ServiceDescription = styled.p`
  color: var(--text-color);
  font-size: 0.95rem;
  line-height: 1.5;
`;

const AppointmentTypeCard = styled(Card)`
  cursor: pointer;
  transition: all 0.3s ease;
  border: ${props => props.selected ? `2px solid var(--secondary-color)` : '1px solid #dee2e6'};
  background-color: ${props => props.selected ? 'rgba(74, 97, 99, 0.1)' : 'var(--white)'};
  text-align: center;
  border-radius: 10px;
  overflow: hidden;
  height: 100%;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .card-body {
    padding: 1.5rem;
  }
`;

const AppointmentTypeIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--secondary-color);
`;

const StyledAlert = styled(Alert)`
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  
  h3 {
    color: var(--primary-color);
    font-weight: 600;
    margin-bottom: 1rem;
  }
`;

const StyledSpinner = styled(Spinner)`
  margin-right: 10px;
`;

const StyledFormGroup = styled(Form.Group)`
  margin-bottom: 1.5rem;
`;

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }
  
  .react-datepicker__input-container input {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid #ced4da;
    transition: all 0.3s ease;
  }
  
  .react-datepicker__input-container input:focus {
    border-color: var(--secondary-color);
    box-shadow: 0 0 0 0.25rem rgba(74, 97, 99, 0.25);
    outline: none;
  }
`;

const CustomDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 8px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  
  &:focus {
    border-color: var(--secondary-color);
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(74, 97, 99, 0.25);
  }
`;

const SubmitButton = styled(Button)`
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
  padding: 0.8rem 2.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 2rem;
  border-radius: 50px;
  color: var(--white);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
    color: var(--white);
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    background-color: var(--gray);
    border-color: var(--gray);
  }
`;

const TimeSlotContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
`;

const TimeSlot = styled.div`
  margin: 0.3rem;
  padding: 0.4rem 0.8rem;
  background-color: ${props => props.selected ? 'var(--secondary-color)' : 'white'};
  color: ${props => props.selected ? 'white' : props.disabled ? '#aaa' : 'var(--secondary-color)'};
  border: 1px solid ${props => props.disabled ? '#ddd' : 'var(--secondary-color)'};
  border-radius: 50px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.7 : 1};
  font-size: 0.95rem;
  text-align: center;
  min-width: 70px;
  
  &:hover {
    background-color: ${props => props.disabled ? 'white' : 'var(--secondary-color)'};
    color: ${props => props.disabled ? '#aaa' : 'white'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }
`;

const TimeSection = styled.div`
  margin-bottom: 0.5rem;
`;

const TimeSectionTitle = styled.h6`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
  font-size: 0.95rem;
`;

const ErrorText = styled.div`
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.25rem;
`;

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [appointmentType, setAppointmentType] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [error, setError] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const formRef = useRef();
  
  const services = [
    {
      id: 'consulta-online-60',
      title: 'Consulta Online',
      price: '$180',
      description: 'Sesión de 60 minutos donde te asesoramos para crear un espacio armonioso y funcional que refleje tu personalidad y estilo.',
      image: '/images/service1.jpg',
      tag: 'Básico',
      duration: '60 min'
    },
    {
      id: 'consulta-online-120',
      title: 'Consulta Online',
      price: '$300',
      description: 'Sesión extendida de 120 minutos para un asesoramiento más detallado sobre tendencias, estilos y decisiones para lograr un resultado impactante.',
      image: '/images/service2.jpg',
      tag: 'Completo',
      duration: '120 min'
    },
    {
      id: 'paquete-esencial',
      title: 'Paquete Esencial',
      price: '$450',
      description: 'Transformación de una habitación con guía profesional que incluye reunión inicial, moodboard, paleta de colores y propuesta de distribución.',
      image: '/images/service3.jpg',
      tag: 'Popular',
      duration: 'Por Habitación'
    },
    {
      id: 'paquete-intermedio',
      title: 'Paquete Intermedio',
      price: '$750',
      description: 'Servicio personalizado con dos propuestas decorativas, paleta detallada, plano 2D, reuniones de revisión y lista de compras recomendadas.',
      image: '/images/service4.jpg',
      tag: 'Recomendado',
      duration: 'Por Habitación'
    },
    {
      id: 'paquete-premium',
      title: 'Paquete Premium',
      price: '$1,150',
      description: 'Diseño exclusivo y detallado con acompañamiento integral, render 3D profesional, guía de montaje y seguimiento personalizado del proyecto.',
      image: '/images/service5.jpg',
      tag: 'Premium',
      duration: 'Por Habitación'
    }
  ];
  
  // Horarios disponibles predefinidos
  const morningTimes = ['9:00', '10:00', '11:00'];
  const afternoonTimes = ['14:00', '15:00', '16:00', '17:00'];
  
  // Cargar horarios ocupados al montar el componente
  useEffect(() => {
    const loadBookedSlots = async () => {
      setLoadingSlots(true);
      try {
        // Obtener los horarios ocupados desde la API
        console.log('Cargando horarios ocupados desde:', apiConfig.endpoints.bookedSlots);
        const response = await axios.get(apiConfig.endpoints.bookedSlots);
        console.log('Horarios ocupados cargados:', response.data);
        setBookedSlots(response.data);
      } catch (error) {
        console.error('Error al cargar horarios ocupados:', error);
        // Fallback a localStorage si la API falla
        const storedBookedSlots = JSON.parse(localStorage.getItem('bookedSlots') || '[]');
        setBookedSlots(storedBookedSlots);
      } finally {
        setLoadingSlots(false);
      }
    };
    
    loadBookedSlots();
  }, []);
  
  // Verificar si un horario está ocupado
  const isTimeSlotBooked = (date, time) => {
    if (!date) return false;
    
    const formattedDate = formatDate(date);
    console.log('Verificando si el horario está ocupado:', formattedDate, time);
    console.log('Horarios ocupados:', bookedSlots);
    
    const isBooked = bookedSlots.some(slot => 
      slot.date === formattedDate && slot.time === time
    );
    
    console.log('¿Está ocupado?', isBooked);
    return isBooked;
  };
  
  const handleServiceSelect = (service, setFieldValue) => {
    setSelectedService(service);
    setFieldValue('service', service.id);
  };
  
  const handleAppointmentTypeSelect = (type, setFieldValue) => {
    setAppointmentType(type);
    setFieldValue('appointmentType', type);
  };
  
  const handleTimeSelect = (time, setFieldValue) => {
    // Verificar si el horario está ocupado
    if (selectedDate && isTimeSlotBooked(selectedDate, time)) {
      return; // No permitir seleccionar horarios ocupados
    }
    
    setSelectedTime(time);
    setFieldValue('time', time);
  };
  
  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    email: Yup.string().email('Ingresa un correo electrónico válido').required('El correo electrónico es obligatorio'),
    phone: Yup.string().required('El teléfono es obligatorio'),
    service: Yup.string().required('Debes seleccionar un servicio'),
    appointmentType: Yup.string().required('Debes seleccionar un tipo de cita'),
    date: Yup.date().nullable().required('Debes seleccionar una fecha'),
    time: Yup.string().required('Debes seleccionar un horario').test(
      'not-booked',
      'Este horario ya está ocupado',
      function(value) {
        const { date } = this.parent;
        if (!date || !value) return true;
        return !isTimeSlotBooked(date, value);
      }
    )
  });
  
  const initialValues = {
    name: '',
    email: '',
    phone: '',
    notes: '',
    service: '',
    appointmentType: '',
    date: null,
    time: ''
  };
  
  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar una vez más si el horario está ocupado
      if (isTimeSlotBooked(values.date, values.time)) {
        throw new Error('Este horario ya está ocupado. Por favor, selecciona otro horario.');
      }
      
      // Encontrar el objeto de servicio completo
      const serviceObj = services.find(s => s.id === values.service);
      
      // Generar un ID único para la reserva
      const bookingId = `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      console.log('Enviando solicitud a:', apiConfig.endpoints.bookings);
      
      // Crear la reserva en el servidor
      const bookingResponse = await axios.post(apiConfig.endpoints.bookings, {
        id: bookingId,
        clientName: values.name,
        clientEmail: values.email,
        clientPhone: values.phone,
        service: serviceObj.title,
        servicePrice: serviceObj.price,
        date: formatDate(values.date),
        time: values.time,
        type: values.appointmentType,
        notes: values.notes || ''
      });
      
      console.log('Respuesta de creación de reserva:', bookingResponse.data);
      
      if (!bookingResponse.data.success) {
        throw new Error('Error al crear la reserva');
      }
      
      // Construir las URLs para confirmar/rechazar
      const confirmUrl = `${window.location.origin.replace(':3001', ':3000')}/confirm-booking?id=${bookingId}&action=confirm`;
      const rejectUrl = `${window.location.origin.replace(':3001', ':3000')}/confirm-booking?id=${bookingId}&action=reject`;
      
      console.log('URL de confirmación:', confirmUrl);
      console.log('URL de rechazo:', rejectUrl);
      
      // Enviar emails de notificación
      console.log('Enviando solicitud a:', apiConfig.endpoints.sendBookingEmail);
      const emailResponse = await axios.post(apiConfig.endpoints.sendBookingEmail, {
        clientEmail: values.email,
        clientName: values.name,
        bookingDetails: {
          service: serviceObj.title,
          date: formatDate(values.date),
          time: values.time,
          type: values.appointmentType,
          phone: values.phone,
          notes: values.notes || ''
        },
        confirmUrl,
        rejectUrl
      });
      
      console.log('Respuesta de envío de email:', emailResponse.data);
      
      if (!emailResponse.data.success) {
        throw new Error('Error al enviar las notificaciones por email');
      }
      
      // Guardar los datos de la reserva en localStorage para referencia futura
      // En un entorno real, esto se haría solo en el servidor
      const pendingBookings = JSON.parse(localStorage.getItem('pendingBookings') || '[]');
      pendingBookings.push({
        id: bookingId,
        status: 'pending',
        clientName: values.name,
        clientEmail: values.email,
        clientPhone: values.phone,
        service: serviceObj.title,
        servicePrice: serviceObj.price,
        date: formatDate(values.date),
        time: values.time,
        type: values.appointmentType,
        notes: values.notes,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('pendingBookings', JSON.stringify(pendingBookings));
      
      console.log('Solicitud de reserva enviada:', bookingId);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error al procesar la reserva:', err);
      if (err.response) {
        console.error('Detalles del error:', err.response.data);
        setError(`Error: ${err.response.data.error || 'Hubo un problema al procesar tu reserva. Por favor, inténtalo de nuevo.'}`);
      } else if (err.request) {
        console.error('No se recibió respuesta del servidor');
        setError('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet e inténtalo de nuevo.');
      } else {
        setError('Hubo un problema al procesar tu reserva. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };
  
  const resetForm = async () => {
    // Reiniciar estados locales
    setSelectedDate(null);
    setSelectedTime('');
    setSelectedService(null);
    setAppointmentType('');
    setIsSubmitted(false);
    setError(null);
    
    // Recargar los horarios ocupados para tener la información más actualizada
    try {
      console.log('Recargando horarios ocupados...');
      const response = await axios.get(apiConfig.endpoints.bookedSlots);
      console.log('Horarios ocupados actualizados:', response.data);
      setBookedSlots(response.data);
    } catch (error) {
      console.error('Error al recargar horarios ocupados:', error);
    }
    
    // Forzar un refresco de la página para asegurar que todo se reinicie correctamente
    window.location.reload();
  };

  // Renderizar los horarios disponibles
  const renderTimeSlots = (times, values, setFieldValue) => {
    return times.map(time => {
      const isBooked = isTimeSlotBooked(values.date, time);
      return (
        <Badge
          key={time}
          bg={selectedTime === time ? "secondary" : isBooked ? "danger" : "light"}
          text={selectedTime === time ? "white" : isBooked ? "white" : "dark"}
          className={`mx-2 mb-2 py-2 px-3 ${!values.date ? 'opacity-50' : isBooked ? 'opacity-70' : 'cursor-pointer'}`}
          style={{ 
            backgroundColor: selectedTime === time ? 'var(--secondary-color)' : 
                             isBooked ? '#dc3545' : '',
            borderColor: isBooked ? '#dc3545' : 'var(--secondary-color)',
            border: selectedTime !== time && !isBooked ? '1px solid' : '',
            cursor: isBooked ? 'not-allowed' : 'pointer'
          }}
          onClick={() => {
            if (values.date && !isBooked) {
              handleTimeSelect(time, setFieldValue);
            } else if (isBooked) {
              // Mostrar mensaje de que el horario está ocupado
              alert('Este horario ya está ocupado. Por favor, selecciona otro horario.');
            }
          }}
        >
          {time} {isBooked && <i className="bi bi-lock-fill ms-1"></i>}
        </Badge>
      );
    });
  };

  return (
    <section className="py-5 bg-light min-vh-100 d-flex align-items-center" style={{ marginTop: '70px' }}>
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold position-relative d-inline-block">
            Agenda tu Cita
            <div className="position-absolute start-50 translate-middle-x" style={{ width: '80px', height: '3px', backgroundColor: 'var(--primary-color)', borderRadius: '2px', bottom: '-10px' }}></div>
          </h2>
          <p className="lead text-muted mt-4 col-md-8 mx-auto">
            Selecciona el servicio, fecha y hora que prefieras para tu consulta de decoración de interiores.
          </p>
        </div>
        
        {isSubmitted ? (
          <Alert variant="success" className="p-4 text-center shadow-sm">
            <div className="mb-3">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
            </div>
            <h3 className="text-success mb-3">¡Solicitud Recibida!</h3>
            <p className="mb-3">Hemos recibido tu solicitud de cita. Te hemos enviado un correo electrónico con los detalles.</p>
            <p className="mb-3"><strong>Tu reserva está pendiente de confirmación.</strong> Recibirás un email cuando sea aprobada por nuestro equipo.</p>
            <p className="mb-4">Si tienes alguna pregunta, no dudes en contactarnos.</p>
            <div className="d-grid gap-2 col-md-6 mx-auto">
              <Button 
                variant="primary" 
                size="lg"
                onClick={resetForm}
                className="rounded-pill px-4 py-3"
              >
                <i className="bi bi-calendar-plus me-2"></i>
                Hacer otra reserva
              </Button>
            </div>
          </Alert>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ 
              values, 
              errors, 
              touched, 
              handleChange, 
              handleBlur, 
              handleSubmit, 
              isSubmitting, 
              setFieldValue,
              isValid,
              dirty
            }) => (
              <Form onSubmit={handleSubmit} className="bg-white p-4 rounded-3 shadow-sm">
                {error && (
                  <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </Alert>
                )}
                
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-light border-0 py-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-grid-3x3-gap fs-4 me-3" style={{ color: 'var(--primary-color)' }}></i>
                      <h4 className="m-0 fw-semibold" style={{ color: 'var(--primary-color)' }}>Selecciona un Servicio</h4>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row xs={1} md={4} className="g-4">
                      {services.map(service => (
                        <Col key={service.id} className="d-flex">
                          <Card 
                            className={`card-hover w-100 ${selectedService && selectedService.id === service.id ? 'border-secondary bg-light' : 'border'}`}
                            onClick={() => handleServiceSelect(service, setFieldValue)}
                            style={{ cursor: 'pointer' }}
                          >
                            <Card.Header 
                              className={`text-center py-3 ${selectedService && selectedService.id === service.id ? 'bg-secondary text-white' : 'bg-light'}`}
                              style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <h5 className="m-0">{service.title}</h5>
                            </Card.Header>
                            <Card.Body className="text-center d-flex flex-column">
                              <h3 className="text-secondary fw-bold mb-3">{service.price}</h3>
                              <Card.Text className="flex-grow-1" style={{ height: '100px', overflow: 'auto' }}>{service.description}</Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    {touched.service && errors.service && (
                      <ErrorText className="text-center mt-3">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.service}
                      </ErrorText>
                    )}
                  </Card.Body>
                </Card>
                
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-light border-0 py-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-calendar2-check fs-4 me-3" style={{ color: 'var(--primary-color)' }}></i>
                      <h4 className="m-0 fw-semibold" style={{ color: 'var(--primary-color)' }}>Tipo de Cita</h4>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row xs={1} md={2} className="g-4">
                      <Col className="d-flex">
                        <Card 
                          className={`card-hover w-100 text-center ${appointmentType === 'presencial' ? 'border-secondary bg-light' : 'border'}`}
                          onClick={() => handleAppointmentTypeSelect('presencial', setFieldValue)}
                          style={{ cursor: 'pointer' }}
                        >
                          <Card.Body className="p-4 d-flex flex-column justify-content-center" style={{ minHeight: '200px' }}>
                            <div className="mb-3 text-secondary">
                              <i className="bi bi-building fs-1"></i>
                            </div>
                            <Card.Title className="fw-bold">Presencial</Card.Title>
                            <Card.Text>Visita a nuestro estudio (medio día)</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col className="d-flex">
                        <Card 
                          className={`card-hover w-100 text-center ${appointmentType === 'online' ? 'border-secondary bg-light' : 'border'}`}
                          onClick={() => handleAppointmentTypeSelect('online', setFieldValue)}
                          style={{ cursor: 'pointer' }}
                        >
                          <Card.Body className="p-4 d-flex flex-column justify-content-center" style={{ minHeight: '200px' }}>
                            <div className="mb-3 text-secondary">
                              <i className="bi bi-laptop fs-1"></i>
                            </div>
                            <Card.Title className="fw-bold">Online</Card.Title>
                            <Card.Text>Videollamada (1 hora)</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    {touched.appointmentType && errors.appointmentType && (
                      <ErrorText className="text-center mt-3">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.appointmentType}
                      </ErrorText>
                    )}
                  </Card.Body>
                </Card>
                
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-light border-0 py-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-calendar-date fs-4 me-3" style={{ color: 'var(--primary-color)' }}></i>
                      <h4 className="m-0 fw-semibold" style={{ color: 'var(--primary-color)' }}>Fecha y Hora</h4>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row>
                      <Col md={6} className="mb-4 mb-md-0">
                        <h5 className="mb-3 d-flex align-items-center justify-content-center">
                          <i className="bi bi-calendar-date me-2" style={{ color: 'var(--primary-color)' }}></i>
                          Fecha
                        </h5>
                        <div className="d-flex justify-content-center align-items-center">
                          <DatePicker
                            selected={values.date}
                            onChange={(date) => {
                              setSelectedDate(date);
                              setFieldValue('date', date);
                              // Resetear la hora seleccionada cuando se cambia la fecha
                              setSelectedTime('');
                              setFieldValue('time', '');
                            }}
                            minDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Selecciona una fecha"
                            inline
                          />
                        </div>
                        {touched.date && errors.date && (
                          <ErrorText className="text-center mt-2">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.date}
                          </ErrorText>
                        )}
                      </Col>
                      
                      <Col md={6}>
                        <h5 className="mb-3 d-flex align-items-center justify-content-center">
                          <i className="bi bi-clock me-2" style={{ color: 'var(--primary-color)' }}></i>
                          Horarios Disponibles
                        </h5>
                        
                        {loadingSlots ? (
                          <div className="text-center py-4">
                            <Spinner animation="border" variant="secondary" />
                            <p className="mt-2">Cargando horarios disponibles...</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="fw-semibold mb-2">Mañana</p>
                            <div className="d-flex flex-wrap justify-content-center mb-4">
                              {renderTimeSlots(morningTimes, values, setFieldValue)}
                            </div>
                            
                            <p className="fw-semibold mb-2">Tarde</p>
                            <div className="d-flex flex-wrap justify-content-center">
                              {renderTimeSlots(afternoonTimes, values, setFieldValue)}
                            </div>
                          </div>
                        )}
                        
                        {!values.date && (
                          <p className="text-muted text-center mt-3 small">
                            <i className="bi bi-info-circle me-1"></i>
                            Selecciona una fecha para habilitar los horarios
                          </p>
                        )}
                        
                        {values.date && (
                          <div className="text-center mt-3">
                            <Badge bg="light" text="dark" className="me-2 py-1 px-2">
                              <i className="bi bi-circle-fill text-secondary me-1"></i> Disponible
                            </Badge>
                            <Badge bg="danger" text="white" className="py-1 px-2">
                              <i className="bi bi-lock-fill me-1"></i> Ocupado
                            </Badge>
                          </div>
                        )}
                        
                        {touched.time && errors.time && values.date && (
                          <ErrorText className="text-center mt-2">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.time}
                          </ErrorText>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-light border-0 py-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-person-vcard fs-4 me-3" style={{ color: 'var(--primary-color)' }}></i>
                      <h4 className="m-0 fw-semibold" style={{ color: 'var(--primary-color)' }}>Información Personal</h4>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row className="mb-3">
                      <Col md={6} className="mb-3 mb-md-0">
                        <Form.Group>
                          <Form.Label className="fw-semibold d-flex align-items-center">
                            <i className="bi bi-person me-2" style={{ color: 'var(--primary-color)' }}></i>
                            Nombre Completo
                          </Form.Label>
                          <Form.Control 
                            type="text" 
                            name="name" 
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Ingresa tu nombre completo"
                            className={`py-2 ${touched.name && errors.name ? 'is-invalid' : ''}`}
                          />
                          {touched.name && errors.name && (
                            <ErrorText>
                              <i className="bi bi-exclamation-circle me-1"></i>
                              {errors.name}
                            </ErrorText>
                          )}
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold d-flex align-items-center">
                            <i className="bi bi-envelope me-2" style={{ color: 'var(--primary-color)' }}></i>
                            Email
                          </Form.Label>
                          <Form.Control 
                            type="email" 
                            name="email" 
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="correo@ejemplo.com"
                            className={`py-2 ${touched.email && errors.email ? 'is-invalid' : ''}`}
                          />
                          {touched.email && errors.email && (
                            <ErrorText>
                              <i className="bi bi-exclamation-circle me-1"></i>
                              {errors.email}
                            </ErrorText>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label className="fw-semibold d-flex align-items-center">
                            <i className="bi bi-telephone me-2" style={{ color: 'var(--primary-color)' }}></i>
                            Teléfono
                          </Form.Label>
                          <Form.Control 
                            type="tel" 
                            name="phone" 
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Tu número de contacto"
                            className={`py-2 ${touched.phone && errors.phone ? 'is-invalid' : ''}`}
                          />
                          {touched.phone && errors.phone && (
                            <ErrorText>
                              <i className="bi bi-exclamation-circle me-1"></i>
                              {errors.phone}
                            </ErrorText>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-light border-0 py-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-chat-square-text fs-4 me-3" style={{ color: 'var(--primary-color)' }}></i>
                      <h4 className="m-0 fw-semibold" style={{ color: 'var(--primary-color)' }}>Descripción del Proyecto</h4>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Form.Group>
                      <Form.Label className="fw-semibold d-flex align-items-center">
                        <i className="bi bi-pencil-square me-2" style={{ color: 'var(--primary-color)' }}></i>
                        Cuéntanos más sobre tu proyecto o cualquier detalle que debamos saber
                      </Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={6}
                        name="notes" 
                        value={values.notes}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Describe tu proyecto, necesidades específicas, ideas o cualquier detalle importante que debamos conocer para ayudarte mejor."
                        className="py-2"
                        style={{ resize: 'vertical' }}
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
                
                <div className="text-center mt-4">
                  <Button 
                    type="submit"
                    className="rounded-pill px-5 py-3 fw-semibold btn-shine"
                    style={{ 
                      backgroundColor: 'var(--primary-color)', 
                      borderColor: 'var(--primary-color)',
                      color: 'white'
                    }}
                    disabled={isSubmitting || isLoading}
                  >
                    {isLoading || isSubmitting ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-calendar-check me-2"></i>
                        Confirmar Reserva
                      </>
                    )}
                  </Button>
                  
                  {!isValid && Object.keys(touched).length > 0 && (
                    <div className="mt-3">
                      <Alert variant="warning" className="py-2 px-3 d-inline-block">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Por favor, completa todos los campos requeridos
                      </Alert>
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        )}
      </Container>
    </section>
  );
};

export default Booking; 