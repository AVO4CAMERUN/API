// Lesson DB services modules

const { createGET, pc } = require('./query-generate.services'); 

// Query for create quiz result
async function addResult (id_lesson, email, numCorrect, numWrong) {
    return await pc.quiz_result.create({
        data: { id_lesson, email, numCorrect, numWrong }
    })
}

// Query for result by filter (in class)
async function getResultByFilter (filter) {

    // metter logica qui
    const obj = createGET('quiz_result', ['*'], filter)
    const { qf, where} = obj
    return await qf({ where })
}

// Query for delete old result
async function delateResult () {
    return await pc.quiz_result.delete({
       where: {}
    })
}

// Export functions 
module.exports = {
    addResult,
    getResultByFilter,
    delateResult
}