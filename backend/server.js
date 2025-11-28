const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "http://localhost:3000" } });

app.use(cors());
app.use(express.json());

// MongoDB connection with error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.log('MongoDB connection failed:', err.message);
    console.log('Running without database - some features may not work');
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/userLocation'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/news', require('./routes/news'));
app.use('/api/helpdesk', require('./routes/helpdesk'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/innovations', require('./routes/innovations'));
app.use('/api/ml', require('./routes/mlAnalysis'));

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Socket.IO
io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('disconnect', () => console.log('User disconnected'));
});

// Make io available to routes
app.set('io', io);

// Start data aggregation
require('./services/dataAggregator')(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});