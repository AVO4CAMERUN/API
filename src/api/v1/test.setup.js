// Setup test in singole file
import "dotenv/config"
import { startDB } from "./utils/main.services"

// Const env
const DB = process.env.DATABASE_NAME

// Get list name tables
async function getTableNames(connection) {
    return (await connection.$queryRaw`SHOW TABLES`).map(o => o[`Tables_in_${DB}`])
}

// Delete all record on tables
async function clearAllTables(connection) {
    (await getTableNames(connection))
        .forEach(async table => await connection[table].deleteMany({}));
}

// SetupDB to jest test 
function setupTest() {

    // Setup models
    let connection;

    // Connect to connection
    beforeAll(async () => connection = startDB())

    // Cleans up database between each test
    afterEach(async () => await clearAllTables(connection))

    // Disconnect connection
    afterAll(async () => connection.$disconnect())
}

export { setupTest }
export default setupTest
/* 
    This file is a config setup, the best practices guided

*/