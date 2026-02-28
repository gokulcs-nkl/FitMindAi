// ==========================================
// TRACKER MODULE — FitMind AI
// Daily calorie & nutrition tracking UI logic
// ==========================================
window.Tracker = {
  currentMealType: 'breakfast',
  searchTimeout: null,
  searchResults: [],

  init() {
    this.renderPage();
  },

  renderPage() {
    const profile = window.Store.getProfile();
    const plan = window.Store.getDietPlan();
    const log = window.Store.getDayLog();
    const totals = window.Store.getDayTotals();
    const target = plan?.calorieTarget || 2000;
    const macros = plan?.macros || { protein: 150, carbs: 250, fat: 67 };
    const waterGoal = plan ? window.AIDiet.getWaterGoal(profile?.weight || 70) : { cups: 8 };

    const caloriePct = Math.min(100, Math.round(totals.kcal / target * 100));
    const proteinPct = Math.min(100, Math.round(totals.protein / macros.protein * 100));
    const carbsPct = Math.min(100, Math.round(totals.carbs / macros.carbs * 100));
    const fatPct = Math.min(100, Math.round(totals.fat / macros.fat * 100));

    // Calorie ring gradient
    const r = 68;
    const circ = 2 * Math.PI * r;
    const dashOffset = circ * (1 - caloriePct / 100);
    const ringColor = caloriePct > 100 ? '#ff5252' : caloriePct > 85 ? '#ffd740' : '#00e676';

    const watercupsHtml = Array.from({ length: waterGoal.cups }, (_, i) =>
      `<div class="water-cup ${i < log.water ? 'filled' : ''}" onclick="Tracker.toggleWater(${i})" title="Cup ${i + 1}">💧</div>`
    ).join('');

    return `
<div class="page-header">
  <h1 class="text-gradient">📟 Nutrition Tracker</h1>
  <p class="page-subtitle">Track everything you eat today — ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
</div>
<div class="tracker-layout">
  <div>
    <!-- Add Food -->
    <div class="add-food-form">
      <h3 style="margin-bottom:14px">➕ Add Food</h3>
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
        ${['breakfast', 'lunch', 'dinner', 'snacks'].map(m => `<button class="btn-sm ${this.currentMealType === m ? 'btn-primary' : 'btn-outline'}" onclick="Tracker.setMeal('${m}')">${m.charAt(0).toUpperCase() + m.slice(1)}</button>`).join('')}
      </div>
      <div class="food-search-wrap" style="position:relative">
        <span class="food-search-icon">🔍</span>
        <input type="text" class="food-search" id="tracker-search" placeholder="Search food (e.g. banana, rice, egg...)" oninput="Tracker.onSearchInput(this.value)" onblur="Tracker.onSearchBlur()" autocomplete="off" />
        <div class="food-results hidden" id="tracker-results"></div>
      </div>
      <div style="margin-top:10px;display:flex;gap:8px;align-items:center">
        <input type="number" id="tracker-qty" placeholder="Qty" value="1" min="0.25" step="0.25" style="width:70px" />
        <span style="font-size:0.8rem;color:var(--text-secondary)">× serving</span>
        <button class="btn-sm btn-green" id="tracker-add-btn" onclick="Tracker.addSelectedFood()" style="opacity:0.4;pointer-events:none">Add</button>
      </div>
    </div>
    <!-- Today's Log -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">📋 Today's Food Log</div>
        <span class="badge badge-blue">${log.foods.length} items</span>
      </div>
      ${log.foods.length === 0
        ? `<div class="empty-state"><div class="empty-icon">🍽️</div><div class="empty-title">Nothing tracked yet</div><div class="empty-desc">Search and add your first meal above!</div></div>`
        : `<div class="tracker-log">${log.foods.map((f, i) => `
        <div class="log-entry">
          <div class="item-left">
            <span class="item-icon">${f.emoji || '🍽️'}</span>
            <div>
              <div class="log-name">${f.name}</div>
              <div class="log-meta">${f.protein}g P · ${f.carbs}g C · ${f.fat}g F</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <div class="log-kcal">${Math.round(f.kcal * (f.quantity || 1))} kcal</div>
            <button class="log-delete" onclick="Tracker.removeFood(${i})">✕</button>
          </div>
        </div>`).join('')}</div>`
      }
      ${log.foods.length > 0 ? `
      <div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:0.85rem;color:var(--text-secondary)">Total today</span>
        <div style="display:flex;gap:16px;font-size:0.85rem;font-weight:700">
          <span style="color:var(--accent-orange)">${totals.kcal} kcal</span>
          <span style="color:var(--accent-blue)">${totals.protein}g P</span>
          <span style="color:var(--accent-yellow)">${totals.carbs}g C</span>
          <span style="color:var(--accent-green)">${totals.fat}g F</span>
        </div>
      </div>` : ''}
    </div>
  </div>
  <!-- Right Panel -->
  <div>
    <!-- Calorie Ring -->
    <div class="card card-gradient-blue" style="margin-bottom:20px">
      <div class="card-title" style="margin-bottom:16px">🎯 Calories Today</div>
      <div class="calorie-ring-container">
        <div class="calorie-ring-wrap">
          <svg class="calorie-ring-svg" width="160" height="160" viewBox="0 0 160 160">
            <circle class="calorie-ring-bg" cx="80" cy="80" r="${r}" />
            <circle class="calorie-ring-fill" cx="80" cy="80" r="${r}"
              stroke="${ringColor}"
              stroke-dasharray="${circ}"
              stroke-dashoffset="${dashOffset}" />
          </svg>
          <div class="calorie-ring-text">
            <div class="calorie-ring-value" style="color:${ringColor}">${totals.kcal}</div>
            <div class="calorie-ring-label">/ ${target} kcal</div>
          </div>
        </div>
        <div style="font-size:0.85rem;color:var(--text-secondary);text-align:center">
          ${target - totals.kcal > 0 ? `<span style="color:var(--accent-green)">${target - totals.kcal} kcal remaining</span>` : `<span style="color:var(--accent-red)">Over by ${totals.kcal - target} kcal</span>`}
        </div>
      </div>
    </div>
    <!-- Macros -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-title" style="margin-bottom:16px">📊 Macros</div>
      <div class="progress-container">
        <div class="progress-label"><span>🔵 Protein</span><span style="color:var(--accent-blue)">${totals.protein}g / ${macros.protein}g</span></div>
        <div class="progress-bar"><div class="progress-fill blue" style="width:${proteinPct}%"></div></div>
      </div>
      <div class="progress-container">
        <div class="progress-label"><span>🟠 Carbs</span><span style="color:var(--accent-orange)">${totals.carbs}g / ${macros.carbs}g</span></div>
        <div class="progress-bar"><div class="progress-fill orange" style="width:${carbsPct}%"></div></div>
      </div>
      <div class="progress-container">
        <div class="progress-label"><span>🟡 Fat</span><span style="color:var(--accent-yellow)">${totals.fat}g / ${macros.fat}g</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${fatPct}%;background:linear-gradient(135deg,#ffd740,#ff7043)"></div></div>
      </div>
    </div>
    <!-- Water Tracker -->
    <div class="card">
      <div class="card-title" style="margin-bottom:12px">💧 Water (${log.water}/${waterGoal.cups} cups)</div>
      <div class="water-cups">${watercupsHtml}</div>
      <p style="font-size:0.75rem;color:var(--text-secondary);margin-top:8px">Each cup = 250ml · Goal: ${waterGoal.liters}L/day</p>
    </div>
  </div>
</div>`;
  },

  setMeal(mealType) {
    this.currentMealType = mealType;
    // Re-render tracker
    document.getElementById('main-content').innerHTML = this.renderPage();
    this.bindSearch();
  },

  bindSearch() {
    // Done via oninput in HTML
  },

  onSearchBlur() {
    // Delay hiding results so onmousedown on result items fires first
    setTimeout(() => {
      const resultsEl = document.getElementById('tracker-results');
      if (resultsEl) resultsEl.classList.add('hidden');
    }, 200);
  },

  onSearchInput(query) {
    clearTimeout(this.searchTimeout);
    const resultsEl = document.getElementById('tracker-results');
    if (!query.trim()) { resultsEl.classList.add('hidden'); return; }
    this.searchTimeout = setTimeout(() => {
      const profile = window.Store.getProfile();
      const vegPref = profile?.foodPreference || 'all';
      const results = window.searchFoods(query, vegPref);
      // Also search custom foods
      const custom = window.Store.getCustomFoods().filter(f => f.name.toLowerCase().includes(query.toLowerCase()));
      const all = [...results, ...custom].slice(0, 8);
      if (all.length === 0) {
        resultsEl.classList.add('hidden');
        return;
      }
      this.searchResults = all;
      resultsEl.innerHTML = all.map((f, i) =>
        `<div class="food-result-item" onmousedown="Tracker.selectFood(${i})">
          <div>
            <div class="food-result-name">${f.emoji || '🍽️'} ${f.name}</div>
            <div style="font-size:0.72rem;color:var(--text-secondary)">${f.protein}g protein · ${f.carbs}g carbs</div>
          </div>
          <div class="food-result-kcal">${f.kcal} kcal</div>
        </div>`
      ).join('');
      resultsEl.classList.remove('hidden');
    }, 300);
  },

  selectedFood: null,

  selectFood(index) {
    this.selectedFood = this.searchResults[index];
    if (!this.selectedFood) return;
    const resultsEl = document.getElementById('tracker-results');
    const searchEl = document.getElementById('tracker-search');
    const addBtn = document.getElementById('tracker-add-btn');
    if (searchEl) searchEl.value = this.selectedFood.name;
    if (resultsEl) resultsEl.classList.add('hidden');
    if (addBtn) { addBtn.style.opacity = '1'; addBtn.style.pointerEvents = 'auto'; }
  },

  addSelectedFood() {
    if (!this.selectedFood) return;
    const qty = parseFloat(document.getElementById('tracker-qty')?.value) || 1;
    const food = { ...this.selectedFood, quantity: qty, mealType: this.currentMealType };
    window.Store.addFoodToLog(food);
    window.showToast(`✅ ${food.name} added!`);
    document.getElementById('main-content').innerHTML = this.renderPage();
    this.selectedFood = null;
  },

  removeFood(idx) {
    window.Store.removeFoodFromLog(idx);
    document.getElementById('main-content').innerHTML = this.renderPage();
  },

  toggleWater(idx) {
    const log = window.Store.getDayLog();
    const newCups = idx < log.water ? idx : idx + 1;
    window.Store.updateWater(newCups);
    document.getElementById('main-content').innerHTML = this.renderPage();
  }
};
