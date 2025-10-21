# 📚 TrackReso - Learning Resource Tracker

A modern full-stack web application for **personal learning management** where users can **create topics**, **manage learning cards**, **share resources with peers**, and **track progress**. Built with **Django REST Framework**, **React**, and includes comprehensive **JWT-based authentication** with intelligent request caching and rate limiting.

---

## 🚀 Key Features

### � Learning Management

-   🎯 **Topic Organization**: Create and manage learning topics
-   📋 **Learning Cards**: Add detailed cards with resources, notes, and progress tracking
-   📊 **Progress Tracking**: Visual progress bars and completion percentages
-   🔄 **Card Expansion**: Collapsible card content for better organization

### 👥 Peer Collaboration

-   🤝 **Peer System**: Send and manage peer requests
-   📤 **Topic Sharing**: Share entire topics with peers securely
-   👀 **Shared View**: Access shared topics from other users
-   🔒 **Privacy Controls**: Full control over what you share

### � Security & Performance

-   🛡️ **JWT Authentication**: Secure token-based authentication
-   ⚡ **Request Caching**: Intelligent API response caching (30s TTL)
-   🚦 **Rate Limiting**: Smart request throttling to prevent API abuse
-   🔄 **Optimistic Updates**: Immediate UI feedback with background sync

### 🎨 Modern UI/UX

-   📱 **Responsive Design**: Mobile-first responsive layout
-   🎯 **Clean Interface**: Modern, card-based design system
-   🌟 **Smooth Animations**: Subtle transitions and hover effects

---

## 🛠 Tech Stack

Layer

Technology

**Frontend**

React 18, Vite, React Router

**Backend**

Django 5.1, Django REST Framework

**Database**

PostgreSQL / SQLite

**Authentication**

JWT (djangorestframework-simplejwt)

**Styling**

CSS3 with Custom Properties

**API Client**

Axios with intelligent caching

**Deployment**

Render (Backend), Netlify/Render (Frontend)

---

## 📦 Installation & Setup

### Prerequisites

-   Python 3.8+
-   Node.js 16+
-   PostgreSQL (for production) or SQLite (for development)

### 1. Clone the Repository

```bash
git clone https://github.com/Saipramodh033/TrackReso.gitcd TrackReso
```

### 2. Backend Setup (Django)

```bash
cd my_django_backend# Create virtual environmentpython -m venv envsource env/bin/activate   # Windows: envScriptsactivate# Install dependenciespip install -r requirements.txt# Environment Configuration# Create .env file with the following:
```

Create `.env` file in `my_django_backend/`:

```env
SECRET_KEY=your_secret_key_hereDEBUG=TrueUSE_REMOTE_DB=False# For production:# DATABASE_URL=postgres://username:password@localhost:5432/trackreso_db
```

```bash
# Run migrationspython manage.py makemigrationspython manage.py migrate# Create superuser (optional)python manage.py createsuperuser# Start development serverpython manage.py runserver
```

### 3. Frontend Setup (React)

```bash
cd my-vue-app# Install dependenciesnpm install# Environment Configuration# Create .env file with:
```

Create `.env` file in `my-vue-app/`:

```env
VITE_BACKEND_URL=http://localhost:8000/api
```

```bash
# Start development servernpm run dev
```

### 4. Access the Application

