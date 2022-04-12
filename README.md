# AVO4CAMERUN API BACK-END
![logo](/assets/img/logo_esteso_white.png")

## TDTR;

## What?
Avo4Camerun is a project that aims to help a Cameroonian school by making video lessons and sharing them via the online e-learning platform we are developing.
The project is born from a collaboration between the public technical school “Amedeo Avogadro” of Turin and the no-profit organisation “Sermig”, also in Turin.

**ADD: Alcune delle sfide che hai dovuto affrontare e le funzionalità che speri di implementare in futuro.**

## Why?
We are a group of electrotechnics and computer science students that, with our teachers’ and Sermig’s aid, decided to share with the Cameroonian students what we normally learn at school here in Italy.

We all study at “Amedeo Avogadro” technical high school, in Turin, our ages range from 17 to 20 and we all agreed when one of our teachers, Alfonso Carlone, offered us to take on this project. 

We decided to team with the “ReTe” project because we all think that knowledge should be accessible to everyone, everywhere.

### What’s Sermig and project “ReTe”?
Sermig is a no-profit organization that helps whoever needs, it’s founded in 1964 in Turin by Ernesto Olivero whose goal was to “end world hunger”, and even if nowadays that dream is still far away Sermig has grown a lot ever since.

<p align="center">
 <img style="margin-block: auto;" width="460" height="300" src="/assets/img/docs/sermig.jpg" />
</p>

Today Sermig has four seats (two in Italy, one in Brazil and one in Jordan) and its volunteers are scattered all over the world. 
One of the many projects that Sermig is taking on is called “ReTe” that stands for “Restituzione Tecnologica” (Technology Sharing) and its objective is to teach in less developed countries the notions that we often give for granted but that could really help them in their situation. 
For more info: [sermig](https://en.sermig.org/)

## How?
Perché hai usato le tecnologie che hai usato?

## Technology
The we app is based on a client-server structure, the server is made with node.js, the database is a SQL structured DB made with MySQL.
The front end uses the server's exposed service via rest api endpoint.
We also used Docker to divide in containers all the different parts that will be installed on the hosting device.

![deployment diagramm](/assets/img/docs/deployment.png)

###  Project Structure
The Structure about AVO4CAMERUN project is very simple, it's consist of DBservices, Routers, Validator, Utils.
The main file is server.js, it call whole app and listen http request.
To find out more, consult the files in repo😁.

### Modules
These modules will be installed for the project to work properly:

- [node.js](https://nodejs.org/en/)                                         - evented I/O for the backend
- [express](https://expressjs.com/)                                         - fast node.js network app framework
- [cors](https://www.npmjs.com/package/cors)                                - module to use cors (cross origins)
- [body-parser](https://www.npmjs.com/package/body-parser)                  - module to analyze http body 
- [express-validator](https://express-validator.github.io/docs/)            - module to valiadte and sanitize input received on http
- [dotenv](https://www.npmjs.com/package/dotenv)                            - module to configure env data 
- [js-sha256](https://www.npmjs.com/package/js-sha256)                      - module to hashing
- [googleapis]()                                                            - module to use google cloud services
- [prisma.io](https://prisma.io)                                            - ORM/ODM library
- [jwt](https://www.npmjs.com/package/jsonwebtoken)                         - simple implementation of JWT standard
- [nodemailer](https://nodemailer.com/about/)                               - module to sending email (SMTP use)
- [winston](https://www.npmjs.com/package/winston)                          - module to create very good logger of app problems
- [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc)              - module to read swagger json  
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)    - module to genarete swagger ui from swagger json  

### How to install and execute
After installing the js node and installing mysql we will execute these commands on the project folder:

1. npm init 
2. npm @prisma/client body-parser cors dotenv express express-validator googleapis js-sha256 jsonwebtoken nodemailer swagger-jsdoc swagger-ui-express winston
3. npx prisma db push
3. node server.js

## Swagger docs
The api design is here:
[Swagger docs](https://app.swaggerhub.com/apis/AVO4CAMERUN/all/1.0.0)

## I badge

## References
[Abstract](https://avo4camerun.notion.site/avo4camerun/Avo4Camerun-ae70fa72aac8463d94213ae11600e5a3)
[PM Teams](https://www.google.com/url?sa=i&url=https%3A%2F%2Fanimalcrossing.fandom.com%2Fwiki%2FPietro&psig=AOvVaw2pddyWrd7AelO70VQwvIxv&ust=1649862741955000&source=images&cd=vfe&ved=0CAoQjRxqFwoTCLiGov3njvcCFQAAAAAdAAAAABAD)