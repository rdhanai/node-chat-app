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

socket.on('newLocationMessage', function (message) {
    var li = jQuery('<li></li>');
    var anchor = jQuery('<a target="_blank">My Current Location</a>');
    li.text(`${message.from}: `);
    anchor.attr('href', message.url);
    li.append(anchor);
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
        var messageTextBox =  jQuery('[name=message]');
        socket.emit('createMessage', {
             from: 'User',
             text: messageTextBox.val()   
        }, function (){
            messageTextBox.val('');
        });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function (){
    if (!navigator.geolocation){
        return alert('geolocation not supported by your browser!')
    } 
    locationButton.attr('disabled', 'disabled').text('Sending Location...');
    navigator.geolocation.getCurrentPosition(function (position){
        locationButton.removeAttr('disabled').text('Send Location');
        console.log(position);
        socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude  
        });
    }, function(error){
        console.log('unable to fetch location.');
        locationButton.removeAttr('disabled').text('Send Location');
    });
});


