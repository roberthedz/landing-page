import React from 'react';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SocialMediaPageSection = styled.section`
  padding: 3rem 0;
  background-color: var(--background-color);
  background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
  min-height: 100vh;
  margin-top: 70px;
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
  }
  
  &:hover {
    background-color: var(--accent-color);
  }
`;

const SocialMediaPage = () => {
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
    <SocialMediaPageSection>
      <Container>
        <SectionTitle>
          <h2>Síguenos en Redes</h2>
          <p>Conéctate con nosotros para inspiración diaria, tutoriales y las últimas tendencias en diseño de interiores</p>
        </SectionTitle>
        
        <SocialMediaGrid className="mb-5">
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
        
        <div className="text-center mt-5 pt-3">
          <p className="text-muted mb-4">¿Quieres saber más sobre nuestros servicios?</p>
          <Link to="/servicios" className="btn rounded-pill px-4 py-2" style={{ 
            color: 'var(--primary-color)',
            borderColor: 'var(--primary-color)',
            backgroundColor: 'transparent'
          }}>
            <i className="bi bi-arrow-right me-2"></i>
            Ver Servicios
          </Link>
        </div>
      </Container>
    </SocialMediaPageSection>
  );
};

export default SocialMediaPage; 