import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import styled from 'styled-components';

const StyledNavbar = styled(Navbar)`
  box-shadow: var(--shadow);
  background-color: var(--white);
  padding: 0.8rem 0;
`;

const NavContainer = styled(Container)`
  max-width: 1400px;
`;

const Logo = styled(Navbar.Brand)`
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
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
  
  &:hover {
    color: var(--accent-color) !important;
  }
`;

const BookButton = styled(Button)`
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
  margin-left: 1rem;
  border-radius: var(--button-radius);
  padding: var(--button-padding);
  color: var(--white);
  
  &:hover {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
    color: var(--white);
    transform: translateY(-2px);
    box-shadow: var(--hover-shadow);
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