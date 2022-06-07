// Setup test in singole file
import prisma from "../services/index.services"

// Functions to delete all documets on collections
async function clearAllTable() {
    // Get all
    const response: any[] = await prisma.$queryRaw`SHOW TABLES`
    const tables = response.map((obj) => { for (const key in obj) return obj[key] })

    //
    const acks = tables.map((table) => prisma[table].deleteMany())

    // console.log(acks)
    await prisma.$transaction(acks)
    await prisma.$disconnect()
}

// Functions to delete all collections on BD
async function dropAllTable(connection) { }

// Main function to setup DB on jest test 
function setupDB() {
    // jest.useFakeTimers()
    jest.setTimeout(10000)

    // Cleans up database between each test
    beforeAll(async () => await clearAllTable())


}

export default setupDB 