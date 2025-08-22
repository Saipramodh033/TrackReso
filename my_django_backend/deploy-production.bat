@echo off
REM Windows deployment script for production

echo 🚀 Preparing for production deployment...

REM Copy production environment files
echo 📋 Setting up production environment...
copy .env.production .env

echo ✅ Production environment configured!
echo 📝 Next steps:
echo 1. Commit and push your changes to GitHub
echo 2. Deploy to Render (it will use .env.production settings)
echo 3. Make sure Render environment variables match .env.production
