const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Expiry Date Manager API Documentation',
            version: '1.0.0',
            description: 'REST API documentation for Expiry Date Manager Node.js/Express backend'
        },
        servers: [
            {
                url: 'http://localhost:5001',
                description: 'Local Development Server'
            }
        ]
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('Swagger UI available at http://localhost:5001/api-docs');
};

module.exports = setupSwagger;
