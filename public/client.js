var socket = io.connect('http://localhost:3700');


// get elements
var users = document.getElementById('users');
var conversation = document.getElementById('conversation');
var btnsend = document.getElementById('datasend');

socket.on('connect', function () {
    socket.emit('adduser', prompt('Set your username'));
});

socket.on('updatechat', function (username, data) {
    conversation.innerHTML += '<b>' + username +  ': </b>' + data + '<br />';
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"conversation"]);
    
});

socket.on('updateusers', function (data) {
    users.innerHTML = "";
    console.log('asfsdaf user');
    for (var user in data) {
        users.innerHTML += "<div>" + data[user] + "</div>";
    }
});

window.onload = function () {
    btnsend.addEventListener('click', function () {
        console.log('asfsd');
        socket.emit('sendchat', document.getElementById('data').value);
        document.getElementById('data').value = '';
                    
    }, false);
    
    var txt = document.getElementById('data');
    
    txt.addEventListener('keypress', function (e) {
        if (e.keyCode == 13) {
            btnsend.click();
        }
        
    }, false)
            
            
}  
    
    

    