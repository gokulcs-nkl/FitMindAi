# 🧠 FitMind AI — Django Backend Setup Guide

## ✅ Setup Complete!

Your FitMind AI project uses **Django** as its backend framework for scalability, database management, and API development. 

### 🎯 Framework Features

Django provides:
- **Robust ORM** — Easy database interaction without raw SQL
- **Built-in Admin Panel** — Manage data with zero frontend code
- **Authentication & Security** — User authentication, CSRF protection
- **Scalability** — Handle thousands of concurrent requests
- **REST Framework Ready** — Build powerful APIs
- **Static Files** — Automatic CSS/JS serving
- **Multi-app Architecture** — Organize code by features

---

## 📁 New Project Structure

```
PLANNER/
├── manage.py                 # Django command-line utility
├── requirements.txt          # Python dependencies (Flask replaced with Django)
├── db.sqlite3               # SQLite database (auto-created)
├── .env                     # Environment variables
│
├── config/                  # Django project config
│   ├── settings.py          # Main Django settings
│   ├── urls.py              # URL routing
│   ├── wsgi.py              # WSGI server entry point
│   ├── asgi.py              # ASGI server entry point
│   └── __init__.py
│
├── apps/
│   └── core/                # FitMind AI app
│       ├── admin.py         # Django admin configuration
│       ├── apps.py          # App configuration
│       ├── models.py        # Database models (UserProfile, DailyLog)
│       ├── views.py         # View functions
│       ├── migrations/       # Database migration files
│       └── __init__.py
│
├── templates/
│   └── index.html           # Main SPA template (with {% load static %})
│
├── static/
│   ├── css/
│   │   ├── global.css
│   │   ├── components.css
│   │   └── pages.css
│   └── js/
│       ├── data/
│       │   ├── foods.js
│       │   ├── exercises.js
│       │   └── meal-plans.js
│       ├── ai-diet.js
│       ├── ai-workout.js
│       ├── calorie-image.js
│       ├── tracker.js
│       ├── goal-engine.js
│       ├── hostel-mode.js
│       ├── location.js
│       ├── weather.js
│       ├── budget.js
│       ├── weight-advisor.js
│       ├── notifications.js
│       ├── dashboard.js
│       ├── ml-progress.js
│       ├── ml-tdee.js
│       ├── ml-meals.js
│       └── app.js
```

---

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
pip install -r requirements.txt
```

### 2. **Run Migrations** (Database setup - only needed once)
```bash
python manage.py migrate
```

### 3. **Create a Superuser** (Optional - for Django admin)
```bash
python manage.py createsuperuser
```
Then log in at `http://localhost:8000/admin/`

### 4. **Start Development Server**
```bash
python manage.py runserver
```

The app will run at: **http://localhost:8000**

---

## 📦 Dependencies (Django Stack)

```
Django>=4.2.0              # Web framework
Pillow>=10.0.0             # Image processing
django-cors-headers>=4.3.0 # CORS support
python-dotenv>=1.0.0       # Environment variables
gunicorn>=21.0.0           # Production WSGI server
```

---

## 🔧 Configuration

### Environment Variables (.env)
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
TIME_ZONE=Asia/Kolkata
```

### Important Settings (config/settings.py)
- **DEBUG**: Set to `False` in production
- **SECRET_KEY**: Change to a strong secret in production
- **INSTALLED_APPS**: Includes `django.contrib.auth`, `django.contrib.admin`, `apps.core`
- **CORS_ALLOWED_ORIGINS**: Configure for your frontend domain
- **STATIC_URL**: `/static/` - Django serves CSS/JS automatically

---

## 🗄️ Database Models

### UserProfile
Stores student health profile data:
- Personal info (name, age, gender, weight, height)
- Goals (gain, lose, maintain)
- Activity level, fitness level
- Regional preferences, budget, environment
- Timestamps (created_at, updated_at)

### DailyLog
Tracks daily nutrition and fitness:
- User profile reference
- Calories, macros (protein, carbs, fats)
- Water intake, weight
- Date-stamped entries

---

## 🔌 API Endpoints (Ready to Extend)

### Current Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/` | Main SPA (index.html) |
| `GET` | `/api/health/` | Health check endpoint |
| `GET` | `/admin/` | Django admin panel |

### How to Add More Endpoints
Edit `config/urls.py` and `apps/core/views.py`:
```python
# In views.py
from django.http import JsonResponse

def get_user_data(request, user_id):
    data = UserProfile.objects.get(id=user_id)
    return JsonResponse({'user': str(data)})

# In urls.py
path('api/user/<int:user_id>/', views.get_user_data, name='user-data'),
```

---

## 📊 Admin Panel

Access Django's built-in admin at: `http://localhost:8000/admin/`

Features:
- Manage users, daily logs
- View/edit all FitMind AI data
- Filter by goal, date, activity level
- Full CRUD operations

---

## 🚢 Deployment (Production)

### Using Gunicorn
```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

### Environment Setup for Production
```env
DEBUG=False
SECRET_KEY=very-long-random-secure-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_ENGINE=django.db.backends.postgresql  # Use PostgreSQL instead of SQLite
DB_NAME=fitmind_db
DB_USER=postgres
DB_PASSWORD=secure-password
```

### Using Docker (Optional)
Create a `Dockerfile`:
```dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

---

## 🔐 Security Tips for Production

1. **Change SECRET_KEY** in `.env`
2. **Set DEBUG=False** in production
3. **Use environment variables** for sensitive data
4. **Add HTTPS/SSL certificate** (use Let's Encrypt)
5. **Use PostgreSQL** instead of SQLite
6. **Set up proper CORS** for your frontend domain
7. **Enable Django security middleware** in production settings

---

## 🐛 Troubleshooting

### Port Already in Use?
```bash
python manage.py runserver 8080  # Use different port
```

### Database Issues?
```bash
python manage.py flush           # Reset database
python manage.py migrate         # Re-apply migrations
```

### Static Files Not Loading?
```bash
python manage.py collectstatic   # Collect static files for production
```

### Reset Everything?
```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

---

## 📚 Next Steps

1. ✅ **Frontend is working** — All your JS/CSS files are served correctly
2. 🔄 **Add API endpoints** — Extend `views.py` with REST APIs
3. 🗄️ **Integrate database** — Use Django ORM to save user profiles
4. 🔐 **Add authentication** — Use Django's built-in user system
5. 📱 **Build mobile app** — Use Django REST framework for API
6. ☁️ **Deploy** — Use Gunicorn + Nginx + Docker

---

## 📖 Resources

- [Django Official Docs](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/) (for APIs)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [Gunicorn Documentation](https://gunicorn.org/)

---

## 🎉 You're All Set!

Your FitMind AI application is running on Django. The browser-side ML models (TensorFlow.js) and all your AI features are intact and working perfectly!

**Start your server with:** `python manage.py runserver`

**Access the app at:** `http://localhost:8000`

Happy coding! 🚀
