// Lesson DB services modules

const { createGET, pc } = require('./query-generate.services'); 

// Query for create quiz result
async function addResult () {
    return await pc.quiz_result.create({
        data: { }
    })
}

// Query for
async function getResultByFilter (filter) {

    // metter logica qui
    const obj = createGET('quiz_result', ['*'], filter)
    const { qf, where} = obj
    return await qf({ where })
}

// Query for
async function delateResult () {
    return await pc.quiz_result.create({
        data: { }
    })
}

// Export functions 
module.exports = {
    addResult,
    getResultByFilter,
    delateResult
}