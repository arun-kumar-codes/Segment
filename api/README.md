# Segments API

A RESTful API service for managing segments with user details. This application provides endpoints for creating, retrieving, and managing segments.

## Features

- Create new segments with user details
- Retrieve all segments
- RESTful API architecture
- JSON response format

## Prerequisites

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd Segments
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add necessary configurations.

4. Start the server:
   ```bash
   npm start
   ```

The server will start running on `http://localhost:8080`.

## API Endpoints

### Get All Segments

```bash
curl -X GET http://localhost:8080/segment \
  -H "Content-Type: application/json"
```

### Create New Segment

```bash
curl -X POST http://localhost:8080/segment \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourpassword123"
  }'
```

## Response Format

- Success responses return appropriate HTTP status codes (200, 201)
- Error responses include error messages and appropriate status codes (401, 409, 500)
- All responses are in JSON format

## Project Structure

```
├── src/
│   ├── config/
│   │   └── db.js           # Database configuration
│   ├── controllers/
│   │   └── segment.controller.js
│   ├── routes/
│   │   └── segment.route.js
│   ├── middleware/        # Custom middleware
│   ├── modules/          # Business logic modules
│   └── utils/           # Utility functions
├── .env                 # Environment variables
└── package.json        # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.