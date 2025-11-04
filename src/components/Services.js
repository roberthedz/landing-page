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
  display: block;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  
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
      id: 'consulta-online-habitacion-cerrada',
      title: 'Habitación Cerrada 12x12',
      price: '$150',
      description: 'Asesoría personalizada de 1 hora en línea para transformar una habitación específica de hasta 12x12 pies. Incluye moodboard digital, recomendaciones de productos y sesión de videollamada.',
      image: '/images/service1.jpg',
      tag: 'Online',
      duration: '60 min'
    },
    {
      id: 'consulta-online-open-concept-1-2',
      title: '1-2 Habitaciones Open Concept',
      price: '$220',
      description: 'Ideal para espacios abiertos donde conviven sala, comedor, cocina. Enfoque estratégico para mantener armonía entre zonas. Incluye moodboard y 6 horas de preparación previa.',
      image: '/images/service2.jpg',
      tag: 'Open Concept',
      duration: '60 min'
    },
    {
      id: 'consulta-online-open-concept-3-4',
      title: '3-4 Habitaciones Open Concept',
      price: '$400',
      description: 'Para renovar múltiples áreas en espacios abiertos. Transiciones fluidas entre habitaciones con coherencia visual. Incluye 8 horas de preparación previa y sesión extendida.',
      image: '/images/service3.jpg',
      tag: 'Completo',
      duration: '120 min'
    }
  ];
  
  const asesoriaCompletaServices = [
    {
      id: 'paquete-esencial',
      title: 'Paquete Esencial',
      price: '$500',
      description: 'Guía profesional para transformar un espacio (12x12) con estilo. Incluye reunión inicial, moodboard, paleta de colores, propuesta de distribución y lista de recomendaciones. Entrega en 10-12 días.',
      image: '/images/service3.jpg',
      tag: 'Por Habitación',
      duration: 'Presencial'
    },
    {
      id: 'paquete-intermedio',
      title: 'Paquete Intermedio',
      price: '$750',
      description: 'Transformación con estilo y funcionalidad. Dos moodboards, plano 2D, reunión de revisión, seguimiento por WhatsApp. Incluye descuentos hasta 20% en proveedores. Entrega en 15-18 días.',
      image: '/images/service4.jpg',
      tag: 'Por Habitación',
      duration: 'Presencial'
    },
    {
      id: 'paquete-premium',
      title: 'Paquete Premium',
      price: '$1,200',
      description: 'Proyecto exclusivo y detallado con diseño a medida. Incluye render 3D profesional, acompañamiento integral, guía de montaje y seguimiento a 30 días. Entrega en 21-25 días.',
      image: '/images/service5.jpg',
      tag: 'Por Habitación',
      duration: 'Presencial'
    }
  ];

  const asesoriaComercialServices = [
    {
      id: 'paquete-comercial-basico',
      title: 'Paquete Comercial Básico',
      price: '$6 por pie cuadrado',
      description: 'Ideal para dueños de negocios, marcas o emprendedores que buscan mejorar la imagen visual y funcionalidad de su local, showroom o tienda. Incluye reunión inicial presencial (hasta 90 min), reunión de seguimiento, 1 moodboard digital, paleta de colores sugerida, propuesta de distribución 2D, ronda de ajuste online (45 min), lista de recomendaciones con links de compra (1 opción por ítem) y selección estratégica de proveedores con descuentos hasta 20%. Entrega en 12-15 días hábiles.',
      image: '/images/service3.jpg',
      tag: 'Comercial',
      duration: 'Presencial'
    },
    {
      id: 'paquete-comercial-premium',
      title: 'Paquete Comercial Premium',
      price: '$9 por pie cuadrado',
      description: 'Solución completa para negocios que buscan una transformación profesional. Incluye reunión inicial presencial (hasta 90 min), reunión de seguimiento, 2 moodboards digitales, paleta de colores personalizada, propuesta de distribución 2D, ronda de ajuste online (45 min), lista de recomendaciones con links de compra (2 opciones por ítem) y selección estratégica de proveedores con descuentos hasta 20%. PDF de presentación final incluido. Entrega en 15-21 días hábiles.',
      image: '/images/service4.jpg',
      tag: 'Comercial',
      duration: 'Presencial'
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
            <CategoryTitle>Servicios de Asesoría Online</CategoryTitle>
          </div>
          <Row className="g-4 justify-content-center">
            {asesoriaBasicaServices.map(renderServiceCard)}
          </Row>
        </CategoryContainer>
        
        <CategoryContainer>
          <div className="d-flex justify-content-center mb-3">
            <CategoryTitle>Servicios de Asesoría Presencial</CategoryTitle>
          </div>
          <Row className="g-4">
            {asesoriaCompletaServices.map(renderServiceCard)}
          </Row>
        </CategoryContainer>
        
        <CategoryContainer>
          <div className="d-flex justify-content-center mb-3">
            <CategoryTitle>Servicios de Asesoría Comercial</CategoryTitle>
          </div>
          <Row className="g-4">
            {asesoriaComercialServices.map(renderServiceCard)}
          </Row>
        </CategoryContainer>
      </Container>
    </ServicesSection>
  );
};

export default Services; 