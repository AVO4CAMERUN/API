// Main server file 

// Standard module import
const express = require('express')
const cors = require('cors')
const env = require('dotenv').config()

// Module for automatic doc
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerOptions = require('./api/v1/Swagger/swegger.options.v1');

// Create requets rooter
const app = express();
app.use(cors())

// Personal module import
const v1 = require('./api/v1/v1')

// Rest-api interface v1 and mount auto docs
app
  .use('/api/v1', v1)
  .use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerOptions)));

// Start http-server port 80
app.listen(80);

// https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/