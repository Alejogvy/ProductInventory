const express = require('express');
require('dotenv').config(); // ✅ Solo esto es suficiente para cargar variables de entorno
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const setupSwaggerDocs = require('./routes/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Rutas API
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Documentación Swagger
setupSwaggerDocs(app);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📘 Documentación disponible en http://localhost:${PORT}/api-docs`);
});
