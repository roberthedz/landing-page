import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import styled from 'styled-components';
import { getOnlineServices, getPresencialServices, getComercialServices, getConsultaRapidaServices } from '../data/servicesData';

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
      background-color: #4a6163;
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
    background-color: #4a6163;
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
  color: #4a6163;
  font-size: ${props => props.isLongPrice ? '1.1rem' : '1.2rem'};
  margin-bottom: 1rem;
`;

const ServiceBadge = styled(Badge)`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: #4a6163;
  color: white;
  padding: 0.5rem 1rem;
  font-weight: 500;
  border-radius: 50px;
  font-size: 0.85rem;
`;

const ServiceButton = styled(Button)`
  background-color: #4a6163;
  border-color: #4a6163;
  color: #fff;
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #5d7a7c;
    border-color: #5d7a7c;
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(74, 97, 99, 0.3);
  }
`;

const ConsultaRapidaSection = styled.div`
  margin-bottom: 5rem;
`;

const ConsultaRapidaLabel = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background-color: rgba(74, 97, 99, 0.1);
    color: #4a6163;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.4rem 1rem;
    border-radius: 50px;
    border: 1px solid rgba(74, 97, 99, 0.2);
  }
`;

const ConsultaRapidaCard = styled.div`
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(74, 97, 99, 0.2);
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 320px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ConsultaRapidaImage = styled.div`
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    min-height: 260px;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, transparent 70%, rgba(74, 97, 99, 0.3));
  }

  @media (max-width: 768px) {
    img { min-height: 220px; }
    &::after { background: linear-gradient(to bottom, transparent 60%, rgba(74, 97, 99, 0.4)); }
  }
`;

const ConsultaRapidaContent = styled.div`
  background: linear-gradient(135deg, #4a6163 0%, #5d7a7c 100%);
  padding: 2.5rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 0.4rem;
    line-height: 1.2;
  }

  .price-line {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 1rem;

    span {
      font-size: 0.95rem;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.8);
    }
  }

  p {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.95rem;
    line-height: 1.7;
    margin-bottom: 1.75rem;
  }

  .buttons {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    padding: 2rem 1.75rem;
  }
`;

const BtnWhite = styled(Button)`
  background-color: #ffffff;
  border-color: #ffffff;
  color: #4a6163;
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.88);
    border-color: rgba(255, 255, 255, 0.88);
    color: #4a6163;
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
  }
`;

const BtnOutlineWhite = styled(Button)`
  background-color: transparent;
  border-color: rgba(255, 255, 255, 0.6);
  color: #ffffff;
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
    border-color: #ffffff;
    color: #ffffff;
    transform: translateY(-2px);
  }
`;

const SectionDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: rgba(74, 97, 99, 0.15);
  }

  span {
    color: #4a6163;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
  }
`;

const Services = () => {
  // Usar datos centralizados desde servicesData.js
  const consultaRapidaServices = getConsultaRapidaServices();
  const asesoriaBasicaServices = getOnlineServices();
  const asesoriaCompletaServices = getPresencialServices();
  const asesoriaComercialServices = getComercialServices();

  const renderServiceCard = (service, index, array) => (
    <Col key={service.id} md={6} lg={array.length === 4 ? 3 : 4} className="d-flex mb-4">
      <ServiceCard>
        <div className="position-relative">
          <ServiceImage variant="top" src={service.image} />
        </div>
        <Card.Body className="d-flex flex-column p-4">
          <ServiceTitle>{service.title}</ServiceTitle>
          <ServicePrice isLongPrice={service.price.includes('Contáctanos')}>{service.price}</ServicePrice>
          <Card.Text className="mb-3">{service.description}</Card.Text>
          
          <div className="mt-auto">
            <Button 
              as={Link} 
              to={`/servicios/${service.id}`}
              className="w-100 py-2 fw-semibold"
              style={{ 
                backgroundColor: 'transparent', 
                borderColor: '#4a6163',
                color: '#4a6163',
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
          <div className="text-center mb-3">
            <CategoryTitle>Servicios de Asesoría Comercial</CategoryTitle>
          </div>
          <Row className="g-4 justify-content-center">
            {asesoriaComercialServices.map(renderServiceCard)}
          </Row>
        </CategoryContainer>

        <SectionDivider><span>¿Solo tienes una duda puntual?</span></SectionDivider>

        {consultaRapidaServices.map(service => (
          <ConsultaRapidaSection key={service.id}>
            <ConsultaRapidaLabel>
              <span><i className="bi bi-lightning-fill"></i>Consulta Rápida</span>
            </ConsultaRapidaLabel>
            <ConsultaRapidaCard>
              <ConsultaRapidaImage>
                <img src={service.image} alt={service.title} />
              </ConsultaRapidaImage>
              <ConsultaRapidaContent>
                <h3>{service.title}</h3>
                <div className="price-line">
                  {service.price} <span>· {service.duration} por videollamada</span>
                </div>
                <p>{service.description}</p>
                <div className="buttons">
                  <BtnWhite as={Link} to={`/servicios/${service.id}`}>
                    <i className="bi bi-eye me-2"></i>Ver Detalles
                  </BtnWhite>
                  <BtnOutlineWhite as={Link} to="/agendar" state={{ selectedService: service }}>
                    <i className="bi bi-calendar-check me-2"></i>Agendar
                  </BtnOutlineWhite>
                </div>
              </ConsultaRapidaContent>
            </ConsultaRapidaCard>
          </ConsultaRapidaSection>
        ))}
      </Container>
    </ServicesSection>
  );
};

export default Services; 