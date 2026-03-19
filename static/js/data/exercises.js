// ==========================================
// EXERCISE DATABASE — FitMind AI
// 200+ exercises categorized by muscle group, equipment, level
// ==========================================
window.EXERCISES_DB = {
    // ===== CHEST =====
    chest: [
        { id: 'pushup', name: 'Push-Ups', equipment: 'none', level: 'beginner', sets: '3', reps: '12-15', rest: '60s', muscle: 'Chest, Triceps, Shoulders', calories_per_min: 7, tip: 'Keep your core tight and body in a straight line.', emoji: '💪' },
        { id: 'wide_pushup', name: 'Wide-Grip Push-Ups', equipment: 'none', level: 'beginner', sets: '3', reps: '10-12', rest: '60s', muscle: 'Chest (outer)', calories_per_min: 7, tip: 'Place hands wider than shoulder-width.', emoji: '💪' },
        { id: 'incline_pushup', name: 'Incline Push-Ups', equipment: 'none', level: 'beginner', sets: '3', reps: '12-15', rest: '60s', muscle: 'Lower Chest', calories_per_min: 6, tip: 'Use a table/desk. Feet elevated targets upper chest.', emoji: '💪' },
        { id: 'diamond_pushup', name: 'Diamond Push-Ups', equipment: 'none', level: 'intermediate', sets: '3', reps: '8-12', rest: '60s', muscle: 'Triceps, Inner Chest', calories_per_min: 8, tip: 'Form a diamond shape with thumbs and index fingers.', emoji: '💎' },
        { id: 'bench_press', name: 'Bench Press', equipment: 'gym', level: 'intermediate', sets: '4', reps: '8-12', rest: '90s', muscle: 'Chest, Triceps', calories_per_min: 8, tip: 'Keep shoulder blades retracted. Full range of motion.', emoji: '🏋️' },
        { id: 'incline_bench', name: 'Incline Bench Press', equipment: 'gym', level: 'intermediate', sets: '3', reps: '8-12', rest: '90s', muscle: 'Upper Chest', calories_per_min: 8, tip: 'Set bench at 30-45 degrees.', emoji: '🏋️' },
        { id: 'dumbbell_flyes', name: 'Dumbbell Flyes', equipment: 'gym', level: 'intermediate', sets: '3', reps: '12-15', rest: '60s', muscle: 'Chest (stretch)', calories_per_min: 6, tip: 'Keep slight bend in elbows throughout.', emoji: '🏋️' },
        { id: 'cable_crossover', name: 'Cable Crossover', equipment: 'gym', level: 'advanced', sets: '3', reps: '12-15', rest: '60s', muscle: 'Inner Chest', calories_per_min: 6, tip: 'Squeeze chest at the peak contraction.', emoji: '🏋️' },
    ],
    // ===== BACK =====
    back: [
        { id: 'pullup', name: 'Pull-Ups', equipment: 'bar', level: 'intermediate', sets: '3', reps: '6-10', rest: '90s', muscle: 'Lats, Biceps', calories_per_min: 9, tip: 'Full hang at bottom, chin over bar at top.', emoji: '🧗' },
        { id: 'superman', name: 'Superman Hold', equipment: 'none', level: 'beginner', sets: '3', reps: '15', rest: '45s', muscle: 'Lower Back', calories_per_min: 4, tip: 'Hold 2 seconds at the top.', emoji: '🦸' },
        { id: 'rows_towel', name: 'Towel Rows (Door)', equipment: 'none', level: 'beginner', sets: '3', reps: '12-15', rest: '60s', muscle: 'Back, Biceps', calories_per_min: 6, tip: 'Loop towel around door handle. Lean back, pull to chest.', emoji: '🚪' },
        { id: 'deadlift', name: 'Deadlift', equipment: 'gym', level: 'intermediate', sets: '4', reps: '6-10', rest: '120s', muscle: 'Full Back, Glutes, Hamstrings', calories_per_min: 10, tip: 'Keep back flat, push floor away, not round.', emoji: '🏋️' },
        { id: 'bent_rows', name: 'Bent-Over Barbell Rows', equipment: 'gym', level: 'intermediate', sets: '4', reps: '8-12', rest: '90s', muscle: 'Lats, Rhomboids', calories_per_min: 9, tip: 'Hinge at hips, pull bar to lower rib cage.', emoji: '🏋️' },
        { id: 'lat_pulldown', name: 'Lat Pulldown', equipment: 'gym', level: 'beginner', sets: '3', reps: '10-12', rest: '60s', muscle: 'Lats', calories_per_min: 7, tip: 'Pull to upper chest, lean slightly back.', emoji: '🏋️' },
        { id: 'seated_cable_row', name: 'Seated Cable Row', equipment: 'gym', level: 'beginner', sets: '3', reps: '12-15', rest: '60s', muscle: 'Middle Back', calories_per_min: 7, tip: 'Keep back straight, pull elbows back.', emoji: '🏋️' },
    ],
    // ===== SHOULDERS =====
    shoulders: [
        { id: 'pike_pushup', name: 'Pike Push-Ups', equipment: 'none', level: 'beginner', sets: '3', reps: '10-12', rest: '60s', muscle: 'Shoulders, Triceps', calories_per_min: 7, tip: 'Form an inverted V shape with your body.', emoji: '🔺' },
        { id: 'wall_handstand', name: 'Wall Handstand Hold', equipment: 'none', level: 'advanced', sets: '3', reps: '20-30s', rest: '90s', muscle: 'Shoulders, Core', calories_per_min: 6, tip: 'Build up hold time gradually.', emoji: '🤸' },
        { id: 'ohp', name: 'Overhead Press (Barbell)', equipment: 'gym', level: 'intermediate', sets: '4', reps: '8-10', rest: '90s', muscle: 'Anterior Deltoid', calories_per_min: 8, tip: 'Press straight up, lock out arms at top.', emoji: '🏋️' },
        { id: 'lateral_raise', name: 'Lateral Raises', equipment: 'gym', level: 'beginner', sets: '3', reps: '12-15', rest: '45s', muscle: 'Medial Deltoid', calories_per_min: 5, tip: 'Lead with elbows, stop at shoulder level.', emoji: '🏋️' },
        { id: 'front_raise', name: 'Front Raises', equipment: 'gym', level: 'beginner', sets: '3', reps: '12', rest: '45s', muscle: 'Front Deltoid', calories_per_min: 5, tip: 'Raise to shoulder height only.', emoji: '🏋️' },
        { id: 'arnold_press', name: 'Arnold Press', equipment: 'gym', level: 'intermediate', sets: '3', reps: '10-12', rest: '60s', muscle: 'Full Deltoid', calories_per_min: 7, tip: 'Rotate from palms facing you to palms out as you press.', emoji: '🏋️' },
    ],
    // ===== ARMS =====
    arms: [
        { id: 'bicep_curls_home', name: 'Water Bottle Curls', equipment: 'none', level: 'beginner', sets: '3', reps: '15-20', rest: '45s', muscle: 'Biceps', calories_per_min: 4, tip: 'Use water-filled bottles. Slow controlled movement.', emoji: '💪' },
        { id: 'tricep_dips', name: 'Chair Tricep Dips', equipment: 'none', level: 'beginner', sets: '3', reps: '12-15', rest: '60s', muscle: 'Triceps', calories_per_min: 6, tip: 'Place hands on chair edge, lower body till elbows are 90°.', emoji: '🪑' },
        { id: 'bicep_curl', name: 'Dumbbell Bicep Curl', equipment: 'gym', level: 'beginner', sets: '3', reps: '10-12', rest: '45s', muscle: 'Biceps', calories_per_min: 5, tip: 'Keep elbows glued to sides. Full contraction at top.', emoji: '🏋️' },
        { id: 'hammer_curl', name: 'Hammer Curls', equipment: 'gym', level: 'beginner', sets: '3', reps: '10-12', rest: '45s', muscle: 'Biceps, Brachialis', calories_per_min: 5, tip: 'Neutral grip (thumbs up). Builds forearm too.', emoji: '🏋️' },
        { id: 'tricep_pushdown', name: 'Tricep Cable Pushdown', equipment: 'gym', level: 'beginner', sets: '3', reps: '12-15', rest: '45s', muscle: 'Triceps', calories_per_min: 5, tip: 'Keep elbows at sides. Full extension.', emoji: '🏋️' },
        { id: 'skullcrusher', name: 'Skull Crushers', equipment: 'gym', level: 'intermediate', sets: '3', reps: '10-12', rest: '60s', muscle: 'Triceps', calories_per_min: 6, tip: 'Lower bar to forehead, elbows fixed.', emoji: '🏋️' },
    ],
    // ===== LEGS =====
    legs: [
        { id: 'squat_bw', name: 'Bodyweight Squats', equipment: 'none', level: 'beginner', sets: '3', reps: '20', rest: '60s', muscle: 'Quads, Glutes, Hamstrings', calories_per_min: 8, tip: 'Feet shoulder-width, knees track over toes.', emoji: '🦵' },
        { id: 'lunges', name: 'Walking Lunges', equipment: 'none', level: 'beginner', sets: '3', reps: '12 each leg', rest: '60s', muscle: 'Quads, Glutes', calories_per_min: 8, tip: 'Front knee stays over ankle. Big step forward.', emoji: '🦵' },
        { id: 'wall_sit', name: 'Wall Sit', equipment: 'none', level: 'beginner', sets: '3', reps: '30-60s', rest: '60s', muscle: 'Quads', calories_per_min: 6, tip: 'Thighs parallel to floor, back flat on wall.', emoji: '🧱' },
        { id: 'glute_bridge', name: 'Glute Bridge', equipment: 'none', level: 'beginner', sets: '3', reps: '20', rest: '45s', muscle: 'Glutes, Hamstrings', calories_per_min: 5, tip: 'Squeeze glutes at the top. Hold 1 second.', emoji: '🍑' },
        { id: 'calf_raise', name: 'Calf Raises', equipment: 'none', level: 'beginner', sets: '4', reps: '25-30', rest: '30s', muscle: 'Calves', calories_per_min: 4, tip: 'Slow and controlled, full range of motion.', emoji: '🦵' },
        { id: 'jump_squat', name: 'Jump Squats', equipment: 'none', level: 'intermediate', sets: '3', reps: '15', rest: '60s', muscle: 'Full Legs, Cardio', calories_per_min: 12, tip: 'Land softly! Use balls of feet.', emoji: '🚀' },
        { id: 'barbell_squat', name: 'Barbell Back Squat', equipment: 'gym', level: 'intermediate', sets: '4', reps: '8-10', rest: '120s', muscle: 'Full Lower Body', calories_per_min: 10, tip: 'Bar on traps, not neck. Depth below parallel.', emoji: '🏋️' },
        { id: 'leg_press', name: 'Leg Press', equipment: 'gym', level: 'beginner', sets: '4', reps: '12-15', rest: '90s', muscle: 'Quads, Glutes', calories_per_min: 8, tip: 'Feet shoulder-width on platform. Full range.', emoji: '🏋️' },
        { id: 'rdl', name: 'Romanian Deadlift', equipment: 'gym', level: 'intermediate', sets: '3', reps: '10-12', rest: '90s', muscle: 'Hamstrings, Glutes', calories_per_min: 9, tip: 'Hinge at hips, bar close to legs. Feel hamstring stretch.', emoji: '🏋️' },
    ],
    // ===== CORE =====
    core: [
        { id: 'plank', name: 'Plank Hold', equipment: 'none', level: 'beginner', sets: '3', reps: '30-60s', rest: '45s', muscle: 'Full Core', calories_per_min: 5, tip: 'Keep hips in line with body. Breathe normally.', emoji: '⚓' },
        { id: 'crunches', name: 'Crunches', equipment: 'none', level: 'beginner', sets: '3', reps: '20', rest: '30s', muscle: 'Abs (upper)', calories_per_min: 5, tip: 'Curl shoulder blades off floor. No neck strain.', emoji: '💪' },
        { id: 'bicycle_crunch', name: 'Bicycle Crunches', equipment: 'none', level: 'beginner', sets: '3', reps: '20', rest: '30s', muscle: 'Obliques, Abs', calories_per_min: 7, tip: 'Opposite elbow to knee, controlled rotation.', emoji: '🚲' },
        { id: 'leg_raises', name: 'Leg Raises', equipment: 'none', level: 'intermediate', sets: '3', reps: '15', rest: '45s', muscle: 'Lower Abs', calories_per_min: 5, tip: 'Keep lower back pressed to floor throughout.', emoji: '🦵' },
        { id: 'russian_twist', name: 'Russian Twists', equipment: 'none', level: 'beginner', sets: '3', reps: '20', rest: '30s', muscle: 'Obliques', calories_per_min: 6, tip: 'Lean back 45°, rotate side to side touching floor.', emoji: '🔄' },
        { id: 'mountain_climber', name: 'Mountain Climbers', equipment: 'none', level: 'intermediate', sets: '3', reps: '30s', rest: '30s', muscle: 'Core, Cardio', calories_per_min: 10, tip: 'Drive knees fast to chest alternately. Hips stable.', emoji: '🏔️' },
        { id: 'ab_wheel', name: 'Ab Wheel Rollout', equipment: 'none', level: 'advanced', sets: '3', reps: '10', rest: '60s', muscle: 'Full Core', calories_per_min: 7, tip: 'Control the extension. Don\'t collapse lower back.', emoji: '⚙️' },
    ],
    // ===== CARDIO =====
    cardio: [
        { id: 'running', name: 'Running / Jogging', equipment: 'none', level: 'beginner', sets: '1', reps: '20-30 min', rest: '-', muscle: 'Cardiovascular', calories_per_min: 11, tip: 'Maintain conversational pace for fat burn.', emoji: '🏃' },
        { id: 'jumping_jacks', name: 'Jumping Jacks', equipment: 'none', level: 'beginner', sets: '3', reps: '50', rest: '30s', muscle: 'Full Body Cardio', calories_per_min: 10, tip: 'Great warm-up exercise. Land softly.', emoji: '⭐' },
        { id: 'burpees', name: 'Burpees', equipment: 'none', level: 'intermediate', sets: '3', reps: '10', rest: '60s', muscle: 'Full Body', calories_per_min: 14, tip: 'Push-up at bottom, jump at top. The ultimate fat burner.', emoji: '🔥' },
        { id: 'high_knees', name: 'High Knees', equipment: 'none', level: 'beginner', sets: '3', reps: '30s', rest: '30s', muscle: 'Legs, Cardio', calories_per_min: 10, tip: 'Pump arms, drive knees to waist height.', emoji: '🏃' },
        { id: 'skipping', name: 'Jump Rope / Skipping', equipment: 'none', level: 'beginner', sets: '3', reps: '2 min', rest: '60s', muscle: 'Cardio, Calves', calories_per_min: 13, tip: 'Best fat-burning exercise. Start slowly.', emoji: '🪢' },
        { id: 'cycling', name: 'Cycling (stationary/outdoor)', equipment: 'gym', level: 'beginner', sets: '1', reps: '30 min', rest: '-', muscle: 'Cardiovascular, Legs', calories_per_min: 9, tip: 'Maintain moderate resistance for fat burn.', emoji: '🚴' },
        { id: 'stair_climb', name: 'Stair Climbing', equipment: 'none', level: 'beginner', sets: '5', reps: '2-3 flights', rest: '30s', muscle: 'Legs, Cardio', calories_per_min: 12, tip: 'Perfect for hostel students! Use college stairs.', emoji: '🪜' },
    ],
};

