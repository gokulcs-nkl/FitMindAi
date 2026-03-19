// ==========================================
// AI DIET ENGINE — FitMind AI
// TDEE calculation + personalized meal plan generation
// Uses Mifflin-St Jeor equation
// ==========================================
window.AIDiet = {

    // Activity multipliers
    ACTIVITY_MULTS: {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
    },

    // ====== TDEE CALCULATION ======
    calculateBMR(weight, height, age, gender) {
        if (gender === 'male') {
            return (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            return (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }
    },

    calculateTDEE(profile) {
        const bmr = this.calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
        const mult = this.ACTIVITY_MULTS[profile.activity] || 1.55;
        return Math.round(bmr * mult);
    },

    getCalorieTarget(profile, tdee = null) {
        if (!tdee) tdee = this.calculateTDEE(profile);
        switch (profile.goal) {
            case 'gain': return tdee + 500;
            case 'lose': return Math.max(tdee - 500, 1200);
            default: return tdee;
        }
    },

    getMacroTargets(calorieTarget, goal) {
        // Protein: 2g/kg for gain, 1.6g/kg for lose, 1.4g/kg for maintain
        // Comes in grams
        const proteinPct = goal === 'gain' ? 0.30 : goal === 'lose' ? 0.35 : 0.25;
        const fatPct = 0.25;
        const carbsPct = 1 - proteinPct - fatPct;
        return {
            protein: Math.round((calorieTarget * proteinPct) / 4),
            carbs: Math.round((calorieTarget * carbsPct) / 4),
            fat: Math.round((calorieTarget * fatPct) / 9),
            calories: calorieTarget
        };
    },

    calculateBMI(weight, height) {
        const hm = height / 100;
        return Math.round((weight / (hm * hm)) * 10) / 10;
    },

    getBMICategory(bmi) {
        if (bmi < 18.5) return { label: 'Underweight', color: '#00d4ff', advice: 'Focus on calorie surplus and muscle building' };
        if (bmi < 25) return { label: 'Normal', color: '#00e676', advice: 'Maintain your healthy weight range' };
        if (bmi < 30) return { label: 'Overweight', color: '#ffd740', advice: 'Light calorie deficit with consistent exercise' };
        return { label: 'Obese', color: '#ff5252', advice: 'Consult a healthcare professional' };
    },

    // ====== MEAL PLAN GENERATION ======
    generateMealPlan(profile) {
        const tdee = this.calculateTDEE(profile);
        const calorieTarget = this.getCalorieTarget(profile, tdee);
        const macros = this.getMacroTargets(calorieTarget, profile.goal);
        const region = profile.region || 'north';
        const vegPref = profile.foodPreference;

        // Calorie split: Breakfast 25%, Lunch 35%, Dinner 30%, Snacks 10%
        const splits = { breakfast: 0.25, lunch: 0.35, dinner: 0.30, snacks: 0.10 };

        const meals = {};
        ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
            const template = window.getMealTemplate(profile.goal, region, mealType);
            let foods = template.foods
                .map(fid => {
                    const food = window.getFoodById(fid);
                    return food ? { ...food, quantity: 1 } : null;
                })
                .filter(Boolean);

            // Filter by veg preference
            if (vegPref === 'vegetarian' || vegPref === 'vegan') {
                foods = foods.filter(f => f.veg);
            }

            // Calculate meal totals
            const mealTotals = foods.reduce((acc, f) => ({
                kcal: acc.kcal + (f.kcal * f.quantity),
                protein: acc.protein + (f.protein * f.quantity),
                carbs: acc.carbs + (f.carbs * f.quantity),
                fat: acc.fat + (f.fat * f.quantity),
            }), { kcal: 0, protein: 0, carbs: 0, fat: 0 });

            meals[mealType] = {
                label: template.label || `${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`,
                foods,
                totals: Object.fromEntries(Object.entries(mealTotals).map(([k, v]) => [k, Math.round(v)])),
                targetKcal: Math.round(calorieTarget * splits[mealType]),
            };
        });

        return {
            tdee,
            calorieTarget,
            macros,
            meals,
            bmi: this.calculateBMI(profile.weight, profile.height),
            bmiCategory: this.getBMICategory(this.calculateBMI(profile.weight, profile.height)),
            profile: { ...profile },
            generatedAt: new Date().toISOString(),
        };
    },

    // ====== TOTAL PLAN MACROS ======
    getPlanTotals(plan) {
        const totals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
        Object.values(plan.meals).forEach(meal => {
            totals.kcal += meal.totals.kcal || 0;
            totals.protein += meal.totals.protein || 0;
            totals.carbs += meal.totals.carbs || 0;
            totals.fat += meal.totals.fat || 0;
        });
        return totals;
    },

    // ====== WATER RECOMMENDATION ======
    getWaterGoal(weight, weather = null) {
        let base = Math.round(weight * 0.033 * 10) / 10; // ~33ml per kg
        if (weather && weather.temp > 35) base += 0.5;
        else if (weather && weather.temp > 30) base += 0.3;
        return { liters: base, cups: Math.ceil(base * 4) }; // 250ml per cup
    },

    // ====== BUDGET-BASED ALTERNATIVE SUGGESTIONS ======
    getCheaperAlternatives(foodId, budget) {
        const food = window.getFoodById(foodId);
        if (!food) return [];
        return window.FOODS_DB
            .filter(f => f.category === food.category && f.cost < food.cost && f.id !== food.id)
            .sort((a, b) => Math.abs(a.kcal - food.kcal) - Math.abs(b.kcal - food.kcal))
            .slice(0, 3);
    },

    // ====== HOSTEL MODE PLAN ======
    generateHostelAddons(profile) {
        const tdee = this.calculateTDEE(profile);
        const calorieTarget = this.getCalorieTarget(profile, tdee);
        const messCalories = 1800; // avg mess calories
        const deficit = calorieTarget - messCalories;

        const addons = [
            { ...window.getFoodById('banana'), quantity: 2, reason: 'Easy, cheap, high-carb' },
            { ...window.getFoodById('milk_full'), quantity: 1, reason: 'Complete protein + calcium' },
            { ...window.getFoodById('peanuts'), quantity: 1, reason: 'High-cal, cheap, filling' },
            { ...window.getFoodById('egg_boiled'), quantity: 2, reason: 'Best cheap protein source' },
            { ...window.getFoodById('almonds'), quantity: 1, reason: 'Healthy fats + micronutrients' },
        ];

        return {
            messCalories,
            calorieTarget,
            deficit: Math.max(0, deficit),
            addons: addons.filter(Boolean),
        };
    }
};
