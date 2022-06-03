// Setup test in singole file
import "dotenv/config"
import { pc } from "./connection.services"
import { jest } from '@jest/globals';
import { mockDeep, mockReset } from 'jest-mock-extended'


/*jest.mock('./main.services', () => ({
    __esModule: true,
    default: mockDeep()
}))
*/
// SetupDB to jest test 
function setupTest() {

    // Drop mock each test
    //beforeEach(() => {
        // mockReset(pc)
    // })

}

export { setupTest }
export default setupTest
/* 
    This file is a config setup, the best practices guided

*/