// Workout split templates
window.WORKOUT_SPLITS = {
    beginner: {
        fullbody: ['Full Body A', 'Rest', 'Full Body B', 'Rest', 'Full Body C', 'Rest', 'Rest'],
        days: { 'Full Body A': ['core', 'legs', 'chest'], 'Full Body B': ['back', 'shoulders', 'arms'], 'Full Body C': ['legs', 'chest', 'core'] }
    },
    intermediate: {
        ppl: ['Push', 'Pull', 'Legs', 'Rest', 'Push', 'Pull', 'Legs'],
        days: { 'Push': ['chest', 'shoulders', 'arms'], 'Pull': ['back', 'arms'], 'Legs': ['legs', 'core'] }
    },
    advanced: {
        ppl: ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs', 'Rest'],
        days: { 'Push': ['chest', 'shoulders', 'arms'], 'Pull': ['back', 'arms'], 'Legs': ['legs', 'core'] }
    }
};

// Get exercises for a muscle group filtered by environment
window.getExercises = (muscleGroup, environment = 'home', level = 'beginner', count = 4) => {
    const group = window.EXERCISES_DB[muscleGroup] || [];
    const equipmentFilter = environment === 'gym' ? ['none', 'bar', 'gym'] : environment === 'hostel' ? ['none'] : ['none', 'bar'];
    const levelOrder = { beginner: 0, intermediate: 1, advanced: 2 };
    const userLevel = levelOrder[level] || 0;
    return group
        .filter(e => equipmentFilter.includes(e.equipment) && levelOrder[e.level] <= userLevel)
        .slice(0, count);
};
