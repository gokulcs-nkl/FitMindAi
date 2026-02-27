// ==========================================
// WEIGHT GAIN ADVISOR — FitMind AI
// Personalized underweight / muscle gain guidance
// ==========================================
window.WeightAdvisor = {

    // High-calorie healthy foods ranked
    HIGH_CAL_FOODS: [
        { name: 'Peanut Butter', icon: '🥜', kcal: 588, protein: 25, servingSize: '100g', tip: 'Add to oats/bread', cost: 'Medium' },
        { name: 'Whole Milk', icon: '🥛', kcal: 150, protein: 8, servingSize: '250ml', tip: 'Drink 2-3 glasses/day', cost: 'Low' },
        { name: 'Banana', icon: '🍌', kcal: 89, protein: 1.1, servingSize: '1 medium', tip: 'Pre-workout energy', cost: 'Very Low' },
        { name: 'Brown Rice', icon: '🍚', kcal: 111, protein: 2.6, servingSize: '100g', tip: 'Complex carbs base', cost: 'Low' },
        { name: 'Soya Chunks', icon: '🟤', kcal: 345, protein: 52, servingSize: '100g dry', tip: 'Best plant protein', cost: 'Very Low' },
        { name: 'Almonds', icon: '🌰', kcal: 579, protein: 21, servingSize: '100g', tip: '20 almonds as snack', cost: 'Medium' },
        { name: 'Eggs', icon: '🥚', kcal: 78, protein: 6.3, servingSize: '1 egg', tip: '3-4 eggs per day', cost: 'Low' },
        { name: 'Paneer', icon: '🧀', kcal: 265, protein: 18, servingSize: '100g', tip: 'Add to every meal', cost: 'Medium' },
        { name: 'Chickpeas (Chana)', icon: '🫘', kcal: 364, protein: 19, servingSize: '100g dry', tip: 'Boiled or curry', cost: 'Low' },
        { name: 'Oats', icon: '🥣', kcal: 389, protein: 17, servingSize: '100g', tip: 'With milk + banana', cost: 'Low' },
    ],

    // Generate personalized advice
    generateAdvice(profile, analysis) {
        const needsGain = analysis?.current ? (profile.targetWeight - analysis.current) : (profile.targetWeight - profile.weight);
        const surplusNeeded = window.AIDiet.getCalorieTarget(profile) - window.AIDiet.calculateTDEE(profile);
        const weeksToGoal = needsGain > 0 ? Math.round(needsGain / 0.35) : 0; // 0.35kg/week clean bulk

        return {
            calorieTarget: window.AIDiet.getCalorieTarget(profile),
            tdee: window.AIDiet.calculateTDEE(profile),
            surplusNeeded: Math.abs(surplusNeeded),
            kgToGain: Math.max(0, Math.round(needsGain * 10) / 10),
            estimatedWeeks: weeksToGoal,
            estimatedDate: this.addWeeks(new Date(), weeksToGoal).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
            strategies: this.getStrategies(profile),
            mealFrequency: '5-6 smaller meals throughout the day',
            workoutFocus: 'Compound movements: Squats, Deadlifts, Push-Ups, Rows',
        };
    },

    addWeeks(date, weeks) {
        const d = new Date(date);
        d.setDate(d.getDate() + (weeks * 7));
        return d;
    },

    getStrategies(profile) {
        const strategies = [
            { icon: '🍽️', title: 'Eat Every 3 Hours', desc: 'Never go more than 3 hours without eating. Set phone reminders.' },
            { icon: '🌙', title: 'Bedtime Snack', desc: 'Have milk + peanut butter or curd + banana before sleeping for overnight gains.' },
            { icon: '🏋️', title: 'Compound Lifts First', desc: 'Squats, deadlifts, bench press trigger maximum muscle growth hormones.' },
            { icon: '😴', title: 'Sleep 8 Hours', desc: 'Growth hormone is released during deep sleep. Non-negotiable for gains.' },
            { icon: '💧', title: 'Drink Calories', desc: 'Add banana + milk + peanut butter smoothies — easy 400 kcal without feeling full.' },
            { icon: '📈', title: 'Progressive Overload', desc: 'Increase weight or reps every week to signal muscle to grow.' },
        ];

        if (profile.environment === 'hostel') {
            strategies.push({ icon: '🏢', title: 'Hostel Hack', desc: 'Buy milk carton + peanuts + banana in bulk. Eat between every meal from mess.' });
        }
        return strategies;
    },

    getSurplusBreakdown(surplusKcal) {
        const items = [
            { name: 'Extra Glass of Milk', kcal: 150, cost: 12 },
            { name: '2 Bananas', kcal: 178, cost: 16 },
            { name: '30g Peanut Butter', kcal: 190, cost: 15 },
            { name: '2 Boiled Eggs', kcal: 156, cost: 16 },
            { name: '30g Almonds', kcal: 173, cost: 25 },
        ];
        let remaining = surplusKcal;
        const result = [];
        for (const item of items) {
            if (remaining <= 0) break;
            result.push(item);
            remaining -= item.kcal;
        }
        return result;
    }
};
