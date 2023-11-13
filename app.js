const { connect } = require('mongoose');
const express = require('express');
require('dotenv').config();
const port = process.env.PORT || 3000;
const { createServer } = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const customerRouter = require('./routes/customer');
const riderRouter = require('./routes/rider');
const ioAuthMiddleware = require('./utils/ioAuthMiddleware');
const shippingModel = require('./models/shippingModel');
const { notificationModel } = require('./models/notifications');
const { connectedUsersModel } = require('./models/connectedUser');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {origin:"*" }
});

io.use((socket, next) => {

  console.log(socket.request)

  const token = socket.request.headers.auth;

  const { error, user } = ioAuthMiddleware(token);

  if (error) return socket.emit('error', "Authentication error");

  socket.request.user = user;
  next();
});

io.on('connection', async(socket) => {
  const socketId = socket.id;
  const userDetails = socket.request.user;

  const nowConnected = await connectedUsersModel.create({
    socketId,
    user: userDetails.userId
  });

  socket.on('update-status', async (payload, callback) => {
    const order = await shippingModel.findById(payload.id);

    if (userDetails.role !== 'rider') return callback({
      successful: false,
      message: 'You-are-not-a-rider'
    });

    if (!order) return callback({
      successful: false,
      message: "Order does not exist"
    });

    if (order.status == payload.newStatus) return callback({
      successful: false,
      message: `status is ${payload.newStatus}`
    });

    if (order.status == 'delivered') return callback({
      successful: false,
      message: 'Order already delivered'
    });

    const orderToEdit = await shippingModel.findByIdAndUpdate(payload.id, {
      status: payload.newStatus,
      riderId: userDetails.userId
    }, { new: true });

    const newNotif = await notificationModel.create({
      message: `Your order ${orderToEdit.itemName} is now ${payload.newStatus}`,
      sendTo: orderToEdit.customerId,
      order: payload.id
    });

    const usersToSendTo = await connectedUsersModel.find({ user: orderToEdit.customerId });

    const userSockets = usersToSendTo.map(user => user.socketId);

    socket.to(userSockets).emit('new-notification', {
      message: newNotif.message
    });

    callback({
      successful: true,
      message: 'order updated successfully'
    });
  });

  socket.on('notifications', async(payload, callback) => {
    const newNotifications = await notificationModel.find({ sendTo: userDetails.userId }).populate('order');
    callback(newNotifications);
  });

  socket.on('disconnecting', async(reason) => {
    await connectedUsersModel.findOneAndDelete({ socketId });
  });
});


const connectDb = mongoose.connect(process.env.MONGODB_URL);

connectDb.then(() =>{
    console.log("Connected to MongoDB");
}).catch((error)=>{
    console.log("Error connecting to database "+ error );
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: '*' }));

app.use('/auth', authRouter);
app.use('/customer/orders', customerRouter);
app.use('/rider/orders', riderRouter);

httpServer.listen(port, () => {
  console.log("Listening on port", port);
});

