const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  number: String,
  status: {
    type: String,
    enum: ['available', 'booked'],
    default: 'available',
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
});

module.exports = mongoose.model('Seat', seatSchema);
