// ==========================================
// MAIN APP — FitMind AI
// SPA Router + Onboarding + Page Renderers
// ==========================================

// ====== GLOBAL UTILS ======
window.showToast = (msg, duration = 3000) => {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), duration);
};

window.toggleSidebar = () => {
  document.getElementById('sidebar')?.classList.toggle('open');
};

// ====== NAVIGATION ======
window.navigate = (page) => {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === page));
  document.querySelectorAll('.tab-item').forEach(l => l.classList.toggle('active', l.dataset.page === page));
  document.getElementById('sidebar')?.classList.remove('open');
  renderPage(page);
};

function renderPage(page) {
  const main = document.getElementById('main-content');
  if (!main) return;
  window.Dashboard.destroyCharts();
  switch (page) {
    case 'dashboard': main.innerHTML = renderDashboard(); setTimeout(initDashboardCharts, 100); break;
    case 'diet': main.innerHTML = renderDiet(); break;
    case 'workout': main.innerHTML = renderWorkout(); break;
    case 'tracker': main.innerHTML = window.Tracker.renderPage(); break;
    case 'scanner': main.innerHTML = renderScanner(); break;
    case 'hostel': main.innerHTML = renderHostel(); break;
    case 'ml-insights': main.innerHTML = renderMLInsightsShell(); initMLInsights(); break;
    case 'advisor': main.innerHTML = renderAdvisor(); break;
    case 'budget': main.innerHTML = renderBudget(); break;
    case 'history': main.innerHTML = renderHistory(); break;
    case 'settings': main.innerHTML = renderSettings(); break;
    default: main.innerHTML = renderDashboard(); setTimeout(initDashboardCharts, 100);
  }
}

// ====== DASHBOARD PAGE ======
function renderDashboard() {
  const profile = window.Store.getProfile();
  const plan = window.Store.getDietPlan();
  const totals = window.Store.getDayTotals();
  const weightLog = window.Store.getWeightLog();
  const latestWeight = window.Store.getLatestWeight();
  const currentWeight = latestWeight?.weight || profile?.weight || '--';
  const bmi = plan?.bmi || (profile ? window.AIDiet.calculateBMI(profile.weight, profile.height) : null);
  const bmiCat = bmi ? window.AIDiet.getBMICategory(bmi) : null;
  const bmiPct = bmi ? Math.min(100, Math.max(0, ((bmi - 10) / (45 - 10)) * 100)) : 50;
  const target = plan?.calorieTarget || 2000;
  const calPct = Math.min(100, Math.round(totals.kcal / target * 100));

  // Streak
  const logs7 = window.Store.getLastNDays(7);
  const loggedDays = logs7.filter(d => d.log && d.log.foods && d.log.foods.length > 0).length;
  const allLogs = window.Store.get(window.Store.KEYS.DAILY_LOG, {});
  const workoutDays = logs7.filter(d => allLogs[d.date]?.workoutDone).length;

  return `
<div class="page-header">
  <h1>Welcome back, <span class="text-gradient">${profile?.name?.split(' ')[0] || 'Athlete'}</span> 👋</h1>
  <p class="page-subtitle">${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
</div>
<div class="dashboard-stats">
  <div class="stat-card card-gradient-blue"><div class="stat-label">Today's Calories</div><div class="stat-value" style="color:var(--accent-cyan)">${totals.kcal}</div><div class="stat-change">${target > 0 ? `/ ${target} kcal target` : ''}</div></div>
  <div class="stat-card card-gradient-green"><div class="stat-label">Current Weight</div><div class="stat-value" style="color:var(--accent-green)">${currentWeight}</div><div class="stat-change">kg · Target: ${profile?.targetWeight || '--'}kg</div></div>
  <div class="stat-card card-gradient-orange"><div class="stat-label">Protein Today</div><div class="stat-value" style="color:var(--accent-orange)">${totals.protein}<span style="font-size:1rem">g</span></div><div class="stat-change">/ ${plan?.macros?.protein || '--'}g target</div></div>
  <div class="stat-card card-gradient-purple"><div class="stat-label">BMI</div><div class="stat-value" style="color:${bmiCat?.color || 'var(--accent-blue)'}">${bmi || '--'}</div><div class="stat-change" style="color:${bmiCat?.color}">${bmiCat?.label || '--'}</div></div>
</div>
<div class="grid-2">
  <div class="card">
    <div class="card-header"><div class="card-title">📊 BMI Tracker</div><span class="badge badge-${bmiCat?.label === 'Normal' ? 'green' : bmiCat?.label === 'Underweight' ? 'blue' : 'orange'}">${bmiCat?.label || '--'}</span></div>
    <div class="bmi-display">
      <div><div class="bmi-value" style="color:${bmiCat?.color || 'var(--accent-blue)'}">${bmi || '--'}</div><div class="bmi-category" style="color:${bmiCat?.color}">${bmiCat?.label || 'Calculate'}</div><p style="font-size:0.78rem;color:var(--text-secondary);margin-top:6px">${bmiCat?.advice || 'Complete onboarding to see BMI'}</p></div>
    </div>
    <div class="bmi-bar-container"><div class="bmi-bar"><div class="bmi-indicator" style="left:${bmiPct}%"></div></div><div style="display:flex;justify-content:space-between;font-size:0.7rem;color:var(--text-muted);margin-top:4px"><span>10</span><span>18.5</span><span>25</span><span>30</span><span>45</span></div></div>
  </div>
  <div class="card">
    <div class="card-header"><div class="card-title">⚡ Weekly Streaks</div></div>
    <div class="streak-display">
      <div class="streak-item"><div class="streak-num" style="color:var(--accent-cyan)">${loggedDays}</div><div class="streak-label">Days Tracked</div></div>
      <div class="streak-item"><div class="streak-num" style="color:var(--accent-green)">${workoutDays}</div><div class="streak-label">Workouts Done</div></div>
      <div class="streak-item"><div class="streak-num" style="color:var(--accent-orange)">${calPct}%</div><div class="streak-label">Today's Goal</div></div>
    </div>
    <div style="margin-top:16px">
      <div class="progress-container"><div class="progress-label"><span>Today's Calories</span><span>${totals.kcal}/${target}</span></div><div class="progress-bar"><div class="progress-fill blue" style="width:${calPct}%"></div></div></div>
    </div>
    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn-sm btn-primary" onclick="navigate('diet')">🍽️ View Diet Plan</button>
      <button class="btn-sm btn-outline" onclick="navigate('workout')">💪 Today's Workout</button>
    </div>
  </div>
</div>
<div class="charts-grid">
  <div class="chart-card"><div class="chart-title">⚖️ Weight Trend (Last 14 Days)</div><div class="chart-container" style="height:200px">${weightLog.length > 1 ? '<canvas id="chart-weight"></canvas>' : '<div class="empty-state" style="padding:20px"><div class="empty-icon" style="font-size:2rem">⚖️</div><div class="empty-desc">Log your weight to see trends</div><button class="btn-sm btn-primary" onclick="showWeightInput()">+ Add Weight</button></div>'}</div></div>
  <div class="chart-card"><div class="chart-title">🔥 7-Day Calorie History</div><div class="chart-container" style="height:200px"><canvas id="chart-calories"></canvas></div></div>
  <div class="chart-card"><div class="chart-title">🥗 Today's Macro Split</div><div class="chart-container" style="height:200px"><canvas id="chart-macros"></canvas></div></div>
  <div class="chart-card"><div class="chart-title">🏋️ Workout Completion (7 Days)</div><div class="chart-container" style="height:200px"><canvas id="chart-workout"></canvas></div></div>
</div>
<div id="weight-input-area"></div>`;
}

window.showWeightInput = () => {
  document.getElementById('weight-input-area').innerHTML = `
<div class="card" style="margin-top:20px">
  <h3>⚖️ Log Today's Weight</h3>
  <div style="display:flex;gap:12px;margin-top:14px;align-items:center">
    <input type="number" id="weight-input" placeholder="e.g. 68.5" step="0.1" style="max-width:150px" />
    <span style="color:var(--text-secondary)">kg</span>
    <button class="btn-primary btn-sm" onclick="saveWeight()">Save</button>
  </div>
</div>`;
};

window.saveWeight = () => {
  const val = parseFloat(document.getElementById('weight-input')?.value);
  if (!val || val < 20 || val > 300) { window.showToast('❌ Invalid weight'); return; }
  window.Store.addWeightEntry(val);
  window.showToast('✅ Weight logged!');
  navigate('dashboard');
};

function initDashboardCharts() {
  const plan = window.Store.getDietPlan();
  const totals = window.Store.getDayTotals();
  const macros = plan?.macros || { protein: 150, carbs: 250, fat: 67 };
  const days7 = window.Store.getLastNDays(7);
  const weightLog = window.Store.getWeightLog();
  window.Dashboard.initCalorieChart('chart-calories', days7);
  window.Dashboard.initMacroChart('chart-macros', totals, macros);
  window.Dashboard.initWorkoutChart('chart-workout', days7);
  if (weightLog.length > 1) window.Dashboard.initWeightChart('chart-weight', weightLog);
}

