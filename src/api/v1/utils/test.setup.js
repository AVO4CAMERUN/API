// Setup test in singole file
import { pc } from "./main.services"
import { startDB } from "./main.services"

// Get list name tables
const getTableNames = async (connection) => (await connection.$queryRaw`SHOW TABLES`).map(o => o["Tables_in_avo4cam"])

// getTableNames(pc).then((e) => console.log(e))

// Functions to build DB
async function buildDB(connection) {
    // execute npx db prisma push
}

// Functions to delete all record on tables
async function clearAllTables(connection) {
    (await getTableNames(connection))
        .forEach(table => await connection[table].deleteMany({}));
}

// Functions to delete all tables on DB
async function dropAllTables(connection) {
    (await getTableNames(connection))
        .forEach(table => await connection.$queryRaw`DROP TABLE ${table}`);
}

// Main function to setup DB on jest test 
function setupTest() {

    // Setup models
    let connection

    // Connect to connection
    beforeAll(async () => {/*connection = startDB()*/})

    // Cleans up database between each test
    afterEach(async () => await clearAllTables(connection))

    // Disconnect connection
    afterAll(async () => await dropAllTables(connection))
}

export { setupTest }  