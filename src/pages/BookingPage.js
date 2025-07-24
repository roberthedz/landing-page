import React from 'react';
import Booking from '../components/Booking';
import { usePreload } from '../context/PreloadContext';

const BookingPage = () => {
  const { preloadedData } = usePreload();

  return <Booking preloadedData={preloadedData} />;
};

export default BookingPage; 