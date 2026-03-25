import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #4a6163;
  color: #ffffff;
  padding: 3rem 0;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  align-items: start;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: #ffffff;
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    position: relative;
    padding-bottom: 0.75rem;
    font-weight: 600;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 2px;
      background-color: rgba(255, 255, 255, 0.6);
      border-radius: 2px;
    }
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }

  a {
    color: rgba(255, 255, 255, 0.85);
    transition: all 0.3s ease;
    position: relative;
    
    &:hover {
      color: #ffffff;
      padding-left: 5px;
    }
  }

  p {
    margin-top: 0;
    color: rgba(255, 255, 255, 0.9);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
      transform: translateY(-3px);
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 2rem 1rem 0;
  
  p {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>DeDecor</h3>
          <p>Transformamos tu casa en un espacio que se sienta verdaderamente tuyo. Encontramos tu estilo, proponemos ideas claras y hacemos que cada ambiente tenga sentido.</p>
          <SocialLinks>
            <a href="https://facebook.com" aria-label="Facebook">FB</a>
            <a href="https://instagram.com" aria-label="Instagram">IG</a>
            <a href="https://pinterest.com" aria-label="Pinterest">PT</a>
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>Enlaces</h3>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/servicios">Servicios</Link></li>
            <li><Link to="/sobre-nosotros">Sobre Nosotros</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
            <li><Link to="/agendar">Agendar Cita</Link></li>
          </ul>
        </FooterSection>
        
        <FooterSection>
          <h3>Servicios</h3>
          <ul>
            <li><Link to="/servicios/consulta-online">Consulta Rápida</Link></li>
            <li><Link to="/servicios/consulta-online-habitacion-cerrada">Online Room Reset</Link></li>
            <li><Link to="/servicios/consulta-online-open-concept-1-2">Open Concept Smart Design</Link></li>
            <li><Link to="/servicios/consulta-online-open-concept-3-4">Full Transformation</Link></li>
            <li><Link to="/servicios/paquete-esencial">Paquete Esencial</Link></li>
            <li><Link to="/servicios/paquete-intermedio">Paquete Intermedio</Link></li>
            <li><Link to="/servicios/paquete-premium">Paquete Premium</Link></li>
          </ul>
        </FooterSection>
        
        <FooterSection>
          <h3>Contacto</h3>
          <p>Email: dedecorinfo@gmail.com</p>
          <p>Teléfono: +1 (786) 490-6092</p>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        <p>&copy; {new Date().getFullYear()} DeDecor. Todos los derechos reservados.</p>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer; 