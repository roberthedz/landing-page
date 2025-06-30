const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Datos de prueba
let bookedSlots = [];

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// API para obtener horarios ocupados
app.get('/api/booked-slots', (req, res) => {
  res.json(bookedSlots);
});

// API para crear una reserva de prueba
app.post('/api/test-booking', (req, res) => {
  const booking = {
    id: `booking-${Date.now()}`,
    date: '15/08/2023',
    time: '10:00'
  };
  
  bookedSlots.push(booking);
  res.status(201).json({ success: true, booking });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor de prueba ejecutándose en http://localhost:${PORT}`);
}); 