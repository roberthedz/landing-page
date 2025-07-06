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
      type: 'asesoria-basica',
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
      type: 'asesoria-basica',
      features: ['Análisis profundo del espacio', 'Planificación completa', 'Recomendaciones detalladas']
    },
    {
      id: 'paquete-esencial',
      title: 'Paquete Esencial',
      price: 'Contáctanos para estimado GRATIS',
      description: 'Ideal para quienes quieren una guía clara y profesional para transformar un espacio con estilo, sin complicaciones.',
      image: '/images/service3.jpg',
      tag: 'Popular',
      duration: '',
      type: 'asesoria-completa',
      features: ['Reunión inicial (60 min)', 'Moodboard digital', 'Paleta de colores', 'Lista de recomendaciones', 'PDF de presentación final']
    },
    {
      id: 'paquete-intermedio',
      title: 'Paquete Intermedio',
      price: 'Contáctanos para estimado GRATIS',
      description: 'Ideal para quienes desean transformar un espacio con estilo y funcionalidad, contando con asesoría personalizada y dos propuestas de decoración para elegir la que mejor se adapte a su visión.',
      image: '/images/service4.jpg',
      tag: 'Recomendado',
      duration: '',
      type: 'asesoria-completa',
      features: ['Dos moodboards por área', 'Plano 2D a escala', 'Reunión de revisión', 'Lista de compras detallada']
    },
    {
      id: 'paquete-premium',
      title: 'Paquete Premium',
      price: 'Contáctanos para estimado GRATIS',
      description: 'Orientado para quienes quieren un paquete exclusivo, detallado y sin preocupaciones, con un diseño completamente a medida y acompañamiento integral en cada paso del proceso.',
      image: '/images/service5.jpg',
      tag: 'Premium',
      duration: '',
      type: 'asesoria-completa',
      features: ['Render 3D profesional', 'Acompañamiento integral', 'Atención preferente', 'Seguimiento personalizado']
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
          <h2 className="text-center mb-4">Servicios de Asesoría Básica</h2>
          <Row className="g-4 justify-content-center">
            {services.filter(service => service.type === 'asesoria-basica').map((service) => (
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
                      className="fw-bold mb-3"
                      style={{ 
                        color: 'var(--secondary-color)',
                        fontSize: service.price.includes('Contáctanos') ? '1.1rem' : '1.25rem'
                      }}
                    >
                      {service.price} <small className="text-muted fs-6">{service.duration}</small>
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
          <h2 className="text-center mb-4">Servicios de Asesoría Completa</h2>
          <Row className="g-4">
            {services.filter(service => service.type === 'asesoria-completa').map((service) => (
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
                      className="fw-bold mb-3"
                      style={{ 
                        color: 'var(--secondary-color)',
                        fontSize: service.price.includes('Contáctanos') ? '1.1rem' : '1.25rem'
                      }}
                    >
                      {service.price} <small className="text-muted fs-6">{service.duration}</small>
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