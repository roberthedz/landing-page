import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Breadcrumb } from 'react-bootstrap';
import { servicesData, getConsultaRapidaServices } from '../data/servicesData';

const ServicesPage = () => {
  const services = servicesData;
  const consultaRapida = getConsultaRapidaServices();

  return (
    <section className="py-5 bg-light" style={{ marginTop: '70px' }}>
      <Container>
       
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold" style={{ color: 'var(--primary-color)' }}>Nuestros Servicios</h1>
          <div className="mx-auto my-3" style={{ width: '80px', height: '3px', backgroundColor: '#4a6163', borderRadius: '2px' }}></div>
          <p className="lead text-muted col-md-8 mx-auto">
            Descubre nuestra selección de servicios especializados para transformar tu espacio con estilo y funcionalidad.
          </p>
        </div>

        <div className="mb-5">
          <h2 className="text-center mb-4" style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            <span>Servicios de Asesoría Online</span>
            <div className="mx-auto mt-3" style={{ width: '60px', height: '2px', backgroundColor: '#4a6163', borderRadius: '2px' }}></div>
          </h2>
          <Row className="g-4">
            {services.filter(service => service.type === 'asesoria-online').map((service) => (
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
                      {service.price}
                    </div>
                    <Card.Text className="mb-3">{service.description}</Card.Text>
                    
                    <div className="mt-auto mt-4 d-flex gap-2">
                      <Button 
                        as={Link} 
                        to={`/servicios/${service.id}`}
                        className="flex-grow-1 py-2 fw-semibold"
                        style={{ 
                          backgroundColor: 'transparent', 
                          borderColor: '#4a6163',
                          color: '#4a6163'
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
                          backgroundColor: '#4a6163', 
                          borderColor: '#4a6163',
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
          <h2 className="text-center mb-4" style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            <span>Servicios de Asesoría Presencial</span>
            <div className="mx-auto mt-3" style={{ width: '60px', height: '2px', backgroundColor: '#4a6163', borderRadius: '2px' }}></div>
          </h2>
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
                      {service.price}
                    </div>
                    <Card.Text className="mb-3">{service.description}</Card.Text>
                    
                    <div className="mt-auto mt-4 d-flex gap-2">
                      <Button 
                        as={Link} 
                        to={`/servicios/${service.id}`}
                        className="flex-grow-1 py-2 fw-semibold"
                        style={{ 
                          backgroundColor: 'transparent', 
                          borderColor: '#4a6163',
                          color: '#4a6163'
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
                          backgroundColor: '#4a6163', 
                          borderColor: '#4a6163',
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
          <h2 className="text-center mb-4" style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            <span>Servicios de Asesoría Comercial</span>
            <div className="mx-auto mt-3" style={{ width: '60px', height: '2px', backgroundColor: '#4a6163', borderRadius: '2px' }}></div>
          </h2>
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
                      {service.price}
                    </div>
                    <Card.Text className="mb-3">{service.description}</Card.Text>
                    
                    <div className="mt-auto mt-4 d-flex gap-2">
                      <Button 
                        as={Link} 
                        to={`/servicios/${service.id}`}
                        className="flex-grow-1 py-2 fw-semibold"
                        style={{ 
                          backgroundColor: 'transparent', 
                          borderColor: '#4a6163',
                          color: '#4a6163'
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
                          backgroundColor: '#4a6163', 
                          borderColor: '#4a6163',
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
        
        {/* Separador + Consulta Rápida al final */}
        <div className="d-flex align-items-center gap-3 mb-5 mt-2">
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(74,97,99,0.15)' }}></div>
          <span style={{ color: '#4a6163', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>¿Solo tienes una duda puntual?</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(74,97,99,0.15)' }}></div>
        </div>

        {consultaRapida.map(service => (
          <div key={service.id} className="rounded-4 overflow-hidden shadow-lg mb-5" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '300px' }}>
            <div className="d-none d-md-block" style={{ overflow: 'hidden' }}>
              <img
                src={service.image}
                alt={service.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: '300px' }}
              />
            </div>
            <div className="p-4 p-md-5 d-flex flex-column justify-content-center" style={{ background: 'linear-gradient(135deg, #4a6163 0%, #5d7a7c 100%)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.35rem 0.9rem', borderRadius: '50px', marginBottom: '1rem', width: 'fit-content' }}>
                <i className="bi bi-lightning-fill"></i>Consulta Rápida
              </span>
              <h2 className="fw-bold mb-2" style={{ color: '#ffffff', fontFamily: 'Playfair Display, serif', fontSize: '2rem', lineHeight: '1.2' }}>{service.title}</h2>
              <div className="fw-bold mb-3" style={{ color: '#ffffff', fontSize: '1.5rem' }}>
                {service.price} <span style={{ fontSize: '0.95rem', fontWeight: '400', color: 'rgba(255,255,255,0.8)' }}>· {service.duration} por videollamada</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '1.7', marginBottom: '1.75rem', fontSize: '0.95rem' }}>{service.description}</p>
              <div className="d-flex gap-3 flex-wrap">
                <Button
                  as={Link}
                  to={`/servicios/${service.id}`}
                  className="fw-bold"
                  style={{ backgroundColor: '#ffffff', borderColor: '#ffffff', color: '#4a6163', borderRadius: '50px', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                >
                  <i className="bi bi-eye me-2"></i>Ver Detalles
                </Button>
                <Button
                  as={Link}
                  to="/agendar"
                  state={{ selectedService: service }}
                  className="fw-semibold"
                  style={{ backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.6)', color: '#ffffff', borderRadius: '50px', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                >
                  <i className="bi bi-calendar-check me-2"></i>Agendar
                </Button>
              </div>
            </div>
          </div>
        ))}

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