-   **Frontend**: [http://localhost:5173](http://localhost:5173)
-   **Backend API**: [http://localhost:8000/api](http://localhost:8000/api)
-   **Django Admin**: [http://localhost:8000/admin](http://localhost:8000/admin)

---

## 🏗️ Project Structure

```
TrackReso/
│
├── 📁 my_django_backend/              # Django Backend API
│   ├── 📁 api/                        # Main API Application
│   │   ├── 📄 __init__.py
│   │   ├── 📄 admin.py                # Django admin configuration
│   │   ├── 📄 apps.py                 # App configuration
│   │   ├── 📄 models.py               # Database models (Topic, Card, Peer, etc.)
│   │   ├── 📄 serializers.py          # DRF serializers for API responses
│   │   ├── 📄 tests.py                # Unit tests
│   │   ├── 📄 urls.py                 # API endpoint routing
│   │   ├── 📄 views.py                # API view logic
│   │   └── 📁 migrations/             # Database migration files
│   │
│   ├── 📁 my_django_backend/          # Django Project Settings
│   │   ├── 📄 __init__.py
│   │   ├── 📄 asgi.py                 # ASGI configuration
│   │   ├── 📄 settings.py             # Main Django settings
│   │   ├── 📄 urls.py                 # Root URL configuration
│   │   └── 📄 wsgi.py                 # WSGI configuration
│   │
│   ├── 📁 staticfiles/                # Static files (CSS, JS, Images)
│   ├── 📄 .env                        # Environment variables
│   ├── 📄 db.sqlite3                  # SQLite database (development)
│   ├── 📄 manage.py                   # Django management commands
│   ├── 📄 Procfile                    # Deployment configuration
│   └── 📄 requirements.txt            # Python dependencies
│
├── 📁 my-vue-app/                     # React Frontend Application
│   ├── 📁 public/                     # Static Assets
│   │   ├── 📄 index.html              # Main HTML template
│   │   └── 📄 vite.svg                # Vite logo
│   │
│   ├── 📁 src/                        # Source Code
│   │   ├── 📁 components/             # Reusable React Components
│   │   │   ├── 📄 api.js              # Axios API configuration
│   │   │   ├── 📄 Card.jsx            # Learning card component
│   │   │   ├── 📄 MainLayout.jsx      # Main layout wrapper
│   │   │   ├── 📄 NavSidebar.jsx      # Navigation sidebar
│   │   │   ├── 📄 ProtectedRoute.jsx  # Route protection
│   │   │   ├── 📄 Topic.jsx           # Topic component
│   │   │   └── 📄 TopicManager.jsx    # Topic management
│   │   │
│   │   ├── 📁 pages/                  # Page Components
│   │   │   ├── 📄 Dashboard.jsx       # Main dashboard with topics/peers
│   │   │   ├── 📄 Home.jsx            # Landing page
│   │   │   ├── 📄 LoadingPage.jsx     # Loading indicator
│   │   │   ├── 📄 Login.jsx           # User authentication
│   │   │   ├── 📄 NotFound.jsx        # 404 error page
│   │   │   ├── 📄 Peers.jsx           # Peer management
│   │   │   ├── 📄 Register.jsx        # User registration
│   │   │   ├── 📄 SharedTopics.jsx    # Shared topics view
│   │   │   └── 📄 TopicsPage.jsx      # Topics management
│   │   │
│   │   ├── 📁 services/               # API Services & Business Logic
│   │   │   ├── 📄 apiService.js       # Cached API client with throttling
│   │   │   └── 📄 authService.js      # Authentication utilities
│   │   │
│   │   ├── 📁 styles/                 # CSS Stylesheets
│   │   │   ├── 📄 App.css             # Global application styles
│   │   │   ├── 📄 Card.css            # Card component styles
│   │   │   ├── 📄 Dashboard.css       # Dashboard layout & components
│   │   │   ├── 📄 Login.css           # Authentication pages
│   │   │   ├── 📄 Register.css        # Registration form styles
│   │   │   └── 📄 [other].css         # Additional component styles
│   │   │
│   │   ├── 📁 app/                    # Application Configuration
│   │   │   ├── 📁 router/             # Route definitions
│   │   │   └── 📁 store/              # State management
│   │   │
│   │   ├── 📄 App.jsx                 # Root application component
│   │   ├── 📄 constants.js            # Application constants
│   │   ├── 📄 index.css               # Global CSS reset & variables
│   │   └── 📄 main.jsx                # React application entry point
│   │
│   ├── 📄 .env                        # Environment variables
│   ├── 📄 eslint.config.js            # ESLint configuration
│   ├── 📄 index.html                  # HTML template
│   ├── 📄 package.json                # Node.js dependencies & scripts
│   └── 📄 vite.config.js              # Vite build configuration
│
├── 📄 .gitignore                      # Git ignore rules
├── 📄 README.md                       # Project documentation (Markdown)
├── 📄 README.txt                      # Project documentation (Text)
└── 📄 package.json                    # Root package configuration
```

---

## 🔐 Authentication System

The application uses JWT-based authentication with the following flow:

1.  **Registration/Login**: Users authenticate via `/api/user/register/` or `/api/token/`
2.  **Token Storage**: Access and refresh tokens stored in localStorage
3.  **API Requests**: All requests include `Authorization: Bearer <token>` header
4.  **Auto-refresh**: Automatic token refresh on expiration
5.  **Rate Limiting**: 1000 requests per hour per authenticated user

### API Endpoints

Method

Endpoint

Description

POST

`/api/user/register/`

User registration

POST

`/api/token/`

Login (get tokens)

POST

`/api/token/refresh/`

Refresh access token

GET

`/api/topics/`

List user topics

GET

`/api/peers/`

List user peers

GET

`/api/shared-topics/`

List shared topics

---

## ⚡ Performance Features

### Intelligent Caching

-   **Response Caching**: API responses cached for 30 seconds
-   **Request Deduplication**: Identical requests within 1 second are merged
-   **Cache Invalidation**: Smart cache clearing on data mutations
-   **Offline Resilience**: Fallback to cached data on network errors

### Rate Limiting

-   **Backend**: 1000 requests/hour per user (configurable)
-   **Frontend**: Request throttling with 1-second cooldowns
-   **Error Handling**: Graceful degradation on rate limit hits

---

## 🚀 Deployment

### Backend (Render)

1.  Connect GitHub repository to Render
2.  Set environment variables in Render dashboard
3.  Deploy using `requirements.txt` and `Procfile`

### Frontend (Netlify/Vercel)

1.  Build the React app: `npm run build`
2.  Deploy `dist/` folder to hosting service
3.  Configure environment variables

### Environment Variables

**Backend (.env)**:

```env
SECRET_KEY=production_secret_keyDEBUG=FalseUSE_REMOTE_DB=TrueDATABASE_URL=postgres://...
```

**Frontend (.env)**:

```env
VITE_BACKEND_URL=https://your-backend-url.com/api
```

---

## 🤝 Contributing

1.  Fork the repository
2.  Create a feature branch: `git checkout -b feature/amazing-feature`
3.  Commit changes: `git commit -m 'Add amazing feature'`
4.  Push to branch: `git push origin feature/amazing-feature`
5.  Open a Pull Request

---


## 🌟 Acknowledgments

-   Django REST Framework for the robust API backend
-   React ecosystem for the modern frontend
-   All contributors and users of this project

---

## 🔗 Links

-   **Live Demo**: [TrackReso App](https://learning-hive-82eb.onrender.com/)
-   **Repository**: [GitHub](https://github.com/Saipramodh033/TrackReso)
-   **Issues**: [Report Bugs](https://github.com/Saipramodh033/TrackReso/issues)

---

*Built with ❤️ for learners everywhere*