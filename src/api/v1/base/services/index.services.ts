// Generic DB services modules
import { PrismaClient } from '@prisma/client'

// Default connection
export const pc = new PrismaClient()

// Start DB function
export function startDB() {
    return new PrismaClient()
    // { log: ['query']}
}

export default pc

