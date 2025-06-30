import React from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AboutPageSection = styled.section`
  padding: 3rem 0;
  background-color: var(--background-color);
  background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
  min-height: 100vh;
  margin-top: 70px;
`;

const AboutText = styled.div`
  p {
    margin-bottom: 1.5rem;
    line-height: 1.8;
    color: var(--text-color);
    font-size: 1.05rem;
  }
`;

const AboutImage = styled.div`
  width: 100%;
  height: 100%;
  min-height: 450px;
  background-size: cover;
  background-position: 10% center;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    min-height: 300px;
    margin-bottom: 2rem;
  }
`;

const TeamCard = styled(Card)`
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  }
`;

const TeamMemberImage = styled.div`
  height: 300px;
  background-size: cover;
  background-position: center;
`;

const TeamMemberName = styled(Card.Title)`
  color: #000;
  margin-bottom: 0.5rem;
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  font-size: 1.5rem;
  margin-top: 1rem;
`;

const TeamMemberRole = styled.p`
  font-style: italic;
  color: var(--secondary-color);
  margin-bottom: 1rem;
  font-weight: 500;
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

const AboutContainer = styled.div`
  margin-top: 0;
`;

const AboutPage = () => {

  return (
    <AboutPageSection>
      <Container>

        
        <AboutContainer>
          <SectionTitle>
            <h2>Un poco más SOBRE NOSOTROS!</h2>
            <p>Conoce más sobre nuestra visión, misión y nuestro proyecto</p>
          </SectionTitle>
          
          <Row className="mb-5 align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <AboutText>
                <h3>Visión</h3>
                <p>
                  Ser referencia en decoración de interiores y contenido creativo en habla hispana, inspirando espacios con identidad y propósito. Un buen diseño no solo embellece, transforma vidas.
                </p>
                <h3>Misión</h3>
                <p>
                  En <strong>DEdecor</strong> fusionamos diseño y narrativa visual para crear espacios auténticos. Acompañamos con creatividad y atención al detalle, ofreciendo soluciones que reflejan la esencia de cada cliente.
                </p>
                <h3>Nuestro Proyecto</h3>
                <p>
                  <strong>DEdecor</strong>, fundada por <strong>Dayana Gafas</strong> y <strong>Eli Fernández</strong>, combina decoración y narrativa visual para transformar espacios con estilo y autenticidad. Desde asesorías hasta proyectos integrales, convertimos ideas en experiencias que inspiran.
                </p>
              </AboutText>
            </Col>
            <Col lg={6}>
              <AboutImage style={{ backgroundImage: 'url(/images/s4.JPEG)' }} />
            </Col>
          </Row>
        </AboutContainer>
        
        {/* Sección de equipo comentada temporalmente hasta tener toda la información
        <div className="mt-5 pt-4 mb-5">
          <SectionTitle>
            <h2>Nuestro Equipo</h2>
            <p>Conoce a las profesionales detrás de cada proyecto</p>
          </SectionTitle>
          <Row className="g-4 mb-5">
            <Col md={6}>
              <TeamCard>
                <TeamMemberImage style={{ backgroundImage: 'url(/images/dayana.jpg)' }} />
                <Card.Body className="p-4">
                  <TeamMemberName>Dayana Gafas</TeamMemberName>
                  <TeamMemberRole>Asesora de Interiores</TeamMemberRole>
                  <Card.Text>
                    Con una formación en Bellas Artes y Diseño de Interiores, Dayana aporta una visión artística única a cada proyecto. Su especialidad es la selección de colores y texturas que transforman por completo la atmósfera de un espacio.
                  </Card.Text>
                </Card.Body>
              </TeamCard>
            </Col>
            
            <Col md={6}>
              <TeamCard>
                <TeamMemberImage style={{ backgroundImage: 'url(/images/eli.jpg)' }} />
                <Card.Body className="p-4">
                  <TeamMemberName>Eli Fernández</TeamMemberName>
                  <TeamMemberRole>Asesora de Interiores</TeamMemberRole>
                  <Card.Text>
                    Eli combina su formación en Arquitectura y Diseño Sostenible para crear espacios funcionales y respetuosos con el medio ambiente. Su enfoque práctico y su atención al detalle garantizan resultados que superan las expectativas.
                  </Card.Text>
                </Card.Body>
              </TeamCard>
            </Col>
          </Row>
          
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
        </div>
        */}
      </Container>
    </AboutPageSection>
  );
};

export default AboutPage; 