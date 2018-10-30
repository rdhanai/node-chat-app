var socket = io();


function scrollToBottm(){
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}   
socket.on('connect', function(){
    console.log('connected to server');
    var params =  jQuery.deparam(window.location.search);
    socket.emit('join', params, function (errors){
        if (errors){
            alert(errors);
            window.location.href = '/';
        } else {
            console.log('no erros');
        }

    })
});
socket.on('disconnect', function() {
    console.log('disconnected from server');
});

socket.on('updateUserList', function(users){
    console.log('users list', users);
    var ol = jQuery("<ol></ol>");

    users.forEach(function (user){
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery("#users").html(ol);

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
    scrollToBottm();
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
    scrollToBottm();

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
             id: socket.id,
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


