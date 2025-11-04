import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Breadcrumb } from 'react-bootstrap';

const ServicesPage = () => {
  const services = [
    {
      id: 'consulta-online-habitacion-cerrada',
      title: 'Habitación Cerrada 12x12',
      price: '$150',
      description: 'Asesoría personalizada de 1 hora en línea para transformar una habitación específica de hasta 12x12 pies. Incluye moodboard digital, recomendaciones de productos y sesión de videollamada.',
      image: '/images/service1.jpg',
      tag: 'Online',
      duration: '60 min',
      type: 'asesoria-online',
      features: ['Cuestionario de estilo personalizado', 'Sesión de videollamada de 60 min', 'Moodboard digital', 'Documento resumen con enlaces de compra', 'Selección de tiendas con descuentos hasta 20%']
    },
    {
      id: 'consulta-online-open-concept-1-2',
      title: '1-2 Habitaciones Open Concept',
      price: '$220',
      description: 'Ideal para espacios abiertos donde conviven sala, comedor, cocina. Enfoque estratégico para mantener armonía entre zonas. Incluye moodboard y 6 horas de preparación previa.',
      image: '/images/service2.jpg',
      tag: 'Open Concept',
      duration: '60 min',
      type: 'asesoria-online',
      features: ['6 horas de preparación previa', 'Enfoque estratégico para open concept', 'Transiciones fluidas entre áreas', 'Moodboard digital', 'Selección de tiendas con descuentos hasta 20%']
    },
    {
      id: 'consulta-online-open-concept-3-4',
      title: '3-4 Habitaciones Open Concept',
      price: '$400',
      description: 'Para renovar múltiples áreas en espacios abiertos. Transiciones fluidas entre habitaciones con coherencia visual. Incluye 8 horas de preparación previa y sesión extendida.',
      image: '/images/service3.jpg',
      tag: 'Completo',
      duration: '120 min',
      type: 'asesoria-online',
      features: ['8 horas de preparación previa', 'Sesión extendida de 120 min', 'Coherencia visual entre múltiples áreas', 'Moodboard digital', 'Selección de tiendas con descuentos hasta 20%']
    },
    {
      id: 'paquete-esencial',
      title: 'Paquete Esencial',
      price: '$500',
      description: 'Guía profesional para transformar un espacio (12x12) con estilo. Incluye reunión inicial, moodboard, paleta de colores, propuesta de distribución y lista de recomendaciones. Entrega en 10-12 días.',
      image: '/images/service4.jpg',
      tag: 'Por Habitación',
      duration: 'Presencial',
      type: 'asesoria-presencial',
      features: ['Reunión inicial (60 min)', 'Moodboard digital', 'Paleta de colores sugerida', 'Propuesta de distribución', 'Lista de recomendaciones con links', 'PDF de presentación final', 'Entrega en 10-12 días']
    },
    {
      id: 'paquete-intermedio',
      title: 'Paquete Intermedio',
      price: '$750',
      description: 'Transformación con estilo y funcionalidad. Dos moodboards, plano 2D, reunión de revisión, seguimiento por WhatsApp. Incluye descuentos hasta 20% en proveedores. Entrega en 15-18 días.',
      image: '/images/service5.jpg',
      tag: 'Por Habitación',
      duration: 'Presencial',
      type: 'asesoria-presencial',
      features: ['Dos moodboards por área', 'Plano 2D a escala', 'Reunión de revisión', 'Seguimiento por WhatsApp', 'Lista de compras detallada', 'Descuentos hasta 20%', 'Entrega en 15-18 días']
    },
    {
      id: 'paquete-premium',
      title: 'Paquete Premium',
      price: '$1,200',
      description: 'Proyecto exclusivo y detallado con diseño a medida. Incluye render 3D profesional, acompañamiento integral, guía de montaje y seguimiento a 30 días. Entrega en 21-25 días.',
      image: '/images/service1.jpg',
      tag: 'Por Habitación',
      duration: 'Presencial',
      type: 'asesoria-presencial',
      features: ['Render 3D profesional', 'Acompañamiento integral', 'Guía de montaje personalizada', 'Seguimiento a 30 días', 'Atención preferente', 'Descuentos hasta 20%', 'Entrega en 21-25 días']
    },
    {
      id: 'paquete-comercial-basico',
      title: 'Paquete Comercial Básico',
      price: '$6 por pie cuadrado',
      description: 'Ideal para dueños de negocios, marcas o emprendedores que buscan mejorar la imagen visual y funcionalidad de su local, showroom o tienda. Incluye reunión inicial presencial (hasta 90 min), reunión de seguimiento, 1 moodboard digital, paleta de colores sugerida, propuesta de distribución 2D, ronda de ajuste online (45 min), lista de recomendaciones con links de compra (1 opción por ítem) y selección estratégica de proveedores con descuentos hasta 20%. Entrega en 12-15 días hábiles.',
      image: '/images/service3.jpg',
      tag: 'Comercial',
      duration: 'Presencial',
      type: 'asesoria-comercial',
      features: ['Reunión inicial presencial (90 min)', 'Reunión de seguimiento', '1 Moodboard digital', 'Paleta de colores sugerida', 'Propuesta de distribución 2D', 'Ronda de ajuste online (45 min)', 'Lista de recomendaciones (1 opción por ítem)', 'Descuentos hasta 20%', 'Entrega en 12-15 días hábiles']
    },
    {
      id: 'paquete-comercial-premium',
      title: 'Paquete Comercial Premium',
      price: '$9 por pie cuadrado',
      description: 'Solución completa para negocios que buscan una transformación profesional. Incluye reunión inicial presencial (hasta 90 min), reunión de seguimiento, 2 moodboards digitales, paleta de colores personalizada, propuesta de distribución 2D, ronda de ajuste online (45 min), lista de recomendaciones con links de compra (2 opciones por ítem) y selección estratégica de proveedores con descuentos hasta 20%. PDF de presentación final incluido. Entrega en 15-21 días hábiles.',
      image: '/images/service4.jpg',
      tag: 'Comercial',
      duration: 'Presencial',
      type: 'asesoria-comercial',
      features: ['Reunión inicial presencial (90 min)', 'Reunión de seguimiento', '2 Moodboards digitales', 'Paleta de colores personalizada', 'Propuesta de distribución 2D', 'Ronda de ajuste online (45 min)', 'Lista de recomendaciones (2 opciones por ítem)', 'PDF de presentación final', 'Descuentos hasta 20%', 'Entrega en 15-21 días hábiles']
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
          <h2 className="text-center mb-4">Servicios de Asesoría Online</h2>
          <Row className="g-4 justify-content-center">
            {services.filter(service => service.type === 'asesoria-online').map((service) => (
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
          <h2 className="text-center mb-4">Servicios de Asesoría Presencial</h2>
          <Row className="g-4">
            {services.filter(service => service.type === 'asesoria-presencial').map((service) => (
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
        
        <div className="mb-5">
          <h2 className="text-center mb-4">Servicios de Asesoría Comercial</h2>
          <Row className="g-4 justify-content-center">
            {services.filter(service => service.type === 'asesoria-comercial').map((service) => (
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