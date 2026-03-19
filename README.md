# 🧠 FitMind AI — Personalized Workout & Diet Planner for Students

> **AI-powered health & fitness companion** built for hostel students and college life.  
> Powered by Django backend with browser-based ML models for ultimate performance.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://gokulcs-nkl.github.io/FitMindAi)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.13-orange?style=for-the-badge&logo=tensorflow)](https://www.tensorflow.org/js)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4-pink?style=for-the-badge)](https://www.chartjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 📸 Screenshots

| Dashboard | Diet Plan | ML Insights |
|-----------|-----------|-------------|
| BMI, calories, charts | AI meal plans | 3 TF.js models live |

---

## ✨ Features (14 Total)

### 🔵 Primary Features
| # | Feature | Description |
|---|---------|-------------|
| 1 | 🍽️ **AI Diet Planner** | TDEE-based regional Indian meal plans (North/South/West/East) |
| 2 | 💪 **AI Workout Planner** | PPL/Full-body splits for Home/Gym/Hostel with progressive overload |
| 3 | 📷 **Image-to-Calorie Scanner** | TensorFlow.js MobileNet food recognition |
| 4 | 📟 **Smart Nutrition Tracker** | Daily food log with macro rings and water tracking |
| 5 | 🎯 **Goal Optimization Engine** | Plateau detection + calorie adjustment recommendations |

### 🟢 Secondary Features
| # | Feature | Description |
|---|---------|-------------|
| 6 | 🏢 **Hostel Student Mode** | Mess meal checklist with live calorie deficit tracking |
| 7 | 📍 **Location-Based Food Finder** | Nearby eateries via OpenStreetMap + Overpass API |
| 8 | 🌤️ **Weather Adaptation** | Diet/hydration advice based on Open-Meteo weather data |
| 9 | 💰 **Budget Intelligence** | ₹ food spend tracking with best-value food rankings |
| 10 | ⚖️ **Weight Gain Advisor** | Personalized strategies + high-calorie food suggestions |

### 🟡 Supporting Utilities
| # | Feature | Description |
|---|---------|-------------|
| 11 | ➕ **Custom Food Entry** | Add your own foods with macros |
| 12 | 📊 **Progress Dashboard** | 4 Chart.js charts (weight trend, calorie history, macros, workouts) |
| 13 | 🔔 **Smart Notifications** | Browser-native meal/water/workout reminders |
| 14 | 📅 **Data History & Export** | Full log history + JSON export |

---

## 🤖 ML Models (TensorFlow.js)

Three real ML models trained on user data, running 100% in-browser:

| Model | Type | Purpose |
|-------|------|---------|
| **Weight Progress Predictor** | Linear Regression | Predicts weight at 7/30/60 days, estimates goal date |
| **Adaptive TDEE Neural Net** | 2-Layer Dense NN (5→16→8→1) | Pre-trained on 50 profiles, fine-tunes on your real weight changes |
| **Meal Pattern Analyzer** | K-Means Clustering (k=3) | Detects eating patterns: Balanced / High Carb / Under-eating |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | HTML5, CSS3 (Glassmorphism dark theme), Vanilla JavaScript |
| ML / AI | TensorFlow.js 4.13, MobileNet (food scanner) |
| Charts | Chart.js 4.4 |
| APIs | Open-Meteo (weather), OpenStreetMap + Overpass (location) |
| Fonts | Google Fonts — Inter, Outfit |
| Storage | Browser localStorage (no backend) |

---

## 📁 Project Structure

```
FitMindAi/
├── index.html              # SPA shell + 4-step onboarding modal
├── css/
│   ├── global.css          # Dark theme, variables, sidebar, responsive
│   ├── components.css      # Cards, badges, progress bars, toggles
│   └── pages.css           # Page-specific layouts
└── js/
    ├── data/
    │   ├── foods.js        # 100+ Indian foods with macros + cost
    │   ├── exercises.js    # 60+ exercises (home/gym/hostel)
    │   └── meal-plans.js   # Regional meal templates
    ├── storage.js          # localStorage CRUD
    ├── ai-diet.js          # TDEE + meal plan generator
    ├── ai-workout.js       # Workout splits + progressive overload
    ├── calorie-image.js    # TF.js MobileNet food scanner
    ├── tracker.js          # Daily nutrition tracker UI
    ├── goal-engine.js      # Plateau detection
    ├── hostel-mode.js      # Mess meal add-ons database
    ├── location.js         # Geolocation + Overpass API
    ├── weather.js          # Open-Meteo integration
    ├── budget.js           # ₹ budget tracking
    ├── weight-advisor.js   # Weight gain strategies
    ├── notifications.js    # Browser notification API
    ├── dashboard.js        # Chart.js dashboard charts
    ├── ml-progress.js      # 🤖 ML: Weight regression model
    ├── ml-tdee.js          # 🤖 ML: Adaptive TDEE neural network
    ├── ml-meals.js         # 🤖 ML: Meal pattern K-means clustering
    └── app.js              # SPA router + all page renderers
```

---

## 🚀 Getting Started

### Option 1 — Open directly
Just double-click `index.html` in Chrome or Edge. No setup needed!

### Option 2 — Local server (recommended)
```bash
python -m http.server 8765
```
Then open `http://localhost:8765`

### Option 3 — GitHub Pages
Enable Pages in repo Settings → deploy from `main` branch.  
Live at: `https://gokulcs-nkl.github.io/FitMindAi`

---

## 📊 API Integrations

| API | Purpose | Auth Required |
|-----|---------|--------------|
| TensorFlow.js | Food image recognition + ML models | ❌ No |
| Chart.js | Dashboard data visualization | ❌ No |
| Open-Meteo | Real-time weather data | ❌ No |
| OpenStreetMap / Overpass | Nearby food establishments | ❌ No |
| Browser Geolocation API | User location (with permission) | ❌ No |
| Browser Notification API | Meal/workout reminders | ❌ No |

---

## 👨‍💻 Built By

**Gokul C S** — Internship Project @ Edunet Foundation (IBM SkillsBuild)

---

## 📄 License

MIT License — free to use, modify, and distribute.
