#!/bin/bash

echo "🚀 Setting up environment variables for Dead Man's Switch"
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Do you want to overwrite it? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

echo "📝 Creating .env.local file..."

# Create .env.local file
cat > .env.local << EOF
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/dead-mans-switch

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000
EOF

echo "✅ .env.local file created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Install MongoDB locally or set up MongoDB Atlas"
echo "2. Update MONGODB_URI in .env.local if using Atlas"
echo "3. Change JWT_SECRET to a strong, unique key"
echo "4. Run 'npm run dev' to start the application"
echo ""
echo "📖 For detailed setup instructions, see DATABASE_SETUP.md"
