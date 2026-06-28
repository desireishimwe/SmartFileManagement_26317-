const express  = require('express');
const cors     = require('cors');
const app      = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/students',   require('./routes/students'));
app.use('/api/teachers',   require('./routes/teachers'));
app.use('/api/classes',    require('./routes/classes'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/results',    require('./routes/results'));
app.use('/api/fees',       require('./routes/fees'));
app.use('/api/payments',   require('./routes/payments'));
app.use('/api/events',     require('./routes/events'));
app.use('/api/dashboard',  require('./routes/dashboard'));

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }));

// 404
app.use((_, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
