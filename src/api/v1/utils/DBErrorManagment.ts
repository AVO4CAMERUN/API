// Module for handling and logging in file

import { createLogger, format, transports } from 'winston'
const { combine, timestamp, label, json } = format
import * as Prisma from '@prisma/client'

// Error level
const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3
}

// Object for logging error
const logger = createLogger({
    levels: logLevels,
    format: combine(
        label(),
        timestamp(),
        json()    
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: './log/error.log', level: 'error'})
    ]
})

// Functions for handling app error and find problems
// Receve prisma code and log in file
// Type error code prisma:
    // Common                                   P1
    // Prisma Client (Query Engine)             P2
    // Prisma Migrate (Migration Engine)        P3
    // prisma db pull (Introspection Engine)    P4

// Add IP richieta e dati geografici (per retropsettive su errori)
function errorManagment(endpoint, res, error) {
    console.log(error);
    // Prisma class error 
    /*const errClasses = [
        /*Prisma.PrismaClientKnownRequestError,
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
    */
    // Error response
    // if (error instanceof Error) res.sendStatus(+error.message)
    res.sendStatus(500)
}

// Export functions 
export { errorManagment }