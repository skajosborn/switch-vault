# Database Setup Guide

This guide will help you set up the MongoDB database integration for the Dead Man's Switch application.

## Prerequisites

1. **MongoDB**: You need MongoDB installed and running locally, or a MongoDB Atlas account
2. **Node.js**: Version 18 or higher
3. **npm**: For package management

## Setup Steps

### 1. Install MongoDB Locally (Optional)

If you want to run MongoDB locally:

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**Windows:**
Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

### 2. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/dead-mans-switch

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### 3. MongoDB Atlas (Cloud Option)

If you prefer to use MongoDB Atlas (cloud):

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Replace the `MONGODB_URI` in your `.env.local` file

Example Atlas connection string:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### 4. Install Dependencies

The required dependencies are already installed, but if you need to reinstall:

```bash
npm install mongodb mongoose bcryptjs jsonwebtoken next-auth @types/bcryptjs @types/jsonwebtoken
```

### 5. Start the Application

```bash
npm run dev
```

## Database Schema

The application creates two main collections:

### Users Collection
- `email`: User's email address (unique)
- `password`: Hashed password
- `name`: User's full name
- `walletAddress`: Optional wallet address
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### WalletSetups Collection
- `userId`: Reference to user
- `mainWallet`: Main wallet address
- `beneficiaries`: Array of beneficiary objects
  - `id`: Unique identifier
  - `name`: Beneficiary name
  - `walletAddress`: Beneficiary wallet address
  - `percentage`: Distribution percentage (1-100)
  - `email`: Optional email
  - `phone`: Optional phone
- `backupWallet`: Optional backup wallet address
- `isActive`: Whether the setup is active
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Wallet Setup
- `GET /api/wallet-setup` - Get user's wallet setup
- `POST /api/wallet-setup` - Save/update wallet setup
- `DELETE /api/wallet-setup` - Deactivate wallet setup

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **JWT Authentication**: Secure token-based authentication
3. **Input Validation**: Server-side validation for all inputs
4. **MongoDB Injection Protection**: Using Mongoose ODM for query safety

## Production Considerations

1. **Change JWT Secret**: Use a strong, unique JWT secret
2. **MongoDB Security**: Enable authentication and network security
3. **Environment Variables**: Use proper environment variable management
4. **HTTPS**: Always use HTTPS in production
5. **Rate Limiting**: Consider implementing rate limiting
6. **Backup Strategy**: Set up regular database backups

## Troubleshooting

### Connection Issues
- Ensure MongoDB is running
- Check your connection string
- Verify network connectivity (for Atlas)

### Authentication Issues
- Check JWT secret configuration
- Verify environment variables are loaded
- Check browser console for errors

### Data Persistence Issues
- Verify database permissions
- Check MongoDB logs
- Ensure collections are created properly

## Development vs Production

### Development
- Use local MongoDB instance
- Simple JWT secret
- HTTP for local development

### Production
- Use MongoDB Atlas or managed MongoDB
- Strong, unique JWT secret
- HTTPS only
- Proper environment variable management
- Database monitoring and backups
