import React, { useState } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AuthSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
`;

const AuthCard = styled(Card)`
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const AuthHeader = styled.div`
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 2rem;
  text-align: center;
`;

const AuthTitle = styled.h2`
  margin: 0;
  font-weight: 600;
  font-size: 1.8rem;
`;

const AuthSubtitle = styled.p`
  margin: 0.5rem 0 0 0;
  opacity: 0.8;
  font-size: 0.9rem;
`;

const AuthBody = styled.div`
  padding: 2rem;
`;

const StyledForm = styled(Form)`
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-label {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  
  .form-control {
    border: 2px solid #e9ecef;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
  padding: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    transform: none;
  }
`;

const AdminAuth = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simular validación (en producción esto sería en el backend)
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'DEdecorAdmin') {
        // Guardar sesión de admin
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminUser', credentials.username);
        navigate('/admin/dashboard');
      } else {
        setError('Credenciales incorrectas. Usuario: admin, Contraseña: DEdecorAdmin');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <AuthSection>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <AuthCard>
              <AuthHeader>
                <AuthTitle>🔐 Panel de Administración</AuthTitle>
                <AuthSubtitle>DEdecor - Sistema de Reservas</AuthSubtitle>
              </AuthHeader>
              <AuthBody>
                <StyledForm onSubmit={handleSubmit}>
                  {error && (
                    <Alert variant="danger" className="mb-3">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </Alert>
                  )}
                  
                  <div className="form-group">
                    <Form.Label htmlFor="username">Usuario</Form.Label>
                    <Form.Control
                      type="text"
                      id="username"
                      name="username"
                      value={credentials.username}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu usuario"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <Form.Label htmlFor="password">Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      id="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu contraseña"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <LoginButton
                    type="submit"
                    disabled={loading || !credentials.username || !credentials.password}
                  >
                    {loading ? (
                      <>
                        <i className="bi bi-hourglass-split me-2"></i>
                        Verificando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Iniciar Sesión
                      </>
                    )}
                  </LoginButton>
                </StyledForm>
                
                <div className="text-center mt-3">
                  <small className="text-muted">
                    <i className="bi bi-shield-lock me-1"></i>
                    Acceso restringido para administradores
                  </small>
                </div>
              </AuthBody>
            </AuthCard>
          </Col>
        </Row>
      </Container>
    </AuthSection>
  );
};

export default AdminAuth;
