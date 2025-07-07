import React, { useState, useEffect } from 'react';
import apiConfig from '../config/apiConfig';

const ApiDebugger = ({ show = false }) => {
  const [apiStatus, setApiStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const checkApiStatus = async () => {
    setIsLoading(true);
    const status = {};

    try {
      // Verificar system status
      console.log('🔍 Checking system status...');
      const systemResponse = await apiConfig.makeRequest(
        apiConfig.endpoints.systemStatus, 
        { method: 'GET' }
      );
      status.systemStatus = {
        success: true,
        data: systemResponse.data,
        url: apiConfig.endpoints.systemStatus
      };
    } catch (error) {
      status.systemStatus = {
        success: false,
        error: error.message,
        url: apiConfig.endpoints.systemStatus
      };
    }

    try {
      // Verificar booked slots
      console.log('🔍 Checking booked slots...');
      const slotsResponse = await apiConfig.makeRequest(
        apiConfig.endpoints.bookedSlots,
        { method: 'GET' }
      );
      status.bookedSlots = {
        success: true,
        data: slotsResponse.data,
        url: apiConfig.endpoints.bookedSlots
      };
    } catch (error) {
      status.bookedSlots = {
        success: false,
        error: error.message,
        url: apiConfig.endpoints.bookedSlots
      };
    }

    setApiStatus(status);
    setIsLoading(false);
  };

  useEffect(() => {
    if (show) {
      checkApiStatus();
    }
  }, [show]);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      border: '2px solid #4a6163',
      borderRadius: '8px',
      padding: '15px',
      maxWidth: '400px',
      maxHeight: '80vh',
      overflow: 'auto',
      zIndex: 9999,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      fontSize: '12px'
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#4a6163' }}>
        🔧 API Debug Panel
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Configuración:</strong><br/>
        Current Origin: {window.location.origin}<br/>
        API Base: {apiConfig.API_BASE_URL}
      </div>

      <button 
        onClick={checkApiStatus} 
        disabled={isLoading}
        style={{
          background: '#4a6163',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          marginBottom: '10px'
        }}
      >
        {isLoading ? '🔄 Verificando...' : '🔍 Verificar APIs'}
      </button>

      {Object.keys(apiStatus).length > 0 && (
        <div>
          <strong>Estado de APIs:</strong>
          {Object.entries(apiStatus).map(([key, value]) => (
            <div key={key} style={{ 
              margin: '5px 0', 
              padding: '5px', 
              background: value.success ? '#d4edda' : '#f8d7da',
              borderRadius: '3px'
            }}>
              <strong>{key}:</strong> {value.success ? '✅' : '❌'}<br/>
              <small style={{ wordBreak: 'break-all' }}>
                URL: {value.url}<br/>
                {value.success ? 
                  `Datos: ${JSON.stringify(value.data, null, 2).substring(0, 100)}...` :
                  `Error: ${value.error}`
                }
              </small>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ 
        marginTop: '10px', 
        fontSize: '10px', 
        color: '#666',
        borderTop: '1px solid #ddd',
        paddingTop: '5px'
      }}>
        💡 Presiona F12 → Console para ver logs detallados
      </div>
    </div>
  );
};

export default ApiDebugger; 