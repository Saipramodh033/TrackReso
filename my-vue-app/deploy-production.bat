@echo off
REM React production deployment script

echo 🚀 Preparing React app for production deployment...

REM Copy production environment
copy .env.production .env

echo ✅ Production environment configured!
echo 📝 React app will connect to: https://learning-hive.onrender.com/api
echo 📝 Next steps:
echo 1. Run: npm run build
echo 2. Deploy the dist/ folder to your hosting service
