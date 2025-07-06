/**
 * Configuración de la API
 */

const API_BASE_URL = 'https://landing-page-534b.onrender.com/api';

export default {
  API_BASE_URL,
  endpoints: {
    bookings: `${API_BASE_URL}/bookings`,
    bookedSlots: `${API_BASE_URL}/booked-slots`,
    sendBookingEmail: `${API_BASE_URL}/send-booking-email`,
    sendContactEmail: `${API_BASE_URL}/send-contact-email`
  }
}; 