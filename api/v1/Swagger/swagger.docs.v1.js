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
  ],
  tags: [
    {
      name: "account",
      description: "Servises users management"
    },
    {
      name: "login",
      description: "Authentication servises"
    },
    {
      name: "classes",
      description: ""
    },
    {
      name: "invites",
      description: ""
    },
    {
      name: "courses",
      description: ""
    },
    {
      name: "units",
      description: ""
    },
    {
      name: "lessons",
      description: ""
    },
    {
      name: "subscribe",
      description: ""
    }
  ],
  paths: {
    "/login": {
      post: {
        tags: ["login"],
        summary: "",
        description: "",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "",
            required: true,
            schema: {
              type: "object",
              properties: {
                username: {
                  type: "string",
                  example: "professore"
                },
                password: {
                  type: "string",
                  example: "professore123"
                }
              }
            }
          }
        ],
        responses: {
          405: {
            description: "Invalid input"
          }
        }
      },
      put: {
        tags: ["login"]
      },
      delete: {
        tags: ["login"]
      }
    },
    "/account": {
      post: {
        tags: ["account"]
      },
      put: {
        tags: ["account"]
      },
      get: {
        tags: ["account"],
        summary: "",
        description: "",
        produces: ["application/json"],
        parameters: [
          {
            in: "query",
            description: "",
            required: false
          }
        ]
      },
      delete: {
        tags: ["account"]
      }
    },
    "/account/{confirmCode}": {
      get: {
        tags: ["account"]
      }
    },
    "/classes": {
      post: {
        tags: ["classes"]
      },
      get: {
        tags: ["classes"]
      }
    },
    "/classes/{id}": {
      put: {
        tags: ["classes"]
      },
      delete: {
        tags: ["classes"]
      }
    },
    "/invites": {
      post: {
        tags: ["invites"]
      },
      get: {
        tags: ["invites"]
      }
    },
    "/invites/{id}": {
      get: {
        tags: ["invites"]
      },
      delete: {
        tags: ["invites"]
      }
    },
    "/courses": {
      post: {
        tags: ["courses"]
      },
      get: {
        tags: ["courses"]
      }
    },
    "/courses/{id}": {
      put: {
        tags: ["courses"]
      },
      delete: {
        tags: ["courses"]
      }
    }, 
    "/units": {
      post: {
        tags: ["units"]
      },
      get: {
        tags: ["units"]
      }
    },
    "/units/{id}": {
      put: {
        tags: ["units"]
      },
      delete: {
        tags: ["units"]
      }
    },
    "/lessons": {
      post: {
        tags: ["lessons"]
      },
      get: {
        tags: ["lessons"]
      }
    },
    "/lessons/{id}": {
      put: {
        tags: ["lessons"]
      },
      delete: {
        tags: ["lessons"]
      }
    },
    "/subscribe": {
      post: {
        tags: ["subscribe"]
      },
      get: {
        tags: ["subscribe"]
      },
      delete: {
        tags: ["subscribe"]
      }
    }
  }
}

// DA VEDERE PER CHI VUOLE AIUTARMI CON SWAGGER
// https://www.npmjs.com/package/swagger-jsdoc
// https://www.npmjs.com/package/swagger-ui-expresss
