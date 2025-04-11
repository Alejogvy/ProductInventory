require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Create Express App
const app = express();

// Connect to MongoDB with the connectDB function
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Main routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route to serve the swagger.json
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

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
