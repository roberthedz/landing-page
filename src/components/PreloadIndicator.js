import React from 'react';
import { usePreload } from '../context/PreloadContext';

const PreloadIndicator = () => {
  const { isPreloading, preloadProgress, hasPreloaded } = usePreload();

  // No mostrar nada si ya se precargó o no está precargando
  if (!isPreloading || hasPreloaded) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      right: '20px',
      background: 'var(--primary-color)',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      zIndex: 1000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      minWidth: '200px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <i className="bi bi-clock me-2"></i>
        <span style={{ fontWeight: '600' }}>Optimizando experiencia...</span>
      </div>
      
      {/* Barra de progreso */}
      <div style={{
        width: '100%',
        height: '4px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '2px',
        overflow: 'hidden',
        marginBottom: '4px'
      }}>
        <div style={{
          width: `${preloadProgress}%`,
          height: '100%',
          background: 'white',
          borderRadius: '2px',
          transition: 'width 0.3s ease',
          boxShadow: '0 0 8px rgba(255,255,255,0.5)'
        }}></div>
      </div>
      
      <div style={{ 
        fontSize: '12px', 
        opacity: 0.9,
        textAlign: 'center'
      }}>
        {preloadProgress < 30 && 'Iniciando precarga...'}
        {preloadProgress >= 30 && preloadProgress < 70 && 'Cargando horarios...'}
        {preloadProgress >= 70 && preloadProgress < 100 && 'Finalizando...'}
        {preloadProgress === 100 && '¡Listo!'}
      </div>
    </div>
  );
};

export default PreloadIndicator; 