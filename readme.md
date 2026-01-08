# Vehicle Rental System - API Documentation

## Base URL

```
http://localhost:8000/api/v1
```

## Live link

```
2nd-assignment-redwan-hasans-projects.vercel.app
2nd-assignment-redwanhasan07208212-redwan-hasans-projects.vercel.app
```

## Technology Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Environment Variables:** dotenv
- **Dev Tool:** tsx (TypeScript executor)

## Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Sign Up (Register)

- **Method:** POST
- **URL:** `/auth/signup`
- **Access:** Public
- **Request Body:**

```json
{
  "name": "Redwan Hasan",
  "email": "redwanhasan@gmail.com",
  "password": "123456",
  "phone": "01853940963"
}
```

- **Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "Redwan Hasan",
    "email": "redwanhasan@gmail.com",
    "phone": "01853940963",
    "role": "customer"
  }
}
```

### 2. Sign In (Login)

- **Method:** POST
- **URL:** `/auth/signin`
- **Access:** Public
- **Request Body:**

```json
{
  "email": "redwanhasancse@gmail.com",
  "password": "123456"
}
```

- **Response (200):**

```json
{
  "success": true,
  "message": "User signed in successfully",
  "data": {
    "user": {
      "id": 2,
      "name": "Redwan Hasan",
      "email": "redwanhasancse@gmail.com",
      "phone": "01853940963",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJyZWR3YW5oYXNhbmNzZUBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Njc4OTkwMTAsImV4cCI6MTc2Nzk4NTQxMH0.Or0Ou-lg1TeIAEHa8pnf_qmboRh6DIVMvm9_4e4RCtA"
  }
}
```

---

## Vehicle Endpoints

### 1. Create Vehicle

- **Method:** POST
- **URL:** `/vehicles`
- **Access:** Admin only
- **Request Body:**

```json
{
  "vehicle_name": "Toyota Camry",
  "type": "car",
  "registration_number": "ABC123",
  "daily_rent_price": 50,
  "availability_status": "available"
}
```

- **Response (201):**

```json
{
  "success": true,
  "message": "Vehicle created successfully",
  "data": {
    "id": 1,
    "vehicle_name": "Toyota Camry",
    "type": "car",
    "registration_number": "ABC123",
    "daily_rent_price": "50.00",
    "availability_status": "available",
    "created_at": "2026-01-03T15:20:32.166Z",
    "updated_at": "2026-01-03T15:20:32.166Z"
  }
}
```

### 2. Get All Vehicles

- **Method:** GET
- **URL:** `/vehicles`
- **Access:** Public
- **Response (200):**

```json
{
  "success": true,
  "message": "Vehicles retrieved successfully",
  "data": [
    {
      "id": 3,
      "vehicle_name": "Toyota Camry 2024",
      "type": "bike",
      "registration_number": "ABC-1234",
      "daily_rent_price": "50.00",
      "availability_status": "available",
      "created_at": "2026-01-03T15:35:07.671Z",
      "updated_at": "2026-01-03T15:35:07.671Z"
    },
    {
      "id": 1,
      "vehicle_name": "Toyota Camry",
      "type": "car",
      "registration_number": "ABC123",
      "daily_rent_price": "50.00",
      "availability_status": "available",
      "created_at": "2026-01-03T15:20:32.166Z",
      "updated_at": "2026-01-03T15:20:32.166Z"
    }
  ]
}
```

### 3. Get Vehicle by ID

- **Method:** GET
- **URL:** `/vehicles/:vehicleId`
- **Access:** Public
- **Response (200):** Same as single vehicle in Get All Vehicles

```json
{
  "success": true,
  "message": "Vehicle retrieved successfully",
  "data": {
    "id": 1,
    "vehicle_name": "Toyota Camry",
    "type": "car",
    "registration_number": "ABC123",
    "daily_rent_price": "50.00",
    "availability_status": "available",
    "created_at": "2026-01-03T15:20:32.166Z",
    "updated_at": "2026-01-03T15:20:32.166Z"
  }
}
```

### 4. Update Vehicle

- **Method:** PUT
- **URL:** `/vehicles/:vehicleId`
- **Access:** Admin only
- **Request Body:** (All fields optional)

```json
{
  "vehicle_name": "Toyota Camry 2024 Premium",
  "type": "car",
  "registration_number": "AB-123",
  "daily_rent_price": 55,
  "availability_status": "available"
}
```

- **Response (200):** Updated vehicle object

```json
{
  "success": true,
  "message": "Vehicle updated successfully",
  "data": {
    "id": 1,
    "vehicle_name": "Toyota Camry 2024 Premium",
    "type": "car",
    "registration_number": "AB-123",
    "daily_rent_price": "55.00",
    "availability_status": "available",
    "created_at": "2026-01-03T15:20:32.166Z",
    "updated_at": "2026-01-03T15:51:33.116Z"
  }
}
```

### 5. Delete Vehicle

- **Method:** DELETE
- **URL:** `/vehicles/:vehicleId`
- **Access:** Admin only
- **Constraint:** Cannot delete if active bookings exist
- **Response (200):**

```json
{
  "success": true,
  "message": "Vehicle deleted successfully"
}
```

---

## User Endpoints

### 1. Get All Users

- **Method:** GET
- **URL:** `/users`
- **Access:** Admin only
- **Response (200):**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 2,
      "name": "Redwan Hasan",
      "email": "redwanhasan@gmail.com",
      "phone": "01853940963",
      "role": "customer"
    },
    {
      "id": 1,
      "name": "Redwan Hasan",
      "email": "redwanhasancse@gmail.com",
      "phone": "01853940963",
      "role": "admin"
    }
  ]
}
```

### 2. Update User

- **Method:** PUT
- **URL:** `/users/:userId`
- **Access:** Admin or Own user
- **Request Body:** (All fields optional)

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 2,
    "name": "Redwan Siam",
    "email": "redwanhasan@gmail.com",
    "phone": "01853940963",
    "role": "customer"
  }
}
```

- **Response (200):** Updated user object
- **Note:** Customers can only update their own profile. Admins can update anyone's profile.

### 3. Delete User

- **Method:** DELETE
- **URL:** `/users/:userId`
- **Access:** Admin only
- **Constraint:** Cannot delete if active bookings exist
- **Response (200):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Booking Endpoints

### 1. Create Booking

- **Method:** POST
- **URL:** `/bookings`
- **Access:** Customer or Admin
- **Request Body:**

```json
{
  "customer_id": 1,
  "vehicle_id": 1,
  "rent_start_date": "2024-02-01",
  "rent_end_date": "2024-02-05"
}
```

- **Response (201):**

```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "customer_id": 1,
    "vehicle_id": 1,
    "rent_start_date": "2024-02-01",
    "rent_end_date": "2024-02-05",
    "total_price": 200,
    "status": "active",
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
}
```

**Notes:**

- Total price is calculated as: `daily_rent_price × number_of_days`
- Vehicle availability status is automatically set to "booked"
- End date must be after start date

### 2. Get Bookings

- **Method:** GET
- **URL:** `/bookings`
- **Access:** Authenticated users
- **Response (200):**

**Admin:** Returns all bookings
**Customer:** Returns only their own bookings

```json
{
  "success": true,
  "message": "Bookings retrieved successfully",
  "data": [
    {
      "id": 1,
      "customer_id": 1,
      "vehicle_id": 1,
      "rent_start_date": "2024-02-01",
      "rent_end_date": "2024-02-05",
      "total_price": 200,
      "status": "active",
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

### 3. Update Booking

- **Method:** PUT
- **URL:** `/bookings/:bookingId`
- **Access:** Customer (for cancellation) or Admin
- **Request Body:**

```json
{
  "status": "cancelled"
}
```

- **Response (200):** Updated booking object

**Status Options:**

- `cancelled` - Customer can only cancel before rent start date
- `returned` - Admin marks booking as returned, vehicle becomes available
- `active` - Default status

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "All fields are required",
  "statusCode": 400
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized: Invalid token",
  "statusCode": 401
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Forbidden: Admin access required",
  "statusCode": 403
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Vehicle not found",
  "statusCode": 404
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal Server Error",
  "statusCode": 500
}
```

---

## Important Rules

### Vehicle Management

- Only admins can create, update, or delete vehicles
- Vehicles cannot be deleted if they have active bookings
- Availability status is automatically managed with bookings

### User Management

- Passwords are hashed with bcrypt before storage
- Users cannot be deleted if they have active bookings
- Customers can only update their own profile
- Admins can update any user's role and details

### Booking Management

- Total price is automatically calculated based on daily rate and duration
- Vehicle availability is automatically updated when booking is created/cancelled/returned
- Customers can only cancel bookings before the rental start date
- Bookings must have valid date ranges (end date > start date)

---

## Setup & Usage Instructions

### Prerequisites

- Node.js v16 or higher
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd 2nd_Assignment
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**
   Create a `.env` file in the root directory:

### Running the Application

**Development mode** (with reload):

```bash
npm run dev
```

**Build for production:**

```bash
npm run build
```

**Start production server:**

```bash
node dist/server.js
```

```

---
```
