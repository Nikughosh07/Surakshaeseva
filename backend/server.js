const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// make sure uploads directory exists for photo uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const coordinationRoutes = require('./coordination');
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: "https://suraksha-e-seva-frontend.onrender.com", // Your specific frontend URL
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/coordination', coordinationRoutes);

// serve uploaded files (photos for missing persons, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/alerts/broadcast', (req, res) => {
  const { message, severity } = req.body;

  // Emit the event to all connected clients
  io.emit('broadcast-alert', {
    message,
    severity,
    timestamp: new Date()
  });

  res.status(200).json({ status: "Broadcast Sent" });
});

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://nikughoshx_db_user:zlxATZEWqjFR7VB7@nikuserver.lvltvoa.mongodb.net/disaster-relief';
console.log('🗄️  Server connecting to MongoDB at', mongoUri);
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('User connected to crisis feed');

  // Listen for inventory updates from the field
  socket.on('update-inventory', (data) => {
    // Broadcast this change to all active coordinators
    socket.broadcast.emit('inventory-alert', {
      campId: data.campId,
      message: `Alert: ${data.item} level changed at ${data.campName}`
    });
  });
});

// In production we may build the React frontend and serve it from here
const buildPath = path.join(__dirname, '../frontend/build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
