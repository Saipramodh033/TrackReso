@echo off
REM React development deployment script

echo 🔧 Switching React app to development environment...

REM Copy development environment
copy .env.development .env

echo ✅ Development environment configured!
echo 📝 React app will connect to: http://127.0.0.1:8000/api
