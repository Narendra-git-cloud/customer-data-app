# customers-data-app

A simple Express REST API for managing customer data with full CRUD operations.
Data is in-memory mock data, so it resets every time the server restarts.

## Requirements

- Node.js 18+
- npm

## Getting started

```bash
npm install
npm start        # production-ish run
npm run dev      # with nodemon auto-reload
```

Server starts on `http://localhost:3000`. Override with `PORT=4000 npm start`.

## Endpoints

| Method | Path                    | Description                                  |
| ------ | ----------------------- | -------------------------------------------- |
| GET    | `/`                     | API index / endpoint listing                 |
| GET    | `/health`               | Health check with uptime                    |
| GET    | `/api/customers`        | List customers (paginated, filterable)       |
| GET    | `/api/customers/stats`  | Total customers and counts grouped by status |
| GET    | `/api/customers/:id`    | Get a single customer                       |
| POST   | `/api/customers`        | Create a customer                            |
| PUT    | `/api/customers/:id`    | Replace a customer (full body required)     |
| PATCH  | `/api/customers/:id`    | Partially update a customer                 |
| DELETE | `/api/customers/:id`    | Delete a customer                            |

### Query parameters for `GET /api/customers`

| Param    | Description                                       | Default |
| -------- | ------------------------------------------------- | ------- |
| `search` | Matches name, email, city or country (case-insensitive) | -  |
| `status` | `active` \| `inactive` \| `pending`               | -       |
| `city`   | Exact city match (case-insensitive)               | -       |
| `page`   | Page number                                       | `1`     |
| `limit`  | Items per page (max 100)                          | `10`    |

### Customer object

```json
{
  "id": 1,
  "firstName": "Aarav",
  "lastName": "Sharma",
  "email": "aarav.sharma@example.com",
  "phone": "+91 98765 43210",
  "city": "Bengaluru",
  "country": "India",
  "status": "active",
  "createdAt": "2024-01-15T09:30:00.000Z",
  "updatedAt": "2024-01-15T09:30:00.000Z"
}
```

`firstName`, `lastName` and a valid `email` are required. Email must be unique.

## Examples

```bash
# List
curl http://localhost:3000/api/customers

# Filter and paginate
curl "http://localhost:3000/api/customers?status=active&search=dubai&page=1&limit=5"

# Create
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Ravi","lastName":"Nair","email":"ravi.nair@example.com","city":"Pune","country":"India"}'

# Read
curl http://localhost:3000/api/customers/1

# Update
curl -X PATCH http://localhost:3000/api/customers/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"inactive"}'

# Delete
curl -X DELETE http://localhost:3000/api/customers/1
```

## Response format

Success:

```json
{ "success": true, "data": { }, "count": 6, "page": 1, "totalPages": 1 }
```

Failure:

```json
{ "success": false, "message": "Customer 1 not found" }
```

Validation errors return `422` with an `errors` array.

## Status codes

| Code | Meaning                                     |
| ---- | ------------------------------------------- |
| 200  | OK                                          |
| 201  | Created                                     |
| 400  | Invalid id or malformed JSON                |
| 404  | Not found                                   |
| 409  | Duplicate email                             |
| 422  | Validation failed                           |
| 500  | Internal server error                       |

## Project structure

```
customers-data-app/
├── index.js
├── src/
│   ├── app.js               # express app, middleware, error handling
│   ├── server.js            # http listener + graceful shutdown
│   ├── data/customers.js    # mock data + data helpers
│   ├── middleware/
│   │   └── validate.js      # request validation
│   └── routes/customers.js  # CRUD routes
└── .gitignore
```

## License

MIT
