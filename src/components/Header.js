import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import styled from 'styled-components';

const StyledNavbar = styled(Navbar)`
  box-shadow: var(--shadow);
  background-color: #ffffff !important;
  background: #ffffff !important;
  padding: 0.8rem 0;
  position: fixed;
  top: 0; 
  width: 100%;
  z-index: 1030;
  border-bottom: 2px solid rgba(74, 97, 99, 0.1);
  
  &,
  &.navbar {
    background-color: #ffffff !important;
    background: #ffffff !important;
  }
`;

const NavContainer = styled(Container)`
  max-width: 1400px;
`;

const Logo = styled(Navbar.Brand)`
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #4a6163;
  transition: color 0.3s ease;
  
  &:hover {
    color: #5d7a7c;
  }
`;

const NavLinksContainer = styled(Nav)`
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

const StyledNavLink = styled(Nav.Link)`
  margin: 0 1rem;
  font-weight: 500;
  color: var(--text-color) !important;
  text-align: center;
  position: relative;
  transition: color 0.3s ease;
  text-decoration: none !important;
  
  &:hover {
    color: #4a6163 !important;
    text-decoration: none !important;
  }
`;

const BookButton = styled(Button)`
  background-color: #4a6163 !important;
  background: #4a6163 !important;
  border-color: #4a6163 !important;
  margin-left: 1rem;
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  color: #ffffff !important;
  min-width: 140px;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: none !important;
  overflow: hidden;
  opacity: 1 !important;
  text-decoration: none !important;
  
  &, &:focus, &:active {
    background-color: #4a6163 !important;
    background: #4a6163 !important;
    border-color: #4a6163 !important;
    color: #ffffff !important;
    text-decoration: none !important;
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
    color: #ffffff !important;
    text-decoration: none !important;
    transform: translateY(-3px);
    box-shadow: none !important;
  }
  
  /* Asegurar que el texto esté por encima de los efectos */
  span, & > * {
    position: relative;
    z-index: 2;
    color: #ffffff !important;
    text-decoration: none !important;
  }
`;

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  const handleLinkClick = () => {
    setExpanded(false);
    window.scrollTo(0, 0);
  };

  return (
    <StyledNavbar expand="lg" fixed="top" expanded={expanded}>
      <NavContainer>
        <Logo as={Link} to="/">DEdecor</Logo>
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setExpanded(expanded ? false : "expanded")}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <NavLinksContainer>
            <StyledNavLink as={Link} to="/" onClick={handleLinkClick}>
              Inicio
            </StyledNavLink>
            <StyledNavLink as={Link} to="/servicios" onClick={handleLinkClick}>
              Servicios
            </StyledNavLink>
            <StyledNavLink as={Link} to="/sobre-nosotros" onClick={handleLinkClick}>
              Sobre Nosotros
            </StyledNavLink>
            <StyledNavLink as={Link} to="/redes-sociales" onClick={handleLinkClick}>
              Redes Sociales
            </StyledNavLink>
            <StyledNavLink as={Link} to="/productos" onClick={handleLinkClick}>
              Productos
            </StyledNavLink>
            <StyledNavLink as={Link} to="/contacto" onClick={handleLinkClick}>
              Contacto
            </StyledNavLink>
            <BookButton as={Link} to="/agendar" onClick={handleLinkClick}>
              Agendar Cita
            </BookButton>
          </NavLinksContainer>
        </Navbar.Collapse>
      </NavContainer>
    </StyledNavbar>
  );
};

export default Header; 