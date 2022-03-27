// Module for handling and logging in file

// https://www.prisma.io/docs/reference/api-reference/error-reference
// https://www.npmjs.com/package/winston
// https://blog.appsignal.com/2021/09/01/best-practices-for-logging-in-nodejs.html

const winston = require("winston");

// 
const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
}

// 
const logger = winston.createLogger({
    levels: logLevels,
    transports: [new winston.transports.Console()]
})

// logger.fatal

// Functions for handling app error and find problems
// Receve prisma code and log in file
function errorManagmentAndLogger(errorCode) {
    // Type error code prisma:
    // Common                                   P1
    // Prisma Client (Query Engine)             P2
    // Prisma Migrate (Migration Engine)        P3
    // prisma db pull (Introspection Engine)    P4
    switch (errorCode) {
        case '': break;
        default:  
    }
}

// Export functions 
module.exports = {
    logger,
    errorManagmentAndLogger
}
