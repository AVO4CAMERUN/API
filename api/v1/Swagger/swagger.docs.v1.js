// Options for version 1

module.exports = {
  openapi: '3.0.1',
  info: {
    title: "AVO4CAMERUN API",
    version: '1.0.0',
    description: 'The best api in the world',
    termsOfService: '',
    contact: {
        name: '',
        email: '',
        url: ''
    },
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    }
  },
  servers: [
    {
        url: 'http://localhost/api/v1',
        description: 'Local server'
    }
  ]
}

// DA VEDERE PER CHI VUOLE AIUTARMI CON SWAGGER
// https://www.npmjs.com/package/swagger-jsdoc
// https://www.npmjs.com/package/swagger-ui-expresss
