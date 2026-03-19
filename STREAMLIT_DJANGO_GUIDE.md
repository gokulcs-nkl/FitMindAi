# 🧠 FitMind AI — Streamlit + Django Stack

## Overview

FitMind AI now features a **dual-stack architecture**:
- ✅ **Django Backend** (Port 8000) — API, Database, Admin Panel
- ✅ **Streamlit Frontend** (Port 8501) — Interactive Web Interface
- ✅ **TensorFlow.js** — Browser-based ML models

---

## 🚀 Quick Start

### Option 1: Automatic (One-Click Start)
```bash
start_all.bat          # Windows
bash start_all.sh      # Linux/Mac
```
This starts both Django and Streamlit automatically.

### Option 2: Manual Start (2 Terminals)

**Terminal 1 - Django Backend:**
```bash
python manage.py runserver
# Runs on http://localhost:8000
```

**Terminal 2 - Streamlit Frontend:**
```bash
streamlit run streamlit_app.py
# Runs on http://localhost:8501
```

---

## 📍 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Streamlit UI** | http://localhost:8501 | Main interactive interface |
| **Django API** | http://localhost:8000 | REST API endpoints |
| **Django Admin** | http://localhost:8000/admin | Content management |
| **Health Check** | http://localhost:8000/api/health | Backend status |

---

## 📁 Architecture

```
FitMind AI/
├── streamlit_app.py          # Streamlit frontend (interacts with Django API)
├── manage.py                 # Django CLI
├── config/                   # Django configuration
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/core/                # Django app
│   ├── models.py             # UserProfile, DailyLog
│   ├── views.py              # API handlers
│   └── admin.py
├── db.sqlite3                # SQLite database
├── static/                   # Frontend assets (CSS, JS)
└── templates/                # Django templates
```

---

## 🎯 Features

### Streamlit Frontend Provides:
- ✨ Dashboard with metrics
- ✨ User onboarding form
- ✨ AI diet planner
- ✨ Workout generator
- ✨ Nutrition tracker
- ✨ Food image scanner (TensorFlow.js)
- ✨ ML insights & predictions
- ✨ Settings & configuration

### Django Backend Provides:
- 🔧 REST API endpoints
- 🗄️ SQLite database
- 👤 User profile management
- 📊 Daily log tracking
- 🔐 Admin panel for content management
- 🔒 Authentication & security

---

## 🔌 API Integration

### Health Check
```bash
curl http://localhost:8000/api/health/
# Response: {"status": "ok", "message": "FitMind AI backend is running"}
```

### Example Frontend-to-Backend Call (in streamlit_app.py)
```python
import requests

DJANGO_API_URL = "http://127.0.0.1:8000"

# Check backend health
response = requests.get(f"{DJANGO_API_URL}/api/health/")
if response.status_code == 200:
    st.success("Backend connected!")
```

---

## 📊 Data Flow

```
User (Streamlit)
    ↓
Streamlit App (Port 8501)
    ↓
HTTP Requests
    ↓
Django API (Port 8000)
    ↓
Database (SQLite)
```

---

## 🔧 Adding New API Endpoints

### 1. Create View in `apps/core/views.py`:
```python
from django.http import JsonResponse
from .models import UserProfile

def get_users(request):
    users = UserProfile.objects.all()
    data = [{'id': u.id, 'name': u.name, 'goal': u.goal} for u in users]
    return JsonResponse({'users': data})
```

### 2. Add URL in `config/urls.py`:
```python
path('api/users/', views.get_users, name='users'),
```

### 3. Call from Streamlit:
```python
response = requests.get("http://localhost:8000/api/users/")
users = response.json()['users']
st.write(users)
```

---

## 🐛 Troubleshooting

### Streamlit Can't Connect to Django
```python
# In streamlit_app.py, the app checks backend health
# If red: Make sure Django is running on port 8000
python manage.py runserver
```

### Port Already in Use?
```bash
# Django on different port
python manage.py runserver 8001

# Streamlit on different port
streamlit run streamlit_app.py --server.port=8000
```

### Clear Cache & Reset
```bash
# Delete database
rm db.sqlite3

# Recreate
python manage.py migrate

# Restart
python manage.py runserver
```

---

## 📦 Dependencies

```
Django>=4.2.0              # Backend framework
Streamlit>=1.28.0          # Frontend  
Plotly>=5.17.0            # Interactive charts
pandas>=2.0.0             # Data manipulation
Pillow>=10.0.0            # Image processing
django-cors-headers>=4.3.0 # CORS support
gunicorn>=21.0.0          # Production server
```

Install all:
```bash
pip install -r requirements.txt
```

---

## 🚢 Deployment Options

### Option 1: Streamlit Cloud
Deploy Streamlit frontend to Streamlit Cloud (free):
1. Push to GitHub
2. Go to share.streamlit.io
3. Connect your repo
4. Remember to change `DJANGO_API_URL` to production backend

### Option 2: Heroku / Railway / Render
Deploy Django backend to a cloud provider

### Option 3: Docker
```dockerfile
FROM python:3.11
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt

# Start both services (needs supervisord or docker-compose)
CMD python manage.py runserver & streamlit run streamlit_app.py
```

---

## 🔐 Production Checklist

- [ ] Change Django `SECRET_KEY`
- [ ] Set `DEBUG=False` in Django settings
- [ ] Update `ALLOWED_HOSTS` to your domain
- [ ] Update `DJANGO_API_URL` in `streamlit_app.py`
- [ ] Enable HTTPS/SSL
- [ ] Use PostgreSQL instead of SQLite
- [ ] Set up email for notifications
- [ ] Configure logging
- [ ] Add rate limiting

---

## 📚 Documentation Links

- [Django Docs](https://docs.djangoproject.com/)
- [Streamlit Docs](https://docs.streamlit.io/)
- [Streamlit Cloud Deployment](https://docs.streamlit.io/deploy/streamlit-cloud)
- [Django REST Framework](https://www.django-rest-framework.org/)

---

## 🎉 You're Ready!

You now have a production-ready full-stack AI application:
- 🎨 Modern Streamlit UI
- 🔧 Powerful Django backend
- 🤖 Browser-based ML models
- 📱 Responsive design

**Start the app:**
```bash
start_all.bat  # Windows
bash start_all.sh  # Linux/Mac
```

**Access:**
- Frontend: http://localhost:8501
- Backend: http://localhost:8000
- Admin: http://localhost:8000/admin

Happy coding! 🚀
