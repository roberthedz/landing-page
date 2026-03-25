/**
 * Fuente centralizada de datos de servicios
 * 
 * Este archivo contiene TODOS los servicios en un solo lugar.
 * Si necesitas modificar un servicio, hazlo aquí y el cambio se aplicará
 * automáticamente en todas las páginas que lo usen.
 */

export const servicesData = [
  // ============================================
  // SERVICIOS DE ASESORÍA ONLINE
  // ============================================
  {
    id: 'consulta-online',
    title: 'Consulta Rápida',
    price: '$95',
    duration: '30 min',
    description: 'Sesión privada de 30 minutos por videollamada para ayudarte a tomar decisiones clave en tu proyecto con orientación de profesionales del diseño.',
    longDescription: 'Muchas decisiones en decoración y renovación implican inversiones significativas: elegir el color de pintura adecuado, seleccionar el piso correcto o decidir entre diferentes opciones de mobiliario. Esta sesión está diseñada para ofrecerte claridad antes de tomar esas decisiones. Durante 30 minutos revisaremos tu espacio, tus opciones y tus dudas para darte recomendaciones profesionales que te ayuden a avanzar con confianza.',
    image: '/images/IMG_3435.PNG',
    tag: 'Consulta',
    type: 'consulta-rapida',
    category: 'consulta-rapida',
    features: [
      'Consulta privada de 30 minutos por videollamada',
      'Revisión de tu espacio mediante fotos, video o referencias',
      'Evaluación de las opciones que estés considerando',
      'Recomendaciones profesionales del equipo DEdecor',
      'Resumen por email con las recomendaciones principales',
    ],
    includes: [
      'Tienes una decisión importante que tomar',
      'Necesitas una segunda opinión profesional',
      'Quieres evitar errores antes de invertir',
      'Quieres validar ideas antes de comprar',
    ],
    extra: [
      'Color de pintura',
      'Tipo de piso',
      'Opciones de mobiliario',
      'Iluminación y lámparas',
      'Materiales y acabados',
      'Distribución del espacio',
      'Combinación de piezas',
      'Orientación antes de una compra',
    ],
    informacion: [
      'Sesión de 30 min por videollamada',
      'Tener fotos o referencias del espacio',
      'Resumen por email al finalizar',
    ]
  },
  {
    id: 'consulta-online-habitacion-cerrada',
    title: 'Online Room Reset',
    price: '$180',
    duration: '60 min',
    description: 'Ideal para una habitación master, oficina, nursery o baño.',
    longDescription: 'Nuestro servicio de asesoría de interiorismo está diseñado para transformar espacios clave del hogar con intención, coherencia y funcionalidad. Es ideal para la habitación principal, oficina en casa, nursery o baño, así como para habitaciones de invitados o espacios pequeños que requieren una mejor distribución y una propuesta estética bien definida.',
    image: '/images/service1.jpg',
    tag: 'Paquete 1',
    type: 'asesoria-online',
    category: 'asesoria-online',
    features: [
      'Análisis previo del espacio (fotos o planos aproximados)',
      'Cuestionario personalizado.',
      'Reunión online estratégica (hasta 60 min)',
      'Moodboard conceptual',
      'Paleta de colores sugerida',
      'Distribución ideal recomendada ',
      'Lista de compra de piezas claves (links)',
      'Descuentos de hasta 15% en tiendas y proveedores recomendados',

    ],
    includes: [
      'Quieres renovar una habitación específica.',
      'Buscas una guía experta para tomar decisiones prácticas con una reunión estratégica.',
      
    ],
    extra: [
      'Ronda de ajustes/seguimiento $95',
    ],
    informacion: [
      'Rate: Habitación standard 12\'x12\'',
      'Se necesitan fotos, planos o medidas aproximadas de la habitación',
    ]
  },
  {
    id: 'consulta-online-open-concept-1-2',
    title: 'Open Concept Smart Design',
    price: '$340',
    duration: '60 min',
    description: 'Ideal para espacios abiertos como sala + comedor, foyer + sala o cocina + comedor.',
    longDescription: 'Nuestro servicio de asesoría de interiorismo para espacios de concepto abierto está diseñado para integrar áreas conectadas del hogar de manera armónica, funcional y visualmente coherente. Es ideal para combinaciones como sala + comedor, foyer + sala o cocina + comedor, donde la clave está en lograr continuidad estética sin perder la identidad de cada ambiente.',
    image: '/images/service2.jpg',
    tag: 'Paquete 2',
    type: 'asesoria-online',
    category: 'asesoria-online',
    features: [
      'Análisis previo del espacio (fotos o planos aproximados)',
      'Cuestionario personalizado.',
      'Reunión online estratégica (hasta 60 min)',
      'Moodboard conceptual por espacio',
      'Paleta de colores sugerida',
      'Distribución ideal por espacio',
      'Zonificación conceptual',
      'Lista de compra de piezas claves (links)',
      'Descuentos de hasta 15% en tiendas y proveedores recomendados',
      
      
    ],
      
      
      
    includes: [
      'Tiene espacios abiertos y conectados (open concept)',
      'Quiere mantener armonía visual entre zonas y coherencia estética',
      'Busca transiciones fluidas sin que se vea desordenado',
      
    ],
    extra: [
      'Ronda de ajustes / seguimiento $95',
      
    ],
    informacion: [
      'Rate: Habitación standard 12\'x12\'',
      'Se necesitan fotos, planos o medidas aproximadas de las habitaciones',
    ]
  },
  {
    id: 'consulta-online-open-concept-3-4',
    title: 'Full Transformation',
    price: '$490',
    duration: '60 min',
    description: 'Ideal para quienes buscan transformación completa en sus hogares.',
    longDescription: 'Nuestro servicio de asesoría de interiorismo de transformación completa está pensado para espacios que parten prácticamente desde cero o que buscan un cambio total de estilo, distribución y funcionalidad. Es ideal para viviendas nuevas, espacios vacíos o proyectos donde se desea conservar poco o ninguno existente, y se quiere replantear el ambiente de forma integral.  Desarrollamos un concepto completo que abarca distribución, selección de mobiliario, materiales, iluminación y estilo, logrando un espacio coherente, funcional y alineado con la visión y estilo de vida del cliente.',
    image: '/images/service3.jpg',
    tag: 'Paquete 3',
    type: 'asesoria-online',
    category: 'asesoria-online',
    features: [
      'Análisis previo del espacio (fotos y planos )',
      'Cuestionario personalizado.',
      'Reunión inicial online (hasta 30 min)',
      'Moodboard conceptual por espacio + render 2D con la propuesta estética',
      'Paleta de colores sugerida',
      'Distribución ideal recomendada por espacio',
      'Presentación de proyecto (hasta 90 min)',
      'Ronda de ajustes online (hasta 30 min)',
      'PDF final con la visión completa del espacio y guía de implementación',
      'Lista de compra de piezas claves (links)',
      'Descuentos de hasta 20% en tiendas y proveedores recomendados',
      
    ],
    includes: [
      'Estás comenzando desde cero o deseas una transformación completa',
      'Buscas un cambio integral de estilo, distribución y funcionalidad',
      ,
      
    ],
    extra: [
      'Seguimiento después de compras $95',
      
    ],
    informacion: [
      'Entrega: 5 a 10 días hábiles después de la reunión inicial',
      'Se necesitan planos de las habitaciones',
      'Rate: Habitación standard 12\'x12\'',
    ]
  },
  
  // ============================================
  // SERVICIOS DE ASESORÍA PRESENCIAL
  // ============================================
  {
    id: 'paquete-esencial',
    title: 'Paquete Esencial',
    price: '$550',
    duration: 'Por Habitación',
    description: 'Guía profesional para transformar un espacio con estilo. Incluye reunión inicial, moodboard, paleta de colores, propuesta de distribución y lista de recomendaciones. Entrega en 10-12 días.',
    longDescription: 'Ideal para quienes quieran una guía clara y profesional para transformar un espacio con estilo, sin complicaciones. Este paquete incluye una propuesta única y final, cuidadosamente diseñada según tus gustos y necesidades. Una habitación standard es 12\'x12\'. Entrega entre 10 y 12 días hábiles después de nuestra reunión inicial.',
    image: '/images/service4.jpg',
    tag: 'Por Habitación',
    type: 'asesoria-presencial',
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
    ],
    extra: [
      'Descuentos de hasta 20% en tiendas y proveedores recomendados',
      'Asesoría personalizada durante todo el proceso'
    ],
    informacion: [
      'Entrega entre 10 y 12 días hábiles',
      'Habitación standard 12\'x12\'',
      'Reunión inicial puede ser virtual o presencial'
    ]
  },
  {
    id: 'paquete-intermedio',
    title: 'Paquete Intermedio',
    price: '$750',
    duration: 'Por Habitación',
    description: 'Transformación con estilo y funcionalidad. Dos moodboards, plano 2D, reunión de revisión, seguimiento por WhatsApp. Incluye descuentos hasta 20% en proveedores. Entrega en 15-18 días.',
    longDescription: 'Ideal para quienes desean transformar un espacio con estilo y funcionalidad, contando con asesoría personalizada y dos propuestas de decoración para elegir la que mejor se adapte a su visión. Una habitación standard es 12\'x12\'. Entrega en 15 a 18 días hábiles.',
    image: '/images/service5.jpg',
    tag: 'Por Habitación',
    type: 'asesoria-presencial',
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
    ],
    extra: [
      'Descuentos de hasta 20% en tiendas y proveedores recomendados',
      'Seguimiento por WhatsApp o correo durante el proceso'
    ],
    informacion: [
      'Entrega en 15 a 18 días hábiles',
      'Habitación standard 12\'x12\'',
      'Hasta 3 enlaces por artículo si se necesitan cambios'
    ]
  },
  {
    id: 'paquete-premium',
    title: 'Paquete Premium',
    price: '$1,200',
    duration: 'Por Habitación',
    description: 'Proyecto exclusivo y detallado con diseño a medida. Incluye render 3D profesional, acompañamiento integral, guía de montaje y seguimiento a 30 días. Entrega en 21-25 días.',
    longDescription: 'Diseñado para quienes buscan un proyecto exclusivo, detallado y sin preocupaciones, con un diseño completamente a medida y acompañamiento integral en cada etapa del proceso. Entrega en 21 a 25 días hábiles.',
    image: '/images/service6.jpg',
    tag: 'Por Habitación',
    type: 'asesoria-presencial',
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
    ],
    extra: [
      'Descuentos de hasta 20% en tiendas y proveedores recomendados',
      'Atención preferente y personalizada vía WhatsApp, correo y Presencial',
      'Check-in de seguimiento a los 30 días de entrega'
    ],
    informacion: [
      'Entrega en 21 a 25 días hábiles',
      'Acompañamiento online durante la compra y montaje',
      'Mini guía de mantenimiento y styling del espacio incluida'
    ]
  },
  
  // ============================================
  // SERVICIOS DE ASESORÍA COMERCIAL
  // ============================================
  {
    id: 'paquete-comercial-basico',
    title: 'Paquete Comercial Básico',
    price: '$6 por pie cuadrado',
    duration: 'Presencial',
    description: 'Ideal para dueños de negocios, marcas o emprendedores que buscan mejorar la imagen visual y funcionalidad de su local, showroom o tienda.',
    longDescription: 'Este paquete está diseñado para dueños de negocios, marcas o emprendedores que buscan mejorar la imagen visual y funcionalidad de su local, showroom o tienda. Incluye una propuesta única y final, cuidadosamente diseñada para reflejar la esencia de tu marca, mejorar la funcionalidad del espacio y elevar la experiencia visual de tus clientes. Entrega entre 12 y 15 días hábiles después de la reunión inicial.',
    image: '/images/service3.jpg',
    tag: 'Comercial',
    type: 'asesoria-comercial',
    category: 'asesoria-comercial',
    features: [
      '1 reunión inicial presencial (hasta 90 minutos) para conocer el espacio, necesidades del negocio y la identidad visual de la marca',
      '1 reunión de seguimiento y presentación del proyecto',
      '1 Moodboard digital con la propuesta estética y el concepto visual del local',
      'Paleta de colores sugerida, adaptada a la identidad de su marca y el tipo de cliente que desea atraer',
      'Propuesta de distribución general (layout en plano 2D) para optimizar la circulación, visibilidad de productos y experiencia del cliente',
      '1 ronda de ajuste online (45 minutos) posterior a la entrega, para revisar y afinar detalles',
      'Lista de recomendaciones de mobiliario, decoración e iluminación, con links de compra (1 opción por ítem) según el presupuesto y estilo del negocio',
      'PDF de presentación final, con la visión completa del espacio, resumen de sugerencias y propuestas finales',
      'Selección estratégica de tiendas, marcas y proveedores recomendados, con descuentos de hasta un 20% en algunos de ellos',
      'Entrega entre 12 y 15 días hábiles después de la reunión inicial'
    ],
    includes: [
      'Es dueño de un negocio, marca o emprendedor',
      'Busca mejorar la imagen visual y funcionalidad de su local, showroom o tienda',
      'Desea una asesoría personalizada en sitio, con observaciones reales del espacio, iluminación y flujo de clientes',
      'Quiere una propuesta integral, práctica y lista para implementar sin complicaciones'
    ],
    extra: [
      'Descuentos de hasta 20% en algunos proveedores',
      '1 opción por ítem en lista de recomendaciones'
    ],
    informacion: [
      'Entrega entre 12 y 15 días hábiles después de la reunión inicial',
      'Reunión inicial presencial de hasta 90 minutos',
      'Ronda de ajuste online (45 minutos) posterior a la entrega'
    ]
  },
  {
    id: 'paquete-comercial-premium',
    title: 'Paquete Comercial Premium',
    price: '$9 por pie cuadrado',
    duration: 'Presencial',
    description: 'Solución completa para negocios que buscan una transformación profesional con múltiples opciones y acompañamiento detallado.',
    longDescription: 'Este paquete premium está diseñado para dueños de negocios, marcas o emprendedores que buscan una solución completa y profesional para transformar su local comercial. Incluye una propuesta única y final, cuidadosamente diseñada para reflejar la esencia de tu marca, mejorar la funcionalidad del espacio y elevar la experiencia visual de tus clientes. Entrega entre 15 y 21 días hábiles después de la reunión inicial.',
    image: '/images/service4.jpg',
    tag: 'Comercial',
    type: 'asesoria-comercial',
    category: 'asesoria-comercial',
    features: [
      '1 reunión inicial presencial (hasta 90 minutos) para conocer el espacio, necesidades del negocio y la identidad visual de la marca',
      '1 reunión de seguimiento para presentación del proyecto',
      '2 Moodboards digitales con la propuesta estética y el concepto visual del local',
      'Paleta de colores sugerida, adaptada a la identidad de su marca y el tipo de cliente que desea atraer',
      'Propuesta de distribución general (layout en plano 2D) para optimizar la circulación, visibilidad de productos y experiencia del cliente',
      '1 ronda de ajuste online (45 minutos) posterior a la entrega, para revisar y afinar detalles',
      'Lista de recomendaciones de mobiliario, decoración e iluminación, con links de compra (2 opciones por ítem) según el presupuesto y estilo del negocio',
      'PDF de presentación final, con la visión completa del espacio, resumen de sugerencias y propuestas finales',
      'Selección estratégica de tiendas, marcas y proveedores recomendados, con descuentos de hasta un 20% en algunos de ellos',
      'Entrega entre 15 y 21 días hábiles después de la reunión inicial'
    ],
    includes: [
      'Es dueño de un negocio, marca o emprendedor',
      'Busca mejorar la imagen visual y funcionalidad de su local, showroom o tienda',
      'Desea una asesoría personalizada en sitio, con observaciones reales del espacio, iluminación y flujo de clientes',
      'Quiere una propuesta integral, práctica y lista para implementar sin complicaciones',
      'Valora tener múltiples opciones por ítem para elegir según su presupuesto'
    ],
    extra: [
      'Descuentos de hasta 20% en algunos proveedores',
      '2 opciones por ítem en lista de recomendaciones',
      'PDF de presentación final incluido'
    ],
    informacion: [
      'Entrega entre 15 y 21 días hábiles después de la reunión inicial',
      'Reunión inicial presencial de hasta 90 minutos',
      'Ronda de ajuste online (45 minutos) posterior a la entrega'
    ]
  }
];

/**
 * Helper functions para filtrar servicios
 */
export const getServicesByType = (type) => {
  return servicesData.filter(service => service.type === type);
};

export const getServiceById = (id) => {
  return servicesData.find(service => service.id === id);
};

export const getOnlineServices = () => getServicesByType('asesoria-online');
export const getPresencialServices = () => getServicesByType('asesoria-presencial');
export const getComercialServices = () => getServicesByType('asesoria-comercial');
export const getConsultaRapidaServices = () => getServicesByType('consulta-rapida');

/**
 * Exportar servicios organizados por categoría (para compatibilidad con código existente)
 */
export const asesoriaOnlineServices = getOnlineServices();
export const asesoriaPresencialServices = getPresencialServices();
export const asesoriaComercialServices = getComercialServices();

