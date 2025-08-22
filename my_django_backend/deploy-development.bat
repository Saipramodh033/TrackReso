@echo off
REM Windows script to switch back to development

echo 🔧 Switching to development environment...

REM Copy development environment files
copy .env.development .env

echo ✅ Development environment configured!
echo 🔗 Backend will allow CORS from localhost:5173
