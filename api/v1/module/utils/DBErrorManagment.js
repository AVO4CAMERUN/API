// Module for handling and logging in file

const winston = require("winston");
const { Prisma } = require('@prisma/client')

// Error level
const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3
}

// Object for logging error
const logger = winston.createLogger({
    levels: logLevels,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: './log/error.log', level: 'error' })
    ]
})

function error(err) {}

// Functions for handling app error and find problems
// Receve prisma code and log in file
// Type error code prisma:
    // Common                                   P1
    // Prisma Client (Query Engine)             P2
    // Prisma Migrate (Migration Engine)        P3
    // prisma db pull (Introspection Engine)    P4
function errorManagment(endpoint, res, error) {
    // Prisma class error 
    const errClasses = [
        Prisma.PrismaClientKnownRequestError,
        Prisma.PrismaClientUnknownRequestError,
        Prisma.PrismaClientRustPanicError,
        Prisma.PrismaClientInitializationError,
        Prisma.PrismaClientValidationError
    ]

    // Add error log
    let flag = false
    for (const obj of errClasses) {
        if (error instanceof obj) {
            logger.log({
                level: 'error',
                endpoint,
                message: new obj()[Symbol.toStringTag]
            })
            flag = false
        } else {
            flag = true
        }
        
    }

    // Aggiungere timestamp
    if (flag) logger.log({ level: 'error', endpoint, message: 'undefined error' })

    // Error response
    if (typeof error !== 'object') res.sendStatus(error) 
    else res.sendStatus(500)
    
}

// Export functions 
module.exports = {
    errorManagment
}

// https://www.prisma.io/docs/reference/api-reference/error-reference
// https://www.npmjs.com/package/winston
// https://blog.appsignal.com/2021/09/01/best-practices-for-logging-in-nodejs.html