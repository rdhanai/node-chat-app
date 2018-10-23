const moment = require('moment');
var date = new moment();
var time = date.format('LT');
console.log('current time:', time);