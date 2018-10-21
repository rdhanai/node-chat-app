const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;


const app = express();
app.use(express.static(publicPath));
const server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket)=>{
    console.log('new user connected..');

    const welcomeMsg = generateMessage('Admin', 'Welcome to chat app');
    socket.emit('newMessage', welcomeMsg);

    const userjoinedMsg = generateMessage('Admin', 'new user joined');
    socket.broadcast.emit('newMessage', userjoinedMsg);

    socket.on('disconnect', ()=>{
        console.log('disconnted from client');
    });

    socket.on('createMessage', (message, callback)=> {
        console.log('createMessage', message);
        // if (!message.from || !message.text) {
        //    socket.emit()     
        // }
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
        // socket.broadcast.emit('newMessage', generateMessage(message.from, message.text));
    });
});

server.listen(port, () => {
    console.log('app is up and running on port' +  port);
});

