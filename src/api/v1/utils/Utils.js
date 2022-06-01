// Module for utils functions
// Get string date yyyy-mm-gg 
function getDateString() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
}

// Get array from string 
function strToArray(str) {
    return str.substring(1, str.length-1).split(',')
}

// Export functions
export default {
    getDateString,
    strToArray
}


