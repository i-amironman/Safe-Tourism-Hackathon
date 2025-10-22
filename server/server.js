
const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const authRouter = require('./auth');
const placesRouter = require('./routes/places');
const crimeRouter = require('./routes/crime');
const routeRouter = require('./routes/route');
const userRouter = require('./routes/user');
const countriesRouter = require('./routes/countries');
const culturesRouter = require('./routes/cultures');
const popularPlacesRouter = require('./routes/popular-places');
const hotelImagesRouter = require('./routes/hotel-images');
const hospitalImagesRouter = require('./routes/hospital-images');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5000',
      'http://127.0.0.1:5000'
    ];
    // Allow Replit dev domains
    if (!origin || allowedOrigins.includes(origin) || origin.includes('.replit.dev')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

// Routes
app.use('/auth', authRouter);
app.use('/places', placesRouter);
app.use('/crime', crimeRouter);
app.use('/route', routeRouter);
app.use('/user', userRouter);
app.use('/api/countries', countriesRouter);
app.use('/api/cultures', culturesRouter);
app.use('/api/popular-places', popularPlacesRouter);
app.use('/api/hotel-images', hotelImagesRouter);
app.use('/api/hospital-images', hospitalImagesRouter);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API routes are working!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
