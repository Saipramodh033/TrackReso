# 📚Learning Hive

A full-stack web application where users can **create groups**, **store and manage resources**, and collaborate securely. Built with **Django**, **React**, and **PostgreSQL**, and includes full **JWT-based authentication** for secure access control.

---

## 🚀 Features

- 🔐 User authentication (Signup, Login, Logout)
- 👥 Create and manage private or shared groups
- 📁 Store and manage resources within each group
- 🧑‍🤝‍🧑 Invite or manage group members *(optional extension)*
- 🔒 JWT-secured API endpoints

---

## 🛠 Tech Stack

| Layer        | Technology                    |
|--------------|-------------------------------|
| Frontend     | React, JavaScript, Axios      |
| Backend      | Django REST Framework         |
| Database     | PostgreSQL                    |
| Authentication | JWT (SimpleJWT)             |
| Deployment   | Render                        |

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/group-resource-manager.git
cd group-resource-manager
2. Backend Setup (Django)

cd backend
python -m venv env
source env/bin/activate   # Windows: env\Scripts\activate
pip install -r requirements.txt
Create a .env file inside the backend folder:

env
Copy
Edit
SECRET_KEY=your_secret_key
DEBUG=True
DATABASE_URL=postgres://username:password@localhost:5432/your_db_name
Run database migrations and start the backend server:

python manage.py makemigrations
python manage.py migrate
python manage.py runserver
3. Frontend Setup (React)

cd my-vue-app
npm install
npm run dev
Ensure your React app points to the correct backend URL (http://localhost:8000/api/ by default).

🔐 Authentication
The project uses JWT authentication via djangorestframework-simplejwt.

On login, the backend issues a pair of tokens (access & refresh)

The frontend stores the token in localStorage or cookies

All authenticated requests include the access token in the headers

Example header:

http

Authorization: Bearer <your_token>
📁 Project Structure
project-root/
│
├── my_django_backend/ # Django project settings
├── api/ # Django app with views, models, serializers
├── manage.py
├── requirements.txt
├── Procfile
│
├── my-vue-app/ # Vue 3 frontend (with Vite)
│ ├── src/
│ ├── public/
│ ├── vite.config.js
│ └── package.json
🌐 Live Demo
🔗(https://learning-hive-82eb.onrender.com/)


