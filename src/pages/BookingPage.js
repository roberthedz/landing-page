import React, { useEffect, useState } from 'react';
import Booking from '../components/Booking';
import apiConfig from '../config/apiConfig';

const BookingPage = () => {
  const [isPreloading, setIsPreloading] = useState(true);
  const [preloadedData, setPreloadedData] = useState({});

  // Función para precargar horarios de las próximas 2 semanas
  const preloadBookedSlots = async () => {
    console.log('🚀 Iniciando precarga de horarios en background...');
    
    try {
      const today = new Date();
      const datesToPreload = [];
      
      // Generar fechas para los próximos 14 días
      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        datesToPreload.push(formatDate(date));
      }
      
      // 🚀 OPTIMIZACIÓN: Usar endpoint en lote para reducir peticiones
      const datesParam = datesToPreload.join(',');
      const endpoint = `${apiConfig.endpoints.bookedSlotsBatch}?dates=${datesParam}`;
      
      console.log('📦 Cargando horarios en lote para 14 días...');
      
      const response = await apiConfig.getCachedRequest(endpoint);
      
      if (response.data && response.data.success) {
        const preloadedSlots = response.data.bookedSlots;
        
        // Guardar en localStorage para uso futuro
        localStorage.setItem('preloadedBookedSlots', JSON.stringify(preloadedSlots));
        localStorage.setItem('preloadedTimestamp', Date.now().toString());
        
        setPreloadedData(preloadedSlots);
        console.log(`✅ Precarga completada: ${Object.keys(preloadedSlots).length} fechas cargadas en una sola petición`);
      } else {
        console.warn('❌ Respuesta inesperada en precarga:', response.data);
        setIsPreloading(false);
      }
      
    } catch (error) {
      console.error('❌ Error en precarga:', error);
      
      // Fallback: precarga individual si el endpoint en lote falla
      console.log('🔄 Intentando precarga individual como fallback...');
      await preloadIndividualSlots();
    } finally {
      setIsPreloading(false);
    }
  };

  // Función de fallback para precarga individual
  const preloadIndividualSlots = async () => {
    try {
      const today = new Date();
      const preloadPromises = [];
      
      // Precargar horarios de los próximos 7 días (menos para fallback)
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const formattedDate = formatDate(date);
        const endpoint = `${apiConfig.endpoints.bookedSlots}?date=${formattedDate}`;
        
        const promise = apiConfig.getCachedRequest(endpoint)
          .then(response => {
            if (response.data && response.data.success) {
              return { date: formattedDate, data: response.data.bookedSlots };
            }
            return { date: formattedDate, data: [] };
          })
          .catch(error => {
            console.warn(`Error precargando fecha ${formattedDate}:`, error);
            return { date: formattedDate, data: [] };
          });
        
        preloadPromises.push(promise);
      }
      
      const results = await Promise.allSettled(preloadPromises);
      
      const preloadedSlots = {};
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          preloadedSlots[result.value.date] = result.value.data;
        }
      });
      
      localStorage.setItem('preloadedBookedSlots', JSON.stringify(preloadedSlots));
      localStorage.setItem('preloadedTimestamp', Date.now().toString());
      
      setPreloadedData(preloadedSlots);
      console.log(`✅ Precarga individual completada: ${Object.keys(preloadedSlots).length} fechas cargadas`);
      
    } catch (error) {
      console.error('❌ Error en precarga individual:', error);
    }
  };

  // Función para formatear fecha
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Iniciar precarga cuando se monta el componente
  useEffect(() => {
    // Verificar si ya tenemos datos precargados recientes (menos de 5 minutos)
    const preloadedTimestamp = localStorage.getItem('preloadedTimestamp');
    const preloadedSlots = localStorage.getItem('preloadedBookedSlots');
    
    if (preloadedTimestamp && preloadedSlots) {
      const timeDiff = Date.now() - parseInt(preloadedTimestamp);
      const fiveMinutes = 5 * 60 * 1000; // 5 minutos en milisegundos
      
      if (timeDiff < fiveMinutes) {
        // Usar datos existentes
        setPreloadedData(JSON.parse(preloadedSlots));
        setIsPreloading(false);
        console.log('📋 Usando datos precargados existentes');
        return;
      }
    }
    
    // Iniciar nueva precarga
    preloadBookedSlots();
  }, []);

  return (
    <>
      {isPreloading && (
        <div style={{
          position: 'fixed',
          top: '70px',
          right: '20px',
          background: 'var(--primary-color)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '8px',
          fontSize: '14px',
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <i className="bi bi-clock me-2"></i>
          Precargando horarios...
        </div>
      )}
      <Booking preloadedData={preloadedData} />
    </>
  );
};

export default BookingPage; 