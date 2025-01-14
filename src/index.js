require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const errorHandler = require('./middlewares/errorHandler');

// Connect to the database
connectDB();

const app = express();

// Create HTTP Server and integrate Socket.IO
const server = http.createServer(app);
const io = socketIo(server);

// Attach the Socket.IO instance to the app for use in controllers
app.set('io', io);

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('A user connected to Socket.IO');

  socket.on('disconnect', () => {
    console.log('A user disconnected from Socket.IO');
  });
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Blue Collar Jobs API');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handling Middleware - this should be the last middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
