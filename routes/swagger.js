const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Productos y Categorías',
      version: '1.0.0',
      description: 'Documentación de la API para el manejo de productos y categorías'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ]
  },
  apis: ['./routes/*.js'], // Aquí tomará las anotaciones Swagger de tus rutas
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  };

module.exports = setupSwaggerDocs;
