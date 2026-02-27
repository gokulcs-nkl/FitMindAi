// ==========================================
// GOAL OPTIMIZATION ENGINE — FitMind AI
// Plateau detection, progress analysis, calorie recalculation
// ==========================================
window.GoalEngine = {

    // Analyze weight progress over last N weeks
    analyzeProgress(profile) {
        const weightLog = window.Store.getWeightLog();
        if (weightLog.length < 2) return { status: 'insufficient_data', message: 'Add at least 2 weight entries to analyze progress.' };

        const latest = weightLog[weightLog.length - 1];
        const earliest = weightLog[0];
        const current = latest.weight;
        const starting = earliest.weight;
        const target = profile.targetWeight || profile.weight;
        const totalChange = current - starting;
        const weeksPassed = Math.max(1, Math.ceil((Date.now() - new Date(earliest.date).getTime()) / (7 * 24 * 3600000)));
        const weeklyRate = totalChange / weeksPassed;

        // Plateau detection: check last 2 weeks
        const recentEntries = weightLog.slice(-4);
        const avgChange = recentEntries.length > 1
            ? Math.abs((recentEntries[recentEntries.length - 1].weight - recentEntries[0].weight) / recentEntries.length)
            : 1;
        const isPlateau = avgChange < 0.2;

        const distanceToGoal = Math.abs(target - current);
        const progressPct = starting !== target
            ? Math.max(0, Math.min(100, Math.round(Math.abs(totalChange) / Math.abs(target - starting) * 100)))
            : 100;

        const result = {
            current, starting, target,
            totalChange: Math.round(totalChange * 10) / 10,
            weeklyRate: Math.round(weeklyRate * 100) / 100,
            weeksPassed,
            distanceToGoal: Math.round(distanceToGoal * 10) / 10,
            progressPct,
            isPlateau,
            status: 'ok',
            insights: [],
            recommendation: null,
        };

        // Generate insights
        if (profile.goal === 'gain') {
            if (weeklyRate < 0.1 && weeksPassed > 2) {
                result.status = 'slow_progress';
                result.insights.push({ type: 'warning', text: `You're gaining only ${Math.abs(weeklyRate).toFixed(2)}kg/week. Target is 0.25-0.5kg/week.` });
                result.recommendation = { action: 'increase_calories', amount: 200, reason: 'Increase daily calories by 200 kcal to break plateau' };
            } else if (weeklyRate > 0.8) {
                result.insights.push({ type: 'info', text: `Gaining ${weeklyRate.toFixed(2)}kg/week — slightly fast. May include excess fat.` });
                result.recommendation = { action: 'decrease_calories', amount: 150, reason: 'Reduce by 150 kcal for cleaner bulk' };
            } else if (weeklyRate >= 0.25 && weeklyRate <= 0.5) {
                result.insights.push({ type: 'success', text: `Perfect! Gaining ${weeklyRate.toFixed(2)}kg/week — ideal lean bulk rate.` });
            }
        } else if (profile.goal === 'lose') {
            if (weeklyRate > -0.1 && weeksPassed > 2) {
                result.status = 'plateau';
                result.insights.push({ type: 'warning', text: `Weight loss has stalled (${Math.abs(weeklyRate).toFixed(2)}kg/week). Target: 0.5-1kg/week.` });
                result.recommendation = { action: 'decrease_calories', amount: 200, reason: 'Reduce by 200 kcal and add 1 cardio session' };
            } else if (weeklyRate < -1.2) {
                result.insights.push({ type: 'warning', text: `Losing ${Math.abs(weeklyRate).toFixed(2)}kg/week — too fast! You may lose muscle.` });
                result.recommendation = { action: 'increase_calories', amount: 200, reason: 'Slight calorie increase to preserve muscle' };
            } else if (weeklyRate >= -1.0 && weeklyRate <= -0.5) {
                result.insights.push({ type: 'success', text: `Great! Losing ${Math.abs(weeklyRate).toFixed(2)}kg/week — healthy sustainable rate.` });
            }
        }

        if (isPlateau && weeksPassed > 3) {
            result.insights.push({ type: 'info', text: '📊 Consider changing workout intensity or meal timing to break the plateau.' });
        }

        // Estimated days to goal
        if (weeklyRate !== 0) {
            const weeksToGoal = distanceToGoal / Math.abs(weeklyRate);
            const daysToGoal = Math.round(weeksToGoal * 7);
            const goalDate = new Date();
            goalDate.setDate(goalDate.getDate() + daysToGoal);
            result.estimatedGoalDate = goalDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
            result.daysToGoal = daysToGoal;
        }

        return result;
    },

    // Get adjusted calorie target based on progress
    getAdjustedTarget(profile, analysis) {
        const basePlan = window.Store.getDietPlan();
        const base = basePlan?.calorieTarget || window.AIDiet.getCalorieTarget(profile);
        if (!analysis.recommendation) return base;
        if (analysis.recommendation.action === 'increase_calories') return base + analysis.recommendation.amount;
        if (analysis.recommendation.action === 'decrease_calories') return base - analysis.recommendation.amount;
        return base;
    }
};