// ====== DIET PAGE ======
function renderDiet() {
  const plan = window.Store.getDietPlan();
  const profile = window.Store.getProfile();
  if (!plan) return `<div class="page-header"><h1 class="text-gradient">🍽️ Diet Plan</h1></div><div class="empty-state"><div class="empty-icon">🤖</div><div class="empty-title">Generating your plan...</div><div class="empty-desc">Complete onboarding first</div></div>`;

  const mealIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snacks: '🍪' };
  const mealColors = { breakfast: 'orange', lunch: 'green', dinner: 'purple', snacks: 'blue' };

  const mealsHtml = Object.entries(plan.meals).map(([type, meal]) => `
    <div style="margin-bottom:20px">
      <div class="meal-time-header">
        <span class="meal-time-badge">${mealIcons[type] || '🍽️'} ${type.charAt(0).toUpperCase() + type.slice(1)}</span>
        <span style="font-size:0.8rem;color:var(--text-secondary)">${meal.totals.kcal} kcal · Target: ${meal.targetKcal} kcal</span>
      </div>
      <div class="meal-card">
        <div class="meal-card-header"><div class="meal-name">${meal.label}</div><div class="meal-kcal">${meal.totals.kcal} kcal</div></div>
        <div class="meal-macros">
          <div class="macro-chip"><div class="macro-dot protein"></div>${meal.totals.protein}g Protein</div>
          <div class="macro-chip"><div class="macro-dot carbs"></div>${meal.totals.carbs}g Carbs</div>
          <div class="macro-chip"><div class="macro-dot fat"></div>${meal.totals.fat}g Fat</div>
        </div>
        <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px">
          ${meal.foods.map(f => `<span style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:20px;padding:4px 10px;font-size:0.75rem">${f.emoji || '🍽️'} ${f.name}</span>`).join('')}
        </div>
      </div>
    </div>`).join('');

  return `
<div class="page-header">
  <h1 class="text-gradient">🍽️ Your AI Diet Plan</h1>
  <p class="page-subtitle">Personalized for ${profile?.name} · Goal: ${profile?.goal?.toUpperCase()}</p>
</div>
<div class="diet-grid">
  <div>
    <div class="alert alert-info"><span class="alert-icon">🤖</span>AI-generated meal plan based on your TDEE, region (${profile?.region}), and food preference (${profile?.foodPreference})</div>
    ${mealsHtml}
    <button class="btn-primary" onclick="regenerateDiet()">🔄 Regenerate Plan</button>
  </div>
  <div>
    <div class="calorie-target-card">
      <div class="calorie-target-label">Daily Calorie Target</div>
      <div class="calorie-target-num">${plan.calorieTarget}</div>
      <div class="calorie-target-label">kcal/day · TDEE: ${plan.tdee}</div>
    </div>
    <div class="nutrition-summary">
      <h3>📊 Macro Targets</h3>
      <div class="macro-stat"><span class="macro-stat-name">🔵 Protein</span><span class="macro-stat-val" style="color:var(--accent-blue)">${plan.macros.protein}g</span></div>
      <div class="macro-stat"><span class="macro-stat-name">🟠 Carbs</span><span class="macro-stat-val" style="color:var(--accent-orange)">${plan.macros.carbs}g</span></div>
      <div class="macro-stat"><span class="macro-stat-name">🟡 Fat</span><span class="macro-stat-val" style="color:var(--accent-yellow)">${plan.macros.fat}g</span></div>
      <div class="macro-stat"><span class="macro-stat-name">💧 Water</span><span class="macro-stat-val" style="color:var(--accent-cyan)">${window.AIDiet.getWaterGoal(profile?.weight || 70).liters}L</span></div>
      <div style="margin-top:16px"><button class="btn-primary w-full" onclick="navigate('tracker')">📟 Start Tracking Today</button></div>
    </div>
  </div>
</div>`;
}

window.regenerateDiet = () => {
  const profile = window.Store.getProfile();
  if (!profile) return;
  const plan = window.AIDiet.generateMealPlan(profile);
  window.Store.setDietPlan(plan);
  window.showToast('✅ New meal plan generated!');
  navigate('diet');
};

// ====== WORKOUT PAGE ======
function renderWorkout() {
  const plan = window.Store.getWorkoutPlan();
  const profile = window.Store.getProfile();
  if (!plan) return `<div class="page-header"><h1>💪 Workout Plan</h1></div><div class="empty-state"><div class="empty-icon">🏋️</div><div class="empty-title">No plan yet</div><button class="btn-primary" onclick="generateWorkoutPlan()">Generate Plan</button></div>`;

  const today = window.AIWorkout.getTodayWorkout(plan);
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  const daysHtml = plan.schedule.map((day, idx) => `
    <div class="day-pill ${idx === todayIdx ? 'active' : ''} ${day.isRest ? 'rest' : ''}" onclick="selectDay(${idx})">
      <span>${day.dayShort}</span>
      <strong>${day.isRest ? '😴' : day.type.split('/')[0]}</strong>
    </div>`).join('');

  const activeDay = window.currentWorkoutDay !== undefined ? plan.schedule[window.currentWorkoutDay] : today;
  const dayIdx = window.currentWorkoutDay !== undefined ? window.currentWorkoutDay : todayIdx;

  const exHtml = activeDay && !activeDay.isRest ? activeDay.exercises.map((ex, i) => `
    <div class="exercise-card">
      <div class="exercise-num">${i + 1}</div>
      <div class="exercise-info">
        <div class="exercise-name">${ex.emoji || '💪'} ${ex.name}</div>
        <div class="exercise-detail">${ex.sets} sets × ${ex.reps} reps · Rest: ${ex.rest}</div>
        <div class="exercise-detail" style="margin-top:3px;color:var(--text-muted);font-size:0.74rem">💡 ${ex.tip}</div>
      </div>
      <div class="exercise-badge">
        <span class="badge badge-${ex.group === 'chest' || ex.group === 'shoulders' ? 'orange' : ex.group === 'back' || ex.group === 'arms' ? 'blue' : 'green'}">${ex.group}</span>
        <span style="font-size:0.72rem;color:var(--text-secondary)">${ex.calories_per_min || 6} kcal/min</span>
      </div>
    </div>`).join('') : `<div class="empty-state"><div class="empty-icon">😴</div><div class="empty-title">Rest Day</div><div class="empty-desc">Recovery is part of the process. Light walk or stretching is fine.</div></div>`;

  return `
<div class="page-header">
  <h1 class="text-gradient">💪 Workout Plan</h1>
  <p class="page-subtitle">${plan.split} Split · Week ${plan.weekNumber} · ${profile?.environment?.charAt(0).toUpperCase() + profile?.environment?.slice(1)} Mode</p>
</div>
<div class="workout-grid">
  <div>
    <div class="card">
      <div class="card-title" style="margin-bottom:14px">📅 This Week</div>
      <div class="week-days">${daysHtml}</div>
      <div style="margin-top:12px">
        ${window.AIWorkout.getWorkoutTips(profile?.goal, '').slice(0, 2).map(t => `<div class="alert alert-info" style="margin-bottom:8px"><span class="alert-icon">💡</span>${t}</div>`).join('')}
      </div>
      <button class="btn-outline w-full" style="margin-top:12px" onclick="generateWorkoutPlan()">🔄 Regenerate</button>
    </div>
  </div>
  <div>
    <div class="workout-day-header">
      <h3>${activeDay?.day} — ${activeDay?.isRest ? 'Rest Day' : activeDay?.type}</h3>
      ${activeDay && !activeDay.isRest ? `<div style="display:flex;gap:8px">
        <span class="badge badge-blue">⏱ ${activeDay.estimatedDuration}</span>
        <span class="badge badge-orange">🔥 ~${window.AIWorkout.estimateCaloriesBurned(activeDay, profile?.weight)} kcal</span>
      </div>` : ''}
    </div>
    ${exHtml}
    ${activeDay && !activeDay.isRest ? `<button class="btn-green w-full" style="margin-top:16px" onclick="markWorkoutComplete()">✅ Mark Complete</button>` : ''}
  </div>
</div>`;
}

window.currentWorkoutDay = undefined;
window.selectDay = (idx) => { window.currentWorkoutDay = idx; navigate('workout'); };
window.generateWorkoutPlan = () => {
  const profile = window.Store.getProfile();
  if (!profile) return;
  const plan = window.AIWorkout.generateWorkoutPlan(profile);
  window.Store.setWorkoutPlan(plan);
  window.showToast('💪 Workout plan generated!');
  navigate('workout');
};
window.markWorkoutComplete = () => {
  window.Store.markWorkoutDone(true);
  window.showToast('🏆 Workout completed! Great job!');
  navigate('workout');
};

// ====== SCANNER PAGE ======
function renderScanner() {
  return `
<div class="page-header">
  <h1 class="text-gradient">📷 Food Scanner</h1>
  <p class="page-subtitle">Upload a food photo to estimate calories using AI</p>
</div>
<div class="scanner-layout">
  <div>
    <div class="upload-zone" id="upload-zone" onclick="document.getElementById('file-input').click()" ondragover="event.preventDefault();this.classList.add('dragging')" ondragleave="this.classList.remove('dragging')" ondrop="Scanner.handleDrop(event)">
      <span class="upload-icon">📸</span>
      <div class="upload-title">Click or drag a food photo here</div>
      <div class="upload-hint">Supports JPG, PNG, WebP · Powered by TensorFlow.js MobileNet</div>
    </div>
    <input type="file" id="file-input" accept="image/*" class="hidden" onchange="Scanner.handleFile(this)" />
    <img id="scan-preview" class="scan-preview hidden" alt="Food preview" />
    <div id="scan-loading" class="loading-overlay hidden"><div class="spinner"></div><span>Analyzing image with AI...</span></div>
  </div>
  <div>
    <div id="scan-result" class="scan-result">
      <div class="empty-state"><div class="empty-icon">🤖</div><div class="empty-title">AI Ready</div><div class="empty-desc">Upload a food image to detect calories, protein, carbs and fat automatically.</div></div>
    </div>
  </div>
</div>`;
}

window.Scanner = {
  handleFile(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => this.analyzeDataUrl(e.target.result);
    reader.readAsDataURL(file);
  },
  handleDrop(e) {
    e.preventDefault();
    document.getElementById('upload-zone').classList.remove('dragging');
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = ev => this.analyzeDataUrl(ev.target.result);
    reader.readAsDataURL(file);
  },
  async analyzeDataUrl(dataUrl) {
    const preview = document.getElementById('scan-preview');
    const loading = document.getElementById('scan-loading');
    const resultEl = document.getElementById('scan-result');
    preview.src = dataUrl;
    preview.classList.remove('hidden');
    loading.classList.remove('hidden');
    resultEl.innerHTML = '';
    const img = new Image();
    img.onload = async () => {
      try {
        const result = await window.CalorieScanner.analyzeImage(img);
        loading.classList.add('hidden');
        if (!result.success) {
          resultEl.innerHTML = `<div class="alert alert-warning"><span class="alert-icon">⚠️</span>${result.message}</div>
          <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:8px">Top guesses: ${(result.predictions || []).map(p => p.className).join(', ')}</p>`;
          return;
        }
        resultEl.innerHTML = `
          <div class="result-food-name">${result.food.emoji || '🍽️'} ${result.food.name}</div>
          <div class="result-confidence">AI Confidence: ${result.confidence}% · ${result.portionSize}</div>
          <div class="grid-2" style="gap:12px;margin-bottom:16px">
            <div class="stat-card"><div class="stat-label">Calories</div><div class="stat-value" style="color:var(--accent-orange);font-size:1.6rem">${result.estimatedKcal}</div></div>
            <div class="stat-card"><div class="stat-label">Protein</div><div class="stat-value" style="color:var(--accent-blue);font-size:1.6rem">${result.estimatedProtein}g</div></div>
            <div class="stat-card"><div class="stat-label">Carbs</div><div class="stat-value" style="color:var(--accent-yellow);font-size:1.6rem">${result.estimatedCarbs}g</div></div>
            <div class="stat-card"><div class="stat-label">Fat</div><div class="stat-value" style="color:var(--accent-green);font-size:1.6rem">${result.estimatedFat}g</div></div>
          </div>
          ${result.uncertain ? '<div class="alert alert-warning"><span class="alert-icon">⚠️</span>Low confidence detection. Values are estimates.</div>' : ''}
          <button class="btn-green w-full" onclick="Scanner.addToTracker(${JSON.stringify(JSON.stringify({ ...result.food, kcal: result.estimatedKcal, protein: result.estimatedProtein, carbs: result.estimatedCarbs, fat: result.estimatedFat }))})">➕ Add to Today's Tracker</button>`;
      } catch (err) {
        loading.classList.add('hidden');
        resultEl.innerHTML = `<div class="alert alert-danger"><span class="alert-icon">❌</span>Error: ${err.message}. Please check internet connection.</div>`;
      }
    };
    img.src = dataUrl;
  },
  addToTracker(jsonStr) {
    const food = JSON.parse(jsonStr);
    window.Store.addFoodToLog({ ...food, quantity: 1 });
    window.showToast(`✅ ${food.name} added to tracker!`);
    navigate('tracker');
  }
};

