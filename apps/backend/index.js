const express = require('express');
const cors = require('cors');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    pingTimeout: 6000,
    cors: cors()
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello there');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(socket.id);

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });

    socket.on('message', (content) => {
        if(content.message === 'ping') {
            let returnContent = {message: 'pong', sender: 'Server'};
            socket.emit('message', returnContent);
        } else {
            let returnContent = {message: content.message, sender: content.sender};
            socket.broadcast.emit('message', returnContent);
        }
    })
});

http.listen(3001, () => {
    console.log('Running');
});