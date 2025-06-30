import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Breadcrumb, Button, Badge, Card, ListGroup } from 'react-bootstrap';
import styled from 'styled-components';

const HeroSection = styled.section`
  padding: 8rem 0 5rem;
  background-color: var(--light-bg);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background-color: var(--white);
    clip-path: ellipse(50% 50% at 50% 100%);
  }
`;

const PageTitle = styled.h1`
  font-size: 3.2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-family: 'Playfair Display', serif;
`;

const Price = styled.div`
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--secondary-color);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  
  small {
    font-size: 1rem;
    margin-left: 0.5rem;
    color: var(--text-color);
    font-weight: 400;
  }
`;

const ServiceTag = styled(Badge)`
  background-color: var(--secondary-color);
  color: white;
  padding: 0.5rem 1.2rem;
  font-weight: 500;
  border-radius: 50px;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  display: inline-block;
`;

const ServiceDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-color);
  margin-bottom: 2rem;
`;

const ContentSection = styled.section`
  padding: 5rem 0;
  background-color: var(--white);
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 3px;
    background-color: var(--secondary-color);
    border-radius: 2px;
  }
`;

const FeatureCard = styled(Card)`
  border: none;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  height: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: var(--secondary-color);
  margin-bottom: 1rem;
`;

const StyledListGroup = styled(ListGroup)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  
  .list-group-item {
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    
    i {
      color: var(--secondary-color);
      margin-right: 1rem;
      font-size: 1.2rem;
    }
  }
`;