// ====== HOSTEL PAGE ======
// Storage key for mess menu
const MESS_MENU_KEY = 'fitmind_mess_menu';
const MESS_CHECKLIST_KEY = 'fitmind_mess_checklist';

function getMessMenu() {
  try { return JSON.parse(localStorage.getItem(MESS_MENU_KEY)) || getDefaultMessMenu(); } catch { return getDefaultMessMenu(); }
}
function saveMessMenu(menu) { localStorage.setItem(MESS_MENU_KEY, JSON.stringify(menu)); }
function getMessChecklist() {
  const today = window.Store.getTodayKey();
  try {
    const data = JSON.parse(localStorage.getItem(MESS_CHECKLIST_KEY)) || {};
    return data[today] || {};
  } catch { return {}; }
}
function saveMessChecklist(checklist) {
  const today = window.Store.getTodayKey();
  try {
    const data = JSON.parse(localStorage.getItem(MESS_CHECKLIST_KEY)) || {};
    data[today] = checklist;
    localStorage.setItem(MESS_CHECKLIST_KEY, JSON.stringify(data));
  } catch { }
}

function getDefaultMessMenu() {
  return {
    breakfast: [
      { id: 'b1', name: 'Idli (3 pcs)', kcal: 210, protein: 6, carbs: 45, fat: 1 },
      { id: 'b2', name: 'Sambar (1 bowl)', kcal: 80, protein: 4, carbs: 10, fat: 2 },
      { id: 'b3', name: 'Chutney', kcal: 40, protein: 1, carbs: 4, fat: 2 },
      { id: 'b4', name: 'Tea / Coffee', kcal: 35, protein: 1, carbs: 5, fat: 1 },
    ],
    lunch: [
      { id: 'l1', name: 'Rice (2 cups)', kcal: 340, protein: 6, carbs: 76, fat: 0.6 },
      { id: 'l2', name: 'Dal (1 ladle)', kcal: 120, protein: 7, carbs: 16, fat: 3 },
      { id: 'l3', name: 'Sabzi (1 serving)', kcal: 90, protein: 2, carbs: 10, fat: 4 },
      { id: 'l4', name: 'Roti (2 pcs)', kcal: 180, protein: 5, carbs: 36, fat: 1 },
      { id: 'l5', name: 'Papad', kcal: 50, protein: 2, carbs: 7, fat: 1 },
    ],
    snacks: [
      { id: 's1', name: 'Evening Tea', kcal: 35, protein: 1, carbs: 5, fat: 1 },
      { id: 's2', name: 'Biscuits (4 pcs)', kcal: 100, protein: 1, carbs: 16, fat: 4 },
    ],
    dinner: [
      { id: 'd1', name: 'Chapati (3 pcs)', kcal: 270, protein: 7, carbs: 54, fat: 2 },
      { id: 'd2', name: 'Paneer Curry', kcal: 180, protein: 10, carbs: 8, fat: 12 },
      { id: 'd3', name: 'Rice (1 cup)', kcal: 170, protein: 3, carbs: 38, fat: 0.3 },
      { id: 'd4', name: 'Dal Fry', kcal: 130, protein: 7, carbs: 14, fat: 4 },
      { id: 'd5', name: 'Buttermilk', kcal: 40, protein: 2, carbs: 3, fat: 1 },
    ],
  };
}

