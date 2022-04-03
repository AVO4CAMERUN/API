// Options for version 1 

module.exports = {
    swaggerDefinition: {
      info: {
        title: "AVO4CAMERUN API",
        version: '1.0.0',
        description: '',
        license: {
          name: 'Licensed Under MIT',
          url: 'https://spdx.org/licenses/MIT.html',
        },
        contact: {
          name: 'Nostro sito presentazione ',
          url: 'link',
        },
      },
    },
    servers: [{
      url: 'http://localhost:3000',
      description: 'Development server',
    }],
    apis: ['./api/v1/module/Routers/*.js'] // POV server.js
};


// DA VEDERE PER CHI VUOLE AIUTARMI CON SWAGGER
// https://www.npmjs.com/package/swagger-jsdoc
// https://www.npmjs.com/package/swagger-ui-expresss