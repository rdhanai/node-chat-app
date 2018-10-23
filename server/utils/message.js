const moment = require('moment');

var generateMessage = function (from, text) {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    }
}
var generateLocationMessage = function (from, latitude, longitude) {
    return {
        from,
        createdAt: moment().valueOf(),
        url: `https://www.google.com/maps?q=${latitude},${longitude}`
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}
