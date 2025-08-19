import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Breadcrumb, Button, Badge, Card, ListGroup } from 'react-bootstrap';
import styled from 'styled-components';

const HeroSection = styled.section`
  padding: 8rem 0 3rem;
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
  font-size: ${props => props.isLongPrice ? '1.5rem' : '2.2rem'};
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
  padding: 3rem 0;
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
    left: 50%;
    transform: translateX(-50%);
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
      const allServices = [
        // SERVICIOS ONLINE
        {
          id: 'consulta-online-habitacion-cerrada',
          title: 'Habitación Cerrada 12x12',
          price: '$150',
          duration: '60 min',
          description: 'Asesoría personalizada de 1 hora en línea para transformar una habitación específica de hasta 12x12 pies.',
          longDescription: 'Si desea transformar una habitación específica de su hogar, este paquete es perfecto para usted. En DEdecor le ofrecemos una asesoría personalizada de 1 hora en línea, pensada para ayudarle a crear un espacio armónico, funcional y lleno de estilo dentro de una habitación cerrada de hasta 12x12 pies. Para garantizar un servicio de calidad, le pedimos que agende su cita con al menos 24 horas de antelación.',
          image: '/images/service1.jpg',
          tag: 'Online',
          category: 'asesoria-online',
          features: [
            'Selección estratégica de tiendas, marcas y proveedores recomendados (con descuentos de hasta un 20% en algunas)',
            'Definición de estilo y elección de elementos clave: paredes, textiles, sofás, camas, etc.',
            'Asesoría en colocación de mobiliario y piezas decorativas',
            'Recomendación de colores, pintura, papel tapiz y texturas para muros',
            'Detalles finales: accesorios, molduras, acabados y toques especiales',
            'Sesión de videollamada de 60 minutos',
            'Cuestionario previo para entender tus gustos, estilo de vida y objetivos',
            'Un Moodboard digital con la propuesta estética',
            'Documento resumen con enlaces de compra de los productos sugeridos'
          ],
          includes: [
            'Quiere transformar una habitación específica de hasta 12x12 pies',
            'Busca asesoría profesional online con resultados claros',
            'Necesita una guía experta para tomar decisiones de decoración',
            'Desea un proceso creativo, enriquecedor y emocionante'
          ]
        },
        {
          id: 'consulta-online-open-concept-1-2',
          title: '1-2 Habitaciones Open Concept',
          price: '$220',
          duration: '60 min',
          description: 'Ideal para espacios abiertos donde conviven sala, comedor, cocina. Enfoque estratégico para mantener armonía entre zonas.',
          longDescription: 'Este paquete está diseñado especialmente para quienes tienen espacios abiertos y conectados (open concept) donde la sala, el comedor, la cocina u otras áreas conviven en un mismo entorno. Para quienes desean renovar una o dos áreas principales de su hogar, pero entienden que en un espacio abierto es fundamental mantener la armonía con las zonas alrededor.',
          image: '/images/service2.jpg',
          tag: 'Open Concept',
          category: 'asesoria-online',
          features: [
            'Selección estratégica de tiendas, marcas y proveedores recomendados (con descuentos de hasta un 20% en algunas)',
            'Definición de estilo y elección de elementos clave: paredes, textiles, sofás, camas, etc.',
            'Asesoría en colocación de mobiliario y piezas decorativas',
            'Recomendación de colores, pintura, papel tapiz y texturas para muros',
            'Detalles finales: accesorios, molduras, acabados y toques especiales',
            'Sesión de videollamada de 60 minutos',
            'Cuestionario previo para entender tus gustos, estilo de vida y objetivos',
            'Un Moodboard digital con la propuesta estética',
            'Documento resumen con enlaces de compra de los productos sugeridos',
            '6 horas previas de preparación para propuestas personalizadas'
          ],
          includes: [
            'Tiene espacios abiertos y conectados (open concept)',
            'Quiere mantener armonía visual entre zonas',
            'Busca transiciones fluidas sin que se vea desordenado',
            'Desea un enfoque estratégico para espacios integrados'
          ]
        },
        {
          id: 'consulta-online-open-concept-3-4',
          title: '3-4 Habitaciones Open Concept',
          price: '$400',
          duration: '120 min',
          description: 'Para renovar múltiples áreas en espacios abiertos. Transiciones fluidas entre habitaciones con coherencia visual.',
          longDescription: 'Este paquete está diseñado especialmente para quienes tienen espacios abiertos y conectados (open concept) donde múltiples áreas conviven en un mismo entorno. Para quienes desean renovar 3-4 áreas principales pero entienden que en un espacio abierto es fundamental mantener la armonía y coherencia visual entre todas las zonas.',
          image: '/images/service3.jpg',
          tag: 'Completo',
          category: 'asesoria-online',
          features: [
            'Selección estratégica de tiendas, marcas y proveedores recomendados (con descuentos de hasta un 20% en algunas)',
            'Definición de estilo y elección de elementos clave: paredes, textiles, sofás, camas, etc.',
            'Asesoría en colocación de mobiliario y piezas decorativas',
            'Recomendación de colores, pintura, papel tapiz y texturas para muros',
            'Detalles finales: accesorios, molduras, acabados y toques especiales',
            'Sesión de videollamada de 120 minutos',
            'Cuestionario previo para entender tus gustos, estilo de vida y objetivos',
            'Un Moodboard digital con la propuesta estética',
            'Documento resumen con enlaces de compra de los productos sugeridos',
            '8 horas previas de preparación para propuestas personalizadas'
          ],
          includes: [
            'Tiene múltiples áreas en espacios abiertos',
            'Quiere coherencia visual entre 3-4 habitaciones',
            'Busca un enfoque integral para espacios complejos',
            'Necesita sesión extendida para cubrir todas las áreas'
          ]
        },
        {
          id: 'paquete-esencial',
          title: 'Paquete Esencial',
          price: '$500',
          duration: 'Por Habitación',
          description: 'Guía profesional para transformar un espacio (12x12) con estilo. Incluye reunión inicial, moodboard, paleta de colores, propuesta de distribución y lista de recomendaciones.',
          longDescription: 'Ideal para quienes quieran una guía clara y profesional para transformar un espacio con estilo, sin complicaciones. Este paquete incluye una propuesta única y final, cuidadosamente diseñada según tus gustos y necesidades. Una habitación standard es 12\'x12\'. Entrega entre 10 y 12 días hábiles después de nuestra reunión inicial.',
          image: '/images/service4.jpg',
          tag: 'Por Habitación',
          category: 'asesoria-presencial',
          features: [
            '1 reunión inicial (virtual o presencial) para conocer el espacio, necesidades y estilo del cliente (hasta 60 min)',
            '1 Moodboard digital con la propuesta estética',
            'Paleta de colores sugerida',
            'Propuesta de distribución (layout general en plano simple)',
            '1 Ronda de ajuste online (30 min)',
            'Lista de recomendaciones de mobiliario y decoración (con links de compra 2 opciones por items)',
            'PDF de presentación final con sugerencias y visión del espacio',
            'Selección estratégica de tiendas, marcas y proveedores recomendados (con descuentos de hasta un 20% en algunas)',
            'Entrega entre 10 y 12 días hábiles'
          ],
          includes: [
            'Quiere una guía clara y profesional sin complicaciones',
            'Busca transformar un espacio con estilo',
            'Prefiere una propuesta única y final bien diseñada',
            'Necesita recomendaciones específicas con enlaces de compra'
          ]
        },
        {
          id: 'paquete-intermedio',
          title: 'Paquete Intermedio',
          price: '$750',
          duration: 'Por Habitación',
          description: 'Transformación con estilo y funcionalidad. Dos moodboards, plano 2D, reunión de revisión, seguimiento por WhatsApp.',
          longDescription: 'Ideal para quienes desean transformar un espacio con estilo y funcionalidad, contando con asesoría personalizada y dos propuestas de decoración para elegir la que mejor se adapte a su visión. Una habitación standard es 12\'x12\'. Entrega en 15 a 18 días hábiles.',
          image: '/images/service5.jpg',
          tag: 'Por Habitación',
          category: 'asesoria-presencial',
          features: [
            'Una (1) reunión inicial (sin costo adicional 60 min)',
            'Dos (2) moodboards por área (para que EL CLIENTE elija o combine a su gusto)',
            'Paleta de colores detallada, incluyendo códigos específicos',
            'Asesoría sobre la combinación de materiales, texturas y estilos',
            'Plano de distribución a escala 2D',
            'Una (1) reunión de revisión (presencial o virtual)',
            'Una (1) ronda de ajustes (en línea)',
            'Lista de compras. Si es necesario, se enviarán enlaces adicionales para reflejar el cambio (hasta 3 enlaces por artículo)',
            'Selección estratégica de tiendas, marcas y proveedores recomendados (con descuentos de hasta un 20% en algunas)',
            'Entrega en 15 a 18 días hábiles',
            'Incluye seguimiento por WhatsApp o correo durante el proceso'
          ],
          includes: [
            'Desea transformar un espacio con estilo y funcionalidad',
            'Quiere dos propuestas para elegir o combinar',
            'Busca asesoría personalizada y detallada',
            'Necesita seguimiento durante todo el proceso'
          ]
        },
        {
          id: 'paquete-premium',
          title: 'Paquete Premium',
          price: '$1,200',
          duration: 'Por Habitación',
          description: 'Proyecto exclusivo y detallado con diseño a medida. Incluye render 3D profesional, acompañamiento integral, guía de montaje y seguimiento a 30 días.',
          longDescription: 'Diseñado para quienes buscan un proyecto exclusivo, detallado y sin preocupaciones, con un diseño completamente a medida y acompañamiento integral en cada etapa del proceso. Entrega en 21 a 25 días hábiles.',
          image: '/images/service1.jpg',
          tag: 'Por Habitación',
          category: 'asesoria-presencial',
          features: [
            '1 reunión inicial + 2 reuniones de seguimiento (virtual o presencial 60min)',
            'Estudio del espacio con análisis de luz, proporciones y flujo',
            '2 moodboards creativos + 1 moodboard final consolidado',
            'Render 3D profesional del diseño final (visión realista del espacio)',
            'Lista de compras detallada con enlaces y asesoría de proveedores',
            'Guía personalizada para montaje',
            'Acompañamiento online durante la compra y montaje',
            'Mini guía de mantenimiento y styling del espacio',
            'Check-in de seguimiento a los 30 días de entrega',
            'Selección estratégica de tiendas, marcas y proveedores recomendados (con descuentos de hasta un 20% en algunas)',
            'Entrega en 21 a 25 días hábiles',
            'Atención preferente y personalizada vía WhatsApp, correo y Presencial'
          ],
          includes: [
            'Busca un proyecto exclusivo y detallado',
            'Quiere diseño completamente a medida',
            'Desea acompañamiento integral en cada etapa',
            'Necesita visualización 3D profesional del resultado',
            'Valora la atención preferente y personalizada'
          ]
        }
      ];
      
      const foundService = [...allServices].find(s => s.id === serviceId);
      
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
              <Price isLongPrice={service.price.includes('Contáctanos')}>
                {service.price} <small>{service.duration}</small>
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
          <Row className="mb-2">
            <Col lg={6} className="mb-4 mb-lg-0">
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