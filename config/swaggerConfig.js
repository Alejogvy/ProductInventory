const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Inventory API',
      version: '1.0.0',
      description: 'API for managing products and categories in an inventory system',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Category: {
          type: 'object',
          required: ['name', 'description'],
          properties: {
            _id: { type: 'string', description: 'Unique identifier' },
            name: { type: 'string', example: 'Electronics' },
            description: { type: 'string', example: 'Devices and gadgets' }
          }
        },
        Product: {
          type: 'object',
          required: ['name', 'category', 'price', 'color', 'stock', 'supplier'],
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'iPhone 13' },
            description: { type: 'string', example: 'Latest smartphone model' },
            category: { type: 'string' },
            price: { type: 'number', format: 'float', example: 999.99 },
            stock: { type: 'integer', example: 50 },
            supplier: { type: 'string', example: 'Apple Inc.' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
