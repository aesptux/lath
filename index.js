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
        io.sockets.emit('updatechat', socket.username, data);    
    });
    
    socket.on('adduser', function(username) {
        socket.username = username;
        usernames[username] = username;
        socket.emit('updatechat', 'SERVER', 'You have connected.');
        
     
    });
    
});

console.log('Listening...');
