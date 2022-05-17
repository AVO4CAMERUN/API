// Options for version 1
module.exports = {

  //START
  openapi: '3.0.1',
  info: {
    title: "AVO4CAMERUN API",
    version: '1.0.0',
    description: 'API that manages all the services and contents for the web-app Avo4Camerun',
    termsOfService: '',
    contact: {
        name: 'Avo4Cam',
        email: 'avogadro4camerun@gmail.com',
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
    },
    {
      url: 'https://app.avo4camerun.kirinsecurity.com/',
      description: 'Public server'
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
      description: "Services users management"
    },
    {
      name: "login",
      description: "Authentication services"
    },
    {
      name: "classes",
      description: "Groups with teachers and students"
    },
    {
      name: "invites",
      description: "Invites made by the teacher to the students"
    },
    {
      name: "courses",
      description: "Contains units with lessons"
    },
    {
      name: "units",
      description: "Sections of the course"
    },
    {
      name: "lessons",
      description: "Video-lessons"
    },
    {
      name: "subscribe",
      description: "Subscription to a course"
    }
  ],
  paths: {

  //LOGIN  
    "/login": {
      post: {
        tags: ["login"],
        summary: "account access",
        description: "Manages the access for registered users",
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
        summary: "Logout account",
        description: "Logout from the account",
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

    //ACCOUNT
    "/account": {
      post: {
        tags: ["account"],
        summary: "Creates new account",
        description: "Creation of a new account by giving user's data",
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
                  firstname: {
                    type: "string",
                    example: "Kingsley"
                  },
                  lastname: {
                    type: "string",
                    example: "Bouba"
                  },
                  username: {
                    type: "string",
                    example: "kigbo"
                  },
                  email: {
                    type: "string",
                    example: "kigbo@gmail.com"
                  },
                  password: {
                    type: "string",
                    example: "Password123"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Account created"
          },
          403: {
            description: "Account creation Forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      },
      put: {
        tags: ["account"],
        summary: "Modifies account's data",
        description: "Change username or password of the account",
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
                  username: {
                    type: "string",
                    example: "kigBou"
                  },
                  password: {
                    type: "string",
                    example: "Password123!"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Modification successful"
          },
          403: {
            description: "Modification Forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      },
      get: {
        tags: ["account"],
        summary: "Returns account's details",
        description: "returns the informations about user's account",
        produces: ["application/json"],
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
      },
      delete: {
        tags: ["account"],
        summary: "deletes account",
        description: "destroy the account",
        consumes: ["application/json"],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: "Elimination successful"
          },
          403: {
            description: "Elimination forbidden"
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
        summary: "confirm code",
        description: "sends the confirm code via email",
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
            description: "Confirmation successful"
          },
          403: {
            description: "Confirmation forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      }
    },

    //CLASSES
    "/classes": {
      post: {
        tags: ["classes"],
        summary: "Creates classroom",
        description: "Creates a new classroom",
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
                    example: "New_class"
                  },
                  img_cover: {
                    type: "string",
                    example: "" //string of an image or empty
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
            description: "Class created"
          },
          403: {
            description: "Class creation forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      },
      get: {
        tags: ["classes"],
        summary: "Returns classes",
        description: "Returns classes by giving id",
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
              type: "array",
              items: {
                type: "integer"
              }
            }
          }
        ],
        responses: {
          200: {
            description: "Classes found"
          },
          403: {
            description: "Classes research forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      }
    },
    "/classes/{id}": {
      get: {
        tags: ["classes"],
        summary: "Returns classes",
        description: "Returns classes by giving id",
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
          }
        ],
        responses: {
          200: {
            description: "Class found"
          },
          403: {
            description: "Class research forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      },
      put: {
        tags: ["classes"],
        summary: "Update class",
        description: "Change class details",
        produces: ["application/json"],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            in: "path",
            name: "id",
            description: "",
            required: true,
            schema: {
              type: "integer",
            }
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
                    type: "boolean",
                    example: false
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Class modified"
          },
          403: {
            description: "Modification forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      },
      delete: {
        tags: ["classes"],
        summary: "Drops the class",
        description: "Deletes the chosen class by its id",
        produces: ["application/json"],
        description: "",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            in: "path",
            name: "id",
            description: "",
            required: true,
            schema: {
              type: "integer",
            }
          }
        ],
        responses: {
          200: {
            description: "Class deleted"
          },
          403: {
            description: "Deletion forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      }
    },

    //INVITES
    "/invites": {
      post: { 
        tags: ["invites"],
        summary: "Sends invites",
        description: "Sends a new invitation made by a teacher to the students",
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
                  class_id: {
                    type: "integer",
                    example: "1"
                  },
                  students: {
                    type: "array",
                    items: {
                      type: "string",
                      example: ""
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Invites sent"
          },
          403: {
            description: "Invites forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      },
      get: {
        tags: ["invites"],
        summary: "",
        description: "",
        produces: ["application/json"],
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
    "/invites/{id}": {
      get: {
        tags: ["invites"],
        summary: "Accept Invite",
        produces: ["application/json"],
        description: "Returns invites by id",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            in: "path",
            name: "id",
            description: "",
            required: true,
            schema: {
              type: "integer",
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
        tags: ["invites"],
        summary: "Reject Invite",
        description: "",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            in: "path",
            name: "id",
            description: "",
            required: true,
            schema: {
              type: "integer",
            }
          }
        ],
        responses: {
          200: {
            description: "Invite rejected"
          },
          403: {
            description: "Refusal forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      }
    },

    //COURSES
    "/courses": {
      post: {
        tags: ["courses"],
        summary: "Create course",
        description: "create a new course",
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
                    example: "Database"
                  },
                  description: {
                    type: "string",
                    example: "How databases works? Installation, configuration and first stepguide"
                  },
                  img_cover: {
                    type: "string",
                    example: "" //empty
                  },
                  subject: {
                    type: "string",
                    example: "Informatics"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Course created"
          },
          403: {
            description: "Course creation forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      },
      get: {
        tags: ["courses"],
        summary: "returns courses",
        description: "returns data about courses",
        produces: ["application/json"],
        //No paramethers
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
    "/courses/{id}": {
      put: {
        tags: ["courses"],
        summary: "Modify course",
        description: "Change the subject of the course by giving course's id",
        produces: ["application/json"],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            in: "path",
            name: "id",
            description: "",
            required: true,
            schema: {
              type: "integer",
            }
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
                    example: "change"
                  },
                  subject: {
                    type: "string",
                    example: "Statistics"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Course updated"
          },
          403: {
            description: "Course update forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      },
      delete: {
        tags: ["courses"],
        summary: "Drop course",
        description: "Unsuscribe from the course by giving its id",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            in: "path",
            name: "id",
            description: "id of the course",
            required: true,
            schema: {
              type: "integer",
            }
          }
        ],
        responses: {
          200: {
            description: "Course deleted"
          },
          403: {
            description: "Elimination Forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      }
    }, 

    //UNITS
    "/units": {
      post: {
        tags: ["units"],
        summary: "Create the unit",
        description: "Create a new unit in the course",
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
                    example: "Unit 1"
                  },
                  description: {
                    type: "string",
                    example: "This unit will teach you all about GPUs and CPUs"
                  },
                  id_course: {
                    type: "integer",
                    example: "8"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Unit created"
          },
          403: {
            description: "Unit creation forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      },
      get: {
        tags: ["units"],
        summary: "Returns units",
        description: "Gives the units by giving ",
        produces: ["application/json"],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            in: "query",
            name: "id_course",
            description: "id that references to a course",
            required: true,
            schema: {
              type: "integer",
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
    "/units/{id}": {
      put: {
        tags: ["units"],
        summary: "Changes unit",
        description: "Alters the unit by gave elements",
        produces: ["application/json"],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            in: "path",
            name: "id",
            description: "unit's id",
            required: true,
            schema: {
              type: "integer",
            }
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
                  id_course: {
                    type: "integer",
                    example: "3"
                  },
                  seq_number: {
                    type: "integer",
                    example: "3"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Unit updated"
          },
          403: {
            description: "Unit update forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      },
      delete: {
        tags: ["units"],
        summary: "Deletes the unit",
        produces: ["application/json"],
        description: "Deletes the unit by giving its id",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            in: "path",
            name: "id",
            description: "",
            required: true,
            schema: {
              type: "integer",
            }
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
                  id_course: {
                    type: "integer",
                    example: "8"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Unit deleted"
          },
          403: {
            description: "Unit elimination forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      }
    },
    "/lessons": {
      post: {
        tags: ["lessons"],
        summary: "Create lesson",
        description: "Create a new lesson with quiz and a video",
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
                  id_course: {
                    type: "integer",
                    example: "8"
                  },
                  id_unit: {
                    type: "integer",
                    example: "8"
                  },
                  name: {
                    type: "lesson 1",
                    example: "This lesson talks about GPUs."
                  },
                  link_video: {
                    type: "string",
                    example: "https://www.youtube.com/watch?v=_bCPuhqS4u8"
                  },
                  quiz: {
                    type: "array",
                    items: {
                      type: "string",
                      example: ""
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Lesson created"
          },
          403: {
            description: "Lesson creation forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      },
      get: {
        tags: ["lessons"],
        summary: "Returns lessons",
        description: "Gives the lessons by giving the id_unit",
        produces: ["application/json"],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            in: "query",
            name: "id_unit",
            description: "id that references to a unit",
            required: true,
            schema: {
              type: "integer",
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
    "/lessons/{id}": {
      put: {
        tags: ["lessons"],
        summary: "changes the lesson",
        description: "Alters the lesson by gave elements",
        produces: ["application/json"],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            in: "path",
            name: "id",
            description: "lesson's id",
            required: true,
            schema: {
              type: "integer",
            }
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
                  id_course: {
                    type: "integer",
                    example: "8"
                  },
                  id_unit: {
                    type: "integer",
                    example: "8"
                  },
                  name: {
                    type: "string",
                    example: "updated lesson"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Lesson updated"
          },
          403: {
            description: "Lesson update forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      },
      delete: {
        tags: ["lessons"],
        summary: "Deletes the selected lesson",
        produces: ["application/json"],
        description: "deletes the lesson by giving its id",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            in: "path",
            name: "id",
            description: "",
            required: true,
            schema: {
              type: "integer",
            }
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
                  id_course: {
                    type: "integer",
                    example: "1"
                  },
                  id_unit: {
                    type: "integer",
                    example: "1"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Lesson deleted"
          },
          403: {
            description: "Lesson elimination forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      }
    },
    "/subscribe": {
      post: {
        tags: ["subscribe"],
        summary: "Subscription to a course",
        description: "Subscription made by a student to a course by giving its id",
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
                  id_course: {
                    type: "integer",
                    example: "1"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Subscription successful"
          },
          403: {
            description: "Subscription forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      },
      get: {
        tags: ["subscribe"],
        summary: "Returns the subscription",
        description: "Gives the subscription by giving teacher's email",
        produces: ["application/json"],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            in: "query",
            name: "email",
            description: "teacher's email",
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
      },
      delete: {
        tags: ["subscribe"],
        summary: "Deletes subscription",
        produces: ["application/json"],
        description: "Cancels the subscription to a course",
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
                  id_course: {
                    type: "integer",
                    example: "1"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Subscription deleted"
          },
          403: {
            description: "Unsubscription forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      }
    }
  }
}