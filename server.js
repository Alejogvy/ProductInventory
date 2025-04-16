require('dotenv').config();
require('./middleware/passport');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const stockHistoryRoutes = require('./routes/stockHistory');

// Create Express App
const app = express();

app.set('trust proxy', 1);

// Connect to MongoDB with the connectDB function
connectDB();

// Dynamic session configuration per environment
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true, // Force HTTPS in production
    sameSite: 'none', // Necessary for cross-site
    maxAge: 24 * 60 * 60 * 1000 // 1 day in ms
  }
};

// MongoDB for Sessions (Production)
if (process.env.NODE_ENV === 'production') {
  sessionConfig.store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 24 * 60 * 60 // 1 day in seconds
  });
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://productinventory-90te.onrender.com' 
    : 'http://localhost:3000',
  credentials: true
}));

app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Headers CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://productinventory-90te.onrender.com");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Z-Key");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, OPTIONS, DELETE");
  next();
});

// Authentication routes
app.get('/login', (req, res) => {
  res.send('<a href="/auth/github">Login con GitHub</a>');
});

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/github/callback', 
  passport.authenticate('github', { 
    failureRedirect: '/login',
    successRedirect: process.env.NODE_ENV === 'production'
      ? 'https://productinventory-90te.onrender.com/api-docs'
      : '/api-docs'
  })
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Main routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stock-history', stockHistoryRoutes);

// Route to serve the swagger.json
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Handle non-existing routes
app.use((req, res) => {
  res.status(404).json({
    message: 'Endpoint not found',
    errorType: 'NOT_FOUND'
  });
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    errorType: err.errorType || 'SERVER_ERROR'
  });
});

// Start the server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on the port ${port}`);
      console.log('Modo:', process.env.NODE_ENV || 'development');
      console.log('Swagger UI:', `http://localhost:${port}/api-docs`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