function renderHostel() {
  const profile = window.Store.getProfile();
  const plan = window.Store.getDietPlan();
  const calorieTarget = plan?.calorieTarget || 2500;
  const menu = getMessMenu();
  const checklist = getMessChecklist();
  const mealIcons = { breakfast: '🌅', lunch: '☀️', snacks: '🍪', dinner: '🌙' };
  const mealColors = { breakfast: 'orange', lunch: 'green', snacks: 'blue', dinner: 'purple' };

  // Calculate totals from checked items
  let totalKcal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
  Object.entries(menu).forEach(([mealType, items]) => {
    items.forEach(item => {
      if (checklist[item.id]) {
        totalKcal += item.kcal;
        totalProtein += item.protein;
        totalCarbs += item.carbs;
        totalFat += item.fat;
      }
    });
  });

  const deficit = Math.max(0, calorieTarget - totalKcal);
  const surplus = Math.max(0, totalKcal - calorieTarget);
  const calPct = Math.min(100, Math.round(totalKcal / calorieTarget * 100));
  const ringColor = calPct >= 100 ? '#ff5252' : calPct >= 80 ? '#ffd740' : '#4f8ef7';

  // Meal checklist HTML
  const mealsHtml = Object.entries(menu).map(([mealType, items]) => {
    const mealKcal = items.filter(i => checklist[i.id]).reduce((s, i) => s + i.kcal, 0);
    const totalMealKcal = items.reduce((s, i) => s + i.kcal, 0);
    return `
<div class="card" style="margin-bottom:18px">
  <div class="card-header">
    <div class="card-title">${mealIcons[mealType]} ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}</div>
    <div style="display:flex;align-items:center;gap:10px">
      <span style="font-size:0.82rem;color:var(--text-secondary)">${mealKcal}/${totalMealKcal} kcal eaten</span>
      <button class="btn-sm btn-outline" onclick="Hostel.addMealItem('${mealType}')" title="Add food item">+ Add Item</button>
    </div>
  </div>
  <div class="mess-meal-list">
    ${items.map(item => `
    <div class="mess-item ${checklist[item.id] ? 'checked' : ''}">
      <label class="mess-check-label">
        <input type="checkbox" class="mess-checkbox" ${checklist[item.id] ? 'checked' : ''}
          onchange="Hostel.toggleItem('${item.id}', this.checked)" />
        <span class="mess-item-name">${item.name}</span>
      </label>
      <div class="mess-item-details">
        <span class="mess-kcal-badge">${item.kcal} kcal</span>
        <span class="mess-macro-chip">P:${item.protein}g</span>
        <span class="mess-macro-chip">C:${item.carbs}g</span>
        <span class="mess-macro-chip">F:${item.fat}g</span>
        <button class="mess-delete-btn" onclick="Hostel.removeItem('${mealType}','${item.id}')" title="Remove">✕</button>
      </div>
    </div>`).join('')}
  </div>
</div>`;
  }).join('');

  // Smart add-on suggestions based on deficit
  const goal = profile?.goal || 'gain';
  const suggestedAddons = window.HostelMode.getAddonsForGoal(goal, deficit, 200).slice(0, 4);

  return `
<div class="page-header">
  <h1 class="text-gradient">🏢 Hostel Student Mode</h1>
  <p class="page-subtitle">Track your mess meals · See how many calories you still need · Add smart supplements</p>
</div>

<div class="hostel-layout">
  <!-- LEFT: Meal Checklist -->
  <div>
    <div class="alert alert-info" style="margin-bottom:18px">
      <span class="alert-icon">📋</span>
      Check each item you <strong>actually ate</strong> from today's mess menu. Add or remove items below.
    </div>
    ${mealsHtml}
    <button class="btn-outline w-full" onclick="Hostel.resetMenu()">🔄 Reset to Default Menu</button>
  </div>

  <!-- RIGHT: Summary Panel -->
  <div>
    <!-- Calorie Summary Card -->
    <div class="card card-gradient-blue" style="margin-bottom:20px">
      <div class="card-title" style="margin-bottom:14px">🎯 Calorie Summary</div>
      <div style="display:flex;justify-content:space-between;margin-bottom:16px">
        <div style="text-align:center">
          <div style="font-size:2rem;font-weight:800;color:${ringColor}">${totalKcal}</div>
          <div style="font-size:0.72rem;color:var(--text-secondary)">kcal eaten</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:2rem;font-weight:800;color:var(--accent-orange)">${calorieTarget}</div>
          <div style="font-size:0.72rem;color:var(--text-secondary)">kcal target</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:2rem;font-weight:800;color:${deficit > 0 ? 'var(--accent-red)' : 'var(--accent-green)'}">${deficit > 0 ? deficit : surplus}</div>
          <div style="font-size:0.72rem;color:var(--text-secondary)">${deficit > 0 ? 'kcal needed' : 'kcal over'}</div>
        </div>
      </div>
      <div class="progress-container">
        <div class="progress-label"><span>Progress to Goal</span><span style="color:${ringColor}">${calPct}%</span></div>
        <div class="progress-bar" style="height:12px">
          <div class="progress-fill" style="width:${calPct}%;background:${ringColor};border-radius:6px;transition:width 0.4s ease"></div>
        </div>
      </div>
      ${deficit > 0
      ? `<div class="alert alert-warning" style="margin-top:12px;padding:10px 14px">
            <span class="alert-icon">⚠️</span>You need <strong>${deficit} more kcal</strong> to hit your daily goal. Add the items below!
           </div>`
      : `<div class="alert alert-success" style="margin-top:12px;padding:10px 14px">
            <span class="alert-icon">✅</span>Goal reached! ${surplus > 0 ? `You are ${surplus} kcal over target.` : 'Exactly on target!'}
           </div>`}
    </div>

    <!-- Macro Totals -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-title" style="margin-bottom:14px">📊 Today's Macros from Mess</div>
      <div class="grid-2" style="gap:10px">
        <div style="background:rgba(79,142,247,0.1);border:1px solid rgba(79,142,247,0.3);border-radius:10px;padding:10px;text-align:center">
          <div style="font-size:1.4rem;font-weight:700;color:var(--accent-blue)">${Math.round(totalProtein)}g</div>
          <div style="font-size:0.72rem;color:var(--text-secondary)">Protein</div>
        </div>
        <div style="background:rgba(255,112,67,0.1);border:1px solid rgba(255,112,67,0.3);border-radius:10px;padding:10px;text-align:center">
          <div style="font-size:1.4rem;font-weight:700;color:var(--accent-orange)">${Math.round(totalCarbs)}g</div>
          <div style="font-size:0.72rem;color:var(--text-secondary)">Carbs</div>
        </div>
        <div style="background:rgba(255,215,64,0.1);border:1px solid rgba(255,215,64,0.3);border-radius:10px;padding:10px;text-align:center">
          <div style="font-size:1.4rem;font-weight:700;color:var(--accent-yellow)">${Math.round(totalFat)}g</div>
          <div style="font-size:0.72rem;color:var(--text-secondary)">Fat</div>
        </div>
        <div style="background:rgba(0,230,118,0.1);border:1px solid rgba(0,230,118,0.3);border-radius:10px;padding:10px;text-align:center">
          <div style="font-size:1.4rem;font-weight:700;color:var(--accent-green)">${Math.round(totalKcal)}</div>
          <div style="font-size:0.72rem;color:var(--text-secondary)">Total kcal</div>
        </div>
      </div>
      <button class="btn-primary w-full" style="margin-top:14px" onclick="Hostel.addAllCheckedToTracker()">
        ➕ Add All Checked Meals to Tracker
      </button>
    </div>

    <!-- Smart Add-ons to fill deficit -->
    ${deficit > 0 ? `
    <div class="card">
      <div class="card-title" style="margin-bottom:14px">💡 Fill the Gap — Recommended Add-ons</div>
      <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:14px">You need <strong style="color:var(--accent-orange)">${deficit} more kcal</strong>. Try these cheap add-ons:</p>
      ${suggestedAddons.map(a => `
      <div class="addon-list-item">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:1.5rem">${a.icon}</span>
          <div>
            <div style="font-weight:600;font-size:0.85rem">${a.name}</div>
            <div style="font-size:0.72rem;color:var(--text-secondary)">${a.benefit}</div>
          </div>
        </div>
        <div style="text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:4px">
          <span style="font-size:0.85rem;font-weight:700;color:var(--accent-orange)">${a.kcal} kcal</span>
          <span style="font-size:0.72rem;color:var(--text-secondary)">₹${a.cost}</span>
          <button class="btn-sm btn-green" style="padding:2px 10px;font-size:0.72rem" onclick="Hostel.addToTracker(${JSON.stringify(JSON.stringify(a))})">Add</button>
        </div>
      </div>`).join('')}
    </div>` : ''}
  </div>
</div>

<!-- Add Meal Item Modal -->
<div id="hostel-add-modal" class="hidden" style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:200;display:flex;align-items:center;justify-content:center">
  <div class="card" style="width:min(400px,92vw);padding:24px">
    <h3 style="margin-bottom:16px">➕ Add Food Item</h3>
    <input type="hidden" id="add-meal-type" />
    <div class="form-group"><label>Food Name</label><input type="text" id="add-item-name" placeholder="e.g. Egg Bhurji" /></div>
    <div class="form-grid">
      <div class="form-group"><label>Calories</label><input type="number" id="add-item-kcal" placeholder="e.g. 180" /></div>
      <div class="form-group"><label>Protein (g)</label><input type="number" id="add-item-protein" placeholder="e.g. 10" step="0.1" /></div>
      <div class="form-group"><label>Carbs (g)</label><input type="number" id="add-item-carbs" placeholder="e.g. 5" step="0.1" /></div>
      <div class="form-group"><label>Fat (g)</label><input type="number" id="add-item-fat" placeholder="e.g. 8" step="0.1" /></div>
    </div>
    <div style="display:flex;gap:10px;margin-top:16px">
      <button class="btn-primary" onclick="Hostel.saveNewItem()">Save Item</button>
      <button class="btn-outline" onclick="document.getElementById('hostel-add-modal').classList.add('hidden')">Cancel</button>
    </div>
  </div>
</div>`;
}

window.Hostel = {
  addToTracker(jsonStr) {
    const item = JSON.parse(jsonStr);
    window.Store.addFoodToLog({ ...item, quantity: item.qty || 1 });
    window.showToast(`✅ ${item.name} added to tracker!`);
    navigate('hostel');
  },

  toggleItem(itemId, checked) {
    const checklist = getMessChecklist();
    checklist[itemId] = checked;
    saveMessChecklist(checklist);
    // Re-render only the summary panel to avoid losing focus on checkbox
    navigate('hostel');
  },

  addMealItem(mealType) {
    const modal = document.getElementById('hostel-add-modal');
    document.getElementById('add-meal-type').value = mealType;
    ['add-item-name', 'add-item-kcal', 'add-item-protein', 'add-item-carbs', 'add-item-fat']
      .forEach(id => document.getElementById(id).value = '');
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
  },

  saveNewItem() {
    const mealType = document.getElementById('add-meal-type').value;
    const name = document.getElementById('add-item-name').value.trim();
    if (!name) { window.showToast('❌ Enter item name'); return; }
    const kcal = parseFloat(document.getElementById('add-item-kcal').value) || 0;
    const protein = parseFloat(document.getElementById('add-item-protein').value) || 0;
    const carbs = parseFloat(document.getElementById('add-item-carbs').value) || 0;
    const fat = parseFloat(document.getElementById('add-item-fat').value) || 0;
    const menu = getMessMenu();
    const id = 'custom_' + Date.now();
    menu[mealType].push({ id, name, kcal, protein, carbs, fat });
    saveMessMenu(menu);
    document.getElementById('hostel-add-modal').classList.add('hidden');
    window.showToast(`✅ "${name}" added to ${mealType}!`);
    navigate('hostel');
  },

  removeItem(mealType, itemId) {
    const menu = getMessMenu();
    menu[mealType] = menu[mealType].filter(i => i.id !== itemId);
    saveMessMenu(menu);
    // Also uncheck it
    const checklist = getMessChecklist();
    delete checklist[itemId];
    saveMessChecklist(checklist);
    navigate('hostel');
  },

  resetMenu() {
    if (!confirm('Reset mess menu to default? Your custom items will be removed.')) return;
    localStorage.removeItem(MESS_MENU_KEY);
    window.showToast('🔄 Menu reset to default');
    navigate('hostel');
  },

  addAllCheckedToTracker() {
    const menu = getMessMenu();
    const checklist = getMessChecklist();
    let count = 0;
    Object.entries(menu).forEach(([mealType, items]) => {
      items.forEach(item => {
        if (checklist[item.id]) {
          window.Store.addFoodToLog({ ...item, emoji: '🍽️', mealType, quantity: 1 });
          count++;
        }
      });
    });
    if (count === 0) { window.showToast('⚠️ Check at least one meal item first'); return; }
    window.showToast(`✅ ${count} mess items added to tracker!`);
    navigate('tracker');
  }
};

