import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

const HeroSection = styled.section`
  height: 90vh;
  min-height: 600px;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1800&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  color: #ffffff;
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
  color: #ffffff;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.8), 0 4px 20px rgba(0, 0, 0, 0.6);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 2rem;
  color: #ffffff;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.8), 0 4px 20px rgba(0, 0, 0, 0.6);
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
  background-color: #4a6163 !important;
  background: #4a6163 !important;
  border-color: #4a6163 !important;
  padding: 0.8rem 2rem;
  font-weight: 600;
  border-radius: 50px;
  color: var(--white) !important;
  min-width: 180px;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), 0 0 20px rgba(74, 97, 99, 0.4), 0 0 25px rgba(74, 97, 99, 0.3);
  overflow: hidden;
  opacity: 1 !important;
  
  &, &:focus, &:active {
    background-color: #4a6163 !important;
    background: #4a6163 !important;
    border-color: #4a6163 !important;
  }
  
  /* Efecto de brillo sutil animado */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%; 
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
    z-index: 1;
  }
  
  /* Capa adicional para el resplandor verde olivo (solo alrededor, no en el fondo) */
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: radial-gradient(circle, rgba(74, 97, 99, 0.3) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
    border-radius: 50px;
    animation: rotateGlow 4s linear infinite;
  }
  
  @keyframes rotateGlow {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    background-color: #5d7a7c !important;
    background: #5d7a7c !important;
    border-color: #5d7a7c !important;
    color: var(--white) !important;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4), 0 0 35px rgba(74, 97, 99, 0.6), 0 0 45px rgba(74, 97, 99, 0.4);
    animation: pulseGlow 2s ease-in-out infinite;
  }
  
  /* Animación más visible de pulso en estado normal */
  animation: subtlePulse 2.5s ease-in-out infinite;
  
  @keyframes subtlePulse {
    0%, 100% {
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), 0 0 20px rgba(74, 97, 99, 0.4), 0 0 25px rgba(74, 97, 99, 0.3);
    }
    50% {
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35), 0 0 25px rgba(74, 97, 99, 0.5), 0 0 30px rgba(74, 97, 99, 0.4);
    }
  }
  
  @keyframes pulseGlow {
    0%, 100% {
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4), 0 0 35px rgba(74, 97, 99, 0.6), 0 0 45px rgba(74, 97, 99, 0.4);
    }
    50% {
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45), 0 0 40px rgba(74, 97, 99, 0.7), 0 0 50px rgba(74, 97, 99, 0.5);
    }
  }
  
  /* Asegurar que el texto esté por encima de los efectos */
  span, & > * {
    position: relative;
    z-index: 2;
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
    color: #4a6163;
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
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background-color: #4a6163;
    color: var(--white);
    transform: translateY(-5px);
    border-color: #4a6163;
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