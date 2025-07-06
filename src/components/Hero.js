import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

const HeroSection = styled.section`
  height: 90vh;
  min-height: 600px;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1800&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  color: var(--white);
  margin-top: 70px;
  position: relative;
  
  @media (max-width: 768px) {
    min-height: 650px;
    align-items: flex-start;
    padding-top: 3rem;
  }
  
  @media (max-width: 576px) {
    min-height: 700px;
    padding-top: 2rem;
  }
  
  @media (max-height: 600px) and (max-width: 768px) {
    min-height: 500px;
    align-items: center;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.8rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 2rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
  
  @media (max-width: 576px) {
    font-size: 1rem;
    margin-bottom: 1.2rem;
    line-height: 1.4;
    padding: 0 0.5rem;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    gap: 0.8rem;
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    width: 80%;
    margin: 0 auto 1rem;
    gap: 0.8rem;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
  padding: 0.8rem 2rem;
  font-weight: 600;
  border-radius: 50px;
  color: var(--white);
  min-width: 180px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
    color: var(--white);
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 576px) {
    margin-bottom: 1rem;
    width: 100%;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  border-color: var(--white);
  color: var(--white);
  padding: 0.8rem 2rem;
  font-weight: 600;
  border-radius: 50px;
  min-width: 180px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--white);
    border-color: var(--white);
    color: var(--secondary-color);
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 576px) {
    width: 100%;
  }
`;

const SocialIconsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    gap: 1rem;
  }
  
  @media (max-width: 576px) {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    gap: 0.8rem;
  }
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: var(--white);
  font-size: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--secondary-color);
    color: var(--white);
    transform: translateY(-5px);
  }
  
  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }
  
  @media (max-width: 576px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

const ScrollDownIndicator = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--white);
  cursor: pointer;
  z-index: 10;
  
  span {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  i {
    font-size: 1.5rem;
    animation: bounce 2s infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
  
  @media (max-width: 768px) {
    bottom: 60px;
    
    span {
      font-size: 0.8rem;
      margin-bottom: 0.3rem;
    }
    
    i {
      font-size: 1.3rem;
    }
  }
  
  @media (max-width: 576px) {
    bottom: 80px;
    
    span {
      font-size: 0.75rem;
      margin-bottom: 0.2rem;
    }
    
    i {
      font-size: 1.2rem;
    }
  }
  
  @media (max-width: 480px) {
    bottom: 100px;
  }
  
  @media (max-height: 600px) and (max-width: 768px) {
    display: none;
  }
`;

const Hero = () => {
  const scrollToServices = () => {
    const servicesSection = document.getElementById('servicios');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HeroSection>
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={10} lg={8}>
            <HeroTitle>Transforma tu espacio, transforma tu vida</HeroTitle>
            <HeroSubtitle>
              Somos Dayana Gafas y Eli Fernández, asesoras en decoración de interiores. 
              Te ayudamos a transformar tu espacio en un lugar que refleje tu esencia con estilo, armonía y personalidad.
            </HeroSubtitle>
            <ButtonsContainer>
              <PrimaryButton as={Link} to="/agendar">Agendar Cita</PrimaryButton>
              <SecondaryButton as={Link} to="/servicios">Ver Servicios</SecondaryButton>
            </ButtonsContainer>
            
            <SocialIconsContainer>
              <SocialIcon href="https://www.instagram.com/dedecorshow?igsh=OGVjN2o2NzRzNmNk" target="_blank" rel="noopener noreferrer" title="Síguenos en Instagram">
                <i className="bi bi-instagram"></i>
              </SocialIcon>
              <SocialIcon href="https://m.youtube.com/@dedecorshow" target="_blank" rel="noopener noreferrer" title="Suscríbete en YouTube">
                <i className="bi bi-youtube"></i>
              </SocialIcon>
              <SocialIcon href="https://www.tiktok.com/@dedecor.show?_t=ZP-8xVYaf8iK3K&_r=1" target="_blank" rel="noopener noreferrer" title="Síguenos en TikTok">
                <i className="bi bi-tiktok"></i>
              </SocialIcon>
            </SocialIconsContainer>
          </Col>
        </Row>
      </Container>
      
      <ScrollDownIndicator onClick={scrollToServices}>
        <span>Descubre más</span>
        <i className="bi bi-chevron-down"></i>
      </ScrollDownIndicator>
    </HeroSection>
  );
};

export default Hero; 