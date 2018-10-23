var socket = io();
socket.on('connect', function(){
    console.log('connected to server');
});
socket.on('disconnect', function() {
    console.log('disconnected from server');
});

socket.on('newMessage', function(data) {
    var formattedTime = moment(data.createdAt).format('h:mm a');
    var template =  jQuery('#message-template').html();
    var html = Mustache.render(template, {
        message: data.text,
        from: data.from,
        createdAt: formattedTime
    });
    var messages = jQuery('#messages');
    messages.append(html);
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });
    var messages = jQuery('#messages');
    messages.append(html);

    // var formattedTime = moment(message.createdAt).format('h:mm a');
    // var li = jQuery('<li></li>');
    // var anchor = jQuery('<a target="_blank">My Current Location</a>');
    // li.text(`${message.from} ${formattedTime}: `);
    // anchor.attr('href', message.url);
    // li.append(anchor);
    // var messages = jQuery('#messages');
    // messages.append(li);
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
        if (!messageTextBox.val()){
            return;
        }
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


