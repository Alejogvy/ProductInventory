const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Inventory API',
      version: '1.0.0',
      description: 'API for managing products, categories, users and stock history in an inventory system',
      contact: {
        name: 'API Support',
        email: 'support@productinventory.com'
      }
    },
    servers: [
      {
        url: "https://productinventory-90te.onrender.com",
        description: "Production server"
      },
      {
        url: "http://localhost:3000",
        description: "Development server"
      }
    ],
    components: {
      securitySchemes: {
        oauth2: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: 'https://github.com/login/oauth/authorize',
              tokenUrl: 'https://github.com/login/oauth/access_token',
              scopes: {
                'read:user': 'Read user information'
              }
            }
          }
        }
      },
      schemas: {
        Category: {
          type: 'object',
          required: ['name', 'description'],
          properties: {
            _id: { 
              type: 'string', 
              description: 'Unique identifier for the category',
              example: '507f1f77bcf86cd799439011'
            },
            name: { 
              type: 'string', 
              description: 'Name of the category',
              example: 'Electronics' 
            },
            description: { 
              type: 'string', 
              description: 'Detailed description of the category',
              example: 'Electronic devices and accessories' 
            }
          }
        },
        Product: {
          type: 'object',
          required: ['name', 'description', 'price', 'color', 'category', 'stock', 'supplier'],
          properties: {
            _id: { 
              type: 'string',
              description: 'Unique identifier for the product',
              example: '507f1f77bcf86cd799439012'
            },
            name: { 
              type: 'string', 
              description: 'Name of the product',
              example: 'iPhone 13' 
            },
            description: { 
              type: 'string', 
              description: 'Detailed description of the product',
              example: 'Latest smartphone model with A15 Bionic chip' 
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Price of the product in USD',
              example: 999.99 
            },
            color: {
              type: 'string',
              description: 'Color of the product',
              example: 'Black'
            },
            category: { 
              type: 'string',
              description: 'Category ID this product belongs to',
              example: '507f1f77bcf86cd799439011'
            },
            stock: { 
              type: 'integer', 
              description: 'Current inventory count',
              example: 50 
            },
            supplier: { 
              type: 'string',
              description: 'Name of the product supplier',
              example: 'Apple Inc.' 
            }
          }
        },
        User: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password', 'favoriteColor', 'birthday'],
          properties: {
            _id: { 
              type: 'string',
              description: 'Unique identifier for the user'
            },
            firstName: { 
              type: 'string',
              description: "User's first name",
              example: 'Ale'
            },
            lastName: { 
              type: 'string',
              description: "User's last name",
              example: 'Villamar'
            },
            password: {
              type: 'string',
              description: "Password composed of numbers and letters",
              example: 'alejo123'
            },
            email: { 
              type: 'string',
              format: 'email',
              description: "User's email address",
              example: 'ale.villamar@example.com'
            },
            favoriteColor: {
              type: 'string',
              description: "User's favorite color",
              example: 'blue'
            },
            birthday: {
              type: 'string',
              format: 'date',
              description: "User's birth date",
              example: '1991-01-01'
            }
          }
        },
        StockHistory: {
          type: 'object',
          required: ['product', 'change', 'reason'],
          properties: {
            _id: {
              type: 'string',
              description: 'Record ID'
            },
            product: {
              type: 'object',
              properties: {
                _id: {
                  type: 'string',
                  description: 'Product ID'
                },
                name: {
                  type: 'string',
                  description: 'Product name'
                }
              }
            },
            change: {
              type: 'integer',
              description: 'Quantity change (positive for restock, negative for sale)'
            },
            reason: {
              type: 'string',
              enum: ['restock', 'sale', 'correction', 'other'],
              description: 'Reason for stock change'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'When the change occurred'
            }
          }
        }
      }
    },
    security: [{
      oauth2: ['read:user']
    }]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;