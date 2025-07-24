import React from 'react';
import { usePreload } from '../context/PreloadContext';

const PreloadIndicator = () => {
  const { isPreloading, preloadProgress, hasPreloaded } = usePreload();

  // Ocultar completamente el indicador - funcionalidad transparente al usuario
  return null;
};

export default PreloadIndicator; 