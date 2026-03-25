import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Breadcrumb, Button, Badge, Card, ListGroup } from 'react-bootstrap';
import styled from 'styled-components';
import { getServiceById } from '../data/servicesData';

const HeroSection = styled.section`
  padding: 8rem 0 3rem;
  background-color: var(--light-bg);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background-color: var(--white);
    clip-path: ellipse(50% 50% at 50% 100%);
  }
`;

const PageTitle = styled.h1`
  font-size: 3.2rem;
  font-weight: 700;
  color: #4a6163;
  margin-bottom: 1.5rem;
  font-family: 'Playfair Display', serif;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 80px;
    height: 3px;
    background-color: #4a6163;
    border-radius: 2px;
  }
`;

const Price = styled.div`
  font-size: ${props => props.isLongPrice ? '1.5rem' : '2.2rem'};
  font-weight: 700;
  color: #4a6163;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  
  small {
    font-size: 1rem;
    margin-left: 0.5rem;
    color: var(--text-color);
    font-weight: 400;
  }
`;

const ServiceTag = styled(Badge)`
  background-color: #4a6163;
  color: white;
  padding: 0.5rem 1.2rem;
  font-weight: 500;
  border-radius: 50px;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  display: inline-block;
`;

const ServiceDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-color);
  margin-bottom: 2rem;
`;

const ContentSection = styled.section`
  padding: 3rem 0;
  background-color: var(--white);
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 1.25rem;
  position: relative;
  display: block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 50px;
    height: 3px;
    background-color: #4a6163;
    border-radius: 2px;
  }
`;

const FeatureCard = styled(Card)`
  border: none;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  height: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: var(--secondary-color);
  margin-bottom: 1rem;
`;

const StyledListGroup = styled(ListGroup)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(74, 97, 99, 0.1);
  
  .list-group-item {
    padding: 0.875rem 1.25rem;
    display: flex;
    align-items: flex-start;
    border: none;
    border-bottom: 1px solid rgba(74, 97, 99, 0.08);
    
    &:last-child {
      border-bottom: none;
    }
    
    i {
      color: #4a6163;
      margin-right: 0.875rem;
      font-size: 1.1rem;
      margin-top: 0.125rem;
      flex-shrink: 0;
    }
    
    &:hover {
      background-color: rgba(74, 97, 99, 0.05);
    }
  }
`;

const BookButton = styled(Button)`
  background-color: #4a6163;
  border-color: #4a6163;
  color: #fff;
  border-radius: 50px;
  padding: 0.8rem 2rem;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #5d7a7c;
    border-color: #5d7a7c;
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(74, 97, 99, 0.3);
  }
`;

/* ── Estilos exclusivos para Consulta Rápida ── */
const ThinSectionTitle = styled.h3`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #4a6163;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(74, 97, 99, 0.2);
`;

const ThinList = styled.ul`
  list-style: none;
  margin: 0 0 2rem 0;
  padding: 0;

  li {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    padding: 0.6rem 0;
    border-bottom: 1px solid rgba(74, 97, 99, 0.07);
    font-size: 0.9rem;
    color: #444;
    line-height: 1.5;

    &:last-child { border-bottom: none; }

    i {
      color: #4a6163;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      flex-shrink: 0;
    }
  }
`;

