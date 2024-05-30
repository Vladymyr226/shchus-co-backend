// swagger.js
const swaggerJSDoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'A simple Express API',
    },
    servers: [
      {
        url: 'http://localhost:4000',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
          },
          required: ['name', 'email', 'password'],
        },
      },
    },
  },
  apis: ['./src/modules/auth/routes/*.ts'], // Путь к файлам с JSDoc комментариями
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec
