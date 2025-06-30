import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import styled from 'styled-components';

const ServicesSection = styled.section`
  padding: 5rem 0;
  background-color: var(--white);
`;

const SectionTitle = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h2 {
    font-size: 2.8rem;
    color: #000;
    font-weight: 700;
    position: relative;
    display: inline-block;
    margin-bottom: 1rem;
    
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
  }
  
  p {
    max-width: 700px;
    margin: 1.5rem auto 0;
    color: var(--text-color);
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

const CategoryTitle = styled.h3`
  font-size: 2rem;
  color: #000;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background-color: var(--secondary-color);
    border-radius: 2px;
  }
`;

const CategoryContainer = styled.div`
  margin-bottom: 2rem;
`;

const ServiceCard = styled(Card)`
  height: 100%;
  border: none;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  }
`;

const ServiceImage = styled(Card.Img)`
  height: 220px;
  object-fit: cover;
`;

const ServiceTitle = styled(Card.Title)`
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: #000;
`;

const ServicePrice = styled.div`
  font-weight: 700;
  color: var(--secondary-color);
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const ServiceBadge = styled(Badge)`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: var(--secondary-color);
  color: white;
  padding: 0.5rem 1rem;
  font-weight: 500;
  border-radius: 50px;
  font-size: 0.85rem;
`;

const ServiceButton = styled(Button)`
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
  color: #fff;
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const Services = () => {
  const onlineServices = [
    {
      id: 'consulta-online-60',
      title: 'Consulta Online',
      price: '$180',
      description: 'Sesión de 60 minutos donde te asesoramos para crear un espacio armonioso y funcional que refleje tu personalidad y estilo.',
      image: '/images/service1.jpg',
      tag: 'Básico',
      duration: '60 min'
    },
    {
      id: 'consulta-online-120',
      title: 'Consulta Online',
      price: '$300',
      description: 'Sesión extendida de 120 minutos para un asesoramiento más detallado sobre tendencias, estilos y decisiones para lograr un resultado impactante.',
      image: '/images/service2.jpg',
      tag: 'Completo',
      duration: '120 min'
    }
  ];
  
  const presencialServices = [
    {
      id: 'paquete-esencial',
      title: 'Paquete Esencial',
      price: '$450',
      description: 'Transformación de una habitación con guía profesional que incluye reunión inicial, moodboard, paleta de colores y propuesta de distribución.',
      image: '/images/service3.jpg',
      tag: 'Popular',
      duration: 'Por Habitación'
    },
    {
      id: 'paquete-intermedio',
      title: 'Paquete Intermedio',
      price: '$750',
      description: 'Servicio personalizado con dos propuestas decorativas, paleta detallada, plano 2D, reuniones de revisión y lista de compras recomendadas.',
      image: '/images/service4.jpg',
      tag: 'Recomendado',
      duration: 'Por Habitación'
    },
    {
      id: 'paquete-premium',
      title: 'Paquete Premium',
      price: '$1,150',
      description: 'Diseño exclusivo y detallado con acompañamiento integral, render 3D profesional, guía de montaje y seguimiento personalizado del proyecto.',
      image: '/images/service5.jpg',
      tag: 'Premium',
      duration: 'Por Habitación'
    }
  ];

  const renderServiceCard = (service) => (
    <Col key={service.id} md={6} lg={4} className="d-flex mb-4">
      <ServiceCard>
        <div className="position-relative">
          <ServiceImage variant="top" src={service.image} />
        </div>
        <Card.Body className="p-4">
          <ServiceTitle>{service.title}</ServiceTitle>
          <ServicePrice>{service.price} <small>({service.duration})</small></ServicePrice>
          <Card.Text>{service.description}</Card.Text>
          <ServiceButton as={Link} to={`/servicios/${service.id}`}>
            <i className="bi bi-arrow-right-circle me-2"></i>
            Ver Detalles
          </ServiceButton>
        </Card.Body>
      </ServiceCard>
    </Col>
  );

  return (
    <ServicesSection id="servicios">
      <Container>
        <SectionTitle>
          <h2>Nuestros Servicios</h2>
          <p>Descubre nuestra selección de servicios especializados para transformar tu espacio</p>
        </SectionTitle>
        
        <CategoryContainer>
          <div className="d-flex justify-content-center mb-3">
            <CategoryTitle>Servicios Online</CategoryTitle>
          </div>
          <Row className="g-4 justify-content-center">
            {onlineServices.map(renderServiceCard)}
          </Row>
        </CategoryContainer>
        
        <CategoryContainer>
          <div className="d-flex justify-content-center mb-3">
            <CategoryTitle>Servicios Presenciales</CategoryTitle>
          </div>
          <Row className="g-4">
            {presencialServices.map(renderServiceCard)}
          </Row>
        </CategoryContainer>
      </Container>
    </ServicesSection>
  );
};

export default Services; 