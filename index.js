var express = require('express');
var path = require('path');
var mysql = require('mysql');    
//var mustache = require("mustache");
var app = express();
var port = 3700;


// statics
app.use(express.static(path.join(__dirname, 'public')));

// define usernames
var usernames = {};

// define rooms
var rooms = ['Calculus', 'Discrete Mathematics', 'Logic'];

var connection = mysql.createConnection({
  host     : '',
  user     : '',
  password : '',
  database : 'lath'
});

connection.connect();


// routes
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});
//app.get('/log', function (req,res) {
//    var html = "";
//    connection.query('SELECT username, message FROM chat_log', function(err, rows, fields) {
//        if (err) throw err;
//        query = rows;
//        console.log(rows[0].username);
//        for (var row in rows) {
//            html += "<div><b>" + rows[row].username + ":</b>" + rows[row].message + "</div>";    
//        }
//        
//        res.send(html);
//    });
//    
//});

// socket
var io = require('socket.io').listen(app.listen(port));


// define events
io.sockets.on('connection', function (socket) {
    
    // when clients emit...

    socket.on('sendchat', function(data) {
        io.sockets.to(socket.room).emit('updatechat', socket.username, data);  
        data = data.replace(/\\/g, '\\\\');
        connection.query('INSERT INTO chat_log(username, message, room) VALUES ("' + socket.username + '", "' + data + '", "' + socket.room + '")', function(err, rows, fields) {
          if (err) throw err;
        });
        
    });
    
    socket.on('adduser', function(username) {
        socket.username = username;
        if (usernames[socket.username]) {
            socket.emit('connect', true);
            return 0;
        }
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
