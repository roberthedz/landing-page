import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Breadcrumb } from 'react-bootstrap';

const ServicesPage = () => {
  const services = [
    {
      id: 'consulta-online-60',
      title: 'Consulta Online',
      price: '$180',
      description: 'Sesión de 60 minutos donde te asesoramos para crear un espacio armonioso y funcional que refleje tu personalidad y estilo.',
      image: '/images/service1.jpg',
      tag: 'Básico',
      duration: '60 min',
      features: ['Asesoría personalizada en tiempo real', 'Recomendaciones de color y estilo', 'Sugerencias de distribución']
    },
    {
      id: 'consulta-online-120',
      title: 'Consulta Online',
      price: '$300',
      description: 'Sesión extendida de 120 minutos para un asesoramiento más detallado sobre tendencias, estilos y decisiones para lograr un resultado impactante.',
      image: '/images/service2.jpg',
      tag: 'Completo',
      duration: '120 min',
      features: ['Análisis profundo del espacio', 'Planificación completa', 'Recomendaciones detalladas']
    },
    {
      id: 'paquete-esencial',
      title: 'Paquete Esencial',
      price: '$450',
      description: 'Transformación de una habitación con guía profesional que incluye reunión inicial, moodboard, paleta de colores y propuesta de distribución.',
      image: '/images/service3.jpg',
      tag: 'Popular',
      duration: 'Por Habitación',
      features: ['Moodboard digital', 'Paleta de colores', 'Propuesta de distribución']
    },
    {
      id: 'paquete-intermedio',
      title: 'Paquete Intermedio',
      price: '$750',
      description: 'Servicio personalizado con dos propuestas decorativas, paleta detallada, plano 2D, reuniones de revisión y lista de compras recomendadas.',
      image: '/images/service4.jpg',
      tag: 'Recomendado',
      duration: 'Por Habitación',
      features: ['Dos moodboards por área', 'Plano 2D a escala', 'Lista de compras detallada']
    },
    {
      id: 'paquete-premium',
      title: 'Paquete Premium',
      price: '$1,150',
      description: 'Diseño exclusivo y detallado con acompañamiento integral, render 3D profesional, guía de montaje y seguimiento personalizado del proyecto.',
      image: '/images/service5.jpg',
      tag: 'Premium',
      duration: 'Por Habitación',
      features: ['Render 3D profesional', 'Guía de montaje', 'Seguimiento personalizado']
    }
  ];

  return (
    <section className="py-5 bg-light" style={{ marginTop: '70px' }}>
      <Container>
       
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">Nuestros Servicios</h1>
          <div className="mx-auto my-3" style={{ width: '80px', height: '3px', backgroundColor: 'var(--primary-color)', borderRadius: '2px' }}></div>
          <p className="lead text-muted col-md-8 mx-auto">
            Descubre nuestra selección de servicios especializados para transformar tu espacio con estilo y funcionalidad.
          </p>
        </div>
        
        <div className="mb-5">
          <h2 className="text-center mb-4">Servicios Online</h2>
          <Row className="g-4 justify-content-center">
            {services.filter(service => service.id.includes('online')).map((service) => (
              <Col key={service.id} md={6} lg={5}>
                <Card className="h-100 border-0 shadow-sm transition-all">
                  <div className="position-relative">
                    <Card.Img 
                      variant="top" 
                      src={service.image} 
                      className="object-fit-cover"
                      style={{ height: '250px' }}
                    />
                  
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title 
                      className="mb-2 fs-4"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {service.title}
                    </Card.Title>
                    <div 
                      className="fw-bold mb-3 fs-5"
                      style={{ color: 'var(--secondary-color)' }}
                    >
                      {service.price} <small className="text-muted fs-6">({service.duration})</small>
                    </div>
                    <Card.Text className="mb-3">{service.description}</Card.Text>
                    
                    <div className="mt-auto mt-4 d-flex gap-2">
                      <Button 
                        as={Link} 
                        to={`/servicios/${service.id}`}
                        className="flex-grow-1 py-2 fw-semibold"
                        style={{ 
                          backgroundColor: 'transparent', 
                          borderColor: 'var(--primary-color)',
                          color: 'var(--primary-color)'
                        }}
                      >
                        <i className="bi bi-eye me-2"></i>
                        Ver Detalles
                      </Button>
                      <Button 
                        as={Link} 
                        to="/agendar" 
                        state={{ selectedService: service }}
                        className="flex-grow-1 py-2 fw-semibold"
                        style={{ 
                          backgroundColor: 'var(--primary-color)', 
                          borderColor: 'var(--primary-color)',
                          color: 'white'
                        }}
                      >
                        <i className="bi bi-calendar-check me-2"></i>
                        Agendar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        
        <div className="mb-5">
          <h2 className="text-center mb-4">Servicios Presenciales</h2>
          <Row className="g-4">
            {services.filter(service => !service.id.includes('online')).map((service) => (
              <Col key={service.id} md={6} lg={4}>
                <Card className="h-100 border-0 shadow-sm transition-all">
                  <div className="position-relative">
                    <Card.Img 
                      variant="top" 
                      src={service.image} 
                      className="object-fit-cover"
                      style={{ height: '250px' }}
                    />
                   
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title 
                      className="mb-2 fs-4"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {service.title}
                    </Card.Title>
                    <div 
                      className="fw-bold mb-3 fs-5"
                      style={{ color: 'var(--secondary-color)' }}
                    >
                      {service.price} <small className="text-muted fs-6">({service.duration})</small>
                    </div>
                    <Card.Text className="mb-3">{service.description}</Card.Text>
                    
                    <div className="mt-auto mt-4 d-flex gap-2">
                      <Button 
                        as={Link} 
                        to={`/servicios/${service.id}`}
                        className="flex-grow-1 py-2 fw-semibold"
                        style={{ 
                          backgroundColor: 'transparent', 
                          borderColor: 'var(--primary-color)',
                          color: 'var(--primary-color)'
                        }}
                      >
                        <i className="bi bi-eye me-2"></i>
                        Ver Detalles
                      </Button>
                      <Button 
                        as={Link} 
                        to="/agendar" 
                        state={{ selectedService: service }}
                        className="flex-grow-1 py-2 fw-semibold"
                        style={{ 
                          backgroundColor: 'var(--primary-color)', 
                          borderColor: 'var(--primary-color)',
                          color: 'white'
                        }}
                      >
                        <i className="bi bi-calendar-check me-2"></i>
                        Agendar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        
        <div className="text-center mt-5 pt-3">
          <p className="text-muted mb-4">¿Tienes alguna pregunta sobre nuestros servicios?</p>
          <Button 
            as={Link} 
            to="/contacto" 
            className="rounded-pill px-4 py-2"
            style={{ 
              color: 'var(--primary-color)',
              borderColor: 'var(--primary-color)',
              backgroundColor: 'transparent'
            }}
          >
            <i className="bi bi-chat-dots me-2"></i>
            Contáctanos
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default ServicesPage; 