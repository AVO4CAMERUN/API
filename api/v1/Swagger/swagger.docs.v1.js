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
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer"    
      }
    }
  },
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
        requestBody: {
          description: "",
          required: true,
          content: {
            "application/json": {
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
          }
        },
        responses: {
          200: {
            description: "Login successful"
          },
          403: {
            description: "Login forbidden"
          },
          500: {
            description: "Server error"
          }
        }
      },
      put: {
        tags: ["login"],
        summary: "",
        description: "",
        consumes: ["application/json"],
        produces: ["application/json"],
        requestBody: {
          description: "",
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                    example: ""
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Refresh successful"
          },
          403: {
            description: "Refresh forbidden"
          },
          500: {
            description: "Server error"
          }
        }
      },
      delete: {
        tags: ["login"],
        summary: "",
        description: "",
        consumes: ["application/json"],
        produces: ["application/json"],
        requestBody: {
          description: "",
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                    example: ""
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Logout successful"
          },
          500: {
            description: "Server error"
          }
        }
      }
    },
    "/account": {
      post: {
        tags: ["account"],
        summary: "",
        description: "",
        consumes: ["application/json"],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          description: "",
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    example: ""
                  },
                  surname: {
                    type: "string",
                    example: ""
                  },
                  username: {
                    type: "string",
                    example: ""
                  },
                  email: {
                    type: "string",
                    example: ""
                  },
                  password: {
                    type: "string",
                    example: ""
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "OK"
          },
          403: {
            description: "Forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      },
      put: {
        tags: ["account"],
        summary: "",
        description: "",
        consumes: ["application/json"],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          description: "",
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    example: ""
                  },
                  surname: {
                    type: "string",
                    example: ""
                  },
                  username: {
                    type: "string",
                    example: ""
                  },
                  email: {
                    type: "string",
                    example: ""
                  },
                  password: {
                    type: "string",
                    example: ""
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "OK"
          },
          403: {
            description: "Forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      },
      get: {
        tags: ["account"],
        summary: "",
        description: "",
        produces: ["application/json"],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [ // rivedere parametri da utilizzare
          {
            in: "query",
            name: "email",
            description: "",
            required: false,
            schema: {
              type: "string",
            }
          },
          {
            in: "query",
            name: "firstname",
            description: "",
            required: false,
            schema: {
              type: "string",
            }
          },
          {
            in: "query",
            name: "lastname",
            description: "",
            required: false,
            schema: {
              type: "string",
            }
          },
          {
            in: "query",
            name: "id_class",
            description: "",
            required: false,
            schema: {
              type: "string",
            }
          }
        ],
        responses: {
          200: {
            description: "OK"
          },
          403: {
            description: "Forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      },
      delete: {
        tags: ["account"],
        summary: "",
        description: "",
        consumes: ["application/json"],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: "OK"
          },
          403: {
            description: "Forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      }
    },
    "/account/{confirmCode}": {
      get: {
        tags: ["account"],
        tags: ["account"],
        summary: "",
        description: "",
        consumes: ["application/json"],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            in: "path",
            name: "confirmCode",
            description: "",
            required: true,
            schema: {
              type: "string",
            }
          }
        ],
        responses: {
          200: {
            description: "OK"
          },
          403: {
            description: "Forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      }
    },
    "/classes": {
      post: {
        tags: ["classes"],
        summary: "",
        description: "",
        consumes: ["application/json"],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          description: "",
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    example: ""
                  },
                  img_cover: {
                    type: "string",
                    example: ""
                  },
                  students: {
                    type: "array",
                    items: {
                      type: "string"
                    }
                  },
                  teachers: {
                    type: "array",
                    items: {
                      type: "string"
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "OK"
          },
          403: {
            description: "Forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      },
      get: {
        tags: ["classes"],
        summary: "",
        description: "",
        produces: ["application/json"],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            in: "query",
            name: "id",
            description: "",
            required: false,
            schema: {
              type: "integer",
            }
          },
          {
            in: "query",
            name: "name",
            description: "",
            required: false,
            schema: {
              type: "string",
            }
          },
          {
            in: "query",
            name: "creation_date",
            description: "",
            required: false,
            schema: {
              type: "string",
            }
          },
          {
            in: "query",
            name: "archived",
            description: "",
            required: false,
            schema: {
              type: "boolean",
            }
          }
        ],
        responses: {
          200: {
            description: "OK"
          },
          403: {
            description: "Forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      }
    },
    "/classes/{id}": {
      put: {
        tags: ["classes"],
        summary: "",
        description: "",
        produces: ["application/json"],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          description: "",
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    example: ""
                  },
                  img_cover: {
                    type: "string",
                    example: ""
                  },
                  students: {
                    type: "array",
                    items: {
                      type: "string"
                    }
                  },
                  teachers: {
                    type: "array",
                    items: {
                      type: "string"
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "OK"
          },
          403: {
            description: "Forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
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
