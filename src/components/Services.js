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
  font-size: ${props => props.isLongPrice ? '1.1rem' : '1.2rem'};
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
  const asesoriaBasicaServices = [
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
  
  const asesoriaCompletaServices = [
    {
      id: 'paquete-esencial',
      title: 'Paquete Esencial',
      price: 'Contáctanos para estimado GRATIS',
      description: 'Ideal para quienes quieren una guía clara y profesional para transformar un espacio con estilo, sin complicaciones.',
      image: '/images/service3.jpg',
      tag: 'Popular',
      duration: ''
    },
    {
      id: 'paquete-intermedio',
      title: 'Paquete Intermedio',
      price: 'Contáctanos para estimado GRATIS',
      description: 'Ideal para quienes desean transformar un espacio con estilo y funcionalidad, contando con asesoría personalizada y dos propuestas de decoración para elegir la que mejor se adapte a su visión.',
      image: '/images/service4.jpg',
      tag: 'Recomendado',
      duration: ''
    },
    {
      id: 'paquete-premium',
      title: 'Paquete Premium',
      price: 'Contáctanos para estimado GRATIS',
      description: 'Orientado para quienes quieren un paquete exclusivo, detallado y sin preocupaciones, con un diseño completamente a medida y acompañamiento integral en cada paso del proceso.',
      image: '/images/service5.jpg',
      tag: 'Premium',
      duration: ''
    }
  ];

  const renderServiceCard = (service) => (
    <Col key={service.id} md={6} lg={4} className="d-flex mb-4">
      <ServiceCard>
        <div className="position-relative">
          <ServiceImage variant="top" src={service.image} />
        </div>
        <Card.Body className="d-flex flex-column p-4">
          <ServiceTitle>{service.title}</ServiceTitle>
          <ServicePrice isLongPrice={service.price.includes('Contáctanos')}>{service.price} <small>{service.duration}</small></ServicePrice>
          <Card.Text className="mb-3">{service.description}</Card.Text>
          
          <div className="mt-auto">
            <Button 
              as={Link} 
              to={`/servicios/${service.id}`}
              className="w-100 py-2 fw-semibold"
              style={{ 
                backgroundColor: 'transparent', 
                borderColor: 'var(--primary-color)',
                color: 'var(--primary-color)',
                borderRadius: '8px'
              }}
            >
              <i className="bi bi-eye me-2"></i>
              Ver Detalles
            </Button>
          </div>
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
            <CategoryTitle>Servicios de Asesoría Básica</CategoryTitle>
          </div>
          <Row className="g-4 justify-content-center">
            {asesoriaBasicaServices.map(renderServiceCard)}
          </Row>
        </CategoryContainer>
        
        <CategoryContainer>
          <div className="d-flex justify-content-center mb-3">
            <CategoryTitle>Servicios de Asesoría Completa</CategoryTitle>
          </div>
          <Row className="g-4">
            {asesoriaCompletaServices.map(renderServiceCard)}
          </Row>
        </CategoryContainer>
      </Container>
    </ServicesSection>
  );
};

export default Services; 