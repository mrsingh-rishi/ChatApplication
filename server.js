const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')

const app = express();

const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = "ChatCord bot"
// Run when a client connects

io.on('connection', socket => {
    socket.on('joinRoom', ({username,room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        // Welcome Message
        console.log('New Website Connection.....');
        socket.emit('message', formatMessage(botName,"Welcome to ChatCord"));
        
        //Brodcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined the chat`));

        // Send users to room info

        io.to(user.room).emit('roomUsers', {
            room:user.room,
            users: getRoomUsers(user.room)
        })
    })


    // Listen for chatMessage

    socket.on('chatMessage', msg => {
        // console.log(msg);
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username,msg))
    })

    // Runs when client is disconnects

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`));
        
            io.to(user.room).emit('roomUsers', {
                room:user.room,
                users: getRoomUsers(user.room)
            })
        }
    });
})

const PORT = 4000 || process.env.PORT;


server.listen(PORT, () => console.log(`Server Running on port ${PORT}`));