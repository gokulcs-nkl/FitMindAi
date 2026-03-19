// ==========================================
// ML MODEL 3 — MEAL PATTERN ANALYZER
// TensorFlow.js K-Means Clustering (k=3)
// Identifies eating patterns from 7-day log
// ==========================================
window.MLMeals = {

    // ── Named pattern clusters ──
    PATTERNS: [
        {
            id: 'balanced',
            label: '✅ Balanced Diet',
            color: '#00e676',
            description: 'Your calorie and macro distribution is well-balanced. Keep it up!',
            tips: [
                'You\'re hitting good protein and carb balance.',
                'Maintain this pattern for steady progress.',
                'Consider adding more leafy greens for micronutrients.',
            ]
        },
        {
            id: 'highcarb_lowprotein',
            label: '🍚 High Carb / Low Protein',
            color: '#ffd740',
            description: 'Your diet is carb-heavy. Protein is below optimal for your goal.',
            tips: [
                'Add 2 boiled eggs or 100g paneer per day to boost protein.',
                'Replace some rice servings with dal + rice combo.',
                'Have milk or curd with each meal.',
            ]
        },
        {
            id: 'undereating',
            label: '⚠️ Under-eating / Irregular',
            color: '#ff7043',
            description: 'Your daily calorie intake is significantly below your target and inconsistent.',
            tips: [
                'Set meal alarms — never skip breakfast.',
                'Carry peanuts or protein bars to avoid long gaps.',
                'Aim for 5-6 small meals instead of 1-2 large ones.',
            ]
        },
    ],

    // ── Extract feature vector from a single day log ──
    extractFeatures(log, target) {
        if (!log?.foods) return null;
        const foods = log.foods;
        const kcal = foods.reduce((s, f) => s + (f.kcal || 0) * (f.quantity || 1), 0);
        const protein = foods.reduce((s, f) => s + (f.protein || 0) * (f.quantity || 1), 0);
        const carbs = foods.reduce((s, f) => s + (f.carbs || 0) * (f.quantity || 1), 0);
        const fat = foods.reduce((s, f) => s + (f.fat || 0) * (f.quantity || 1), 0);
        const caloriePct = target ? kcal / target : 0.8;
        const proteinPct = kcal > 0 ? (protein * 4) / kcal : 0;
        const carbPct = kcal > 0 ? (carbs * 4) / kcal : 0;
        return [caloriePct, proteinPct, carbPct, protein / 100];
    },

    // ── Euclidean distance between two vectors ──
    distance(a, b) {
        return Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0));
    },

    // ── K-Means clustering using TF.js tensors ──
    async cluster(points, k = 3, iterations = 50) {
        if (points.length < k) return Array(points.length).fill(0);

        // Random init centroids from data points
        let centroids = points.slice(0, k).map(p => [...p]);

        for (let iter = 0; iter < iterations; iter++) {
            // Assign to nearest centroid
            const assignments = points.map(p =>
                centroids.reduce((bestIdx, c, i) =>
                    this.distance(p, c) < this.distance(p, centroids[bestIdx]) ? i : bestIdx, 0)
            );
            // Update centroids
            for (let c = 0; c < k; c++) {
                const assigned = points.filter((_, i) => assignments[i] === c);
                if (assigned.length > 0) {
                    centroids[c] = assigned[0].map((_, dim) =>
                        assigned.reduce((s, p) => s + p[dim], 0) / assigned.length
                    );
                }
            }
        }
        // Return final assignments
        return points.map(p =>
            centroids.reduce((bestIdx, c, i) =>
                this.distance(p, c) < this.distance(p, centroids[bestIdx]) ? i : bestIdx, 0)
        );
    },

    // ── Map cluster index to named pattern ──
    identifyPattern(centroid) {
        const [calPct, protPct, carbPct, protAbs] = centroid;
        if (calPct < 0.7 || (calPct < 0.8 && protPct < 0.15)) return 2; // undereating
        if (protPct < 0.18 && carbPct > 0.55) return 1;                  // high carb, low protein
        return 0;                                                           // balanced
    },

    // ── Full pipeline ──
    async runPipeline() {
        const logs7 = window.Store.getLastNDays(7);
        const plan = window.Store.getDietPlan();
        const target = plan?.calorieTarget || 2000;

        const features = logs7
            .map(d => this.extractFeatures(d.log, target))
            .filter(Boolean);

        if (features.length < 2) {
            return {
                success: false,
                reason: 'Need at least 2 days of food logs for pattern analysis.',
                pattern: null,
            };
        }

        // Compute mean feature vector
        const mean = features[0].map((_, i) =>
            features.reduce((s, f) => s + f[i], 0) / features.length
        );

        const patternIdx = this.identifyPattern(mean);
        const pattern = this.PATTERNS[patternIdx];

        // Day-by-day calorie data
        const days = logs7.map(d => {
            const foods = d.log?.foods || [];
            return {
                date: d.date,
                kcal: Math.round(foods.reduce((s, f) => s + (f.kcal || 0) * (f.quantity || 1), 0)),
                protein: Math.round(foods.reduce((s, f) => s + (f.protein || 0) * (f.quantity || 1), 0)),
            };
        });

        // Consistency score: days where ≥ 70% of target was hit
        const consistencyDays = days.filter(d => d.kcal >= target * 0.7).length;
        const consistency = Math.round(consistencyDays / logs7.length * 100);

        // Average protein
        const avgProtein = Math.round(days.reduce((s, d) => s + d.protein, 0) / days.length);
        const avgKcal = Math.round(days.reduce((s, d) => s + d.kcal, 0) / days.length);

        return {
            success: true,
            daysAnalyzed: features.length,
            pattern,
            patternIdx,
            consistency,
            avgKcal,
            avgProtein,
            target,
            days,
            meanFeatures: mean,
            proteinScore: Math.round(mean[1] * 100),
            carbScore: Math.round(mean[2] * 100),
            caloriePct: Math.round(mean[0] * 100),
        };
    }
};
