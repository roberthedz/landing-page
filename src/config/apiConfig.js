/**
 * Configuración de la API con optimizaciones de rendimiento
 */
import axios from 'axios';

// Detectar automáticamente el dominio base
const getBaseUrl = () => {
  // En desarrollo, usar localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  // En producción, SIEMPRE usar el servidor de Render para las APIs
  // porque es el único que tiene el servidor Node.js funcionando
  return 'https://landing-page-534b.onrender.com/api';
};

const API_BASE_URL = getBaseUrl();

// Configuración de timeout y reintentos
const API_CONFIG = {
  timeout: 15000, // 15 segundos timeout
  maxRetries: 3,
  retryDelay: 1000 // 1 segundo entre reintentos
};

// Cache simple para evitar múltiples llamadas
const cache = new Map();
const CACHE_DURATION = 30000; // 30 segundos

// Función para hacer peticiones con reintentos automáticos
const makeRequest = async (url, options = {}, retries = API_CONFIG.maxRetries) => {
  try {
    const response = await axios({
      url,
      timeout: API_CONFIG.timeout,
      ...options
    });
    return response;
  } catch (error) {
    console.error(`Error en petición a ${url}:`, error);
    
    if (retries > 0 && (error.code === 'ECONNABORTED' || error.response?.status >= 500)) {
      console.log(`Reintentando petición a ${url}. Intentos restantes: ${retries - 1}`);
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
    console.log(`Usando cache para ${url}`);
    return cached.data;
  }
  
  try {
    const response = await makeRequest(url, { method: 'GET' });
    cache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });
    return response;
  } catch (error) {
    // Si falla y tenemos datos en cache, usarlos como fallback
    if (cached) {
      console.log(`Usando cache como fallback para ${url}`);
      return cached.data;
    }
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

export default {
  API_BASE_URL,
  API_CONFIG,
  makeRequest,
  getCachedRequest,
  clearCache,
  endpoints: {
    bookings: `${API_BASE_URL}/bookings`,
    bookedSlots: `${API_BASE_URL}/booked-slots`,
    sendBookingEmail: `${API_BASE_URL}/send-booking-email`,
    sendContactEmail: `${API_BASE_URL}/send-contact-email`
  }
}; 