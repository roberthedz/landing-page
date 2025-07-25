import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--primary-color);
  color: var(--white);
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
    color: var(--white);
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
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
    color: var(--gray-light);
    
    &:hover {
      color: var(--accent-color);
    }
  }

  p {
    margin-top: 0;
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
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: var(--secondary-color);
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--gray-light);
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 2rem 1rem 0;
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
            <li><Link to="/servicios/consulta-online-60">Consulta Online (60 min)</Link></li>
            <li><Link to="/servicios/consulta-online-120">Consulta Online (120 min)</Link></li>
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