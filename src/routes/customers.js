const express = require('express');
const {
  customers,
  clone,
  generateId,
  findById,
  emailExists,
} = require('../data/customers');
const { validateCustomer } = require('../middleware/validate');

const router = express.Router();

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /api/customers
router.get('/', (req, res) => {
  const { search, status, city, page = 1, limit = 10 } = req.query;

  let results = customers.slice();

  if (search) {
    const term = String(search).toLowerCase();
    results = results.filter((c) =>
      [c.firstName, c.lastName, c.email, c.city, c.country]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }

  if (status) {
    results = results.filter((c) => c.status === status);
  }

  if (city) {
    results = results.filter(
      (c) => c.city.toLowerCase() === String(city).toLowerCase()
    );
  }

  results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const perPage = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const total = results.length;
  const totalPages = Math.ceil(total / perPage) || 1;
  const start = (currentPage - 1) * perPage;

  res.json({
    success: true,
    count: total,
    page: currentPage,
    totalPages,
    data: clone(results.slice(start, start + perPage)),
  });
});

// GET /api/customers/stats
router.get('/stats', (req, res) => {
  const byStatus = customers.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    data: { total: customers.length, byStatus },
  });
});

// GET /api/customers/:id
router.get('/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid customer id' });
  }

  const customer = findById(id);
  if (!customer) {
    return res
      .status(404)
      .json({ success: false, message: `Customer ${id} not found` });
  }

  res.json({ success: true, data: clone(customer) });
});

// POST /api/customers
router.post('/', (req, res) => {
  const { valid, errors } = validateCustomer(req.body);
  if (!valid) {
    return res
      .status(422)
      .json({ success: false, message: 'Validation failed', errors });
  }

  if (emailExists(req.body.email)) {
    return res.status(409).json({
      success: false,
      message: `A customer with email "${req.body.email.trim()}" already exists`,
    });
  }

  const customer = {
    id: generateId(),
    firstName: req.body.firstName.trim(),
    lastName: req.body.lastName.trim(),
    email: req.body.email.trim().toLowerCase(),
    phone: (req.body.phone || '').trim(),
    city: (req.body.city || '').trim(),
    country: (req.body.country || '').trim(),
    status: req.body.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  customers.push(customer);
  res.status(201).json({ success: true, data: clone(customer) });
});

// PUT /api/customers/:id
router.put('/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid customer id' });
  }

  const customer = findById(id);
  if (!customer) {
    return res
      .status(404)
      .json({ success: false, message: `Customer ${id} not found` });
  }

  const { valid, errors } = validateCustomer(req.body);
  if (!valid) {
    return res
      .status(422)
      .json({ success: false, message: 'Validation failed', errors });
  }

  if (emailExists(req.body.email, id)) {
    return res.status(409).json({
      success: false,
      message: `Another customer already uses email "${req.body.email.trim()}"`,
    });
  }

  Object.assign(customer, {
    firstName: req.body.firstName.trim(),
    lastName: req.body.lastName.trim(),
    email: req.body.email.trim().toLowerCase(),
    phone: (req.body.phone || '').trim(),
    city: (req.body.city || '').trim(),
    country: (req.body.country || '').trim(),
    status: req.body.status || customer.status,
    updatedAt: new Date().toISOString(),
  });

  res.json({ success: true, data: clone(customer) });
});

// PATCH /api/customers/:id
router.patch('/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid customer id' });
  }

  const customer = findById(id);
  if (!customer) {
    return res
      .status(404)
      .json({ success: false, message: `Customer ${id} not found` });
  }

  const { valid, errors } = validateCustomer(req.body, { partial: true });
  if (!valid) {
    return res
      .status(422)
      .json({ success: false, message: 'Validation failed', errors });
  }

  if (req.body.email !== undefined && emailExists(req.body.email, id)) {
    return res.status(409).json({
      success: false,
      message: `Another customer already uses email "${req.body.email.trim()}"`,
    });
  }

  const fields = ['firstName', 'lastName', 'email', 'phone', 'city', 'country', 'status'];
  for (const field of fields) {
    if (req.body[field] === undefined) continue;
    const value = req.body[field];
    if (typeof value !== 'string') continue;
    customer[field] = field === 'email' ? value.trim().toLowerCase() : value.trim();
  }
  customer.updatedAt = new Date().toISOString();

  res.json({ success: true, data: clone(customer) });
});

// DELETE /api/customers/:id
router.delete('/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid customer id' });
  }

  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) {
    return res
      .status(404)
      .json({ success: false, message: `Customer ${id} not found` });
  }

  const [removed] = customers.splice(index, 1);
  res.json({ success: true, message: `Customer ${id} deleted`, data: clone(removed) });
});

module.exports = router;
