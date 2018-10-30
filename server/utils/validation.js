var isRealString = function (str){
    return str && str.trim().length > 0 && typeof str === 'string';
}

module.exports = {
    isRealString
}