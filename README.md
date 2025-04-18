# Segment Management Application

A full-stack web application for managing and organizing segments with various academic, location, and skill criteria.

## Project Overview

This application allows users to create, view, and manage segments with various filtering options. It includes features such as:

- Segment creation with detailed criteria
- Segment listing with pagination
- Active/Archive segment filtering
- Search and filtering capabilities

## Tech Stack

### Backend (API)
- Node.js with Express.js
- PostgreSQL database
- Prisma ORM
- Express Validator for request validation

### Frontend (Client)
- Next.js 15 with React 19
- Tailwind CSS for styling
- Material UI & Radix UI components
- Axios for API requests

## Project Structure

```
/
├── api/                    # Backend API
│   ├── prisma/             # Prisma schema and migrations
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── database/       # Database configuration
│   │   ├── middlewares/    # Express middlewares
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Main Express application
│   ├── .env                # Environment variables (not in git)
│   ├── .env.example        # Example environment variables
│   └── package.json        # Backend dependencies
│
├── client/                 # Frontend Next.js application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── app/            # Next.js app directory
│   │   ├── components/     # React components
│   │   └── lib/            # Utility functions & API client
│   ├── .env                # Environment variables (not in git)
│   ├── .env.example        # Example environment variables
│   └── package.json        # Frontend dependencies
│
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v14 or later)
- npm or yarn

### Backend Setup

1. Navigate to the api directory:
   ```bash
   cd api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your database:
   ```
   PORT=8080
   DATABASE_URL="postgresql://username:password@localhost:5432/segment_db?schema=public"
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080
   NEXT_PUBLIC_APP_NAME=Segment Management
   NEXT_PUBLIC_APP_ENVIRONMENT=development
   ```

## Development

### Running the Backend

```bash
cd api
npm start
```

The API will be available at http://localhost:8080

### Running the Frontend

```bash
cd client
npm run dev
```

The application will be available at http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/segment/get | Get paginated segments |
| POST | /api/v1/segment/create | Create a new segment |
| PUT | /api/v1/segment/update | Update segment status |
| GET | /api/v1/segment/:id | Get segment by ID |
| GET | /health | API health check |
