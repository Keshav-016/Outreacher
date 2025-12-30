# Outreacher Generator API

Backend service for generating personalized outreach messages.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
npm start
```

## API Endpoints

### POST /generate

Generate a personalized outreach message.

**Request Body:**

```json
{
  "user": {
    "name": "John Doe",
    "years": 5
  },
  "profile": {
    "fullName": "",
    "role": "Software Engineer",
    "company": "Tech Corp",
    "skills": ["JavaScript", "React", "Node.js"],
    "url": "https://linkedin.com/jobs/..."
  }
}
```

**Response:**

```json
{
  "message": "Hi,\n\nMy name is John Doe..."
}
```

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-12-29T..."
}
```

## Environment

- Port: 4000
- CORS: Enabled for all origins
