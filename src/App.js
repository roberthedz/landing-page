import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmation from './pages/BookingConfirmation';
import SocialMediaPage from './pages/SocialMediaPage';
import NotFound from './pages/NotFound';
import ApiDebugger from './components/ApiDebugger';
import { PreloadProvider } from './context/PreloadContext';
import PreloadIndicator from './components/PreloadIndicator';

function App() {
  const [showDebugger, setShowDebugger] = useState(false);

  // Mostrar debugger con Ctrl+Shift+D
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        setShowDebugger(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <PreloadProvider>
      <Router>
        <GlobalStyles />
        <PreloadIndicator />
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
    </PreloadProvider>
  );
}

export default App;
