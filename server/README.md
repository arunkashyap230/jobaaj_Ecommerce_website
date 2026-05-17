# MERN E-Commerce Backend

Simple Node.js + Express + MongoDB backend for the e-commerce assignment.

## Setup

1. `cd server`
2. `npm install`
3. Create a `.env` file from `.env.example` and put your MongoDB URI + JWT secret.
4. `npm run dev` (or `npm start`)

Server will run on `http://localhost:5000`.

## API Endpoints

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`

### Products
- GET `/api/products` (supports `?keyword=` and `?category=`)
- GET `/api/products/:id`
- POST `/api/products` (admin)
- PUT `/api/products/:id` (admin)
- DELETE `/api/products/:id` (admin)
- POST `/api/products/:id/reviews` (logged-in user)

### Orders
- POST `/api/orders` (logged-in user)
- GET `/api/orders/myorders` (logged-in user)
- GET `/api/orders` (admin)
- PUT `/api/orders/:id/deliver` (admin)

### Users
- GET `/api/users` (admin)
- DELETE `/api/users/:id` (admin)

## Folder Structure

```
server/
  config/       - DB connection
  controllers/  - business logic
  middleware/   - auth middleware
  models/       - Mongoose schemas
  routes/       - express routes
  utils/        - helpers (jwt token)
  server.js     - entry point
```

## Make a user admin

After registering, manually set `isAdmin: true` in MongoDB for that user.
