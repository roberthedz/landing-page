/**
 * Configuración de la API
 */

// Detectar automáticamente el dominio base
const getBaseUrl = () => {
  // En desarrollo, usar localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  // En producción, usar el dominio actual
  return `${window.location.origin}/api`;
};

const API_BASE_URL = getBaseUrl();

export default {
  API_BASE_URL,
  endpoints: {
    bookings: `${API_BASE_URL}/bookings`,
    bookedSlots: `${API_BASE_URL}/booked-slots`,
    sendBookingEmail: `${API_BASE_URL}/send-booking-email`,
    sendContactEmail: `${API_BASE_URL}/send-contact-email`
  }
}; 