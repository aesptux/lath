var socket = io.connect('http://localhost:3700');


// get elements
var users = document.getElementById('users');
var rooms_list = document.getElementById('rooms');
var conversation = document.getElementById('conversation');
var txt = document.getElementById('data');
var btnsend = document.getElementById('datasend');

socket.on('connect', function () {
    socket.emit('adduser', prompt('Set your username'));
});

socket.on('updatechat', function (username, data) {
    conversation.innerHTML += '<b>' + username +  ': </b>' + data + '<br />';
    // update MathJax with new DOM elements
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"conversation"]);
    
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
    console.log('asfsdaf user');
    for (var user in data) {
        users.innerHTML += "<div>" + data[user] + "</div>";
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
    
    

    