// Main server file 

// Standard module import
const express = require('express')
const cors = require('cors')
const env = require('dotenv').config()

// Module for automatic doc
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerDocument = require('./Swagger/swagger.json');

const options = {
    swaggerOptions: {
      validatorUrl: null
    }
};

  
// Create requets rooter
const app = express();
app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));


// Personal module import
const v1 = require('./api/v1/v1');

// Rest-api interface v1 (Versioni non necessiarissime anche se potrebbero essere fornite alcune per inntegrazione su altri siti)
app.use('/api/v1', v1);

// Start http-server port 80
app.listen(80);

// https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/