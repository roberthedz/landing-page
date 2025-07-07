import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ApiDebugger from './components/ApiDebugger';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmation from './pages/BookingConfirmation';
import NotFound from './pages/NotFound';
import SocialMediaPage from './pages/SocialMediaPage';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  const [showDebugger, setShowDebugger] = useState(false);

  useEffect(() => {
    // Listener para activar el debugger con Ctrl+Shift+D
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        setShowDebugger(prev => !prev);
        console.log(`🔧 API Debugger ${!showDebugger ? 'activado' : 'desactivado'}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDebugger]);

  // Log inicial para debugging
  useEffect(() => {
    console.log('🚀 App iniciada');
    console.log('💡 Presiona Ctrl+Shift+D para abrir el panel de debugging de APIs');
  }, []);

  return (
    <Router>
      <GlobalStyles />
      <ApiDebugger show={showDebugger} />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/servicios/:serviceId" element={<ServiceDetailPage />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/agendar" element={<BookingPage />} />
          <Route path="/confirm-booking" element={<BookingConfirmation />} />
          <Route path="/redes-sociales" element={<SocialMediaPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
