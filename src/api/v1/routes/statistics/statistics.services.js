// Statistics DB services modules
import { createGET, pc } from "../../base/connection.services.js"

// Query for create quiz result
export async function addResult (id_lesson, email, numCorrect, numWrong) {
    return await pc.quiz_result.create({
        data: { id_lesson, email, numCorrect, numWrong }
    })
}

// Query for result by filter (in class)
export async function getResultByFilter (filter) {

    // metter logica qui
    const obj = createGET('quiz_result', ['*'], filter)
    const { qf, where} = obj
    return await qf({ where })
}

// Query for delete old result
export async function delateResult () {
    return await pc.quiz_result.delete({
       where: {}
    })
}