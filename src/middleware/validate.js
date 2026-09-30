const VALID_STATUSES = ['active', 'inactive', 'pending'];
const REQUIRED_FIELDS = ['firstName', 'lastName', 'email'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCustomer(payload, { partial = false } = {}) {
  const errors = [];
  const body = payload && typeof payload === 'object' ? payload : {};

  for (const field of REQUIRED_FIELDS) {
    const present = Object.prototype.hasOwnProperty.call(body, field);
    if (partial && !present) continue;
    if (!present || typeof body[field] !== 'string' || !body[field].trim()) {
      errors.push(`"${field}" is required and must be a non-empty string`);
    }
  }

  const email = body.email;
  if (typeof email === 'string' && email.trim() && !EMAIL_PATTERN.test(email.trim())) {
    errors.push('"email" must be a valid email address');
  }

  if (body.status !== undefined && !VALID_STATUSES.includes(body.status)) {
    errors.push(`"status" must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (body.phone !== undefined && typeof body.phone !== 'string') {
    errors.push('"phone" must be a string');
  }

  for (const field of ['city', 'country']) {
    if (body[field] !== undefined && typeof body[field] !== 'string') {
      errors.push(`"${field}" must be a string`);
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateCustomer, VALID_STATUSES, REQUIRED_FIELDS };
