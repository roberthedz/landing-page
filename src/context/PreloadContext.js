import React, { createContext, useContext, useState, useEffect } from 'react';
import apiConfig from '../config/apiConfig';

const PreloadContext = createContext();

export const usePreload = () => {
  const context = useContext(PreloadContext);
  if (!context) {
    throw new Error('usePreload debe ser usado dentro de un PreloadProvider');
  }
  return context;
};

export const PreloadProvider = ({ children }) => {
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadedData, setPreloadedData] = useState({});
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [hasPreloaded, setHasPreloaded] = useState(false);

  // Función para formatear fecha
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Función para precargar horarios usando endpoint en lote
  const preloadBookedSlots = async () => {
    console.log('🚀 Iniciando precarga global de horarios...');
    setIsPreloading(true);
    setPreloadProgress(0);
    
    try {
      // Verificar si ya tenemos datos precargados recientes
      const preloadedTimestamp = localStorage.getItem('preloadedTimestamp');
      const preloadedSlots = localStorage.getItem('preloadedBookedSlots');
      
      if (preloadedTimestamp && preloadedSlots) {
        const timeDiff = Date.now() - parseInt(preloadedTimestamp);
        const fiveMinutes = 5 * 60 * 1000;
        
        if (timeDiff < fiveMinutes) {
          setPreloadedData(JSON.parse(preloadedSlots));
          setHasPreloaded(true);
          setIsPreloading(false);
          console.log('📋 Usando datos precargados existentes');
          return;
        }
      }

      const today = new Date();
      const datesToPreload = [];
      
      // Generar fechas para los próximos 14 días
      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        datesToPreload.push(formatDate(date));
      }
      
      setPreloadProgress(10);
      
      // Usar endpoint en lote para reducir peticiones
      const datesParam = datesToPreload.join(',');
      const endpoint = `${apiConfig.endpoints.bookedSlotsBatch}?dates=${datesParam}`;
      
      console.log('📦 Cargando horarios en lote para 14 días...');
      
      const response = await apiConfig.getCachedRequest(endpoint);
      setPreloadProgress(80);
      
      if (response.data && response.data.success) {
        const preloadedSlots = response.data.bookedSlots;
        
        // Guardar en localStorage
        localStorage.setItem('preloadedBookedSlots', JSON.stringify(preloadedSlots));
        localStorage.setItem('preloadedTimestamp', Date.now().toString());
        
        setPreloadedData(preloadedSlots);
        setHasPreloaded(true);
        setPreloadProgress(100);
        
        console.log(`✅ Precarga global completada: ${Object.keys(preloadedSlots).length} fechas cargadas`);
      } else {
        console.warn('❌ Respuesta inesperada en precarga:', response.data);
        await preloadIndividualSlots();
      }
      
    } catch (error) {
      console.error('❌ Error en precarga global:', error);
      await preloadIndividualSlots();
    } finally {
      setIsPreloading(false);
    }
  };

  // Función de fallback para precarga individual
  const preloadIndividualSlots = async () => {
    console.log('🔄 Intentando precarga individual como fallback...');
    
    try {
      const today = new Date();
      const preloadPromises = [];
      
      // Precargar horarios de los próximos 7 días
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
      setHasPreloaded(true);
      setPreloadProgress(100);
      
      console.log(`✅ Precarga individual completada: ${Object.keys(preloadedSlots).length} fechas cargadas`);
      
    } catch (error) {
      console.error('❌ Error en precarga individual:', error);
      setHasPreloaded(true); // Marcar como completado para no seguir intentando
    }
  };

  // Función para forzar recarga de datos
  const refreshPreloadedData = async () => {
    setHasPreloaded(false);
    await preloadBookedSlots();
  };

  // Iniciar precarga cuando se monta el contexto
  useEffect(() => {
    // Pequeño delay para no bloquear la carga inicial de la app
    const timer = setTimeout(() => {
      preloadBookedSlots();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const value = {
    isPreloading,
    preloadedData,
    preloadProgress,
    hasPreloaded,
    refreshPreloadedData,
    preloadBookedSlots
  };

  return (
    <PreloadContext.Provider value={value}>
      {children}
    </PreloadContext.Provider>
  );
}; 