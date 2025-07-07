const mongoose = require('mongoose');

// Schema para los mensajes de contacto
const contactMessageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  clientName: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: 'No proporcionado'
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema); 