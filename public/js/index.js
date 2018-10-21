var socket = io();
socket.on('connect', function(){
    console.log('connected to server');
});
socket.on('disconnect', function() {
    console.log('disconnected from server');
});

socket.on('newMessage', function(data) {
    console.log('new message..', data);
    var li = jQuery('<li></li>');
    li.text(`${data.from}: ${data.text}`);
    var messages = jQuery('#messages');
    messages.append(li);
});

// socket.emit('createMessage', {
//     from: 'Frank',
//     text: 'Hi from Frank'
// }, function(){
//     console.log('got it');
// });

jQuery('#message-form').on('submit', function(e){
        e.preventDefault();
        socket.emit('createMessage', {
             from: 'User',
             text: jQuery('#message').val()   
        }, function (){

        });
});