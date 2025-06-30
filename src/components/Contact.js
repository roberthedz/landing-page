import React, { useState } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import emailConfig from '../config/emailTemplates';
import apiConfig from '../config/apiConfig';
import axios from 'axios';

const ContactSection = styled.section`
  padding: 3rem 0;
  background-color: var(--background-color);
  background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
  min-height: 100vh;
  margin-top: 70px;
`;

const ContactInfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ContactInfoIcon = styled.div`
  width: 45px;
  height: 45px;
  background-color: var(--secondary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: var(--white);
  font-size: 1.3rem;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
`;

const ContactInfoContent = styled.div`
  h4 {
    margin-bottom: 0.2rem;
    color: var(--primary-color);
    font-weight: 600;
    font-size: 1.1rem;
  }
  
  p {
    margin-bottom: 0.2rem;
    font-size: 0.95rem;
    color: var(--text-color);
  }
`;

const StyledForm = styled(Form)`
  background-color: var(--white);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  }
`;

const SubmitButton = styled(Button)`
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
  border-radius: 50px;
  padding: 0.8rem 2.5rem;
  color: var(--white);
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 1.5rem;
  display: block;
  width: 100%;
  max-width: 250px;
  margin-left: auto;
  margin-right: auto;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
    color: var(--white);
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const FormGroup = styled(Form.Group)`
  margin-bottom: 1.5rem;
  
  .form-label {
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
  }
  
  .form-control {
    border-radius: 8px;
    padding: 0.75rem 1rem;
    border: 1px solid #ced4da;
    transition: all 0.3s ease;
    
    &:focus {
      border-color: var(--secondary-color);
      box-shadow: 0 0 0 0.25rem rgba(74, 97, 99, 0.25);
    }
  }
  
  textarea.form-control {
    min-height: 150px;
  }