// ====== ML INSIGHTS PAGE ======
function renderMLInsightsShell() {
  return `
<div class="page-header">
  <h1 class="text-gradient">🤖 ML Insights</h1>
  <p class="page-subtitle">3 TensorFlow.js models trained on your real data — running entirely in your browser</p>
</div>
<div class="ml-model-badges">
  <span class="ml-badge">🔵 TF.js Linear Regression</span>
  <span class="ml-badge">🟣 2-Layer Dense Neural Net</span>
  <span class="ml-badge">🟠 K-Means Clustering</span>
</div>
<div id="ml-loading" class="ml-loading-overlay">
  <div class="ml-spinner"></div>
  <div class="ml-loading-text">Training ML models on your data...</div>
  <div class="ml-loading-sub" id="ml-loading-sub">Initializing TensorFlow.js</div>
</div>
<div id="ml-results" class="hidden"></div>`;
}

async function initMLInsights() {
  const loadingEl = document.getElementById('ml-loading');
  const resultsEl = document.getElementById('ml-results');
  const subEl = document.getElementById('ml-loading-sub');
  if (!loadingEl || !resultsEl) return;

  const profile = window.Store.getProfile();
  if (!profile) {
    loadingEl.innerHTML = '<div class="empty-state"><div class="empty-icon">🤖</div><div class="empty-title">Complete setup first</div><div class="empty-desc">Finish onboarding to enable ML models.</div></div>';
    return;
  }

  try {
    // ── Model 1: Weight Progress Regression ──
    subEl.textContent = 'Training weight progress predictor...';
    const progressResult = await window.MLProgress.runPipeline();

    // ── Model 2: Adaptive TDEE Neural Net ──
    subEl.textContent = 'Training adaptive TDEE neural network (pre-training on 50 profiles)...';
    const tdeeResult = await window.MLTDEE.runPipeline(profile);

    // ── Model 3: Meal Pattern Clustering ──
    subEl.textContent = 'Clustering your meal patterns...';
    const mealResult = await window.MLMeals.runPipeline();

    loadingEl.classList.add('hidden');
    resultsEl.classList.remove('hidden');
    resultsEl.innerHTML = buildMLResultsHTML(progressResult, tdeeResult, mealResult, profile);

    // Draw prediction curve chart if trained
    if (progressResult.trained && progressResult.curve?.length > 1) {
      setTimeout(() => drawPredictionChart(progressResult), 100);
    }
  } catch (err) {
    loadingEl.innerHTML = `<div class="alert alert-danger"><span class="alert-icon">❌</span>ML Error: ${err.message}</div>`;
    console.error('ML Error:', err);
  }
}

