/**
 * Configuración de plantillas de EmailJS
 * 
 * Este archivo contiene los IDs de servicio y plantillas para los diferentes tipos de emails
 * que se envían desde la aplicación.
 */

const emailConfig = {
  // ID del servicio EmailJS
  serviceId: 'service_9xzlvtl',
  
  // ID de usuario público de EmailJS
  userId: 's8hn6kkN5Ry8vFCnJ',
  
  // Plantillas
  templates: {
    // Email a la empresa con los detalles de la reserva y botones de confirmar/rechazar
    bookingRequest: 'template_6wqvvlb',
    
    // Email al cliente cuando hace una reserva (pendiente de confirmación)
    bookingReceipt: 'template_6wqvvlb',
    
    // Email al cliente cuando la empresa confirma la reserva
    bookingConfirmation: 'template_6wqvvlb',
    
    // Email al cliente cuando la empresa rechaza la reserva
    bookingRejection: 'template_6wqvvlb'
  },
  
  // Email de la empresa para recibir notificaciones
  companyEmail: 'dedecorinfo@gmail.com',
  
  // Email para respuestas (no-reply)
  noReplyEmail: 'noreply@dedecor.com'
};

export default emailConfig; 