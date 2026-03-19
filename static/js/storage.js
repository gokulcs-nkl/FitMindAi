// ==========================================
// STORAGE MODULE — FitMind AI
// localStorage CRUD helpers + data management
// ==========================================
window.Store = {

    // ====== KEYS ======
    KEYS: {
        PROFILE: 'fitmind_profile',
        DIET_PLAN: 'fitmind_diet_plan',
        WORKOUT_PLAN: 'fitmind_workout_plan',
        DAILY_LOG: 'fitmind_daily_log',
        WEIGHT_LOG: 'fitmind_weight_log',
        CUSTOM_FOODS: 'fitmind_custom_foods',
        BUDGET: 'fitmind_budget',
        SETTINGS: 'fitmind_settings',
        WEEK_START: 'fitmind_week_start',
    },

    // ====== GENERIC ======
    get(key, fallback = null) {
        try {
            const val = localStorage.getItem(key);
            return val ? JSON.parse(val) : fallback;
        } catch { return fallback; }
    },

    set(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); return true; }
        catch { return false; }
    },

    remove(key) { localStorage.removeItem(key); },

    // ====== PROFILE ======
    getProfile() { return this.get(this.KEYS.PROFILE); },
    setProfile(data) { return this.set(this.KEYS.PROFILE, { ...data, updatedAt: new Date().toISOString() }); },
    hasProfile() { return !!this.getProfile(); },

    // ====== DIET PLAN ======
    getDietPlan() { return this.get(this.KEYS.DIET_PLAN); },
    setDietPlan(plan) { return this.set(this.KEYS.DIET_PLAN, { ...plan, generatedAt: new Date().toISOString() }); },

    // ====== WORKOUT PLAN ======
    getWorkoutPlan() { return this.get(this.KEYS.WORKOUT_PLAN); },
    setWorkoutPlan(plan) { return this.set(this.KEYS.WORKOUT_PLAN, { ...plan, generatedAt: new Date().toISOString() }); },

    // ====== DAILY LOG ======
    getTodayKey() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },

    getDayLog(dateKey = null) {
        const key = dateKey || this.getTodayKey();
        const all = this.get(this.KEYS.DAILY_LOG, {});
        return all[key] || { date: key, foods: [], water: 0, workoutDone: false, notes: '' };
    },

    saveDayLog(log, dateKey = null) {
        const key = dateKey || this.getTodayKey();
        const all = this.get(this.KEYS.DAILY_LOG, {});
        all[key] = { ...log, date: key };
        return this.set(this.KEYS.DAILY_LOG, all);
    },

    addFoodToLog(foodItem, dateKey = null) {
        const log = this.getDayLog(dateKey);
        log.foods.push({ ...foodItem, addedAt: Date.now() });
        this.saveDayLog(log, dateKey);
        return log;
    },

    removeFoodFromLog(idx, dateKey = null) {
        const log = this.getDayLog(dateKey);
        log.foods.splice(idx, 1);
        this.saveDayLog(log, dateKey);
        return log;
    },

    updateWater(cups, dateKey = null) {
        const log = this.getDayLog(dateKey);
        log.water = cups;
        this.saveDayLog(log, dateKey);
    },

    markWorkoutDone(done = true, dateKey = null) {
        const log = this.getDayLog(dateKey);
        log.workoutDone = done;
        this.saveDayLog(log, dateKey);
    },

    // Totals for a day log
    getDayTotals(dateKey = null) {
        const log = this.getDayLog(dateKey);
        const totals = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, cost: 0 };
        log.foods.forEach(f => {
            const mul = (f.quantity || 1);
            totals.kcal += (f.kcal || 0) * mul;
            totals.protein += (f.protein || 0) * mul;
            totals.carbs += (f.carbs || 0) * mul;
            totals.fat += (f.fat || 0) * mul;
            totals.fiber += (f.fiber || 0) * mul;
            totals.cost += (f.cost || 0) * mul;
        });
        return Object.fromEntries(Object.entries(totals).map(([k, v]) => [k, Math.round(v * 10) / 10]));
    },

    // Get all day logs sorted desc
    getAllLogs() {
        const all = this.get(this.KEYS.DAILY_LOG, {});
        return Object.values(all).sort((a, b) => b.date.localeCompare(a.date));
    },

    getLastNDays(n = 7) {
        const logs = this.getAllLogs();
        const result = [];
        for (let i = 0; i < n; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const all = this.get(this.KEYS.DAILY_LOG, {});
            result.unshift({ date: key, log: all[key] || null });
        }
        return result;
    },

    // ====== WEIGHT LOG ======
    getWeightLog() { return this.get(this.KEYS.WEIGHT_LOG, []); },

    addWeightEntry(weight) {
        const log = this.getWeightLog();
        log.push({ weight, date: this.getTodayKey(), timestamp: Date.now() });
        return this.set(this.KEYS.WEIGHT_LOG, log);
    },

    getLatestWeight() {
        const log = this.getWeightLog();
        if (!log.length) return null;
        return log[log.length - 1];
    },

    // ====== CUSTOM FOODS ======
    getCustomFoods() { return this.get(this.KEYS.CUSTOM_FOODS, []); },

    addCustomFood(food) {
        const foods = this.getCustomFoods();
        const id = 'custom_' + Date.now();
        foods.push({ ...food, id, custom: true });
        this.set(this.KEYS.CUSTOM_FOODS, foods);
        return id;
    },

    // ====== BUDGET ======
    getBudget() { return this.get(this.KEYS.BUDGET, { weekly: 800, monthly: 3200, spent: {} }); },
    setBudget(data) { return this.set(this.KEYS.BUDGET, data); },

    // ====== SETTINGS ======
    getSettings() {
        return this.get(this.KEYS.SETTINGS, {
            notifications: false,
            mealReminders: true,
            waterReminders: true,
            workoutReminders: true,
            reminderTimes: { breakfast: '08:00', lunch: '13:00', dinner: '20:00', workout: '18:00' },
            hostelMode: false,
            theme: 'dark'
        });
    },
    saveSettings(s) { return this.set(this.KEYS.SETTINGS, s); },

    // ====== RESET ======
    clearAll() {
        Object.values(this.KEYS).forEach(k => this.remove(k));
    },

    exportData() {
        const data = {};
        Object.entries(this.KEYS).forEach(([name, key]) => {
            data[name] = this.get(key);
        });
        return data;
    }
};
