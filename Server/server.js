const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http'); // Required for Socket.io integration
const { Server } = require('socket.io'); // Import Socket.io
const db = require('./config/db'); // Import your database configuration
const drugRoutes = require('./routes/drugRoutes');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const stockRoutes = require('./routes/stockRoutes');
const paymentRoutes = require('./routes/paymentRoute');
const opdroutes = require('./routes/opdRoute');
const userRoutes = require('./routes/userRoutes');

// const authMiddleware = require('./middlewares/authMiddleware');
const app = express();
const port = 5000;
const server = http.createServer(app);

// Initialize Socket.io server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(bodyParser.json());
app.use(cors());
app.use('/api', drugRoutes);
app.use('/opd', opdroutes);
app.use('/patient', (req, res, next) => {
  req.io = io; // Attach io to req for use in routes
  next();
}, patientRoutes);
app.use('/payment', paymentRoutes);
app.use('/user', userRoutes);

app.use('/stock', stockRoutes);
// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth', authRoutes);


// Export the Socket.io instance for other files to use
module.exports = { db, io };

// app.use('/api/protected', authMiddleware, drugRoutes);
// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Example: Listen for a custom event
  socket.on('exampleEvent', (data) => {
    console.log('Received event:', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});