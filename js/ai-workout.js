// ==========================================
// AI WORKOUT ENGINE — FitMind AI
// Goal-based workout plan with progressive overload
// ==========================================
window.AIWorkout = {

    // Day names for workout splits
    DAY_NAMES: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    DAY_SHORT: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],

    // Progressive overload: week multiplier for sets/reps
    getWeekMultiplier(weekNum) {
        const progressions = [1.0, 1.05, 1.1, 1.15, 0.85, 1.15, 1.2, 1.25]; // deload at week 5
        return progressions[Math.min(weekNum - 1, progressions.length - 1)] || 1.0;
    },

    // Generate weekly workout schedule
    generateWorkoutPlan(profile) {
        const { goal, environment: env, fitnessLevel: level } = profile;
        const weekSplits = window.WORKOUT_SPLITS[level] || window.WORKOUT_SPLITS.beginner;

        // Pick appropriate split (PPL or Full Body)
        const split = level === 'beginner' ? weekSplits.fullbody || weekSplits.ppl : weekSplits.ppl;
        const dayTypes = level === 'beginner' ? weekSplits.days : weekSplits.days;

        // Build each day's workout
        const schedule = split.map((dayType, idx) => {
            if (dayType === 'Rest') {
                return { day: this.DAY_NAMES[idx], dayShort: this.DAY_SHORT[idx], type: 'Rest', exercises: [], isRest: true };
            }

            const muscleGroups = dayTypes[dayType] || [];
            const exercises = [];
            muscleGroups.forEach(group => {
                const exCount = group === 'cardio' ? 2 : 3;
                const groupExercises = window.getExercises(group, env, level, exCount);
                groupExercises.forEach(ex => {
                    exercises.push({ ...ex, group });
                });
            });

            // Add cardio for fat loss
            if (goal === 'lose' && exercises.length < 8) {
                const cardioEx = window.getExercises('cardio', env, level, 1);
                if (cardioEx.length) exercises.push({ ...cardioEx[0], group: 'cardio' });
            }

            return {
                day: this.DAY_NAMES[idx],
                dayShort: this.DAY_SHORT[idx],
                type: dayType,
                exercises,
                isRest: false,
                estimatedDuration: `${exercises.length * 7 + 10} min`,
                estimatedCalories: exercises.reduce((sum, e) => sum + (e.calories_per_min || 6) * 3, 0),
            };
        });

        return {
            schedule,
            level,
            goal,
            environment: env,
            split: level === 'beginner' ? 'Full Body' : 'Push/Pull/Legs',
            weekNumber: 1,
            generatedAt: new Date().toISOString(),
        };
    },

    // Apply progressive overload for a given week
    applyProgressiveOverload(plan, weekNum) {
        const mult = this.getWeekMultiplier(weekNum);
        return {
            ...plan,
            weekNumber: weekNum,
            schedule: plan.schedule.map(day => ({
                ...day,
                exercises: day.exercises.map(ex => {
                    // Increase reps by ~5-10% per week
                    const baseReps = ex.reps.includes('-') ? parseInt(ex.reps.split('-')[0]) : parseInt(ex.reps) || 12;
                    const newReps = Math.round(baseReps * mult);
                    return { ...ex, reps: `${newReps}${ex.reps.includes('-') ? '-' + Math.round(parseInt(ex.reps.split('-')[1] || baseReps + 3) * mult) : ''}` };
                })
            }))
        };
    },

    // Estimate calories burned for a workout day
    estimateCaloriesBurned(dayPlan, weight = 70) {
        if (dayPlan.isRest) return 0;
        const bodyWeightFactor = weight / 70;
        return Math.round(dayPlan.exercises.reduce((sum, ex) => {
            const sets = parseInt(ex.sets) || 3;
            const timeMin = sets * 2.5; // ~2.5 min per set including rest
            return sum + (ex.calories_per_min || 6) * timeMin;
        }, 0) * bodyWeightFactor);
    },

    // Get today's workout based on schedule
    getTodayWorkout(plan) {
        const today = new Date().getDay(); // 0=Sunday
        const dayIdx = today === 0 ? 6 : today - 1; // Convert to Mon=0 index
        return plan.schedule[dayIdx] || null;
    },

    // Get workout tips based on goal
    getWorkoutTips(goal, level) {
        const tips = {
            gain: ['Progressive overload is key — increase weight or reps each week', 'Focus on compound movements first', 'Rest 90-120 seconds between sets for strength', 'Eat your protein within 1hr post-workout'],
            lose: ['Combine cardio with resistance training for best results', 'Rest 30-60 seconds to keep heart rate elevated', 'HIIT is 3x more effective than steady-state cardio', 'Stay hydrated during workout'],
            maintain: ['Vary your workout to avoid plateaus', 'Include flexibility and mobility work', 'Listen to your body — rest when needed', 'Consistency beats intensity']
        };
        return tips[goal] || tips.maintain;
    },
};
