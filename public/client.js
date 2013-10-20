var socket = io.connect('http://localhost:3700');


// get elements
var users = document.getElementById('users');
var rooms_list = document.getElementById('rooms');
var conversation = document.getElementById('conversation');
var txt = document.getElementById('data');
var btnsend = document.getElementById('datasend');


socket.on('connect', function (exists) {
    var username = null;
    console.log(exists);
    while (username == null) {
        if (exists) {
            username = prompt('The username is taken. Please, choose another.');
        } else {
            username = prompt('Set your username');
        }
        
    }
    socket.emit('adduser', username);
});


socket.on('updatechat', function (username, data) {
    conversation.innerHTML += '<b class="user">' + username +  ': </b><span class="message">' + data + '</span><br />';
    // update MathJax with new DOM elements
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"conversation"]);
    document.getElementById('content').scrollTop = document.getElementById('content').scrollHeight;
    
});


socket.on('updaterooms', function (rooms, current_room) {
    console.log('Updating rooms');
    rooms_list.innerHTML = "";
    console.log(rooms);
    for (var room in rooms) {
        if (rooms[room] == current_room) {
            rooms_list.innerHTML += '<div><b>' + rooms[room] + '</b></div>';
        } else {
            rooms_list.innerHTML += '<div><a href="#" onclick="switchRoom(\''+rooms[room]+'\')">' + rooms[room] + '</a></div>';
        }
    }
});


socket.on('updateusers', function (data) {
    users.innerHTML = "";
    for (var user in data) {
        users.innerHTML += "<div class='user'>" + data[user] + "</div>";
    }
});


function switchRoom(room) {
    console.log('Changing room');
    socket.emit('switchroom', room);
}


window.onload = function () {
    btnsend.addEventListener('click', function () {
        console.log('asfsd');
        socket.emit('sendchat', document.getElementById('data').value);
        document.getElementById('data').value = '';
                    
    }, false);
    
    txt.addEventListener('keypress', function (e) {
        if (e.keyCode == 13) {
            btnsend.click();
        }
        
    }, false)  
            
}  
    
    

    