require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const errorHandler = require('./middlewares/errorHandler');
const initializeSockets = require('./sockets'); // Socket.IO events

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
app.use(express.json()); // Use built-in body parser
app.use(express.urlencoded({ extended: true }));

// Initialize Socket.IO Events
initializeSockets(io);

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Blue Collar Jobs API');
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is healthy', uptime: process.uptime() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handling Middleware - this should be the last middleware
app.use(errorHandler);

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('Server is shutting down...');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
