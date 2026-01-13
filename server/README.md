# CRM Server

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory with the following variables:

```env
# Environment
NODE_ENV=development

# Development Database
MONGODB_URI_DEV=mongodb+srv://username:password@cluster.mongodb.net/crm-dev?retryWrites=true&w=majority

# Production Database
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/crm-prod?retryWrites=true&w=majority

# Development JWT Secret
JWT_SECRET_DEV=your-dev-secret-key-change-this

# Production JWT Secret
JWT_SECRET_PROD=your-prod-secret-key-change-this

# Development CORS Origin
CORS_ORIGIN_DEV=http://localhost:5173

# Production CORS Origin
CORS_ORIGIN_PROD=https://your-production-domain.com

# Email Configuration
EMAIL_HOST=mail.example.com
EMAIL_PORT=465
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password

# Server Port
PORT=5000
```

3. Start the server:
```bash
npm start
```

## Creating a Test User

To create a test user, run:
```bash
node scripts/createUser.js
```

This will create a user with:
- Username: `test`
- Password: `password`

## Environment Configuration

The server uses environment-based configuration. Set `NODE_ENV` to `development` or `production` to use the appropriate database and secrets.

- Development: Uses `MONGODB_URI_DEV`, `JWT_SECRET_DEV`, `CORS_ORIGIN_DEV`
- Production: Uses `MONGODB_URI_PROD`, `JWT_SECRET_PROD`, `CORS_ORIGIN_PROD`
