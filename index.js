var express = require('express');
var path = require('path');
var app = express();
var port = 3700;

//// templates live here
//app.set('views', __dirname + '/templates');
// statics
app.use(express.static(path.join(__dirname, 'public')));
//app.set(express.static(__dirname + '/public'));
//app.set('view engine', 'jade');
//app.engine('jade', require('jade').__express);


// define usernames
var usernames = {};

// define rooms
var rooms = ['Calculus', 'Discrete Mathematics', 'Logic'];


// routes
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// socket
var io = require('socket.io').listen(app.listen(port));

// define events
io.sockets.on('connection', function (socket) {
    
    // when clients emit...

    socket.on('sendchat', function(data) {
        io.sockets.to(socket.room).emit('updatechat', socket.username, data);    
    });
    
    socket.on('adduser', function(username) {
        socket.username = username;
        socket.room = 'Calculus';
        usernames[username] = username;
        socket.join('Calculus');
        socket.emit('updatechat', 'SERVER', 'You have connected to Calculus.');
        // broadcast to all users
        socket.broadcast.to('Calculus').emit('updatechat', 'SERVER', username + ' has connected.');
        // update list client side
        io.sockets.emit('updateusers', usernames);
        socket.emit('updaterooms', rooms, 'Calculus');
    });
    
    socket.on('switchroom', function (newroom) {
        socket.leave(socket.room);
        socket.join(newroom);
        socket.emit('updatechat', 'SERVER', 'You have connected to ' + newroom + '.');
        socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username + ' has left the room.');
        socket.room = newroom;
        socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username + ' has joined the room');
        socket.emit('updaterooms', rooms, newroom);
        
    });
    
    // sad panda is sad with this event
    socket.on('disconnect', function() {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        // broadcast
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected.');
        socket.leave(socket.room);
    });
    
});

console.log('Listening...');
