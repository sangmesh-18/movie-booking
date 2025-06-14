const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const Seat = require('./models/seat.model');
const User = require('./models/user.model');

const app = express();
app.use(cors());
app.use(express.json());



// Connect to MongoDB


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB();


// JWT middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(403).json({ message: 'Invalid token' });
  }
}

// ========== AUTH ROUTES ==========

// Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ message: 'User exists' });

  const user = await User.create({ username, password });
  res.json({ message: 'Registered successfully', userId: user._id });
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

// ========== SEAT ROUTES ==========

// Add seats
app.post('/add-seats', async (req, res) => {
  const { count } = req.body;

  
  const lastSeat = await Seat.findOne().sort({ number: -1 });

  let startNumber = 1;
  if (lastSeat) {
    
    const lastNumber = parseInt(lastSeat.number.replace('S', ''));
    startNumber = lastNumber + 1;
  }

  
  const seats = [];
  for (let i = 0; i < count; i++) {
    seats.push({ number: `S${startNumber + i}`, status: 'available' });
  }

  
  await Seat.insertMany(seats);
  res.json({ message: 'Seats added', addedSeats: seats });
});


// Get all seats
app.get('/seats', async (req, res) => {
  const seats = await Seat.find();
  res.json(seats);
});


// Book seats
app.post('/book-seats', verifyToken, async (req, res) => {
  const { seatIds } = req.body;
  const userId = req.userId;

  const results = [];

  for (let id of seatIds) {
    const seat = await Seat.findOne({ _id: id, status: 'available' });
    if (seat) {
      seat.status = 'booked';
      seat.bookedBy = userId; // ✅ Save user ID
      await seat.save();
      results.push({ id, status: 'booked' });
    } else {
      results.push({ id, status: 'unavailable' });
    }
  }

  res.json({ results });
});


// Cancel a seat booking (only by the user who booked it)
app.post('/cancel-seat', verifyToken, async (req, res) => {
  const { seatId } = req.body; 
  const userId = req.userId;

  if (!Array.isArray(seatId)) {
    return res.status(400).json({ message: 'seatId must be an array of IDs' });
  }

  const results = [];

  for (let id of seatId) {
    const seat = await Seat.findById(id);

    if (!seat) {
      results.push({ id, status: 'not_found' });
      continue;
    }

    if (seat.status !== 'booked' || String(seat.bookedBy) !== String(userId)) {
      results.push({ id, status: 'not_allowed' });
      continue;
    }

    seat.status = 'available';
    seat.bookedBy = null;
    await seat.save();

    results.push({ id, status: 'cancelled' });
  }

  res.json({ message: 'Cancel process complete', results });
});



// Start server
app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
