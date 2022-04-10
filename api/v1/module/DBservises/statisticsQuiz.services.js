// Lesson DB services modules

const { createGET, pc } = require('./query-generate.services'); 

// Query for create quiz result
async function addResult () {
    return await pc.quiz_result.create({
        data: { }
    })
}


// Export functions 
module.exports = {}