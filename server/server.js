const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;


const app = express();
app.use(express.static(publicPath));
const server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket)=>{
    console.log('new user connected..');
    socket.on('disconnect', ()=>{
        console.log('disconnted from client');
    });

    socket.on('createMessage', (message)=>{
        console.log('createMessage', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })
    });

});

server.listen(port, () => {
    console.log('app is up and running on port' +  port);
});

