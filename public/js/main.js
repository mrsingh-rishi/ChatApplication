const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages'); 
const socket = io();

// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submits

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //Get Message text
    const msg = e.target.elements.msg.value;
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
    div.innerHTML = `<p class="meta">Mary <span>9:15pm</span></p>
    <p class="text">
        ${message};
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}