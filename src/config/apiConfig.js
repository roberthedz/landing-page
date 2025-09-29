/**
 * Configuración de la API con optimizaciones de rendimiento
 */
import axios from 'axios';

// CONFIGURACIÓN PARA PRODUCCIÓN: Usar Render para todas las APIs
const getBaseUrl = () => {
  // En desarrollo local, usar localhost
  if (window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      window.location.port === '3000' ||
      window.location.port === '3001') {
    return 'http://localhost:3001/api';
  }
  
  // EN PRODUCCIÓN: Siempre usar Render (incluye APIs admin después del deploy)
  return 'https://landing-page-534b.onrender.com/api';
};

const API_BASE_URL = getBaseUrl();

// LOG DE DEBUGGING PARA VERIFICAR LA CONFIGURACIÓN
console.log('🔧 API Configuration:');
console.log('  - Current hostname:', window.location.hostname);
console.log('  - Current port:', window.location.port);
console.log('  - API Base URL:', API_BASE_URL);
console.log('  - Full origin:', window.location.origin);

// Configuración de timeout y reintentos
const API_CONFIG = {
  timeout: 120000, // 2 minutos timeout para reservas
  maxRetries: 2, // Reducir reintentos para evitar duplicados
  retryDelay: 2000, // 2 segundos entre reintentos
  // Configurar headers por defecto (solo los esenciales)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    // Quitamos X-Requested-With porque causa problemas de CORS
  }
};

// Cache simple para evitar múltiples llamadas
const cache = new Map();
const CACHE_DURATION = 30000; // 30 segundos

// Función para hacer peticiones con reintentos automáticos
const makeRequest = async (url, options = {}, retries = API_CONFIG.maxRetries) => {
  // Configurar headers por defecto (SIN Origin manual)
  const requestConfig = {
    url,
    timeout: API_CONFIG.timeout,
    headers: {
      ...API_CONFIG.headers,
      // NO agregar Origin manualmente - el navegador lo hace automáticamente
      ...options.headers
    },
    // Configurar CORS
    withCredentials: false,
    ...options
  };
  
  console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);
  console.log(`   Origin: ${window.location.origin}`);
  
  try {
    const response = await axios(requestConfig);
    console.log(`✅ API Success: ${url} (${response.status})`);
    return response;
  } catch (error) {
    console.error(`❌ Error en petición a ${url}:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      origin: window.location.origin
    });
    
    // Reintentar en casos específicos
    if (retries > 0 && (
      error.code === 'ECONNABORTED' || 
      error.response?.status >= 500 ||
      error.message.includes('Network Error')
    )) {
      console.log(`🔄 Reintentando petición a ${url}. Intentos restantes: ${retries - 1}`);
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay));
      return makeRequest(url, options, retries - 1);
    }
    
    throw error;
  }
};

// Función para peticiones GET con cache
const getCachedRequest = async (url) => {
  const cacheKey = url;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`💾 Usando cache para ${url}`);
    return cached.data;
  }
  
  try {
    const response = await makeRequest(url, { method: 'GET' });
    console.log(`💾 Guardando en cache: ${url}`);
    cache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });
    return response;
  } catch (error) {
    // Si falla y tenemos datos en cache, usarlos como fallback
    if (cached) {
      console.log(`💾 Usando cache como fallback para ${url}`);
      return cached.data;
    }
    console.error(`❌ No hay datos en cache para ${url}, propagando error`);
    throw error;
  }
};

// Función para limpiar cache
const clearCache = (pattern = null) => {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
};

// Log final de configuración
console.log('🎯 Endpoints configurados:');
console.log(`  - Bookings: ${API_BASE_URL}/bookings`);
console.log(`  - Booked Slots: ${API_BASE_URL}/booked-slots`);
console.log(`  - System Status: ${API_BASE_URL}/system-status`);

export default {
  baseURL: API_BASE_URL,
  API_BASE_URL,
  API_CONFIG,
  makeRequest,
  getCachedRequest,
  clearCache,
  endpoints: {
    bookings: `${API_BASE_URL}/bookings`,
    bookedSlots: `${API_BASE_URL}/booked-slots`,
    bookedSlotsBatch: `${API_BASE_URL}/booked-slots-batch`,
    sendBookingEmail: `${API_BASE_URL}/send-booking-email`,
    sendContactEmail: `${API_BASE_URL}/send-contact-email`,
    // Nuevos endpoints para debugging
    systemStatus: `${API_BASE_URL}/system-status`,
    health: `${API_BASE_URL}/health`,
    // Endpoints administrativos
    adminLogin: `${API_BASE_URL}/admin/login`,
    adminBlockDate: `${API_BASE_URL}/admin/block-date`,
    adminBlockTimes: `${API_BASE_URL}/admin/block-times`,
    adminUnblockDate: `${API_BASE_URL}/admin/unblock-date`,
    adminBookings: `${API_BASE_URL}/admin/bookings`
  }
}; 