`;

const FormLabelIcon = styled.i`
  font-size: 1.2rem;
  color: var(--secondary-color);
  margin-right: 0.5rem;
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Generar un ID único para el mensaje
      const messageId = `message-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      console.log('Enviando solicitud a:', apiConfig.endpoints.sendContactEmail);
      
      // Enviar emails de notificación
      const emailResponse = await axios.post(apiConfig.endpoints.sendContactEmail, {
        clientEmail: formData.email,
        clientName: formData.name,
        contactDetails: {
          phone: formData.phone,
          message: formData.message,
          date: new Date().toLocaleDateString()
        }
      });
      
      console.log('Respuesta de envío de email:', emailResponse.data);
      
      if (!emailResponse.data.success) {
        throw new Error('Error al enviar las notificaciones por email');
      }
      
      // Guardar los datos del mensaje en localStorage para referencia futura
      // En un entorno real, esto se haría solo en el servidor
      const contactMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      contactMessages.push({
        id: messageId,
        clientName: formData.name,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        message: formData.message,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('contactMessages', JSON.stringify(contactMessages));
      
      console.log('Mensaje de contacto enviado:', messageId);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
      
    } catch (err) {
      console.error('Error al enviar el mensaje:', err);
      if (err.response) {
        console.error('Detalles del error:', err.response.data);
        setError(`Error: ${err.response.data.error || 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.'}`);
      } else if (err.request) {
        console.error('No se recibió respuesta del servidor');
        setError('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet e inténtalo de nuevo.');
      } else {
        setError('Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContactSection id="contacto">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold position-relative d-inline-block" style={{ color: '#000' }}>
            Contáctanos
            <div className="position-absolute start-50 translate-middle-x" style={{ width: '80px', height: '3px', backgroundColor: 'var(--secondary-color)', borderRadius: '2px', bottom: '-10px' }}></div>
          </h2>
          <p className="lead text-muted mt-4 col-md-8 mx-auto">
            Estamos aquí para ayudarte con cualquier pregunta sobre nuestros servicios de diseño de interiores. Ponte en contacto con nosotros y te responderemos lo antes posible.
          </p>
        </div>
        
        <div className="mb-5">
          {isSubmitted ? (
            <Alert variant="success" className="p-4 text-center shadow-sm">
              <div className="mb-3">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
              </div>
              <h3 className="text-success mb-3">¡Mensaje Enviado!</h3>
              <p className="mb-3">Hemos recibido tu mensaje. Te contactaremos pronto.</p>
              <p className="mb-4">Si tienes alguna pregunta urgente, no dudes en llamarnos directamente.</p>
            </Alert>
          ) : (
            <Row className="justify-content-center">
              <Col lg={4} md={5} className="mb-4 mb-lg-0">
                <div className="bg-white p-4 rounded-3 shadow-sm h-100">
                  <h4 className="mb-4 fw-semibold" style={{ color: '#000' }}>
                    <i className="bi bi-info-circle me-2"></i>
                    Información de Contacto
                  </h4>
                  
                  <ContactInfoItem>
                    <ContactInfoIcon>
                      <i className="bi bi-geo-alt"></i>
                    </ContactInfoIcon>
                    <ContactInfoContent>
                      <h4>Ubicación</h4>
                      <p>Miami, Florida, Estados Unidos</p>
                    </ContactInfoContent>
                  </ContactInfoItem>
                  <ContactInfoItem>
                    <ContactInfoIcon>
                      <i className="bi bi-telephone"></i>
                    </ContactInfoIcon>
                    <ContactInfoContent>
                      <h4>Telefono</h4>
                      <p>+1 (786) 490-6092</p>
                    </ContactInfoContent>
                  </ContactInfoItem>
                  <ContactInfoItem>
                    <ContactInfoIcon>
                      <i className="bi bi-envelope"></i>
                    </ContactInfoIcon>
                    <ContactInfoContent>
                      <h4>Email</h4>
                      <p>dedecorinfo@gmail.com</p>
                    </ContactInfoContent>
                  </ContactInfoItem>
                  
                  <ContactInfoItem>
                    <ContactInfoIcon>
                      <i className="bi bi-clock"></i>
                    </ContactInfoIcon>
                    <ContactInfoContent>
                      <h4>Horario de Atención</h4>
                      <p>Lunes - Viernes: 9:00 AM - 6:00 PM</p>
                      <p>Sábados: 10:00 AM - 2:00 PM</p>
                    </ContactInfoContent>
                  </ContactInfoItem>
                  
                  <div className="mt-4 pt-3 border-top">
                    <h5 className="mb-3 fw-semibold" style={{ color: '#000' }}>Síguenos</h5>
                    <div className="d-flex">
                      <a href="https://www.instagram.com/dedecorshow?igsh=OGVjN2o2NzRzNmNk" className="me-3 text-secondary fs-4">
                        <i className="bi bi-instagram"></i>
                      </a>
                      <a href="https://m.youtube.com/@dedecorshow" className="me-3 text-secondary fs-4">
                        <i className="bi bi-youtube"></i>
                      </a>
                      <a href="#" className="me-3 text-secondary fs-4">
                        <i className="bi bi-tiktok"></i>
                      </a>
                    
                    </div>
                  </div>
                </div>
              </Col>
              
              <Col lg={8} md={7}>
                <StyledForm onSubmit={handleSubmit}>
                  <h4 className="mb-4 fw-semibold" style={{ color: '#000' }}>
                    <i className="bi bi-send me-2"></i>
                    Envíanos un Mensaje
                  </h4>
                  
                  {error && (
                    <Alert variant="danger" className="mb-4">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </Alert>
                  )}
                  
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Form.Label>
                          <FormLabelIcon className="bi bi-person"></FormLabelIcon>
                          Nombre
                        </Form.Label>
                        <Form.Control 
                          type="text" 
                          name="name" 
                          value={formData.name}
                          onChange={handleChange}
                          required 
                          placeholder="Tu nombre completo"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Form.Label>
                          <FormLabelIcon className="bi bi-envelope"></FormLabelIcon>
                          Email
                        </Form.Label>
                        <Form.Control 
                          type="email" 
                          name="email" 
                          value={formData.email}
                          onChange={handleChange}
                          required 
                          placeholder="correo@ejemplo.com"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  
                  <FormGroup>
                    <Form.Label>
                      <FormLabelIcon className="bi bi-telephone"></FormLabelIcon>
                      Teléfono
                    </Form.Label>
                    <Form.Control 
                      type="tel" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Tu número de contacto"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Form.Label>
                      <FormLabelIcon className="bi bi-chat-dots"></FormLabelIcon>
                      Mensaje
                    </Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={5}
                      name="message" 
                      value={formData.message}
                      onChange={handleChange}
                      required 
                      placeholder="¿En qué podemos ayudarte?"
                    />
                  </FormGroup>
                  
                  <SubmitButton type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Enviar Mensaje
                      </>
                    )}
                  </SubmitButton>
                </StyledForm>
              </Col>
            </Row>
          )}
        </div>
        
        <div className="text-center mt-5 pt-3">
          <p className="text-muted mb-4">¿Quieres conocer nuestros servicios?</p>
          <Link to="/servicios" className="btn rounded-pill px-4 py-2" style={{ 
            color: 'var(--primary-color)',
            borderColor: 'var(--primary-color)',
            backgroundColor: 'transparent'
          }}>
            <i className="bi bi-arrow-right me-2"></i>
            Ver Servicios
          </Link>
        </div>
      </Container>
    </ContactSection>
  );
};

export default Contact; 