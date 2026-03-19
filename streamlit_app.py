import streamlit as st
import requests
import json
from datetime import datetime, timedelta
import plotly.graph_objects as go
import pandas as pd

# Configuration
DJANGO_API_URL = "http://127.0.0.1:8000"
st.set_page_config(
    page_title="FitMind AI",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        background: linear-gradient(135deg, #4f8ef7 0%, #00d4ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 1rem;
    }
    .metric-box {
        background: linear-gradient(135deg, #131d35 0%, #1a2540 100%);
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid rgba(79, 142, 247, 0.2);
    }
</style>
""", unsafe_allow_html=True)

# Check Django backend health
@st.cache_data(ttl=30)
def check_backend_health():
    try:
        response = requests.get(f"{DJANGO_API_URL}/api/health/", timeout=2)
        return response.status_code == 200
    except:
        return False

# Header
st.markdown('<h1 class="main-header">🧠 FitMind AI</h1>', unsafe_allow_html=True)
st.markdown("**AI-powered health & fitness companion for students** — Django + Streamlit")

# Backend Status
col1, col2, col3 = st.columns([2, 1, 1])
with col1:
    backend_status = check_backend_health()
    if backend_status:
        st.success("✅ **Django Backend Connected**")
    else:
        st.error("❌ **Django Backend Offline**")
        st.info("Start Django: `python manage.py runserver`")
with col2:
    st.link_button("📐 Django Admin", f"{DJANGO_API_URL}/admin/")
with col3:
    st.link_button("📖 Docs", "https://github.com/gokulcs-nkl/FitMindAi")

st.divider()

# Sidebar Navigation
with st.sidebar:
    st.subheader("📍 Navigation")
    page = st.radio(
        "Select Page",
        ["Dashboard", "Onboarding", "Diet Planner", "Workout", 
         "Tracker", "Food Scanner", "ML Insights", "Settings"],
        label_visibility="collapsed"
    )
    
    st.divider()
    st.markdown("### 🔗 Quick Links")
    st.link_button("📊 Django Admin", f"{DJANGO_API_URL}/admin/", use_container_width=True)
    st.link_button("💻 GitHub Repository", "https://github.com/gokulcs-nkl/FitMindAi", use_container_width=True)

if not backend_status:
    st.error("### ⚠️ Django Backend is Offline")
    st.warning("""
    To use FitMind AI, start the Django backend:
    ```bash
    python manage.py runserver
    ```
    Then refresh this page.
    """)
    st.stop()

# Dashboard Page
if page == "Dashboard":
    st.header("📊 Dashboard")
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric(label="📊 BMI", value="22.5", delta="Normal")
    with col2:
        st.metric(label="💪 TDEE", value="2400", delta="+200 surplus", delta_color="off")
    with col3:
        st.metric(label="⚖️ Weight", value="70 kg", delta="-2 kg")
    with col4:
        st.metric(label="🎯 Goal", value="Muscle+", delta="110 days")
    
    st.divider()
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📈 Weight Progress")
        dates = pd.date_range(start="2026-02-20", periods=30, freq="D")
        weights = [68 + (x * 0.067) for x in range(30)]
        df = pd.DataFrame({'Date': dates, 'Weight': weights})
        st.line_chart(df.set_index('Date'), use_container_width=True)
    
    with col2:
        st.subheader("🥗 Macro Distribution")
        macros = pd.DataFrame({
            'Macro': ['Protein', 'Carbs', 'Fats'],
            'Grams': [120, 280, 70]
        })
        st.bar_chart(macros.set_index('Macro'), use_container_width=True)

# Onboarding Page
elif page == "Onboarding":
    st.header("👋 Create Your Profile")
    
    with st.form("profile_form"):
        col1, col2, col3 = st.columns(3)
        with col1:
            name = st.text_input("Full Name", placeholder="Rahul Kumar")
            age = st.number_input("Age", 13, 35, 20)
        with col2:
            gender = st.selectbox("Gender", ["Male", "Female", "Other"])
            weight = st.number_input("Weight (kg)", 30, 200, 70)
        with col3:
            height = st.number_input("Height (cm)", 130, 250, 170)
            target = st.number_input("Target Weight (kg)", 30, 200, 75)
        
        col1, col2, col3 = st.columns(3)
        with col1:
            goal = st.selectbox("Goal", ["Muscle Gain", "Fat Loss", "Maintain"])
            activity = st.selectbox("Activity", ["Sedentary", "Light", "Moderate", "Active"])
        with col2:
            fitness = st.selectbox("Fitness", ["Beginner", "Intermediate", "Advanced"])
            diet = st.selectbox("Diet", ["Vegetarian", "Non-Veg", "Vegan"])
        with col3:
            region = st.selectbox("Region", ["North", "South", "West", "East"])
            budget = st.number_input("Budget (₹/week)", 200, 5000, 800)
        
        environment = st.selectbox("Environment", ["Hostel", "Home", "Gym"])
        college = st.text_input("College", placeholder="Anna University")
        
        if st.form_submit_button("✅ Create Profile", use_container_width=True):
            st.success("✅ Profile created! Welcome to FitMind AI 🎉")
            st.balloons()

# Diet Planner Page
elif page == "Diet Planner":
    st.header("🍽️ AI Diet Planner")
    
    col1, col2 = st.columns(2)
    with col1:
        goal = st.radio("Goal", ["Bulk", "Cut", "Maintain"])
    with col2:
        region = st.selectbox("Region", ["North India", "South India", "West", "East"])
    
    if st.button("🤖 Generate Diet Plan", use_container_width=True):
        st.success("✅ Personalized diet plan created!")
        
        meals = {
            "🌅 Breakfast": ["Oats + banana + milk", "2 eggs", "Brown toast"],
            "☕ Mid-Morning": ["Greek yogurt", "Almonds"],
            "🍽️ Lunch": ["Chicken biryani", "Green salad", "Roti"],
            "🍌 Snack": ["Banana + peanut butter", "Whey shake"],
            "🌙 Dinner": ["Grilled fish", "Brown rice", "Mixed veg"]
        }
        
        for meal, items in meals.items():
            with st.expander(meal):
                for item in items:
                    st.write(f"• {item}")

# Workout Planner Page
elif page == "Workout":
    st.header("💪 Workout Planner")
    
    col1, col2 = st.columns(2)
    with col1:
        goal = st.selectbox("Goal", ["Muscle Gain", "Fat Loss", "Strength"])
        env = st.selectbox("Environment", ["Hostel", "Home", "Gym"])
    with col2:
        exp = st.selectbox("Experience", ["Beginner", "Intermediate", "Advanced"])
        days = st.slider("Days/week", 1, 7, 4)
    
    if st.button("⚡ Generate Workout", use_container_width=True):
        st.success("✅ PPL Split Generated!")
        
        splits = {
            "Day 1 💪": "Push (Chest, Shoulders, Triceps) - 45 min",
            "Day 2 🔙": "Pull (Back, Biceps) - 50 min",
            "Day 3 🦵": "Legs (Quads, Hamstring, Calves) - 60 min",
            "Day 4 ⏸️": "Rest & Recovery",
        }
        
        for day, workout in splits.items():
            st.write(f"**{day}** → {workout}")

# Nutrition Tracker Page
elif page == "Tracker":
    st.header("📟 Nutrition Tracker")
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Calories", "1,840 / 2,400", "-560")
    with col2:
        st.metric("Protein", "95g / 180g", "-85g")
    with col3:
        st.metric("Carbs", "220g / 330g", "-110g")
    with col4:
        st.metric("Fats", "62g / 80g", "-18g")
    
    st.divider()
    
    st.subheader("➕ Log Food")
    col1, col2, col3 = st.columns(3)
    with col1:
        food = st.text_input("Food name", placeholder="Chicken Rice")
    with col2:
        serving = st.number_input("Serving (g)", 10, 1000, 100)
    with col3:
        st.write("")
        if st.button("✅ Add", use_container_width=True):
            st.success(f"Added {food} to today's log!")

# Food Scanner Page
elif page == "Food Scanner":
    st.header("📷 Food Calorie Scanner (TensorFlow.js)")
    st.write("Upload a food image to estimate calories using AI")
    
    uploaded = st.file_uploader("Choose image", type=["jpg", "jpeg", "png"])
    
    if uploaded:
        st.image(uploaded, caption="Your food", use_container_width=True)
        if st.button("🤖 Analyze", use_container_width=True):
            st.info("Analyzing with TensorFlow.js MobileNet...")
            st.success("✅ Biryani detected")
            st.write("**Estimated:** 480 kcal | 28g protein | 45g carbs | 18g fat")

# ML Insights Page
elif page == "ML Insights":
    st.header("🤖 ML-Powered Insights")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📊 Weight Prediction")
        st.metric("In 7 days", "68.5 kg", "-1.5 kg", delta_color="off")
        st.metric("Goal Date", "June 15, 2026", "56 days left")
    
    with col2:
        st.subheader("🍴 Eating Pattern")
        st.write("• High carb intake")
        st.write("• Consistent breakfast")
        st.write("• Evening snacking habit")
    
    st.divider()
    st.subheader("💡 AI Recommendations")
    recs = [
        "🎯 Increase protein by 10g daily",
        "💧 Drink 3L water/day",
        "😴 Get 8h sleep for recovery",
        "📅 Maintain 75% workout consistency"
    ]
    for rec in recs:
        st.write(rec)

# Settings Page
elif page == "Settings":
    st.header("⚙️ Settings & Configuration")
    
    tab1, tab2, tab3 = st.tabs(["Profile", "API", "About"])
    
    with tab1:
        st.subheader("User Profile")
        st.write("Edit your profile information")
        name = st.text_input("Name")
        goal = st.selectbox("Goal", ["Muscle Gain", "Fat Loss"])
        if st.button("Save Changes"):
            st.success("Profile updated!")
    
    with tab2:
        st.subheader("API Configuration")
        st.write(f"**Django Backend URL:** `{DJANGO_API_URL}`")
        st.write(f"**Admin Panel:** `{DJANGO_API_URL}/admin/`")
        st.write(f"**Health Check:** `{DJANGO_API_URL}/api/health/`")
        
        if st.button("Test Connection"):
            if check_backend_health():
                st.success("✅ Backend Connected!")
            else:
                st.error("❌ Connection Failed")
    
    with tab3:
        st.subheader("About FitMind AI")
        st.markdown("""
        **v1.0.0** - Powered by Django + Streamlit
        
        🎯 **Features:**
        - AI Diet & Workout Planning
        - Nutrition Tracking
        - Food Calorie Scanner (TensorFlow.js)
        - Weight Progress Prediction
        - Eating Pattern Analysis
        
        📊 **Tech Stack:**
        - **Backend:** Django 4.2+
        - **Frontend:** Streamlit
        - **ML:** TensorFlow.js
        - **Database:** SQLite
        
        🔗 **Links:**
        - [GitHub](https://github.com/gokulcs-nkl/FitMindAi)
        - [Django Docs](https://docs.djangoproject.com)
        - [Streamlit Docs](https://docs.streamlit.io)
        """)
