let nextId = 1000;

const customers = [
  {
    id: 1,
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    city: 'Bengaluru',
    country: 'India',
    status: 'active',
    createdAt: '2024-01-15T09:30:00.000Z',
  },
  {
    id: 2,
    firstName: 'Meera',
    lastName: 'Iyer',
    email: 'meera.iyer@example.com',
    phone: '+91 91234 56789',
    city: 'Chennai',
    country: 'India',
    status: 'active',
    createdAt: '2024-02-03T11:15:00.000Z',
  },
  {
    id: 3,
    firstName: 'Daniel',
    lastName: 'Kowalski',
    email: 'daniel.kowalski@example.com',
    phone: '+48 601 234 567',
    city: 'Krakow',
    country: 'Poland',
    status: 'inactive',
    createdAt: '2024-03-22T16:45:00.000Z',
  },
  {
    id: 4,
    firstName: 'Sofia',
    lastName: 'Ramirez',
    email: 'sofia.ramirez@example.com',
    phone: '+34 612 345 678',
    city: 'Valencia',
    country: 'Spain',
    status: 'active',
    createdAt: '2024-05-10T08:05:00.000Z',
  },
  {
    id: 5,
    firstName: 'Chen',
    lastName: 'Wei',
    email: 'chen.wei@example.com',
    phone: '+86 138 0013 8000',
    city: 'Hangzhou',
    country: 'China',
    status: 'pending',
    createdAt: '2024-07-01T02:20:00.000Z',
  },
  {
    id: 6,
    firstName: 'Fatima',
    lastName: 'Al-Sayed',
    email: 'fatima.alsayed@example.com',
    phone: '+971 50 123 4567',
    city: 'Dubai',
    country: 'UAE',
    status: 'active',
    createdAt: '2024-09-18T13:00:00.000Z',
  },
];

const clone = (value) => JSON.parse(JSON.stringify(value));

function generateId() {
  nextId += 1;
  return nextId;
}

function findById(id) {
  return customers.find((customer) => customer.id === id);
}

function emailExists(email, excludeId = null) {
  const normalized = email.trim().toLowerCase();
  return customers.some(
    (customer) =>
      customer.id !== excludeId && customer.email.toLowerCase() === normalized
  );
}

module.exports = { customers, clone, generateId, findById, emailExists };
