const mongoose = require('mongoose');

// Schema para los horarios ocupados
const bookedSlotSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  bookingId: {
    type: String,
    required: false // Opcional para bloqueos administrativos
  },
  reason: {
    type: String,
    required: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice compuesto para consultas eficientes
bookedSlotSchema.index({ date: 1, time: 1 });
bookedSlotSchema.index({ bookingId: 1 });

module.exports = mongoose.model('BookedSlot', bookedSlotSchema); 