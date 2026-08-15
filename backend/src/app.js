const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Camp Management API is running' });
});

// Import routes
const authRoutes = require('./routes/auth.routes');
const campersRoutes = require('./routes/campers.routes');
const periodsRoutes = require('./routes/periods.routes');
const registrationsRoutes = require('./routes/registrations.routes');
const paymentsRoutes = require('./routes/payments.routes');
const groupsRoutes = require('./routes/groups.routes');
const staffRoutes = require('./routes/staff.routes');
const medicalRoutes = require('./routes/medical.routes');
const checkinRoutes = require('./routes/checkin.routes');
const foodRoutes = require('./routes/food.routes');
const invoicesRoutes = require('./routes/invoices.routes');
const incidentsRoutes = require('./routes/incidents.routes');
const safetyRoutes = require('./routes/safety.routes');

app.use('/api/auth', authRoutes);
app.use('/api/campers', campersRoutes);
app.use('/api/periods', periodsRoutes);
app.use('/api/registrations', registrationsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/incidents', incidentsRoutes);
app.use('/api/safety', safetyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
