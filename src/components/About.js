import React from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AboutSection = styled.section`
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
  min-height: 400px;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    min-height: 300px;
  }
`;

const TeamMemberCard = styled(Card)`
  text-align: center;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  }
`;

const TeamMemberImage = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  margin: 1.5rem auto;
  background-size: cover;
  background-position: center;
  border: 4px solid var(--white);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const TeamMemberName = styled(Card.Title)`
  color: #000;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
  font-weight: 600;
`;

const TeamMemberRole = styled.p`
  font-style: italic;
  color: var(--secondary-color);
  margin-bottom: 1rem;
  font-weight: 500;
`;

const ReadMoreButton = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.6rem 1.5rem;
  background-color: var(--secondary-color);
  color: white;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--accent-color);
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    color: white;
  }
  
  i {
    margin-left: 0.5rem;
  }
`;

const SocialMediaSection = styled.div`
  margin-bottom: 5rem;
`;

const SocialMediaTitle = styled.h2`
  font-size: 2.8rem;
  color: #000;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  
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
`;

const SocialMediaDescription = styled.p`
  text-align: center;
  max-width: 700px;
  margin: 1.5rem auto 3rem;
  color: var(--text-color);
  font-size: 1.1rem;
  line-height: 1.6;
`;

const SocialMediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 0 auto;
  max-width: 1000px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SocialMediaCard = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 1.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  }
`;

const SocialMediaIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.color || 'var(--secondary-color)'};
`;

const SocialMediaName = styled.h4`
  font-size: 1.5rem;
  color: #000;
  margin-bottom: 0.8rem;
  font-weight: 600;
`;

const SocialMediaText = styled.p`
  text-align: center;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;

const SocialMediaButton = styled.span`
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background-color: var(--secondary-color);
  color: white;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  i {
    margin-left: 0.5rem;
    color: white;
  }
  
  &:hover {
    background-color: var(--accent-color);
  }
`;

const AboutContainer = styled.div`
  margin-top: 5rem;
`;

const About = () => {
  const socialPlatforms = [
    {
      name: 'Instagram',
      icon: 'bi bi-instagram',
      color: '#E1306C',
      text: 'Inspírate con nuestras ideas de decoración, proyectos recientes y tendencias de diseño de interiores.',
      link: 'https://www.instagram.com/dedecorshow?igsh=OGVjN2o2NzRzNmNk'
    },
    {
      name: 'YouTube',
      icon: 'bi bi-youtube',
      color: '#FF0000',
      text: 'Tutoriales, recorridos por proyectos y consejos prácticos para transformar tu espacio paso a paso.',
      link: 'https://m.youtube.com/@dedecorshow'
    },
    {
      name: 'TikTok',
      icon: 'bi bi-tiktok',
      color: '#000000',
      text: 'Trucos rápidos, ideas creativas y tendencias virales para renovar tu hogar con estilo.',
      link: 'https://www.tiktok.com/@dedecor.show?_t=ZP-8xVYaf8iK3K&_r=1'
    }
  ];

  return (
    <AboutSection id="sobre-nosotros">
      <Container>
        <SocialMediaSection>
          <div className="text-center">
            <SocialMediaTitle>Síguenos en Redes</SocialMediaTitle>
            <SocialMediaDescription>
              Conéctate con nosotros para inspiración diaria, tutoriales y las últimas tendencias en diseño de interiores
            </SocialMediaDescription>
          </div>
          
          <SocialMediaGrid>
            {socialPlatforms.map((platform, index) => (
              <SocialMediaCard 
                key={index} 
                href={platform.link} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <SocialMediaIcon color={platform.color}>
                  <i className={platform.icon}></i>
                </SocialMediaIcon>
                <SocialMediaName>{platform.name}</SocialMediaName>
                <SocialMediaText>{platform.text}</SocialMediaText>
                <SocialMediaButton>
                  Visitar <i className="bi bi-arrow-right"></i>
                </SocialMediaButton>
              </SocialMediaCard>
            ))}
          </SocialMediaGrid>
        </SocialMediaSection>
        
        <AboutContainer>
          <SectionTitle>
            <h2>Sobre Nosotras</h2>
            <p>Conoce más sobre nuestro equipo y nuestra pasión por transformar espacios en hogares con personalidad</p>
          </SectionTitle>
          
          <Row className="align-items-center mb-5">
            <Col lg={6} className="mb-4 mb-lg-0">
              <AboutText>
                <p>
                  Somos <strong>Dayana Gafas</strong> y <strong>Eli Fernández</strong>, asesoras en decoración de interiores con más de 10 años de experiencia transformando espacios. Nuestra pasión es ayudarte a crear un hogar que refleje tu personalidad y estilo de vida.
                </p>
                <p>
                  Ya sea que empieces desde cero o quieras darle vida a un rincón olvidado, te guiamos en cada paso. Encontramos tu estilo, proponemos ideas claras y hacemos que cada ambiente tenga sentido.
                </p>
                <p>
                  <strong>Convertimos tu hogar en tu lugar favorito.</strong>
                </p>
                <ReadMoreButton to="/nosotros">
                  Conoce más sobre nosotras <i className="bi bi-arrow-right"></i>
                </ReadMoreButton>
              </AboutText>
            </Col>
            <Col lg={6}>
              <AboutImage style={{ 
                backgroundImage: "url('/images/about-team.jpg')",
                backgroundColor: '#f8f9fa' // Fallback mientras carga la imagen
              }} />
            </Col>
          </Row>
          
          {/* Sección de equipo comentada temporalmente hasta tener toda la información
          <Row className="mt-5 pt-3">
            <Col xs={12} md={6}>
              <TeamMemberCard>
                <Card.Body className="p-4">
                  <TeamMemberImage style={{ backgroundImage: 'url(/images/dayana.jpg)' }} />
                  <TeamMemberName>Dayana Gafas</TeamMemberName>
                  <TeamMemberRole>Asesora de Interiores</TeamMemberRole>
                  <Card.Text>
                    Con una formación en Bellas Artes y Diseño de Interiores, Dayana aporta una visión artística única a cada proyecto.
                  </Card.Text>
                </Card.Body>
              </TeamMemberCard>
            </Col>
            
            <Col xs={12} md={6}>
              <TeamMemberCard>
                <Card.Body className="p-4">
                  <TeamMemberImage style={{ backgroundImage: 'url(/images/eli.jpg)' }} />
                  <TeamMemberName>Eli Fernández</TeamMemberName>
                  <TeamMemberRole>Asesora de Interiores</TeamMemberRole>
                  <Card.Text>
                    Eli combina su formación en Arquitectura y Diseño Sostenible para crear espacios funcionales y respetuosos con el medio ambiente.
                  </Card.Text>
                </Card.Body>
              </TeamMemberCard>
            </Col>
          </Row>
          */}
        </AboutContainer>
      </Container>
    </AboutSection>
  );
};

export default About; 