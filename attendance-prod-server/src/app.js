const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const employeeRoutes   = require('./routes/employees_routes');
const shiftRoutes      = require('./routes/shifts_routes');
const productRoutes    = require('./routes/products_routes');
const attendanceRoutes = require('./routes/attendance_routes');
const productionRoutes = require('./routes/productions_routes');
const adminRoutes      = require('./routes/admin_routes');
const rfidRoutes       = require('./routes/rfid_routes');
//const statsRoutes      = require('./routes/stats');
//const reportsRoutes    = require('./routes/reports');

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/employees', employeeRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/products', productRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rfid', rfidRoutes);
//app.use('/stats', statsRoutes);
//app.use('/reports', reportsRoutes);
let rfidMode = "attendance";
app.set('rfidMode', rfidMode);


// Create HTTP server & Socket.IO
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Make io available to controllers
app.set('io', io);

module.exports = { app, server };
