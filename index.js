const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const userAuthRoute = require('./routes/auth');
const ordersRoute = require('./routes/order');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Connect to MongoDB 
const connect = mongoose.connect(process.env.MONGODB_URL);

connect.then(() =>{
    console.log("Connected to MongoDB");
}).catch((error)=>{
    console.log("Error connecting to database "+ error );
});


// Express Middleware

app.use(express.json());
app.use(cors()); 


app.use('/v1/auth',userAuthRoute);
app.use('/v1/orders',ordersRoute);



// Socket.io Connection for Real-time Updates
io.on('connection', (socket) => {
    console.log('A user connected');

    // Example: Emit a message to the connected client
    socket.emit('message', 'Welcome to the logistics app!');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
