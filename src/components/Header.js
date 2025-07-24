import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePreload } from '../context/PreloadContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { refreshPreloadedData, hasPreloaded } = usePreload();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleRefreshData = async () => {
    console.log('🔄 Usuario solicitó recarga de datos...');
    await refreshPreloadedData();
  };

  return (
    <header className={`fixed-top ${isScrolled ? 'scrolled' : ''}`} style={{
      backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      transition: 'all 0.3s ease',
      borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.1)' : 'none',
      zIndex: 1000
    }}>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/" style={{ color: 'var(--primary-color)' }}>
            DeDecor
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ border: 'none' }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/') ? 'active' : ''}`} 
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/servicios') ? 'active' : ''}`} 
                  to="/servicios"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Servicios
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/sobre-nosotros') ? 'active' : ''}`} 
                  to="/sobre-nosotros"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/contacto') ? 'active' : ''}`} 
                  to="/contacto"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contacto
                </Link>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-2">
              {/* Botón de refresh de datos (solo visible si ya se precargó) */}
              {hasPreloaded && (
                <button
                  onClick={handleRefreshData}
                  className="btn btn-sm btn-outline-secondary"
                  title="Actualizar datos de horarios"
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.25rem 0.5rem',
                    border: '1px solid var(--primary-color)',
                    color: 'var(--primary-color)',
                    background: 'transparent'
                  }}
                >
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              )}
              
              <Link 
                to="/agendar" 
                className="btn btn-primary rounded-pill px-3"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  backgroundColor: 'var(--primary-color)',
                  borderColor: 'var(--primary-color)',
                  color: 'white',
                  fontWeight: '600'
                }}
              >
                <i className="bi bi-calendar-check me-2"></i>
                Agendar Cita
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header; 