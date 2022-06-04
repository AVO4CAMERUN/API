// Utils valdatios module
function customCheckArrayInGET (value, message) {
    let array = []
    if (value !== undefined) {
        array = JSON.parse(value)

        // Check is array is isno't nont undefined 
        if (!Array.isArray(array) || array.length === 0) 
            return Promise.reject(message)
    }
    return true
}

export { customCheckArrayInGET }