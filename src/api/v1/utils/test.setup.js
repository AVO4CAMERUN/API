// Setup test in singole file
import { pc } from "./main.services" 
import { startDB } from "./main.services"

// Functions to build DB
async function buildDB(connection) {
    
}

// Functions to delete all record on tables
async function clearAllTables(connection) {
   //  const array;

}

// Functions to delete all tables on DB
async function dropAllTables(connection) {
    
}

// Main function to setup DB on jest test 
function setupDB() {

    // Setup models
    let connection

    // Connect to connection
    beforeAll(async () => connection = startDB())

    // Cleans up database between each test
    afterEach(async () => await clearAllTables(connection))

    // Disconnect connection
    afterAll(async () => await dropAllTables(connection))
}

export { setupDB }  