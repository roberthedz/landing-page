import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import styled from 'styled-components';

// Contenedor principal optimizado para móviles
const HomeContainer = styled.div`
  // Asegurar que no hay overflow horizontal en móviles
  overflow-x: hidden;
  width: 100%;
  
  // Mejorar el espaciado entre secciones en móviles
  & > * {
    margin-bottom: 0;
    
    @media (max-width: 768px) {
      margin-bottom: 0;
    }
  }
  
  // Optimizar el scroll en móviles
  -webkit-overflow-scrolling: touch;
`;

const Home = () => {
  return (
    <HomeContainer>
      <Hero />
      <Services />
    </HomeContainer>
  );
};

export default Home; 