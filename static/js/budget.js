// ==========================================
// BUDGET INTELLIGENCE — FitMind AI
// Weekly/monthly food budget tracking
// ==========================================
window.BudgetModule = {

    // Default budget limits
    getDefaults() { return { weekly: 800, monthly: 3200 }; },

    getBudget() { return window.Store.getBudget(); },

    getCurrentWeekSpend() {
        const logs = window.Store.getLastNDays(7);
        let total = 0;
        logs.forEach(({ log }) => {
            if (log?.foods) {
                log.foods.forEach(f => { total += (f.cost || 0) * (f.quantity || 1); });
            }
        });
        return Math.round(total);
    },

    getCurrentMonthSpend() {
        const all = window.Store.getAllLogs();
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        let total = 0;
        all.filter(l => l.date?.startsWith(monthKey)).forEach(l => {
            if (l.foods) l.foods.forEach(f => { total += (f.cost || 0) * (f.quantity || 1); });
        });
        return Math.round(total);
    },

    getBudgetStatus() {
        const budget = this.getBudget();
        const weeklySpent = this.getCurrentWeekSpend();
        const monthlySpent = this.getCurrentMonthSpend();
        const weeklyRemaining = (budget.weekly || 800) - weeklySpent;
        const monthlyRemaining = (budget.monthly || 3200) - monthlySpent;
        const weeklyPct = Math.min(100, Math.round(weeklySpent / (budget.weekly || 800) * 100));
        const monthlyPct = Math.min(100, Math.round(monthlySpent / (budget.monthly || 3200) * 100));

        return {
            weekly: { budget: budget.weekly || 800, spent: weeklySpent, remaining: weeklyRemaining, pct: weeklyPct },
            monthly: { budget: budget.monthly || 3200, spent: monthlySpent, remaining: monthlyRemaining, pct: monthlyPct },
            isWeeklyOver: weeklyRemaining < 0,
            isMonthlyOver: monthlyRemaining < 0,
            isWeeklyWarning: weeklyPct > 80,
            isMonthlyWarning: monthlyPct > 80,
        };
    },

    // Daily budget breakdown
    getDailyBudget() {
        const budget = this.getBudget();
        return Math.round((budget.weekly || 800) / 7);
    },

    // Cheap alternatives for a food item
    getCheapAlternatives(foodId) {
        const food = window.getFoodById(foodId);
        if (!food) return [];
        return window.FOODS_DB
            .filter(f => f.category === food.category && f.cost < food.cost && f.veg === food.veg)
            .sort((a, b) => a.cost - b.cost)
            .slice(0, 3);
    },

    // Budget-optimized food suggestions
    getBudgetMeals(dailyBudget, vegPref) {
        const meals = window.FOODS_DB
            .filter(f => f.cost <= dailyBudget * 0.4 && (vegPref === 'non-vegetarian' || f.veg))
            .sort((a, b) => (b.protein / b.cost) - (a.protein / a.cost))
            .slice(0, 10);
        return meals;
    },

    // Best protein per rupee ranking
    getBestValueFoods(vegPref = 'vegetarian') {
        return window.FOODS_DB
            .filter(f => f.cost > 0 && f.protein > 0 && (vegPref === 'non-vegetarian' || f.veg))
            .map(f => ({ ...f, proteinPerRupee: (f.protein / f.cost).toFixed(2), kcalPerRupee: (f.kcal / f.cost).toFixed(1) }))
            .sort((a, b) => b.proteinPerRupee - a.proteinPerRupee)
            .slice(0, 10);
    }
};
