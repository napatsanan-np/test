# Sports Court Booking System - Setup Guide

## Quick Start

### 1. Start Backend (Database + Go Server)

```bash
cd /workspaces/test/database

# Start with Docker Compose
docker-compose up --build
```

This will start:
- PostgreSQL Database on `localhost:5432`
- Go Backend Server on `localhost:8080`
- PGAdmin on `localhost:5050`

**Database Credentials:**
- User: `postgres`
- Password: `postgres`
- Database: `sports_booking`

**Seed Data:**
- Admin User: `somchai_k` / `012345`
- 12 Courts (3 of each sport type)

### 2. Start Frontend (React)

In another terminal:

```bash
cd /workspaces/test/SportsBookingPage

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

## Testing the System

### 1. Register a New User
- Go to `http://localhost:3000/register`
- Fill in the form and submit
- Data will be saved to the database

### 2. Login
- Go to `http://localhost:3000/login`
- Use the credentials created during registration
- JWT token will be returned and stored in localStorage

### 3. Book a Court
- From Home page, select a sport
- Choose court and time slot
- Click "จองสนาม" (Book)
- Booking will be saved to database

## Features Implemented

✅ **Frontend - API Integration**
- RegisterPage: Sends data to `/api/auth/register`
- LoginPage: Sends credentials to `/api/auth/login` and stores JWT token
- BadmintonBookingPage, BasketballBookingPage, TennisBookingPage, VolleyballBookingPage: All send booking requests to `/api/bookings`

✅ **Backend - Database Integration**
- User registration saved to `users` table
- Login returns JWT token
- Bookings saved to `bookings` table with court and user associations
- Courts seeded into `courts` table

✅ **Authentication & Authorization**
- JWT token generation and verification
- AuthMiddleware protects booking endpoints
- AdminMiddleware restricts admin operations

✅ **Database**
- PostgreSQL with 3 tables: users, courts, bookings
- Automatic table creation on startup
- Data seeding for admin user and sample courts

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (requires auth)

### Courts
- `GET /api/courts` - Get all courts
- `GET /api/courts/:sportType` - Get courts by sport type
- `GET /api/sports` - Get sport types

### Bookings
- `POST /api/bookings` - Create booking (requires auth)
- `GET /api/bookings/history` - Get user's booking history (requires auth)
- `DELETE /api/bookings/:bookingId` - Cancel booking (requires auth)

### Admin
- `POST /api/admin/bookings/reset` - Reset all bookings (requires auth + admin)

## Troubleshooting

**Can't connect to database?**
- Ensure Docker is running
- Check if port 5432 is not in use
- Run `docker-compose logs db` to see database logs

**Backend not starting?**
- Check Go dependencies: `go mod download`
- Verify `.env` file exists in database folder
- Check logs: `docker-compose logs backend`

**Frontend can't reach backend?**
- Ensure `.env` file has `REACT_APP_API_URL=http://localhost:8080/api`
- Check CORS is enabled in backend (it is)
- Verify backend is running on port 8080

## File Structure

```
/workspaces/test/
├── database/              # Backend (Go)
│   ├── main.go
│   ├── database.go
│   ├── handlers/
│   │   ├── auth.go
│   │   ├── booking.go
│   │   ├── db_users.go
│   │   ├── db_bookings.go
│   │   ├── middleware.go
│   │   ├── jwt.go
│   │   └── models.go
│   ├── docker/
│   │   ├── Dockerfile
│   │   └── init.sql
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── go.mod
│   └── .env
│
└── SportsBookingPage/     # Frontend (React)
    ├── public/
    ├── src/
    │   ├── pages/
    │   │   ├── RegisterPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── BadmintonBookingPage.jsx
    │   │   ├── BasketballBookingPage.jsx
    │   │   ├── TennisBookingPage.jsx
    │   │   └── VolleyballBookingPage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── hooks/
    │   │   └── useBooking.js
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── .env
```
