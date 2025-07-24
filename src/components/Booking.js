import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Container, Row, Col, Form, Button, Card, Alert, Spinner, Badge } from 'react-bootstrap';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import emailConfig from '../config/emailTemplates';
import apiConfig from '../config/apiConfig';

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

const Booking = ({ preloadedData = {} }) => {
  console.log("=== COMPONENTE BOOKING SE ESTÁ EJECUTANDO ===");
  
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
  
  // Referencias para las secciones
  const serviceSectionRef = useRef();
  const dateTimeSectionRef = useRef();
  const personalInfoSectionRef = useRef();
  const projectDescriptionSectionRef = useRef();
  
  const services = [
    {
      id: 'consulta-online-60',
      title: 'Consulta Online',
      price: '$180',
      description: 'Sesión de 60 minutos donde te asesoramos para crear un espacio armonioso y funcional que refleje tu personalidad y estilo.',
      image: '/images/service1.jpg',
      tag: 'Básico',
      duration: '60 min',
      type: 'asesoria-basica'
    },
    {
      id: 'consulta-online-120',
      title: 'Consulta Online',
      price: '$300',
      description: 'Sesión extendida de 120 minutos para un asesoramiento más detallado sobre tendencias, estilos y decisiones para lograr un resultado impactante.',
      image: '/images/service2.jpg',
      tag: 'Completo',
      duration: '120 min',
      type: 'asesoria-basica'
    },
    {
      id: 'paquete-esencial',
      title: 'Paquete Esencial',
      price: 'Estimado GRATIS',
      description: 'Transformación de una habitación con guía profesional que incluye reunión inicial, moodboard, paleta de colores y propuesta de distribución.',
      image: '/images/service3.jpg',
      tag: 'Popular',
      duration: 'Por Habitación',
      type: 'asesoria-completa'
    },
    {
      id: 'paquete-intermedio',
      title: 'Paquete Intermedio',
      price: 'Estimado GRATIS',
      description: 'Servicio personalizado con dos propuestas decorativas, paleta detallada, plano 2D, reuniones de revisión y lista de compras recomendadas.',
      image: '/images/service4.jpg',
      tag: 'Recomendado',
      duration: 'Por Habitación',
      type: 'asesoria-completa'
    },
    {
      id: 'paquete-premium',
      title: 'Paquete Premium',
      price: 'Estimado GRATIS',
      description: 'Diseño exclusivo y detallado con acompañamiento integral, render 3D profesional, guía de montaje y seguimiento personalizado del proyecto.',
      image: '/images/service5.jpg',
      tag: 'Premium',
      duration: 'Por Habitación',
      type: 'asesoria-completa'
    }
  ];
  
  // Horarios disponibles predefinidos
  const morningTimes = ['9:00 AM', '10:00 AM', '11:00 AM'];
  const afternoonTimes = ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
  
  // Función optimizada para cargar horarios ocupados con cache inteligente
  const loadBookedSlots = useCallback(async (forceRefresh = false, selectedDateParam = null) => {
    setLoadingSlots(true);
    setError(null);
    
    try {
      // Obtener la fecha seleccionada (del estado o parámetro)
      const dateToQuery = selectedDateParam || selectedDate;
      if (!dateToQuery) {
        setBookedSlots([]);
        setLoadingSlots(false);
        return;
      }
      
      const formattedDate = formatDate(dateToQuery);
      
      // 🚀 ESTRATEGIA 1: Usar datos precargados si están disponibles
      if (preloadedData[formattedDate] && !forceRefresh) {
        console.log(`⚡ Usando datos precargados para ${formattedDate}`);
        setBookedSlots(preloadedData[formattedDate]);
        setLoadingSlots(false);
        return;
      }
      
      // 🚀 ESTRATEGIA 2: Verificar cache local
      const cachedTimestamp = localStorage.getItem('cachedTimestamp');
      const cachedData = localStorage.getItem('cachedBookedSlots');
      
      if (cachedData && cachedTimestamp && !forceRefresh) {
        const timeDiff = Date.now() - parseInt(cachedTimestamp);
        const cacheValidTime = 2 * 60 * 1000; // 2 minutos
        
        if (timeDiff < cacheValidTime) {
          const parsedData = JSON.parse(cachedData);
          if (parsedData[formattedDate]) {
            console.log(`📋 Usando cache local para ${formattedDate}`);
            setBookedSlots(parsedData[formattedDate]);
            setLoadingSlots(false);
            return;
          }
        }
      }
      
      // 🚀 ESTRATEGIA 3: Hacer petición a la API con reintentos
      const endpoint = `${apiConfig.endpoints.bookedSlots}?date=${formattedDate}`;
      console.log('🌐 Cargando horarios ocupados desde API:', endpoint);
      
      // Implementar reintentos automáticos (3 veces con intervalo de 1 segundo)
      let response = null;
      let lastError = null;
      
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`Intento ${attempt}/3 de cargar horarios ocupados...`);
          response = await apiConfig.getCachedRequest(endpoint);
          console.log('Horarios ocupados cargados exitosamente:', response.data);
          break; // Si llegamos aquí, la petición fue exitosa
        } catch (error) {
          lastError = error;
          console.error(`Error en intento ${attempt}/3:`, error);
          
          // Si es el último intento, no esperar
          if (attempt < 3) {
            console.log(`Esperando 1 segundo antes del siguiente intento...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      // Si después de 3 intentos no tenemos respuesta, lanzar el último error
      if (!response) {
        throw lastError || new Error('No se pudo cargar los horarios después de 3 intentos');
      }
      
      // Validar que la respuesta tenga la estructura correcta
      if (response.data && response.data.success && Array.isArray(response.data.bookedSlots)) {
        console.log(`✅ Procesando ${response.data.bookedSlots.length} horarios ocupados para ${formattedDate}`);
        
        // 🚀 ESTRATEGIA 4: Actualizar cache local
        const currentCache = JSON.parse(localStorage.getItem('cachedBookedSlots') || '{}');
        currentCache[formattedDate] = response.data.bookedSlots;
        localStorage.setItem('cachedBookedSlots', JSON.stringify(currentCache));
        localStorage.setItem('cachedTimestamp', Date.now().toString());
        
        setBookedSlots(response.data.bookedSlots);
      } else if (Array.isArray(response.data)) {
        console.log('📋 Usando formato de respuesta directo (array)');
        setBookedSlots(response.data);
      } else {
        console.warn('❌ La respuesta no tiene el formato esperado:', response.data);
        setBookedSlots([]);
      }
    } catch (error) {
      console.error('Error al cargar horarios ocupados después de todos los intentos:', error);
      
      // Fallback a localStorage si la API falla
      try {
        const storedBookedSlots = JSON.parse(localStorage.getItem('bookedSlots') || '[]');
        if (Array.isArray(storedBookedSlots)) {
          setBookedSlots(storedBookedSlots);
          console.log('Usando horarios desde localStorage como fallback');
        } else {
          setBookedSlots([]);
        }
      } catch (parseError) {
        console.error('Error al parsear localStorage:', parseError);
        setBookedSlots([]);
      }
      
      // Mostrar error no crítico al usuario
      setError('No se pudieron cargar algunos horarios. Los horarios mostrados pueden no estar completamente actualizados.');
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedDate, preloadedData]);

  // Cargar horarios ocupados al cambiar la fecha seleccionada
  useEffect(() => {
    if (selectedDate) {
      loadBookedSlots(false, selectedDate);
    }
  }, [selectedDate, loadBookedSlots]);

  // Limpiar error cuando el usuario empiece a completar campos
  useEffect(() => {
    if (error && (error.includes('Falta completar') || error.includes('Faltan completar'))) {
      // Si hay progreso en los campos, limpiar el error de validación
      if (appointmentType || selectedService || selectedDate || selectedTime) {
        setError(null);
      }
    }
  }, [appointmentType, selectedService, selectedDate, selectedTime, error]);
  
  // Verificar si un horario está ocupado
  const isTimeSlotBooked = (date, time) => {
    if (!date) return false;
    
    const formattedDate = formatDate(date);
    console.log('Verificando si el horario está ocupado:', formattedDate, time);
    console.log('Horarios ocupados:', bookedSlots);
    
    // Validar que bookedSlots sea un array antes de usar .some()
    if (!Array.isArray(bookedSlots)) {
      console.warn('bookedSlots no es un array válido, tratando como array vacío');
      return false;
    }
    
    const isBooked = bookedSlots.some(slot => 
      slot.date === formattedDate && slot.time === time
    );
    
    console.log('¿Está ocupado?', isBooked);
    return isBooked;
  };

  // Verificar si un horario es válido para el servicio seleccionado
  const isTimeSlotValidForService = (date, time, service) => {
    if (!service || !date) return true;
    
    const formattedDate = formatDate(date);
    
    // Para consulta de 120 min, verificar que haya slot siguiente disponible (solo si no es el último)
    if (service.duration === '120 min') {
      const allTimes = [...morningTimes, ...afternoonTimes];
      const currentIndex = allTimes.indexOf(time);
      
      // Si es el último horario del turno, SÍ se puede atender (se extiende más allá del horario normal)
      if (time === '11:00 AM' || time === '5:00 PM') {
        return true;
      }
      
      // Verificar que el siguiente slot esté disponible (solo si no es el último)
      if (currentIndex !== -1 && currentIndex < allTimes.length - 1) {
        const nextTime = allTimes[currentIndex + 1];
        // Solo verificar el siguiente si está en el mismo turno
        const isMorningTime = morningTimes.includes(time);
        const isNextMorningTime = morningTimes.includes(nextTime);
        
        if (isMorningTime === isNextMorningTime) {
          return !isTimeSlotBooked(date, nextTime);
        }
      }
    }
    
    return true;
  };
  
  const handleServiceSelect = (service, setFieldValue) => {
    setSelectedService(service);
    setFieldValue('service', service.id);
    
    // Auto-scroll a la siguiente sección después de un pequeño delay
    setTimeout(() => {
      if (dateTimeSectionRef.current) {
        dateTimeSectionRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 300);
  };
  
  const handleAppointmentTypeSelect = (type, setFieldValue) => {
    setAppointmentType(type);
    setFieldValue('appointmentType', type);
    // Resetear el servicio seleccionado cuando se cambia el tipo de cita
    setSelectedService(null);
    setFieldValue('service', '');
    
    // Auto-scroll a la sección de servicios después de un pequeño delay
    setTimeout(() => {
      if (serviceSectionRef.current) {
        serviceSectionRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 300);
  };
  
  const handleTimeSelect = (time, setFieldValue) => {
    // Verificar si el horario está ocupado
    if (selectedDate && isTimeSlotBooked(selectedDate, time)) {
      return; // No permitir seleccionar horarios ocupados
    }
    
    setSelectedTime(time);
    setFieldValue('time', time);
    
    // Auto-scroll a la siguiente sección después de un pequeño delay
    setTimeout(() => {
      if (personalInfoSectionRef.current) {
        personalInfoSectionRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 300);
  };
  
  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  
  const validationSchema = Yup.object().shape({
    appointmentType: Yup.string().required('Debes seleccionar un tipo de cita'),
    service: Yup.string().required('Debes seleccionar un servicio'),
    name: Yup.string().required('El nombre es obligatorio'),
    email: Yup.string().email('Ingresa un correo electrónico válido').required('El correo electrónico es obligatorio'),
    phone: Yup.string().required('El teléfono es obligatorio'),
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
    appointmentType: '',
    service: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
    date: null,
    time: ''
  };
  
  const handleSubmit = async (values, { setSubmitting, setTouched, setFieldError }) => {
    // Marcar todos los campos como tocados para mostrar errores de validación
    setTouched({
      appointmentType: true,
      service: true,
      name: true,
      email: true,
      phone: true,
      date: true,
      time: true
    });

    // Validar campos requeridos manualmente y mostrar errores específicos
    const validationErrors = {};
    
    if (!values.appointmentType) {
      validationErrors.appointmentType = 'Debes seleccionar un tipo de cita';
    }
    if (!values.service) {
      validationErrors.service = 'Debes seleccionar un servicio';
    }
    if (!values.name) {
      validationErrors.name = 'El nombre es obligatorio';
    }
    if (!values.email) {
      validationErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      validationErrors.email = 'Ingresa un correo electrónico válido';
    }
    if (!values.phone) {
      validationErrors.phone = 'El teléfono es obligatorio';
    }
    if (!values.date) {
      validationErrors.date = 'Debes seleccionar una fecha';
    }
    if (!values.time) {
      validationErrors.time = 'Debes seleccionar un horario';
    }

         // Si hay errores de validación, mostrarlos y detener el envío
     if (Object.keys(validationErrors).length > 0) {
       Object.keys(validationErrors).forEach(field => {
         setFieldError(field, validationErrors[field]);
       });
       
       // Crear mensaje específico sobre qué campos faltan
       const missingFields = [];
       if (!values.appointmentType) missingFields.push('tipo de cita');
       if (!values.service) missingFields.push('servicio');
       if (!values.date) missingFields.push('fecha');
       if (!values.time) missingFields.push('horario');
       if (!values.name) missingFields.push('nombre');
       if (!values.email) missingFields.push('email');
       if (!values.phone) missingFields.push('teléfono');
       
       let errorMessage = 'Faltan campos por completar: ';
       if (missingFields.length === 1) {
         errorMessage = `Falta completar: ${missingFields[0]}`;
       } else if (missingFields.length === 2) {
         errorMessage = `Faltan completar: ${missingFields[0]} y ${missingFields[1]}`;
       } else {
         errorMessage = `Faltan completar: ${missingFields.slice(0, -1).join(', ')} y ${missingFields[missingFields.length - 1]}`;
       }
       
       setError(errorMessage + '. Por favor, completa la información requerida.');
       
       // Scroll al primer campo con error
       setTimeout(() => {
         if (!values.appointmentType) {
           window.scrollTo({ top: 0, behavior: 'smooth' });
         } else if (!values.service && serviceSectionRef.current) {
           serviceSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
         } else if ((!values.date || !values.time) && dateTimeSectionRef.current) {
           dateTimeSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
         } else if ((!values.name || !values.email || !values.phone) && personalInfoSectionRef.current) {
           personalInfoSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }
       }, 100);
      
      setSubmitting(false);
      return;
    }

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
      
      // Crear la reserva en el servidor con reintentos automáticos
      const bookingResponse = await apiConfig.makeRequest(apiConfig.endpoints.bookings, {
        method: 'POST',
        data: {
          id: bookingId,
          clientName: values.name,
          clientEmail: values.email,
          clientPhone: values.phone,
          service: serviceObj.title,
          serviceDuration: serviceObj.duration,
          servicePrice: serviceObj.price,
          date: formatDate(values.date),
          time: values.time,
          type: values.appointmentType,
          notes: values.notes || ''
        }
      });
      
      console.log('Respuesta de creación de reserva:', bookingResponse.data);
      
      if (!bookingResponse.data.success) {
        throw new Error('Error al crear la reserva en el servidor');
      }
      
      // ✅ Los emails ya se envían automáticamente en el servidor
      // No necesitamos hacer una segunda llamada a /api/send-booking-email
      console.log('✅ Reserva creada exitosamente. Emails enviados automáticamente por el servidor.');
      
      // ✅ Guardar la solicitud en localStorage como referencia
      // El estado real se mantiene en el servidor (MongoDB)
      const pendingBookings = JSON.parse(localStorage.getItem('pendingBookings') || '[]');
      pendingBookings.push({
        id: bookingId,
        status: 'pending', // ⏳ Estado: Esperando confirmación del admin
        clientName: values.name,
        clientEmail: values.email,
        clientPhone: values.phone,
        service: serviceObj.title,
        servicePrice: serviceObj.price,
        date: formatDate(values.date),
        time: values.time,
        type: values.appointmentType,
        notes: values.notes,
        createdAt: new Date().toISOString(),
        note: 'Esperando confirmación por email del administrador'
      });
      localStorage.setItem('pendingBookings', JSON.stringify(pendingBookings));
      
      console.log('✅ Solicitud de reserva enviada exitosamente:', bookingId);
      console.log('⏳ Estado: PENDING - Esperando confirmación del admin por email');
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error al procesar la reserva:', err);
      
      let errorMessage = 'Hubo un problema al procesar tu reserva. Por favor, inténtalo de nuevo.';
      
      if (err.response) {
        console.error('Detalles del error:', err.response.data);
        // Errores del servidor
        if (err.response.status === 400) {
          errorMessage = 'Los datos enviados no son válidos. Por favor, revisa la información e inténtalo de nuevo.';
        } else if (err.response.status === 409) {
          errorMessage = 'Este horario ya está ocupado. Por favor, selecciona otro horario.';
        } else if (err.response.status === 500) {
          errorMessage = 'Error del servidor. Por favor, inténtalo de nuevo en unos minutos.';
        } else {
          errorMessage = err.response.data.error || errorMessage;
        }
      } else if (err.request) {
        console.error('No se recibió respuesta del servidor');
        // Error de conexión
        errorMessage = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet e inténtalo de nuevo.';
      } else if (err.code === 'ECONNABORTED') {
        // Timeout
        errorMessage = 'La solicitud tardó demasiado tiempo. Por favor, inténtalo de nuevo.';
      } else {
        // Otros errores
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
      
      // Refrescar horarios ocupados para evitar conflictos
      loadBookedSlots(true);
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
      await loadBookedSlots(true); // Forzar refresh del cache
      console.log('Horarios ocupados actualizados exitosamente');
    } catch (error) {
      console.error('Error al recargar horarios ocupados:', error);
      setError('No se pudieron actualizar los horarios. Algunos horarios pueden no estar actualizados.');
    }
    
    // Scroll al inicio de la página suavemente
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Renderizar los horarios disponibles
  const renderTimeSlots = (times, values, setFieldValue) => {
    return times.map(time => {
      const isBooked = isTimeSlotBooked(values.date, time);
      const isValidForService = isTimeSlotValidForService(values.date, time, selectedService);
      const isDisabled = isBooked || !isValidForService || !values.date;
      
      let buttonClass = 'btn btn-sm ';
      let backgroundColor, borderColor, textColor;
      
      if (selectedTime === time) {
        backgroundColor = 'var(--primary-color)';
        borderColor = 'var(--primary-color)';
        textColor = 'white';
      } else if (isBooked) {
        buttonClass += 'btn-danger';
        backgroundColor = '#dc3545';
        borderColor = '#dc3545';
        textColor = 'white';
      } else if (!isValidForService) {
        backgroundColor = '#ffc107';
        borderColor = '#ffc107';
        textColor = 'white';
      } else {
        backgroundColor = 'white';
        borderColor = 'var(--primary-color)';
        textColor = 'var(--primary-color)';
      }
      
      return (
        <button
          key={time}
          type="button"
          className={buttonClass}
          style={{ 
            minWidth: '65px',
            opacity: !values.date ? 0.5 : isDisabled ? 0.7 : 1,
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            fontSize: '0.85rem',
            backgroundColor,
            borderColor,
            color: textColor
          }}
          disabled={isDisabled}
          onClick={() => {
            if (values.date && !isDisabled) {
              handleTimeSelect(time, setFieldValue);
            }
          }}
          title={!isValidForService && selectedService?.duration === '120 min' ? 
            'No disponible para consulta de 120 min (horario siguiente ocupado)' : ''}
        >
          {time} 
          {isBooked && <i className="bi bi-lock-fill ms-1"></i>}
          {!isValidForService && !isBooked && <i className="bi bi-exclamation-triangle-fill ms-1"></i>}
        </button>
      );
    });
  };

  // Filtrar servicios según el tipo de cita seleccionado
  const getFilteredServices = () => {
    if (!appointmentType) return [];
    return services.filter(service => service.type === appointmentType);
  };

  // Determinar qué secciones están habilitadas
  const isServiceSectionEnabled = appointmentType !== '';
  const isDateTimeSectionEnabled = selectedService !== null;
  const isPersonalInfoSectionEnabled = selectedService !== null;
  const isProjectDescriptionSectionEnabled = selectedService !== null;
  const isSubmitEnabled = appointmentType && selectedService && selectedDate && selectedTime;

  // Función para manejar el cambio de fecha
  const handleDateChange = (date, setFieldValue) => {
    setSelectedDate(date);
    setFieldValue('date', date);
    setSelectedTime('');
    setFieldValue('time', '');
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
            Completa los siguientes pasos para agendar tu consulta de decoración de interiores.
          </p>
        </div>
        
        {/* Estilos CSS para personalizar el DatePicker */}
        <style>
          {`
            .react-datepicker {
              border: 1px solid var(--primary-color) !important;
              border-radius: 8px !important;
            }
            .react-datepicker__header {
              background-color: var(--primary-color) !important;
              border-bottom: 1px solid var(--primary-color) !important;
            }
            .react-datepicker__current-month,
            .react-datepicker__day-name {
              color: white !important;
            }
            .react-datepicker__day--selected,
            .react-datepicker__day--keyboard-selected {
              background-color: var(--primary-color) !important;
              color: white !important;
            }
            .react-datepicker__day:hover {
              background-color: var(--primary-color) !important;
              color: white !important;
            }
            .react-datepicker__navigation {
              border: none !important;
            }
            .react-datepicker__navigation--previous {
              border-right-color: white !important;
            }
            .react-datepicker__navigation--next {
              border-left-color: white !important;
            }
          `}
        </style>
        
        {isSubmitted ? (
          <Alert variant="info" className="p-4 text-center shadow-sm">
            <div className="mb-3">
              <i className="bi bi-clock-history text-info" style={{ fontSize: '3rem' }}></i>
            </div>
            <h3 className="text-info mb-3">📋 ¡Solicitud Enviada!</h3>
            <p className="mb-3">Hemos recibido tu solicitud de reserva y <strong>la revisaremos pronto</strong>.</p>
            <div className="alert alert-light border-0 mb-3">
              <p className="mb-2"><strong>📝 Estado actual:</strong> Pendiente de confirmación</p>
              <p className="mb-2"><strong>⏳ Tiempo estimado:</strong> Te contactaremos dentro de las próximas 24 horas</p>
              <p className="mb-0"><strong>📧 Confirmación:</strong> Recibirás un email cuando tu reserva sea aprobada</p>
            </div>
            <p className="mb-3"><strong>✉️ Nota:</strong> Hemos enviado un email de confirmación a tu bandeja de entrada con los detalles de tu solicitud.</p>
            <p className="mb-4">Si tienes alguna pregunta urgente, no dudes en contactarnos.</p>
            <div className="d-grid gap-2 col-md-6 mx-auto">
              <Button 
                size="lg"
                onClick={resetForm}
                className="rounded-pill px-4 py-3"
                style={{
                  backgroundColor: 'var(--primary-color)',
                  borderColor: 'var(--primary-color)',
                  color: 'white'
                }}
              >
                <i className="bi bi-calendar-plus me-2"></i>
                Hacer otra solicitud
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
                  <Alert variant="danger" className="mb-4 border-0 shadow-sm">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                      <div>
                        <strong>Error de validación:</strong><br/>
                    {error}
                      </div>
                    </div>
                  </Alert>
                )}
                
                {/* PASO 1: Tipo de Cita - SIEMPRE CON COLOR */}
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="py-3" style={{ 
                    backgroundColor: 'var(--primary-color)', 
                    color: 'white' 
                  }}>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-calendar2-check fs-5 me-3"></i>
                      <h5 className="m-0 fw-semibold">¿Cómo prefieres tu cita?</h5>
                      {appointmentType && <i className="bi bi-check-circle-fill ms-auto"></i>}
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row xs={1} md={2} className="g-4">
                      <Col className="d-flex">
                        <Card 
                          className={`w-100 text-center border ${appointmentType === 'asesoria-completa' ? 'bg-light' : ''}`}
                          onClick={() => handleAppointmentTypeSelect('asesoria-completa', setFieldValue)}
                          style={{ 
                            cursor: 'pointer', 
                            transition: 'all 0.3s ease',
                            borderColor: appointmentType === 'asesoria-completa' ? 'var(--primary-color)' : '#dee2e6',
                            borderWidth: appointmentType === 'asesoria-completa' ? '2px' : '1px'
                          }}
                        >
                          <Card.Body className="p-4 d-flex flex-column justify-content-center" style={{ minHeight: '120px' }}>
                            <div className="mb-2" style={{ color: 'var(--primary-color)' }}>
                              <i className="bi bi-star-fill fs-1"></i>
                            </div>
                            <Card.Title className="h6 fw-bold mb-1">Asesoría Completa</Card.Title>
                            <Card.Text className="text-muted small">Servicio integral y personalizado</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col className="d-flex">
                        <Card 
                          className={`w-100 text-center border ${appointmentType === 'asesoria-basica' ? 'bg-light' : ''}`}
                          onClick={() => handleAppointmentTypeSelect('asesoria-basica', setFieldValue)}
                          style={{ 
                            cursor: 'pointer', 
                            transition: 'all 0.3s ease',
                            borderColor: appointmentType === 'asesoria-basica' ? 'var(--primary-color)' : '#dee2e6',
                            borderWidth: appointmentType === 'asesoria-basica' ? '2px' : '1px'
                          }}
                        >
                          <Card.Body className="p-4 d-flex flex-column justify-content-center" style={{ minHeight: '120px' }}>
                            <div className="mb-2" style={{ color: 'var(--primary-color)' }}>
                              <i className="bi bi-chat-dots fs-1"></i>
                            </div>
                            <Card.Title className="h6 fw-bold mb-1">Asesoría Básica</Card.Title>
                            <Card.Text className="text-muted small">Consulta especializada online</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    {touched.appointmentType && errors.appointmentType && (
                      <div className="text-danger text-center mt-3 small">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.appointmentType}
                      </div>
                    )}
                  </Card.Body>
                </Card>

                {/* PASO 2: Servicios - COLOR SOLO SI PASO 1 ESTÁ COMPLETO */}
                <Card 
                  ref={serviceSectionRef}
                  className={`border-0 shadow-sm mb-4 ${!isServiceSectionEnabled ? 'opacity-50' : ''}`}
                >
                  <Card.Header className="py-3" style={{ 
                    backgroundColor: appointmentType ? 'var(--primary-color)' : '#e9ecef', 
                    color: appointmentType ? 'white' : '#6c757d' 
                  }}>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-grid-3x3-gap fs-5 me-3"></i>
                      <h5 className="m-0 fw-semibold">
                        {appointmentType === 'asesoria-basica' ? 'Servicios de Asesoría Básica' : appointmentType === 'asesoria-completa' ? 'Servicios de Asesoría Completa' : 'Servicios'}
                      </h5>
                      {selectedService && <i className="bi bi-check-circle-fill ms-auto"></i>}
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    {!isServiceSectionEnabled ? (
                      <div className="text-center py-4 text-muted">
                        <i className="bi bi-lock fs-1 mb-2 d-block opacity-50"></i>
                        <p className="small mb-0">Selecciona el tipo de cita para continuar</p>
                      </div>
                    ) : (
                      <>
                        <Row xs={1} md={appointmentType === 'asesoria-basica' ? 2 : 3} className="g-3">
                          {getFilteredServices().map(service => (
                            <Col key={service.id} className="d-flex">
                              <Card 
                                className={`w-100 border ${selectedService && selectedService.id === service.id ? 'bg-light' : ''}`}
                                onClick={() => handleServiceSelect(service, setFieldValue)}
                                style={{ 
                                  cursor: 'pointer', 
                                  transition: 'all 0.3s ease',
                                  borderColor: selectedService && selectedService.id === service.id ? 'var(--primary-color)' : '#dee2e6',
                                  borderWidth: selectedService && selectedService.id === service.id ? '2px' : '1px'
                                }}
                              >
                                <Card.Header 
                                  className={`text-center py-3 ${selectedService && selectedService.id === service.id ? 'text-white' : ''}`}
                                  style={{ 
                                    backgroundColor: selectedService && selectedService.id === service.id ? 'var(--primary-color)' : '#f8f9fa',
                                    minHeight: '70px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    flexDirection: 'column' 
                                  }}
                                >
                                  <h6 className="m-0">{service.title}</h6>
                                  {service.duration && (
                                    <small className="mt-1 opacity-75">({service.duration})</small>
                                  )}
                                </Card.Header>
                                <Card.Body className="text-center p-3">
                                  <h5 className="fw-bold mb-2" style={{ color: 'var(--primary-color)' }}>{service.price}</h5>
                                  <Card.Text className="text-muted small" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{service.description}</Card.Text>
                                  {service.tag && (
                                    <span 
                                      className="badge mt-2"
                                      style={{ 
                                        fontSize: '0.7rem', 
                                        backgroundColor: 'var(--primary-color)', 
                                        color: 'white',
                                        padding: '0.25rem 0.5rem'
                                      }}
                                    >
                                      {service.tag}
                                    </span>
                                  )}
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                        {touched.service && errors.service && (
                          <div className="text-danger text-center mt-3 small">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.service}
                          </div>
                        )}
                      </>
                    )}
                  </Card.Body>
                </Card>

                {/* PASO 3: Fecha y Hora - COLOR SOLO SI PASO 2 ESTÁ COMPLETO */}
                <Card 
                  ref={dateTimeSectionRef}
                  className={`border-0 shadow-sm mb-4 ${!isDateTimeSectionEnabled ? 'opacity-50' : ''}`}
                >
                  <Card.Header className="py-3" style={{ 
                    backgroundColor: selectedService ? 'var(--primary-color)' : '#e9ecef', 
                    color: selectedService ? 'white' : '#6c757d' 
                  }}>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-calendar-date fs-5 me-3"></i>
                      <h5 className="m-0 fw-semibold">Fecha y Hora</h5>
                      {(selectedDate && selectedTime) && <i className="bi bi-check-circle-fill ms-auto"></i>}
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    {!isDateTimeSectionEnabled ? (
                      <div className="text-center py-4 text-muted">
                        <i className="bi bi-lock fs-1 mb-2 d-block opacity-50"></i>
                        <p className="small mb-0">Selecciona un servicio para continuar</p>
                      </div>
                    ) : (
                      <Row className="justify-content-center">
                        <Col lg={5} md={6} className="mb-4 mb-lg-0">
                          <div className="text-center">
                            <h6 className="mb-3 d-flex align-items-center justify-content-center">
                              <i className="bi bi-calendar3 me-2" style={{ color: 'var(--primary-color)' }}></i>
                              Selecciona una fecha
                            </h6>
                            <div className="d-flex justify-content-center">
                              <DatePicker
                                selected={values.date}
                                onChange={(date) => handleDateChange(date, setFieldValue)}
                                minDate={new Date()}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="Selecciona una fecha"
                                inline
                              />
                            </div>
                            {touched.date && errors.date && (
                              <div className="text-danger text-center mt-2 small">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                {errors.date}
                              </div>
                            )}
                          </div>
                        </Col>
                        
                        <Col lg={5} md={6}>
                          <div className="text-center">
                            <div className="d-flex align-items-center justify-content-center mb-3">
                              <h6 className="mb-0 me-2 d-flex align-items-center">
                                <i className="bi bi-clock me-2" style={{ color: 'var(--primary-color)' }}></i>
                                Horarios disponibles
                              </h6>
                              {!loadingSlots && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => loadBookedSlots(true)}
                                  title="Actualizar horarios"
                                  style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                                >
                                  <i className="bi bi-arrow-clockwise"></i>
                                </button>
                              )}
                            </div>
                            
                            {loadingSlots ? (
                              <div className="text-center py-4">
                                <Spinner animation="border" style={{ color: 'var(--primary-color)' }} size="sm" />
                                <p className="mt-2 text-muted small">Cargando horarios disponibles...</p>
                                <div className="mt-2">
                                  <small className="text-muted">Por favor espera un momento</small>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className="mb-4">
                                  <small className="fw-semibold text-muted d-block mb-3">MAÑANA</small>
                                  <div className="d-flex flex-wrap justify-content-center gap-2">
                                    {renderTimeSlots(morningTimes, values, setFieldValue)}
                                  </div>
                                </div>
                                
                                <div className="mb-3">
                                  <small className="fw-semibold text-muted d-block mb-3">TARDE</small>
                                  <div className="d-flex flex-wrap justify-content-center gap-2">
                                    {renderTimeSlots(afternoonTimes, values, setFieldValue)}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {!values.date && (
                              <p className="text-muted text-center mt-3 small">
                                <i className="bi bi-info-circle me-1"></i>
                                Selecciona una fecha para ver horarios
                              </p>
                            )}
                            
                            {/* Leyenda de colores */}
                            {values.date && (
                              <div className="mt-4 pt-3 border-top">
                                <small className="fw-semibold text-muted d-block mb-2 text-center">LEYENDA</small>
                                <div className="d-flex flex-wrap justify-content-center gap-2 small">
                                  <div className="d-flex align-items-center">
                                    <div 
                                      className="me-1"
                                      style={{
                                        width: '12px',
                                        height: '12px',
                                        backgroundColor: 'white',
                                        border: '1px solid var(--primary-color)',
                                        borderRadius: '2px'
                                      }}
                                    ></div>
                                    <span className="text-muted">Disponible</span>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <div 
                                      className="me-1"
                                      style={{
                                        width: '12px',
                                        height: '12px',
                                        backgroundColor: '#dc3545',
                                        borderRadius: '2px'
                                      }}
                                    ></div>
                                    <span className="text-muted">Ocupado</span>
                                  </div>
                                  {selectedService?.duration === '120 min' && (
                                    <div className="d-flex align-items-center">
                                      <div 
                                        className="me-1"
                                        style={{
                                          width: '12px',
                                          height: '12px',
                                          backgroundColor: '#ffc107',
                                          borderRadius: '2px'
                                        }}
                                      ></div>
                                      <span className="text-muted">No disponible (120 min)</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {!loadingSlots && bookedSlots.length >= 0 && (
                              <div className="mt-3">
                                <small className="text-muted">
                                  <i className="bi bi-info-circle me-1"></i>
                                  Horarios actualizados: {new Date().toLocaleTimeString()}
                                </small>
                              </div>
                            )}
                            
                            {touched.time && errors.time && values.date && (
                              <div className="text-danger text-center mt-2 small">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                {errors.time}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                    )}
                  </Card.Body>
                </Card>
                
                {/* PASO 4: Información Personal - COLOR SOLO SI PASO 3 ESTÁ COMPLETO */}
                <Card 
                  ref={personalInfoSectionRef}
                  className={`border-0 shadow-sm mb-4 ${!isPersonalInfoSectionEnabled ? 'opacity-50' : ''}`}
                >
                  <Card.Header className="py-3" style={{ 
                    backgroundColor: (selectedDate && selectedTime) ? 'var(--primary-color)' : '#e9ecef', 
                    color: (selectedDate && selectedTime) ? 'white' : '#6c757d' 
                  }}>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-person fs-5 me-3"></i>
                      <h5 className="m-0 fw-semibold">Información Personal</h5>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    {!isPersonalInfoSectionEnabled ? (
                      <div className="text-center py-4 text-muted">
                        <i className="bi bi-lock fs-1 mb-2 d-block opacity-50"></i>
                        <p className="small mb-0">Completa los pasos anteriores para continuar</p>
                      </div>
                    ) : (
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold small">
                              <i className="bi bi-person me-2" style={{ color: 'var(--primary-color)' }}></i>
                              Nombre Completo
                            </Form.Label>
                            <Form.Control 
                              type="text" 
                              name="name" 
                              value={values.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Tu nombre completo"
                              className={`${touched.name && errors.name ? 'is-invalid' : ''}`}
                              style={{
                                borderColor: touched.name && !errors.name && values.name ? 'var(--primary-color)' : ''
                              }}
                            />
                            {touched.name && errors.name && (
                              <div className="text-danger mt-1 small">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                {errors.name}
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold small">
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
                              className={`${touched.email && errors.email ? 'is-invalid' : ''}`}
                              style={{
                                borderColor: touched.email && !errors.email && values.email ? 'var(--primary-color)' : ''
                              }}
                            />
                            {touched.email && errors.email && (
                              <div className="text-danger mt-1 small">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                {errors.email}
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                        
                        <Col xs={12}>
                          <Form.Group>
                            <Form.Label className="fw-semibold small">
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
                              className={`${touched.phone && errors.phone ? 'is-invalid' : ''}`}
                              style={{
                                borderColor: touched.phone && !errors.phone && values.phone ? 'var(--primary-color)' : ''
                              }}
                            />
                            {touched.phone && errors.phone && (
                              <div className="text-danger mt-1 small">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                {errors.phone}
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                    )}
                  </Card.Body>
                </Card>
                
                {/* PASO 5: Descripción del Proyecto - COLOR SOLO SI PASO 4 ESTÁ COMPLETO */}
                <Card 
                  ref={projectDescriptionSectionRef}
                  className={`border-0 shadow-sm mb-4 ${!isProjectDescriptionSectionEnabled ? 'opacity-50' : ''}`}
                >
                  <Card.Header className="py-3" style={{ 
                    backgroundColor: (values.name && values.email && values.phone) ? 'var(--primary-color)' : '#e9ecef', 
                    color: (values.name && values.email && values.phone) ? 'white' : '#6c757d' 
                  }}>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-chat-text fs-5 me-3"></i>
                      <h5 className="m-0 fw-semibold">Descripción del Proyecto</h5>
                      <small className="ms-2 opacity-75">(Opcional)</small>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    {!isProjectDescriptionSectionEnabled ? (
                      <div className="text-center py-4 text-muted">
                        <i className="bi bi-lock fs-1 mb-2 d-block opacity-50"></i>
                        <p className="small mb-0">Completa los pasos anteriores para continuar</p>
                      </div>
                    ) : (
                      <Form.Group>
                        <Form.Label className="fw-semibold small">
                          <i className="bi bi-pencil-square me-2" style={{ color: 'var(--primary-color)' }}></i>
                          Cuéntanos sobre tu proyecto
                        </Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={3}
                          name="notes" 
                          value={values.notes}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Describe tu proyecto, necesidades específicas o ideas..."
                          style={{ 
                            resize: 'vertical',
                            borderColor: touched.notes && values.notes ? 'var(--primary-color)' : ''
                          }}
                        />
                      </Form.Group>
                    )}
                  </Card.Body>
                </Card>
                
                {/* Botón de envío */}
                <div className="text-center mt-4">
                  <Button 
                    type="submit"
                    className="rounded-pill px-4 py-2 fw-semibold"
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
                  
                    <div className="mt-2">
                      <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                      {isSubmitEnabled 
                        ? 'Haz clic en "Confirmar Reserva" para proceder'
                        : 'Completa los campos requeridos y luego confirma tu reserva'
                      }
                      </small>
                    </div>
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