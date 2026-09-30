const express = require('express');
const customerRoutes = require('./routes/customers');
const { customers } = require('./data/customers');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - startedAt;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'customers-data-app',
    version: '1.0.0',
    endpoints: {
      list: 'GET /api/customers?search=&status=&city=&page=&limit=',
      stats: 'GET /api/customers/stats',
      getOne: 'GET /api/customers/:id',
      create: 'POST /api/customers',
      replace: 'PUT /api/customers/:id',
      update: 'PATCH /api/customers/:id',
      remove: 'DELETE /api/customers/:id',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
});

app.use('/api/customers', customerRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid JSON payload' });
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

module.exports = app;
