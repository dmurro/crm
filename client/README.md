# CRM Client

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the client directory with the following variable:

```env
# API URL
VITE_API_URL=http://localhost:5000
```

For production, set this to your production API URL.

3. Start the development server:
```bash
npm run dev
```

## Features

- **TanStack React Query**: All API requests are handled through React Query for better caching and error handling
- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop
- **Authentication**: JWT-based authentication with token validation
- **Theme Toggle**: Dark/light mode support
