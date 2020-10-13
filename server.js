const express = require('express');
const ejs = require('ejs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server , {
    debug: true
});



app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/peerjs' ,peerServer);

app.get('/',(req, res)=>{
    res.redirect(`/${uuidv4()}`)
})

app.get('/:roomId',(req,res) => {
    res.render('room', {roomId: req.params.roomId})
})

io.on('connection',socket => {
    socket.on('join-room',(roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected',userId);

        socket.on('message',message => {
            io.to(roomId).emit('createMessage',message)
        })
    })
})


server.listen(process.env.PORT || 3000,function() {
    console.log("Server Started on Port 3000")
});