const ThinDivider = styled.div`
  height: 1px;
  background-color: rgba(74, 97, 99, 0.12);
  margin: 1.75rem 0;
`;

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulando carga de datos
    setTimeout(() => {
      // Usar datos centralizados desde servicesData.js
      const foundService = getServiceById(serviceId);
      
      if (foundService) {
        setService(foundService);
      } else {
        // Si no se encuentra el servicio, redirigir a la página de servicios
        navigate('/servicios');
      }
      
      setLoading(false);
    }, 500);
  }, [serviceId, navigate]);
  
  if (loading) {
    return (
      <Container className="py-5 text-center" style={{ marginTop: '100px' }}>
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }
  
  if (!service) {
    return null; // Redirección manejada en useEffect
  }

  return (
    <>
      <HeroSection>
        <Container>
       
          
          <Row className="align-items-center">
            <Col lg={6}>
              <PageTitle>{service.title}</PageTitle>
              <Price isLongPrice={service.price.includes('Contáctanos')}>
                {service.price}
              </Price>
              <ServiceDescription>{service.longDescription}</ServiceDescription>
              <BookButton as={Link} to="/agendar" state={{ selectedService: service }}>
                <i className="bi bi-calendar-check me-2"></i>
                Agendar Consulta
              </BookButton>
            </Col>
            <Col lg={6} className="mt-5 mt-lg-0">
              <img 
                src={service.image} 
                alt={service.title} 
                className="img-fluid rounded-3 shadow"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            </Col>
          </Row>
        </Container>
      </HeroSection>
      
      <ContentSection>
        <Container>
          {service.type === 'consulta-rapida' ? (
            /* ── Layout Consulta Rápida: misma tipografía/estilo, distribución diferente ── */
            <>
              <Row className="align-items-start">
                {/* Columna izquierda: ¿Qué incluye? + Información */}
                <Col lg={5} className="mb-4 mb-lg-0 pe-lg-4">
                  <SectionTitle>¿Qué incluye?</SectionTitle>
                  <StyledListGroup variant="flush" className="mb-4">
                    {service.features && service.features.map((item, i) => (
                      <ListGroup.Item key={i}>
                        <i className="bi bi-check-circle-fill"></i>{item}
                      </ListGroup.Item>
                    ))}
                  </StyledListGroup>

                  <SectionTitle>Información</SectionTitle>
                  <StyledListGroup variant="flush">
                    {service.informacion && service.informacion.map((item, i) => (
                      <ListGroup.Item key={i}>
                        <i className="bi bi-info-circle-fill"></i>{item}
                      </ListGroup.Item>
                    ))}
                  </StyledListGroup>
                </Col>

                {/* Columna derecha: Ideal para ti si + ¿Qué podemos revisar? */}
                <Col lg={7} className="ps-lg-4">
                  <SectionTitle>Ideal para ti si...</SectionTitle>
                  <StyledListGroup variant="flush" className="mb-4">
                    {service.includes && service.includes.map((item, i) => (
                      <ListGroup.Item key={i}>
                        <i className="bi bi-check-circle-fill"></i>{item}
                      </ListGroup.Item>
                    ))}
                  </StyledListGroup>

                  <SectionTitle>¿Qué podemos revisar?</SectionTitle>
                  <Row className="g-3">
                    {service.extra && service.extra.map((item, i) => (
                      <Col xs={6} key={i}>
                        <StyledListGroup variant="flush">
                          <ListGroup.Item>
                            <i className="bi bi-dot" style={{ fontSize: '1.4rem' }}></i>{item}
                          </ListGroup.Item>
                        </StyledListGroup>
                      </Col>
                    ))}
                  </Row>
                </Col>
              </Row>

              <Row className="mt-5">
                <Col className="text-center">
                  <h3 className="mb-4">¿Listo para transformar tu espacio?</h3>
                  <BookButton as={Link} to="/agendar" state={{ selectedService: service }}>
                    <i className="bi bi-calendar-check me-2"></i>
                    Agendar Consulta
                  </BookButton>
                </Col>
              </Row>
            </>
          ) : (
            /* ── Layout estándar para el resto de servicios ── */
            <>
              <Row className="align-items-start">
                <Col lg={7} className="mb-4 mb-lg-0 pe-lg-4">
                  <SectionTitle>¿Qué incluye?</SectionTitle>
                  <StyledListGroup variant="flush">
                    {service.features && service.features.map((feature, index) => (
                      <ListGroup.Item key={index}>
                        <i className="bi bi-check-circle-fill"></i>
                        {feature}
                      </ListGroup.Item>
                    ))}
                  </StyledListGroup>
                </Col>
                
                <Col lg={5} className="ps-lg-4">
                  <div className="mb-4">
                    <SectionTitle>Ideal para ti si...</SectionTitle>
                    <StyledListGroup variant="flush">
                      {service.includes && service.includes.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <i className="bi bi-check-circle-fill"></i>
                          {item}
                        </ListGroup.Item>
                      ))}
                    </StyledListGroup>
                  </div>
                  
                  <div className="mb-4">
                    <SectionTitle>Extra</SectionTitle>
                    <StyledListGroup variant="flush">
                      {service.extra && service.extra.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <i className="bi bi-star-fill"></i>
                          {item}
                        </ListGroup.Item>
                      ))}
                    </StyledListGroup>
                  </div>
                  
                  <div className="mb-4">
                    <SectionTitle>Información</SectionTitle>
                    <StyledListGroup variant="flush">
                      {service.informacion && service.informacion.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <i className="bi bi-info-circle-fill"></i>
                          {item}
                        </ListGroup.Item>
                      ))}
                    </StyledListGroup>
                  </div>
                </Col>
              </Row>
              
              <Row className="mt-5">
                <Col className="text-center">
                  <h3 className="mb-4">¿Listo para transformar tu espacio?</h3>
                  <BookButton as={Link} to="/agendar" state={{ selectedService: service }}>
                    <i className="bi bi-calendar-check me-2"></i>
                    Agendar Consulta
                  </BookButton>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </ContentSection>
    </>
  );
};

export default ServiceDetailPage; 