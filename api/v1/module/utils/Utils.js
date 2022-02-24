// Module for utils functions

// Get string date yyyy-mm-gg 
function getDateString(){
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
}

// Get array from string 
function strToArray(str){
    str = str.substring(1, str.length-1)
    return str.split(',')
}

// Export functions
module.exports = {
    getDateString,
    strToArray
}


