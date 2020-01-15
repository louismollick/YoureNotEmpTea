const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');
const login = require('./routes/login');
const User = require('./models/User');

// Express setup
const app = express();
app.use(express.json());
app.use('/api/', login);

// Load env variables
require('dotenv-flow').config();

// Serve static assets if in production & set env vars
if (process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}
const port = process.env.PORT || 5000;

// Database connection
const db = process.env.MONGO_URI;
mongoose.connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Socket.io connection
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

const players = {};

io.use((socket, next) => {
    const { id, token } = socket.handshake.query;
    if (id && token){
        User.findOne({ id }) // Compare token
        .then(user => {
            if(!user) return next(new Error('User does not exist'));
            // Validate password
            bcrypt.compare(token, user.token)
            .then(isMatch => {
                if(!isMatch) return next(new Error('Token is incorrect'));
                // If another instance is online, kick it
                Object.keys(players).forEach((socketid) => {
                    if (players[socketid].discordId === id)io.sockets.connected[socketid].disconnect(true);
                });
                return next();
            })
        });
    } 
    return next(new Error('Authentication error'));
});

io.on('connection', (socket) => {
    console.log(`A user connected with socket id ${socket.id} and discord id ${socket.handshake.query.id}`);
    players[socket.id] = {
        x: Math.floor(Math.random() * 400) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        dir: 'down',
        playerId: socket.id,
        discordId: socket.handshake.query.id,
    };
    // send the players object to the new player
    socket.emit('currentPlayers', players);

    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);

    // when a player disconnects, remove them from our players object
    socket.on('disconnect', () => {
        console.log('User disconnected: ', socket.id);
        delete players[socket.id];
        // emit a message to all players to remove this player
        io.emit('playerDisconnect', socket.id);
    });
     
    // when a plaayer moves, update the player data
    socket.on('playerMovement', (movementData) => {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        players[socket.id].dir = movementData.dir;
        // emit a message to all players about the player that moved
        socket.broadcast.emit('playerMoved', players[socket.id]);
    });
});

server.listen(port, () => console.log(`Server started on port ${port}`));