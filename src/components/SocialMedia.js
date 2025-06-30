import React from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Card } from 'react-bootstrap';

const SocialMediaSection = styled.section`
  padding: 5rem 0;
  background-color: var(--background-color);
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

const SocialCard = styled(Card)`
  border: none;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  }
`;

const SocialIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: ${props => props.color || 'var(--secondary-color)'};
`;

const SocialTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #000;
`;

const SocialDescription = styled.p`
  color: var(--text-color);
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

const SocialStats = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: auto;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--secondary-color);
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-color);
`;

const SocialLink = styled.a`
  display: inline-block;
  margin-top: 1rem;
  color: var(--secondary-color);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--accent-color);
    transform: translateY(-2px);
  }
  
  i {
    margin-left: 0.5rem;
  }
`;

const SocialMedia = () => {
  const socialPlatforms = [
    {
      name: 'Instagram',
      icon: 'bi bi-instagram',
      color: '#E1306C',
      description: 'Inspírate con nuestras ideas de decoración, proyectos recientes y tendencias de diseño de interiores.',
      followers: '15K',
      posts: '320',
      link: 'https://www.instagram.com/dedecorshow?igsh=OGVjN2o2NzRzNmNk'
    },
    {
      name: 'YouTube',
      icon: 'bi bi-youtube',
      color: '#FF0000',
      description: 'Tutoriales, recorridos por proyectos y consejos prácticos para transformar tu espacio paso a paso.',
      subscribers: '8.5K',
      videos: '45',
      link: 'https://m.youtube.com/@dedecorshow'
    },
    {
      name: 'TikTok',
      icon: 'bi bi-tiktok',
      color: '#000000',
      description: 'Trucos rápidos, ideas creativas y tendencias virales para renovar tu hogar con estilo.',
      followers: '12K',
      likes: '120K',
      link: 'https://www.tiktok.com/@dedecor.show?_t=ZP-8xVYaf8iK3K&_r=1'
    }
  ];

  return (
    <SocialMediaSection id="redes-sociales">
      <Container>
        <SectionTitle>
          <h2>Síguenos en Redes</h2>
          <p>Conéctate con nosotros para inspiración diaria, tutoriales y las últimas tendencias en diseño de interiores</p>
        </SectionTitle>
        
        <Row className="g-4">
          {socialPlatforms.map((platform, index) => (
            <Col key={index} md={4}>
              <SocialCard className="text-center p-4">
                <Card.Body className="d-flex flex-column">
                  <SocialIcon color={platform.color}>
                    <i className={platform.icon}></i>
                  </SocialIcon>
                  <SocialTitle>{platform.name}</SocialTitle>
                  <SocialDescription>{platform.description}</SocialDescription>
                  
                  <SocialStats>
                    {platform.followers && (
                      <StatItem>
                        <StatNumber>{platform.followers}</StatNumber>
                        <StatLabel>Seguidores</StatLabel>
                      </StatItem>
                    )}
                    
                    {platform.posts && (
                      <StatItem>
                        <StatNumber>{platform.posts}</StatNumber>
                        <StatLabel>Posts</StatLabel>
                      </StatItem>
                    )}
                    
                    {platform.subscribers && (
                      <StatItem>
                        <StatNumber>{platform.subscribers}</StatNumber>
                        <StatLabel>Suscriptores</StatLabel>
                      </StatItem>
                    )}
                    
                    {platform.videos && (
                      <StatItem>
                        <StatNumber>{platform.videos}</StatNumber>
                        <StatLabel>Videos</StatLabel>
                      </StatItem>
                    )}
                    
                    {platform.likes && (
                      <StatItem>
                        <StatNumber>{platform.likes}</StatNumber>
                        <StatLabel>Likes</StatLabel>
                      </StatItem>
                    )}
                  </SocialStats>
                  
                  <SocialLink href={platform.link} target="_blank" rel="noopener noreferrer">
                    Visitar {platform.name} <i className="bi bi-arrow-right"></i>
                  </SocialLink>
                </Card.Body>
              </SocialCard>
            </Col>
          ))}
        </Row>
      </Container>
    </SocialMediaSection>
  );
};

export default SocialMedia; 