const BookButton = styled(Button)`
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
  color: #fff;
  border-radius: 50px;
  padding: 0.8rem 2rem;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulando carga de datos
    setTimeout(() => {
      // Aquí buscaríamos el servicio por ID en una API real
      const onlineServices = [
        {
          id: 'consulta-online-60',
          title: 'Consulta Online',
          price: '$180',
          duration: '60 min',
          description: 'Sesión de 60 minutos donde te asesoramos para crear un espacio armonioso y funcional que refleje tu personalidad y estilo.',
          longDescription: 'Si deseas transformar por completo tu hogar o simplemente quieras renovar una habitación específica, en DEdecor te acompañamos en cada paso para crear un espacio armonioso, funcional y lleno de estilo, uno que realmente disfrutes habitar. Podemos asesorarte en tendencias actuales, ayudarte a descubrir el estilo que mejor refleja tu personalidad y guiarte en cada decisión para lograr un resultado coherente y estéticamente impactante.',
          image: '/images/service1.jpg',
          tag: 'Básico',
          category: 'online',
          features: [
            'Cuestionario de estilo con preguntas para conocer tus gustos y forma de vivir tu espacio.',
            'Sesión por videollamada de 60 minutos.',
            'Sugerencias de distribución, combinación de colores, movilario y piezas decorativas.',
            'Un Moodboard digital con la propuesta estética.',
            'Documento resumen con enlaces de compra de los productos sugeridos.',
          ],
          includes: [
            'Estás bloqueado con la decoración de un espacio en concreto.',
            'Quieres validar decisiones antes de comprar.',
            'Necesitas una guía para combinar colores y materiales que eleven tu espacio.',
          ]
        },
        {
          id: 'consulta-online-120',
          title: 'Consulta Online',
          price: '$300',
          duration: '120 min',
          description: 'Sesión extendida de 120 minutos para un asesoramiento más detallado sobre tendencias, estilos y decisiones para lograr un resultado impactante.',
          longDescription: 'Si buscas una asesoría completa y eficiente para transformar tu espacio, esta consulta extendida de 120 minutos está diseñada para ti. Durante la sesión trabajaremos de forma estructurada: revisaremos tus necesidades, evaluaremos el potencial de tus ambientes y te entregaremos recomendaciones claras para lograr un diseño funcional, estético y alineado a tus objetivos.',
          image: '/images/service2.jpg',
          tag: 'Completo',
          category: 'online',
          features: [
            'Cuestionario previo para entender tus gustos, estilo de vida y objetivos.',
            'Sesión por videollamada de 120 minutos.',
            'Recomendación de distribución, paleta de colores y combinación de materiales.',
            'Un Moodboard digital con la propuesta estética.',
            'Recomendaciones de marcas, tiendas y piezas clave que eleven tu espacio.',
            'Documento resumen con enlaces de compra de los productos sugeridos.'
          ],
          includes: [
            'Necesitas una transformación detallada de mas de un espacio.',
            'Tienes muchas ideas, pero necesitas ayuda para ordenarlas y tomar decisiones.',
            'Buscas claridad, respaldo y creatividad antes de invertir.',
          ]
        },
        {
          id: 'paquete-esencial',
          title: 'Paquete Esencial',
          price: '$450',
          duration: 'Por Habitación',
          description: 'Transformación de una habitación con guía profesional que incluye reunión inicial, moodboard, paleta de colores y propuesta de distribución.',
          longDescription: 'Nuestro Paquete Esencial está diseñado para quienes buscan una transformación profesional de su espacio con un presupuesto controlado. Te ofrecemos una solución completa que incluye desde la evaluación inicial hasta una propuesta detallada con todos los elementos necesarios para implementar el cambio. Ideal para espacios de hasta 12\'x12\' que necesitan una renovación con estilo y funcionalidad.',
          image: '/images/service3.jpg',
          tag: 'Popular',
          category: 'presencial',
          features: [
            'Evaluación personalizada del espacio y sus necesidades.',
            'Propuesta estética coherente con tu estilo y presupuesto.',
            'Selección cuidadosa de colores, materiales y elementos decorativos.',
            'Optimización del espacio para mejorar su funcionalidad.',
            'Guía paso a paso para implementar los cambios sugeridos.'
          ],
          includes: [
            'Buscas una solución profesional con presupuesto controlado.',
            'Necesitas una guía clara para transformar un espacio específico.',
            'Prefieres una propuesta concreta sin muchas variaciones.',
            'Quieres implementar cambios que mejoren tanto la estética como la funcionalidad.'
          ]
        },
        {
          id: 'paquete-intermedio',
          title: 'Paquete Intermedio',
          price: '$750',
          duration: 'Por Habitación',
          description: 'Servicio personalizado con dos propuestas decorativas, paleta detallada, plano 2D, reuniones de revisión y lista de compras recomendadas.',
          longDescription: 'El Paquete Intermedio ofrece un nivel superior de personalización y detalle para quienes desean explorar diferentes posibilidades para su espacio. Trabajamos con un enfoque colaborativo, presentando dos conceptos distintos que puedes combinar según tus preferencias. Incluye planos profesionales, asesoría detallada en materiales y un seguimiento continuo durante todo el proceso de transformación para espacios de hasta 12\'x12\'.',
          image: '/images/service4.jpg',
          tag: 'Recomendado',
          category: 'presencial',
          features: [
            'Análisis detallado del espacio, iluminación y circulación.',
            'Dos propuestas conceptuales distintas para elegir o combinar.',
            'Plano técnico a escala con distribución optimizada.',
            'Selección detallada de materiales, texturas y acabados.',
            'Múltiples opciones de mobiliario y decoración con distintos rangos de precio.',
            'Asesoría personalizada durante la implementación del proyecto.'
          ],
          includes: [
            'Deseas explorar diferentes conceptos de diseño para tu espacio.',
            'Buscas un nivel de detalle técnico y profesional en la propuesta.',
            'Necesitas asesoría continua durante el proceso de transformación.',
            'Quieres un equilibrio perfecto entre estética, funcionalidad y presupuesto.'
          ]
        },
        {
          id: 'paquete-premium',
          title: 'Paquete Premium',
          price: '$1,150',
          duration: 'Por Habitación',
          description: 'Diseño exclusivo y detallado con acompañamiento integral, render 3D profesional, guía de montaje y seguimiento personalizado del proyecto.',
          longDescription: 'Nuestro Paquete Premium representa la experiencia más completa y exclusiva para transformar tu espacio. Incluye visualización 3D fotorrealista, acompañamiento integral en todas las fases del proyecto y atención preferencial con múltiples reuniones de seguimiento. Diseñado para quienes buscan un resultado excepcional con la tranquilidad de contar con asistencia profesional en cada detalle, desde la conceptualización hasta la implementación final en espacios de hasta 12\'x12\'.',
          image: '/images/service5.jpg',
          tag: 'Premium',
          category: 'presencial',
          features: [
            'Estudio completo del espacio con análisis arquitectónico detallado.',
            'Múltiples conceptos creativos con desarrollo profundo del seleccionado.',
            'Visualización 3D fotorrealista para apreciar el resultado final antes de implementarlo.',
            'Selección minuciosa de cada elemento con opciones exclusivas y personalizadas.',
            'Documentación técnica completa para una implementación perfecta.',
            'Acompañamiento VIP durante todo el proceso con atención prioritaria.',
            'Seguimiento post-implementación para garantizar satisfacción total.'
          ],
          includes: [
            'Buscas un resultado excepcional sin preocuparte por los detalles.',
            'Necesitas visualizar con precisión el resultado final antes de implementarlo.',
            'Deseas un servicio exclusivo con atención personalizada y preferencial.',
            'Quieres un proyecto completamente a medida que refleje perfectamente tu estilo y necesidades.',
            'Valoras el acompañamiento profesional en cada etapa del proceso.'
          ]
        }
      ];
      
      const foundService = [...onlineServices].find(s => s.id === serviceId);
      
      if (foundService) {
        setService(foundService);
      } else {
        // Si no se encuentra el servicio, redirigir a la página de servicios
        navigate('/servicios');
      }
      
      setLoading(false);
    }, 500);
  }, [serviceId, navigate]);
  
  if (loading) {
    return (
      <Container className="py-5 text-center" style={{ marginTop: '100px' }}>
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }
  
  if (!service) {
    return null; // Redirección manejada en useEffect
  }

  return (
    <>
      <HeroSection>
        <Container>
       
          
          <Row className="align-items-center">
            <Col lg={6}>
              <PageTitle>{service.title}</PageTitle>
              <Price>
                {service.price} <small>({service.duration})</small>
              </Price>
              <ServiceDescription>{service.longDescription}</ServiceDescription>
              <BookButton as={Link} to="/agendar" state={{ selectedService: service }}>
                <i className="bi bi-calendar-check me-2"></i>
                Agendar Consulta
              </BookButton>
            </Col>
            <Col lg={6} className="mt-5 mt-lg-0">
              <img 
                src={service.image} 
                alt={service.title} 
                className="img-fluid rounded-3 shadow"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            </Col>
          </Row>
        </Container>
      </HeroSection>
      
      <ContentSection>
        <Container>
          <Row className="mb-5">
            <Col lg={6} className="mb-5 mb-lg-0">
              <SectionTitle>¿Qué incluye?</SectionTitle>
              <StyledListGroup variant="flush">
                {service.features.map((feature, index) => (
                  <ListGroup.Item key={index}>
                    <i className="bi bi-check-circle-fill"></i>
                    {feature}
                  </ListGroup.Item>
                ))}
              </StyledListGroup>
            </Col>
            <Col lg={6}>
              <SectionTitle>Ideal para ti si...</SectionTitle>
              <StyledListGroup variant="flush">
                {service.includes.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <i className="bi bi-check-circle-fill"></i>
                    {item}
                  </ListGroup.Item>
                ))}
              </StyledListGroup>
            </Col>
          </Row>
          
          <Row className="mt-5">
            <Col className="text-center">
              <h3 className="mb-4">¿Listo para transformar tu espacio?</h3>
              <BookButton as={Link} to="/agendar" state={{ selectedService: service }}>
                <i className="bi bi-calendar-check me-2"></i>
                Agendar Consulta
              </BookButton>
            </Col>
          </Row>
        </Container>
      </ContentSection>
    </>
  );
};

export default ServiceDetailPage; 