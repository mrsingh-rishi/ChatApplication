const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages'); 
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room fron URL

const {username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// console.log(username, room);


const socket = io();
socket.emit('joinRoom', {username, room})

// Get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUser(users);
})

// Message from server
socket.on('message', message => {
    // console.log(message);
    outputMessage(message)

    // Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submits

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    //Get Message text
    const msg = e.target.elements.msg.value
    // console.log(msg);
    // EMIT message to server
    socket.emit('chatMessage', msg);
    //Clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus();

})

// Output Message to DOM

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text} 
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


// Add room name to DOM

function outputRoomName(room){
    roomName.innerText = room;
}

// Add users to room 

function outputUser(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}