function buildMLResultsHTML(prog, tdee, meals, profile) {
  const progressHTML = prog.trained ? `
<div class="card card-gradient-blue" style="margin-bottom:24px">
  <div class="card-header">
    <div class="card-title">📈 Weight Progress Predictor</div>
    <span class="ml-badge" style="background:rgba(79,142,247,0.2);color:var(--accent-blue)">✅ Trained on ${prog.dataPoints} data points</span>
  </div>
  <div class="ml-model-desc">TF.js Linear Regression · Trained on your actual weight log</div>
  <div class="grid-2" style="gap:12px;margin:16px 0">
    <div style="background:var(--bg-secondary);border-radius:10px;padding:14px;text-align:center">
      <div style="font-size:1.8rem;font-weight:800;color:var(--accent-cyan)">${prog.pred7 ?? '--'}</div>
      <div style="font-size:0.72rem;color:var(--text-secondary)">Predicted in 7 days (kg)</div>
    </div>
    <div style="background:var(--bg-secondary);border-radius:10px;padding:14px;text-align:center">
      <div style="font-size:1.8rem;font-weight:800;color:var(--accent-blue)">${prog.pred30 ?? '--'}</div>
      <div style="font-size:0.72rem;color:var(--text-secondary)">Predicted in 30 days (kg)</div>
    </div>
    <div style="background:var(--bg-secondary);border-radius:10px;padding:14px;text-align:center">
      <div style="font-size:1.8rem;font-weight:800;color:var(--accent-purple)">${prog.pred60 ?? '--'}</div>
      <div style="font-size:0.72rem;color:var(--text-secondary)">Predicted in 60 days (kg)</div>
    </div>
    <div style="background:var(--bg-secondary);border-radius:10px;padding:14px;text-align:center">
      <div style="font-size:1.4rem;font-weight:800;color:var(--accent-green)">${prog.weeklyRate !== null ? (prog.weeklyRate > 0 ? '+' : '') + prog.weeklyRate : '--'} kg</div>
      <div style="font-size:0.72rem;color:var(--text-secondary)">Weekly rate (ML)</div>
    </div>
  </div>
  ${prog.goalDate ? `<div class="alert alert-success" style="margin-bottom:10px"><span class="alert-icon">🏆</span>ML predicts you'll reach <strong>${prog.target}kg</strong> by <strong>${prog.goalDate}</strong> (${prog.goalDays} days)</div>` : `<div class="alert alert-info"><span class="alert-icon">ℹ️</span>Add more weight logs for a goal date prediction.</div>`}
  <div style="margin-top:16px">
    <div style="font-size:0.82rem;font-weight:600;margin-bottom:8px;color:var(--text-secondary)">📊 30-Day Prediction Curve</div>
    <div class="chart-container" style="height:180px"><canvas id="chart-ml-weight"></canvas></div>
  </div>
</div>` : `
<div class="card" style="margin-bottom:24px">
  <div class="card-title">📈 Weight Progress Predictor</div>
  <div class="ml-model-desc">TF.js Linear Regression</div>
  <div class="alert alert-warning" style="margin-top:12px"><span class="alert-icon">⚠️</span>${prog.reason || 'Log at least 3 weight entries to train this model.'}</div>
  <button class="btn-primary btn-sm" style="margin-top:12px" onclick="showWeightInput();navigate('dashboard')">⚖️ Log Weight Now</button>
</div>`;

  const tdeeHTML = tdee.success ? `
<div class="card card-gradient-purple" style="margin-bottom:24px">
  <div class="card-header">
    <div class="card-title">🧠 Adaptive TDEE Neural Network</div>
    <span class="ml-badge" style="background:rgba(156,39,176,0.2);color:#ce93d8">${tdee.finetuned ? '🔥 Fine-tuned on your data' : '✅ Pre-trained (50 profiles)'}</span>
  </div>
  <div class="ml-model-desc">2-Layer Dense Neural Net (5 → 16 → 8 → 1) · Pre-trained + optionally fine-tuned</div>
  <div class="grid-2" style="gap:12px;margin:16px 0">
    <div style="background:var(--bg-secondary);border-radius:10px;padding:14px;text-align:center">
      <div style="font-size:0.72rem;color:var(--text-secondary);margin-bottom:4px">Formula TDEE</div>
      <div style="font-size:1.6rem;font-weight:800;color:var(--text-primary)">${tdee.formulaTDEE}</div>
      <div style="font-size:0.7rem;color:var(--text-muted)">Mifflin-St Jeor</div>
    </div>
    <div style="background:rgba(156,39,176,0.1);border:1px solid rgba(156,39,176,0.3);border-radius:10px;padding:14px;text-align:center">
      <div style="font-size:0.72rem;color:#ce93d8;margin-bottom:4px">ML TDEE</div>
      <div style="font-size:1.6rem;font-weight:800;color:#ce93d8">${tdee.mlTDEE}</div>
      <div style="font-size:0.7rem;color:var(--text-muted)">Neural Network</div>
    </div>
    <div style="background:var(--bg-secondary);border-radius:10px;padding:14px;text-align:center">
      <div style="font-size:0.72rem;color:var(--text-secondary);margin-bottom:4px">Formula Target</div>
      <div style="font-size:1.6rem;font-weight:800;color:var(--accent-orange)">${tdee.formulaTarget}</div>
      <div style="font-size:0.7rem;color:var(--text-muted)">kcal/day</div>
    </div>
    <div style="background:rgba(156,39,176,0.1);border:1px solid rgba(156,39,176,0.3);border-radius:10px;padding:14px;text-align:center">
      <div style="font-size:0.72rem;color:#ce93d8;margin-bottom:4px">ML Target</div>
      <div style="font-size:1.6rem;font-weight:800;color:#ce93d8">${tdee.mlCalorieTarget}</div>
      <div style="font-size:0.7rem;color:var(--text-muted)">kcal/day</div>
    </div>
  </div>
  <div class="alert ${Math.abs(tdee.difference) < 50 ? 'alert-success' : 'alert-info'}" style="margin-top:4px">
    <span class="alert-icon">${Math.abs(tdee.difference) < 50 ? '✅' : '🔬'}</span>${tdee.recommendation}
  </div>
  ${tdee.finetuned && tdee.actualTDEE ? `<div style="margin-top:10px;font-size:0.8rem;color:var(--text-secondary)">🔄 Estimated actual TDEE from your weight change: <strong style="color:#ce93d8">${tdee.actualTDEE} kcal</strong></div>` : ''}
  <button class="btn-sm" style="margin-top:14px;background:rgba(156,39,176,0.2);color:#ce93d8;border:1px solid rgba(156,39,176,0.4);border-radius:8px;padding:6px 16px;cursor:pointer" onclick="applyMLCalorieTarget(${tdee.mlCalorieTarget})">Apply ML Calorie Target</button>
</div>` : `<div class="card" style="margin-bottom:24px"><div class="card-title">🧠 Adaptive TDEE Neural Network</div><div class="alert alert-warning"><span class="alert-icon">⚠️</span>Could not run TDEE model.</div></div>`;

  const mealHTML = meals.success ? `
<div class="card" style="margin-bottom:24px">
  <div class="card-header">
    <div class="card-title">🍽️ Meal Pattern Analyzer</div>
    <span class="ml-badge" style="background:rgba(255,112,67,0.2);color:var(--accent-orange)">✅ Analyzed ${meals.daysAnalyzed} days</span>
  </div>
  <div class="ml-model-desc">K-Means Clustering (k=3) on 7-day food log · 4 features per day</div>
  <div style="background:rgba(${meals.patternIdx === 0 ? '0,230,118' : meals.patternIdx === 1 ? '255,215,64' : '255,112,67'},0.1);border:1px solid rgba(${meals.patternIdx === 0 ? '0,230,118' : meals.patternIdx === 1 ? '255,215,64' : '255,112,67'},0.3);border-radius:12px;padding:18px;margin:16px 0">
    <div style="font-size:1.1rem;font-weight:700;color:${meals.pattern.color}">${meals.pattern.label}</div>
    <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:6px">${meals.pattern.description}</div>
  </div>
  <div class="grid-2" style="gap:10px;margin-bottom:16px">
    <div style="background:var(--bg-secondary);border-radius:10px;padding:12px;text-align:center">
      <div style="font-size:1.4rem;font-weight:800;color:var(--accent-orange)">${meals.avgKcal}</div>
      <div style="font-size:0.72rem;color:var(--text-secondary)">Avg kcal/day</div>
    </div>
    <div style="background:var(--bg-secondary);border-radius:10px;padding:12px;text-align:center">
      <div style="font-size:1.4rem;font-weight:800;color:var(--accent-blue)">${meals.avgProtein}g</div>
      <div style="font-size:0.72rem;color:var(--text-secondary)">Avg protein/day</div>
    </div>
    <div style="background:var(--bg-secondary);border-radius:10px;padding:12px;text-align:center">
      <div style="font-size:1.4rem;font-weight:800;color:var(--accent-green)">${meals.consistency}%</div>
      <div style="font-size:0.72rem;color:var(--text-secondary)">Days ≥ 70% calorie goal</div>
    </div>
    <div style="background:var(--bg-secondary);border-radius:10px;padding:12px;text-align:center">
      <div style="font-size:1.4rem;font-weight:800;color:var(--accent-cyan)">${meals.caloriePct}%</div>
      <div style="font-size:0.72rem;color:var(--text-secondary)">Avg % of target hit</div>
    </div>
  </div>
  <div style="font-size:0.85rem;font-weight:700;margin-bottom:10px">💡 AI Recommendations</div>
  ${meals.pattern.tips.map(t => `<div class="advisor-insight" style="margin-bottom:8px"><div class="insight-text">${t}</div></div>`).join('')}
</div>` : `
<div class="card" style="margin-bottom:24px">
  <div class="card-title">🍽️ Meal Pattern Analyzer</div>
  <div class="ml-model-desc">K-Means Clustering</div>
  <div class="alert alert-warning" style="margin-top:12px"><span class="alert-icon">⚠️</span>${meals.reason || 'Log meals for 2+ days to activate pattern analysis.'}</div>
  <button class="btn-primary btn-sm" style="margin-top:12px" onclick="navigate('tracker')">📟 Go to Tracker</button>
</div>`;

  return progressHTML + tdeeHTML + mealHTML;
}

function drawPredictionChart(prog) {
  const canvas = document.getElementById('chart-ml-weight');
  if (!canvas || !prog.curve?.length) return;
  const ctx = canvas.getContext('2d');
  const weightLog = window.Store.getWeightLog().slice(-5);
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: prog.curve.map(p => p.date),
      datasets: [
        {
          label: 'ML Prediction',
          data: prog.curve.map(p => p.weight),
          borderColor: '#4f8ef7',
          backgroundColor: 'rgba(79,142,247,0.1)',
          borderWidth: 2,
          borderDash: [5, 3],
          pointRadius: 3,
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Current',
          data: prog.curve.map((p, i) => i === 0 ? prog.current : null),
          borderColor: '#00e676',
          backgroundColor: 'rgba(0,230,118,0.2)',
          pointRadius: 8,
          pointStyle: 'circle',
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#b0bec5', font: { size: 11 } } } },
      scales: {
        x: { ticks: { color: '#78909c', maxTicksLimit: 6 }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#78909c' }, grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    }
  });
}

window.applyMLCalorieTarget = (target) => {
  const plan = window.Store.getDietPlan();
  if (!plan) { window.showToast('❌ Generate a diet plan first'); return; }
  plan.calorieTarget = target;
  window.Store.setDietPlan(plan);
  window.showToast(`✅ Calorie target set to ${target} kcal by ML model!`);
};

// ====== ADVISOR PAGE ======
function renderAdvisor() {
  const profile = window.Store.getProfile();
  const analysis = window.GoalEngine.analyzeProgress(profile || {});
  const advice = window.WeightAdvisor.generateAdvice(profile || { weight: 55, targetWeight: 65, goal: 'gain', height: 170, age: 20, gender: 'male', activity: 'moderate', environment: 'hostel' }, analysis);

  return `
<div class="page-header"><h1 class="text-gradient">🎯 AI Advisor</h1><p class="page-subtitle">Progress analysis & personalized recommendations</p></div>
<div class="advisor-hero">
  <div class="advisor-icon">🤖</div>
  <h2>Progress Analysis</h2>
  <p style="color:var(--text-secondary);margin-top:8px">${analysis.message || 'Based on your weight logs and goals'}</p>
  ${analysis.progressPct !== undefined ? `
  <div style="margin-top:20px">
    <div class="progress-bar" style="height:12px;border-radius:6px;background:var(--bg-secondary)">
      <div class="progress-fill green" style="width:${analysis.progressPct}%"></div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:0.8rem">
      <span>Start: ${analysis.starting}kg</span>
      <span style="color:var(--accent-green)">${analysis.progressPct}% to goal</span>
      <span>Target: ${analysis.target}kg</span>
    </div>
  </div>` : ''}
</div>
${analysis.insights?.length ? analysis.insights.map(ins => `
  <div class="advisor-insight">
    <div class="insight-label">${ins.type === 'success' ? '✅ Great' : ins.type === 'warning' ? '⚠️ Warning' : 'ℹ️ Info'}</div>
    <div class="insight-text">${ins.text}</div>
  </div>`).join('') : ''}
${analysis.recommendation ? `
<div class="card card-gradient-blue" style="margin-bottom:24px">
  <div class="card-title" style="margin-bottom:10px">🎯 AI Recommendation</div>
  <p>${analysis.recommendation.reason}</p>
  <button class="btn-primary btn-sm" style="margin-top:12px" onclick="applyRecommendation()">Apply This Change</button>
</div>` : ''}

<div style="margin-bottom:16px"><button class="btn-outline btn-sm" onclick="showWeightInput();navigate('dashboard')">⚖️ Log Today's Weight</button></div>

<h3 style="margin-bottom:16px">💡 Weight Gain Strategies</h3>
${advice.strategies.map(s => `<div class="advisor-insight"><div class="insight-label">${s.icon} ${s.title}</div><div class="insight-text">${s.desc}</div></div>`).join('')}
<div class="card card-gradient-green" style="margin-top:24px">
  <div class="card-title" style="margin-bottom:14px">🏆 Top High-Calorie Foods</div>
  <div class="grid-2">
    ${window.WeightAdvisor.HIGH_CAL_FOODS.slice(0, 6).map(f => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--bg-secondary);border-radius:10px">
      <span style="font-size:1.6rem">${f.icon}</span>
      <div><div style="font-weight:600;font-size:0.85rem">${f.name}</div><div style="font-size:0.72rem;color:var(--accent-orange)">${f.kcal} kcal · ${f.protein}g protein</div><div style="font-size:0.7rem;color:var(--text-secondary)">${f.tip}</div></div>
    </div>`).join('')}
  </div>
</div>`;
}

window.applyRecommendation = () => {
  const profile = window.Store.getProfile();
  const analysis = window.GoalEngine.analyzeProgress(profile);
  const newTarget = window.GoalEngine.getAdjustedTarget(profile, analysis);
  const plan = window.Store.getDietPlan();
  if (plan) { plan.calorieTarget = newTarget; window.Store.setDietPlan(plan); }
  window.showToast(`✅ Calorie target updated to ${newTarget} kcal`);
  navigate('advisor');
};

// ====== BUDGET PAGE ======
function renderBudget() {
  const profile = window.Store.getProfile();
  const status = window.BudgetModule.getBudgetStatus();
  const bestValue = window.BudgetModule.getBestValueFoods(profile?.foodPreference || 'vegetarian');
  const daily = window.BudgetModule.getDailyBudget();

  return `
<div class="page-header"><h1 class="text-gradient">💰 Budget Intelligence</h1><p class="page-subtitle">Track nutrition spending · Daily budget: ₹${daily}</p></div>
<div class="grid-2" style="margin-bottom:24px">
  <div class="card card-gradient-green">
    <div class="card-title" style="margin-bottom:12px">📅 This Week</div>
    <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:0.85rem;color:var(--text-secondary)">Spent</span><strong style="color:var(--accent-orange)">₹${status.weekly.spent}</strong></div>
    <div style="display:flex;justify-content:space-between;margin-bottom:12px"><span style="font-size:0.85rem;color:var(--text-secondary)">Budget</span><strong>₹${status.weekly.budget}</strong></div>
    <div class="progress-bar"><div class="progress-fill ${status.isWeeklyOver ? '' : 'green'}" style="width:${status.weekly.pct}%;background:${status.isWeeklyOver ? '#ff5252' : status.isWeeklyWarning ? '#ffd740' : ''}"></div></div>
    <div style="text-align:right;font-size:0.8rem;margin-top:6px;color:${status.isWeeklyOver ? 'var(--accent-red)' : 'var(--accent-green)'}">₹${Math.abs(status.weekly.remaining)} ${status.isWeeklyOver ? 'over' : 'remaining'}</div>
  </div>
  <div class="card card-gradient-orange">
    <div class="card-title" style="margin-bottom:12px">📆 This Month</div>
    <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:0.85rem;color:var(--text-secondary)">Spent</span><strong style="color:var(--accent-orange)">₹${status.monthly.spent}</strong></div>
    <div style="display:flex;justify-content:space-between;margin-bottom:12px"><span style="font-size:0.85rem;color:var(--text-secondary)">Budget</span><strong>₹${status.monthly.budget}</strong></div>
    <div class="progress-bar"><div class="progress-fill orange" style="width:${status.monthly.pct}%"></div></div>
    <div style="text-align:right;font-size:0.8rem;margin-top:6px;color:${status.isMonthlyOver ? 'var(--accent-red)' : 'var(--accent-yellow)'}">₹${Math.abs(status.monthly.remaining)} ${status.isMonthlyOver ? 'over' : 'remaining'}</div>
  </div>
</div>
<div class="card" style="margin-bottom:24px">
  <div class="card-title" style="margin-bottom:14px">⚙️ Update Budget</div>
  <div class="form-grid">
    <div class="form-group"><label>Weekly Budget (₹)</label><input type="number" id="budget-weekly" value="${status.weekly.budget}" min="100" /></div>
    <div class="form-group"><label>Monthly Budget (₹)</label><input type="number" id="budget-monthly" value="${status.monthly.budget}" min="400" /></div>
  </div>
  <button class="btn-primary btn-sm" style="margin-top:12px" onclick="Budget.save()">Save Budget</button>
</div>
<div class="card">
  <div class="card-title" style="margin-bottom:14px">🏆 Best Value Foods (Protein per ₹)</div>
  ${bestValue.map((f, i) => `
  <div class="list-item">
    <div class="item-left"><span class="item-icon">${f.emoji || '🍽️'}</span><div><div class="item-name">${i + 1}. ${f.name}</div><div class="item-desc">${f.kcal} kcal · ₹${f.cost}/serving</div></div></div>
    <div class="item-right"><div class="item-value">${f.proteinPerRupee}g</div><div class="item-unit">protein/₹</div></div>
  </div>`).join('')}
</div>`;
}

window.Budget = {
  save() {
    const w = parseFloat(document.getElementById('budget-weekly')?.value) || 800;
    const m = parseFloat(document.getElementById('budget-monthly')?.value) || 3200;
    window.Store.setBudget({ weekly: w, monthly: m, spent: {} });
    window.showToast('✅ Budget saved!');
    navigate('budget');
  }
};

// ====== HISTORY PAGE ======
function renderHistory() {
  const logs = window.Store.getAllLogs().slice(0, 30);
  const today = window.Store.getTodayKey();

  const entriesHtml = logs.length === 0
    ? `<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-title">No history yet</div><div class="empty-desc">Start tracking meals to see your history here.</div></div>`
    : logs.map(log => {
      const foods = log.foods || [];
      const kcal = foods.reduce((s, f) => s + (f.kcal || 0) * (f.quantity || 1), 0);
      return `<div class="history-entry">
          <div class="history-date">📅 ${new Date(log.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} ${log.date === today ? '<span class="badge badge-green" style="margin-left:8px">Today</span>' : ''}</div>
          <div class="history-stats">
            <span class="history-stat"><span class="history-stat-label">Calories: </span><span class="history-stat-val">${Math.round(kcal)} kcal</span></span>
            <span class="history-stat"><span class="history-stat-label">Foods: </span><span class="history-stat-val">${foods.length} items</span></span>
            <span class="history-stat"><span class="history-stat-label">Water: </span><span class="history-stat-val">${log.water || 0} cups</span></span>
            <span class="history-stat"><span class="history-stat-label">Workout: </span><span class="history-stat-val">${log.workoutDone ? '✅' : '❌'}</span></span>
          </div>
        </div>`;
    }).join('');

  return `
<div class="page-header"><h1 class="text-gradient">📅 History</h1><p class="page-subtitle">Your health journey over time</p></div>
<div style="display:flex;gap:12px;margin-bottom:20px">
  <button class="btn-outline btn-sm" onclick="History.exportJSON()">📤 Export JSON</button>
  <button class="btn-outline btn-sm" onclick="History.clearAll()">🗑️ Clear All Data</button>
</div>
${entriesHtml}`;
}

window.History = {
  exportJSON() {
    const data = window.Store.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `fitmind-backup-${window.Store.getTodayKey()}.json`;
    a.click();
    window.showToast('✅ Data exported!');
  },
  clearAll() {
    if (!confirm('Are you sure? This will delete ALL your data including logs, plans, and weight history.')) return;
    window.Store.clearAll();
    window.showToast('🗑️ All data cleared.');
    location.reload();
  }
};

// ====== SETTINGS PAGE ======
function renderSettings() {
  const profile = window.Store.getProfile();
  const settings = window.Store.getSettings();

  return `
<div class="page-header"><h1 class="text-gradient">⚙️ Settings</h1><p class="page-subtitle">Notifications, profile, and preferences</p></div>
<div class="card" style="margin-bottom:24px">
  <div class="card-title" style="margin-bottom:14px">👤 Profile</div>
  <div class="form-grid">
    <div class="form-group"><label>Name</label><input type="text" id="s-name" value="${profile?.name || ''}" /></div>
    <div class="form-group"><label>Age</label><input type="number" id="s-age" value="${profile?.age || ''}" /></div>
    <div class="form-group"><label>Weight (kg)</label><input type="number" id="s-weight" value="${profile?.weight || ''}" step="0.1" /></div>
    <div class="form-group"><label>Target Weight (kg)</label><input type="number" id="s-target" value="${profile?.targetWeight || ''}" step="0.1" /></div>
    <div class="form-group"><label>Goal</label><select id="s-goal"><option value="gain" ${profile?.goal === 'gain' ? 'selected' : ''}>Muscle Gain</option><option value="lose" ${profile?.goal === 'lose' ? 'selected' : ''}>Fat Loss</option><option value="maintain" ${profile?.goal === 'maintain' ? 'selected' : ''}>Maintain</option></select></div>
    <div class="form-group"><label>Activity</label><select id="s-activity"><option value="sedentary" ${profile?.activity === 'sedentary' ? 'selected' : ''}>Sedentary</option><option value="light" ${profile?.activity === 'light' ? 'selected' : ''}>Light</option><option value="moderate" ${profile?.activity === 'moderate' ? 'selected' : ''}>Moderate</option><option value="active" ${profile?.activity === 'active' ? 'selected' : ''}>Active</option><option value="very_active" ${profile?.activity === 'very_active' ? 'selected' : ''}>Very Active</option></select></div>
  </div>
  <button class="btn-primary btn-sm" style="margin-top:14px" onclick="Settings.saveProfile()">Save Profile & Regenerate Plan</button>
</div>
<div class="card" style="margin-bottom:24px">
  <div class="card-title" style="margin-bottom:4px">🔔 Notifications</div>
  ${['mealReminders', 'waterReminders', 'workoutReminders'].map(key => `
  <div class="setting-row">
    <div class="setting-left"><div class="setting-title">${key === 'mealReminders' ? '🍽️ Meal Reminders' : key === 'waterReminders' ? '💧 Water Reminders' : '💪 Workout Reminders'}</div></div>
    <label class="toggle"><input type="checkbox" id="s-${key}" ${settings[key] ? 'checked' : ''} onchange="Settings.toggleNotif('${key}',this.checked)" /><span class="toggle-slider"></span></label>
  </div>`).join('')}
  <div class="form-grid" style="margin-top:16px">
    <div class="form-group"><label>Breakfast Time</label><input type="time" id="s-breakfast" value="${settings.reminderTimes?.breakfast || '08:00'}" /></div>
    <div class="form-group"><label>Lunch Time</label><input type="time" id="s-lunch" value="${settings.reminderTimes?.lunch || '13:00'}" /></div>
    <div class="form-group"><label>Dinner Time</label><input type="time" id="s-dinner" value="${settings.reminderTimes?.dinner || '20:00'}" /></div>
    <div class="form-group"><label>Workout Time</label><input type="time" id="s-workout" value="${settings.reminderTimes?.workout || '18:00'}" /></div>
  </div>
  <button class="btn-outline btn-sm" style="margin-top:12px" onclick="Settings.saveNotifs()">Save Notification Times</button>
  <button class="btn-sm btn-primary" style="margin-left:8px" onclick="Settings.enableNotifs()">Enable Notifications</button>
</div>
<div class="card">
  <div class="card-title" style="margin-bottom:4px">🍽️ Add Custom Food</div>
  <div class="form-grid" style="margin-top:14px">
    <div class="form-group"><label>Food Name</label><input type="text" id="cf-name" placeholder="e.g. Mom's Dal" /></div>
    <div class="form-group"><label>Calories (per serving)</label><input type="number" id="cf-kcal" placeholder="e.g. 250" /></div>
    <div class="form-group"><label>Protein (g)</label><input type="number" id="cf-protein" placeholder="e.g. 12" step="0.1" /></div>
    <div class="form-group"><label>Carbs (g)</label><input type="number" id="cf-carbs" placeholder="e.g. 30" step="0.1" /></div>
    <div class="form-group"><label>Fat (g)</label><input type="number" id="cf-fat" placeholder="e.g. 8" step="0.1" /></div>
    <div class="form-group"><label>Cost (₹)</label><input type="number" id="cf-cost" placeholder="e.g. 25" /></div>
  </div>
  <button class="btn-green btn-sm" style="margin-top:12px" onclick="Settings.addCustomFood()">➕ Save Custom Food</button>
</div>`;
}

window.Settings = {
  saveProfile() {
    const profile = window.Store.getProfile() || {};
    const updated = {
      ...profile,
      name: document.getElementById('s-name')?.value || profile.name,
      age: parseInt(document.getElementById('s-age')?.value) || profile.age,
      weight: parseFloat(document.getElementById('s-weight')?.value) || profile.weight,
      targetWeight: parseFloat(document.getElementById('s-target')?.value) || profile.targetWeight,
      goal: document.getElementById('s-goal')?.value || profile.goal,
      activity: document.getElementById('s-activity')?.value || profile.activity,
    };
    window.Store.setProfile(updated);
    const plan = window.AIDiet.generateMealPlan(updated);
    window.Store.setDietPlan(plan);
    const workoutPlan = window.AIWorkout.generateWorkoutPlan(updated);
    window.Store.setWorkoutPlan(workoutPlan);
    updateSidebarInfo(updated, plan);
    window.showToast('✅ Profile saved & plans regenerated!');
  },
  toggleNotif(key, val) {
    const s = window.Store.getSettings();
    s[key] = val;
    window.Store.saveSettings(s);
  },
  saveNotifs() {
    const s = window.Store.getSettings();
    s.reminderTimes = {
      breakfast: document.getElementById('s-breakfast')?.value || '08:00',
      lunch: document.getElementById('s-lunch')?.value || '13:00',
      dinner: document.getElementById('s-dinner')?.value || '20:00',
      workout: document.getElementById('s-workout')?.value || '18:00',
    };
    window.Store.saveSettings(s);
    window.showToast('✅ Reminder times saved!');
  },
  async enableNotifs() {
    const s = window.Store.getSettings();
    s.notifications = true;
    window.Store.saveSettings(s);
    const ok = await window.NotificationModule.requestPermission();
    if (ok) { window.NotificationModule.startReminders(); window.showToast('🔔 Notifications enabled!'); }
    else window.showToast('❌ Permission denied. Enable in browser settings.');
  },
  addCustomFood() {
    const name = document.getElementById('cf-name')?.value?.trim();
    if (!name) { window.showToast('❌ Enter food name'); return; }
    window.Store.addCustomFood({
      name, emoji: '🍽️',
      kcal: parseFloat(document.getElementById('cf-kcal')?.value) || 100,
      protein: parseFloat(document.getElementById('cf-protein')?.value) || 0,
      carbs: parseFloat(document.getElementById('cf-carbs')?.value) || 0,
      fat: parseFloat(document.getElementById('cf-fat')?.value) || 0,
      cost: parseFloat(document.getElementById('cf-cost')?.value) || 0,
      category: 'custom', veg: true,
    });
    window.showToast(`✅ "${name}" saved to your food list!`);
    navigate('settings');
  }
};

// ====== ONBOARDING ======
let obStep = 1;
let obData = { goal: null, env: null, foodPreference: 'vegetarian' };

window.obNext = () => {
  if (!validateObStep(obStep)) return;
  if (obStep < 4) { obStep++; updateObUI(); }
  else finishOnboarding();
};

window.obBack = () => {
  if (obStep > 1) { obStep--; updateObUI(); }
};

function validateObStep(step) {
  if (step === 1) {
    const name = document.getElementById('ob-name')?.value?.trim();
    const age = parseInt(document.getElementById('ob-age')?.value);
    const weight = parseFloat(document.getElementById('ob-weight')?.value);
    const height = parseFloat(document.getElementById('ob-height')?.value);
    const target = parseFloat(document.getElementById('ob-target-weight')?.value);
    if (!name) { window.showToast('❌ Enter your name'); return false; }
    if (!age || age < 13 || age > 50) { window.showToast('❌ Enter a valid age (13-50)'); return false; }
    if (!weight || weight < 30) { window.showToast('❌ Enter a valid weight'); return false; }
    if (!height || height < 130) { window.showToast('❌ Enter a valid height'); return false; }
    if (!target || target < 30) { window.showToast('❌ Enter a target weight'); return false; }
    obData = { ...obData, name, age, weight, height, targetWeight: target, gender: document.getElementById('ob-gender')?.value };
  }
  if (step === 2) {
    if (!obData.goal) { window.showToast('❌ Select a goal'); return false; }
    obData.activity = document.getElementById('ob-activity')?.value;
    obData.fitnessLevel = document.getElementById('ob-fitness-level')?.value;
  }
  if (step === 3) {
    obData.region = document.getElementById('ob-region')?.value;
    obData.budget = parseFloat(document.getElementById('ob-budget')?.value) || 800;
    window.Store.setBudget({ weekly: obData.budget, monthly: obData.budget * 4 });
  }
  if (step === 4) {
    if (!obData.env) { window.showToast('❌ Select your living environment'); return false; }
    obData.environment = obData.env;
    obData.college = document.getElementById('ob-college')?.value || '';
  }
  return true;
}

function updateObUI() {
  document.querySelectorAll('.ob-step').forEach(s => s.classList.toggle('active', parseInt(s.dataset.step) === obStep));
  document.getElementById('ob-progress').style.width = `${(obStep / 4) * 100}%`;
  document.getElementById('ob-back').style.display = obStep > 1 ? 'inline-flex' : 'none';
  document.getElementById('ob-next').textContent = obStep === 4 ? '🚀 Let\'s Go!' : 'Next →';
}

function finishOnboarding() {
  window.Store.setProfile(obData);
  const plan = window.AIDiet.generateMealPlan(obData);
  window.Store.setDietPlan(plan);
  const workoutPlan = window.AIWorkout.generateWorkoutPlan(obData);
  window.Store.setWorkoutPlan(workoutPlan);
  updateSidebarInfo(obData, plan);
  document.getElementById('onboarding-overlay').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  window.showToast('🎉 Welcome to FitMind AI! Your plan is ready.');
  navigate('dashboard');
}

// Goal card selection
document.addEventListener('click', e => {
  const gc = e.target.closest('.goal-card');
  if (gc) { document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('selected')); gc.classList.add('selected'); obData.goal = gc.dataset.goal; }
  const ec = e.target.closest('.env-card');
  if (ec) { document.querySelectorAll('.env-card').forEach(c => c.classList.remove('selected')); ec.classList.add('selected'); obData.env = ec.dataset.env; }
  const pc = e.target.closest('.pref-card');
  if (pc) { document.querySelectorAll('.pref-card').forEach(c => c.classList.remove('active')); pc.classList.add('active'); obData.foodPreference = pc.dataset.pref; }
});

function updateSidebarInfo(profile, plan) {
  const el = document.getElementById('sidebar-name');
  const goalEl = document.getElementById('sidebar-goal');
  const avatarEl = document.getElementById('sidebar-avatar');
  const tdeeEl = document.getElementById('tdee-val');
  if (el) el.textContent = profile.name;
  if (goalEl) goalEl.textContent = `Goal: ${profile.goal?.charAt(0).toUpperCase() + profile.goal?.slice(1)}`;
  if (avatarEl) avatarEl.textContent = (profile.name || 'U').charAt(0).toUpperCase();
  if (tdeeEl) tdeeEl.textContent = plan?.tdee || '--';
}

// ====== INIT ======
document.addEventListener('DOMContentLoaded', () => {
  if (window.Store.hasProfile()) {
    const profile = window.Store.getProfile();
    const plan = window.Store.getDietPlan();
    updateSidebarInfo(profile, plan);
    document.getElementById('onboarding-overlay').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    navigate('dashboard');
    window.NotificationModule.startReminders();
  } else {
    document.getElementById('onboarding-overlay').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
  }
});
