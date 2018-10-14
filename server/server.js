const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const path = require('path');
const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

var io = socketIO(server);

io.on('connection', (socket)=>{
    console.log('new user connected..');
    socket.on('disconnect', ()=>{
        console.log('disconnted from client');
    });
});


app.use(express.static(publicPath));
console.log('hi', publicPath);
server.listen(port, () => {
    console.log('app is up and running on port' +  port);
});

