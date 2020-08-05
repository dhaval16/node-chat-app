const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateMessageLocation }=require('./utils/messages');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { adduser,getUserInRoom,getUser,removeUser} = require('./utils/users');
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('join',(options,callback)=>{
        const { error,user }=adduser({ id:socket.id , ...options })
        if(error)
        {
            return callback(error); 
        }
        console.log("room = ",user.room);
        socket.join(user.room);

        socket.emit('message', generateMessage('Admin','Welcome!'));
        socket.broadcast.to(user.room).emit('message', generateMessage(user.username,`${user.username} has joined!`));
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserInRoom(user.room)
        })

        callback()

        //socket.emit,io.emit,socket.brodcast
        //io.to.emit,socket.brodcast.to.emit
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();
        const user = getUser(socket.id);
        // const rooms = getUserInRoom(user.room);
        // console.log(rooms[0].room);
        //console.log(room);
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username,message));
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id);
        // const rooms = getUserInRoom(user.room);
        io.to(user.room).emit('locationMessage', generateMessageLocation(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        console.log(user);
        if(user)
        {
            console.log(user[0].room);
            io.to(user[0].room).emit('message', generateMessage('Admin ',`${user[0].username} has left`));
            io.to(user[0].room).emit('removeData',{
                room:user[0].room,
                users:getUserInRoom(user[0].room) 
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
// const path = require('path');
// const express = require('express');
// const http= require('http');
// const socketio = require('socket.io');
// const Filter = require('bad-words');
// const app = express();
// const server= http.createServer(app);
// const io = socketio(server);

// const port = 3000 || process.env.PORT;
// const publicDirectoryPath = path.join(__dirname, '../public');

// app.use(express.static(publicDirectoryPath));

// // let count = 0;

// io.on('connection',(socket)=>{
//     console.log('New WebSocket Connection');
//     socket.emit('message','welcome!');
//     // socket.emit('countUpdated',count);
//     socket.broadcast.emit('message','A New User Joined!');
//     socket.on('sendMessage',(msg, callback)=>{
//         const filter = new Filter();
//         if(filter.isProfane(msg))
//         {
//             return callback('Profane is not allowed');
//         }
//         io.emit('message',msg);
//         //callback()
//     })    
//     socket.on('sendLocation',(l, callback)=>{
//         io.emit('message','https://www.google.com/maps?q='+l.latitude+','+l.longitude)
//         callback
//     })
//     socket.on('disconnect',()=>{
//         io.emit('message','A User Left');
//     });
   
//     // socket.on('increment',()=>{
//     //     count++;
//     //     //socket.emit('countUpdated',count);
//     //     io.emit('countUpdated',count);
//     // })
// })

// server.listen(port,()=>{
//     console.log('Server Running '+port);
// });