import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

const NotFoundSection = styled.section`
  padding: 8rem 0;
  background-color: var(--background-color);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const NotFoundTitle = styled.h1`
  font-size: 8rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  
  @media (max-width: 576px) {
    font-size: 6rem;
  }
`;

const NotFoundSubtitle = styled.h2`
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 2rem;
`;

const HomeButton = styled(Button)`
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
  padding: 0.8rem 1.5rem;
  
  &:hover {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
    color: var(--text-color);
  }
`;

const NotFound = () => {
  return (
    <NotFoundSection>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <NotFoundTitle>404</NotFoundTitle>
            <NotFoundSubtitle>Página no encontrada</NotFoundSubtitle>
            <p className="mb-4">
              Lo sentimos, la página que estás buscando no existe o ha sido movida.
            </p>
            <HomeButton as={Link} to="/">Volver al inicio</HomeButton>
          </Col>
        </Row>
      </Container>
    </NotFoundSection>
  );
};

export default NotFound; 