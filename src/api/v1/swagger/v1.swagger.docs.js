// Options for version 1
export default {

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
      url: 'https://api.avo4camerun.kirinsecurity.com/api/v1',
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
        description: "Manages the access for registered users. You have to put your username and password, then the API will give you an access token in order to use all the other functions of the API.",
        consumes: ["application/json"],
        produces: ["application/json"],
        requestBody: {
          description: "Insert your username and password.",
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
        summary: "Refresh token",
        description: "By this request the API will give you another token in case the other one is expired. You have to put the refresh token so you will receive a new access token",
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
        description: "This method will allow you to logout from your account by giving the refresh token.",
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
        description: "Creation of a new account by giving your firstname, lastname, username, email and password. After that you will receive a confirm code to ensure that you are the correct user.",
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
            description: "Account creation forbidden"
          },
          500: {
            description: "Server Error"
          }
        }
      },
      put: {
        tags: ["account"],
        summary: "Modifies account's data",
        description: "You can change the username or password associated to your account.",
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
        description: "Returns the parameters (email, role, username, firstname, lastname, profile image, class that you joined and registration date) about your personal account.",
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
        summary: "Deletes account",
        description: "Deletes your account from the platform.",
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
        summary: "Confirm code",
        description: "Allows you to insert your confirm code in order to activate your account.",
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
        description: "Creates a new classroom with a name, an image cover (if you don't put it, there will be a sample image), the emails of the students of the classroom and the teachers that created them.",
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
                    example: ""
                  },
                  students: {
                    type: "array",
                    items: {
                      type: "string",
                      example:"studente1@gmail.com"
                    }
                  },
                  teachers: {
                    type: "array",
                    items: {
                      type: "string",
                      example:"professore@gmail.com"
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
        description: "Returns information about the classes (id, name, creation date, cover image, if is archived or not, teachers and students data) where the user is subscribed.",
        produces: ["application/json"],
        security: [
          {
            bearerAuth: []
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
        description: "Returns informations(id, name, creation date, cover image, if is archived or not, teachers and students data) about the class by giving its id.",
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
        description: "Changes class details (name, cover image and the students list) by giving its id.",
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
                  archived: {
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
        description: "Deletes the chosen class by its id from your classes",
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
        description: "Sends the invites to subscribe at one specific class by giving its id and students' email (the invites are sent by the teacher).",
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
        summary: "Returns invites",
        description: "Returns the list of invites sent by the user.",
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
        description: "Accepts the invite to the classroom by giving its id.",
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
        description: "Rejects the invite by giving its id.",
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
        description: "create a new course with a name, a short description, a cover image (it's not mandatory) and the subject that the course talks about (Chemistry, Electrical engineering, English, Informatics, mathematics and statistics).",
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
                    enum:["Chemistry", "Electrical engineering", "English", "Informatics", "Mathematics", "Statistics"],
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
        description: "Returns data about courses in which the user partecipates",
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
        description: "Changes the name and/or the subject of the course by giving its id.",
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
                    enum:["Chemistry", "Electrical engineering", "English", "Informatics", "Mathematics", "Statistics"],
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
        description: "Deletes the course by giving its id.",
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
        description: "Create a new unit in the specified course with a name and a description by giving the course id.",
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
        description: "Gives the units information (id, course id, sequence number, course name, description and informations about lessons ) of the specified course by giving its id.",
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
        description: "Alters the specified unit with a new course id and sequence number",
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
            description: "unit id",
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
                  seqNumber: {
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
        description: "Deletes the unit by giving its id and the course id that contains the unit.",
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

    //LESSONS
    "/lessons": {
      post: {
        tags: ["lessons"],
        summary: "Create lesson",
        description: "Create a new lesson with the course id that contains it, the unit id, name, video link on youtube and the quiz.",
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
        description: "Gives lessons informations (lesson id, unit id, sequence number, name, creation date, video link and quiz) about the specified lesson by giving the unit id.",
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
        summary: "Changes the lesson",
        description: "Alters lesson parameters (course id, unit id and name) by giving the lesson id.",
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
            description: "lesson id",
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
        description: "Deletes the lesson by giving its id and unit id.",
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

    //SUBSCRIBE
    "/subscribe": {
      post: {
        tags: ["subscribe"],
        summary: "Subscription to a course",
        description: "Subscription made by a user to a course by giving course id.",
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
        description: "Gives the subscription by giving email",
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
        tags: ["subscribe"],
        produces: ["application/json"],
        summary: "Deletes subscription",
        description: "Cancels the subscription to the specified course by giving its id.",
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