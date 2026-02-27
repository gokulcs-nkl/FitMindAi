// ==========================================
// ML MODEL 2 — ADAPTIVE TDEE NEURAL NETWORK
// TensorFlow.js Dense Neural Network
// Pre-trained on embedded dataset, then
// fine-tuned on user's actual weight changes
// ==========================================
window.MLTDEE = {
    model: null,
    trained: false,

    // ── Embedded pre-training dataset (50 profiles) ──
    // [age, weight_kg, height_cm, activity(1-5), gender(0=F,1=M), tdee_kcal]
    PRETRAIN_DATA: [
        [18, 55, 162, 2, 0, 1800], [18, 65, 172, 3, 1, 2400], [20, 58, 165, 2, 0, 1850],
        [20, 70, 175, 3, 1, 2550], [21, 60, 163, 2, 0, 1900], [21, 72, 178, 3, 1, 2600],
        [22, 52, 158, 1, 0, 1650], [22, 68, 173, 3, 1, 2500], [23, 62, 167, 3, 0, 2000],
        [23, 75, 180, 4, 1, 2800], [24, 57, 161, 2, 0, 1820], [24, 80, 182, 4, 1, 2900],
        [25, 55, 160, 2, 0, 1780], [25, 85, 185, 5, 1, 3200], [26, 63, 168, 3, 0, 2050],
        [19, 48, 155, 1, 0, 1540], [19, 90, 188, 5, 1, 3400], [20, 76, 177, 4, 1, 2750],
        [21, 54, 162, 2, 0, 1750], [22, 82, 183, 4, 1, 3000], [23, 67, 170, 3, 0, 2100],
        [24, 91, 190, 5, 1, 3500], [25, 49, 156, 1, 0, 1560], [18, 78, 180, 4, 1, 2850],
        [20, 61, 164, 2, 0, 1930], [22, 73, 176, 3, 1, 2650], [24, 59, 163, 2, 0, 1880],
        [25, 77, 179, 4, 1, 2760], [23, 53, 159, 2, 0, 1700], [21, 86, 186, 5, 1, 3250],
        [19, 69, 174, 3, 1, 2530], [20, 58, 166, 3, 0, 1970], [22, 74, 177, 4, 1, 2700],
        [24, 51, 157, 1, 0, 1620], [25, 88, 187, 5, 1, 3350], [18, 66, 171, 3, 1, 2450],
        [21, 57, 163, 2, 0, 1840], [23, 79, 181, 4, 1, 2870], [20, 64, 169, 3, 0, 2020],
        [22, 70, 175, 3, 1, 2580], [24, 56, 161, 2, 0, 1800], [25, 83, 184, 4, 1, 3050],
        [19, 60, 165, 2, 0, 1890], [21, 92, 191, 5, 1, 3550], [23, 65, 170, 3, 1, 2420],
        [20, 50, 156, 1, 0, 1580], [22, 76, 178, 4, 1, 2730], [24, 62, 167, 3, 0, 2040],
        [25, 87, 186, 5, 1, 3280], [18, 71, 176, 3, 1, 2600],
    ],

    // ── Encode features from profile ──
    encode(profile) {
        const actMap = { sedentary: 1, light: 2, moderate: 3, active: 4, very_active: 5 };
        return [
            profile.age / 40,
            profile.weight / 120,
            profile.height / 200,
            (actMap[profile.activity] || 3) / 5,
            profile.gender === 'male' ? 1 : 0,
        ];
    },

    // ── Build 2-layer dense model ──
    buildModel() {
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [5] }));
        model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1, activation: 'linear' }));
        model.compile({ optimizer: tf.train.adam(0.005), loss: 'meanSquaredError' });
        return model;
    },

    // ── Pre-train on embedded dataset ──
    async pretrain() {
        const xsRaw = this.PRETRAIN_DATA.map(r => [r[0] / 40, r[1] / 120, r[2] / 200, r[3] / 5, r[4]]);
        const ysRaw = this.PRETRAIN_DATA.map(r => [r[5] / 4000]);

        const xs = tf.tensor2d(xsRaw);
        const ys = tf.tensor2d(ysRaw);

        this.model = this.buildModel();
        await this.model.fit(xs, ys, {
            epochs: 300, shuffle: true, verbose: 0,
            validationSplit: 0.1,
        });
        xs.dispose(); ys.dispose();
        this.trained = true;
    },

    // ── Fine-tune using actual weight change data ──
    async finetune(profile, weightLog) {
        if (!this.trained || !weightLog || weightLog.length < 3) return;

        // Calculate actual weekly weight change
        const sorted = [...weightLog].sort((a, b) => new Date(a.date) - new Date(b.date));
        const weeks = (new Date(sorted[sorted.length - 1].date) - new Date(sorted[0].date)) / (7 * 86400000);
        if (weeks < 1) return;

        const weightChange = sorted[sorted.length - 1].weight - sorted[0].weight;
        const weeklyChange = weightChange / weeks;

        // 1 kg of body mass ≈ 7700 kcal
        // If gaining 0.35 kg/week at formula-estimated TDEE + 300, actual TDEE might differ
        const formulaTDEE = window.AIDiet.calculateTDEE(profile);
        const actualCaloriesConsumed = window.Store.getDayTotals().kcal || formulaTDEE;

        // Reverse-engineer actual TDEE from weight change
        // actualIntake - actualTDEE = weeklyChange * 7700 / 7
        const dailySurplusOrDeficit = (weeklyChange * 7700) / 7;
        const estimatedActualTDEE = actualCaloriesConsumed - dailySurplusOrDeficit;

        if (estimatedActualTDEE < 1000 || estimatedActualTDEE > 5000) return;

        // Fine-tune with 1 real data point (multiple repetitions)
        const xFt = tf.tensor2d([this.encode(profile)]);
        const yFt = tf.tensor2d([[estimatedActualTDEE / 4000]]);

        await this.model.fit(xFt, yFt, {
            epochs: 50, verbose: 0, learningRate: 0.001
        });
        xFt.dispose(); yFt.dispose();
        this.finetuned = true;
        this.actualTDEE = Math.round(estimatedActualTDEE);
    },

    // ── Predict TDEE for a profile ──
    predict(profile) {
        if (!this.trained || !this.model) return null;
        const input = tf.tensor2d([this.encode(profile)]);
        const output = this.model.predict(input).dataSync()[0];
        input.dispose();
        return Math.round(output * 4000);
    },

    // ── Calorie target based on ML TDEE + goal ──
    getCalorieTarget(profile, mlTDEE) {
        const tdee = mlTDEE || this.predict(profile);
        if (!tdee) return null;
        const surplus = { gain: 350, lose: -500, maintain: 0 };
        return Math.max(1200, tdee + (surplus[profile.goal] || 0));
    },

    // ── Full pipeline ──
    async runPipeline(profile) {
        if (!profile) return { success: false };
        await this.pretrain();
        const weightLog = window.Store.getWeightLog();
        await this.finetune(profile, weightLog);
        const mlTDEE = this.predict(profile);
        const formulaTDEE = window.AIDiet.calculateTDEE(profile);
        const mlCalorieTarget = this.getCalorieTarget(profile, mlTDEE);
        const formulaTarget = window.AIDiet.getCalorieTarget(profile);
        const diff = mlCalorieTarget - formulaTarget;
        return {
            success: true,
            mlTDEE,
            formulaTDEE,
            mlCalorieTarget,
            formulaTarget,
            difference: diff,
            finetuned: this.finetuned || false,
            actualTDEE: this.actualTDEE || null,
            recommendation: Math.abs(diff) < 50
                ? 'Your formula estimate is accurate. No changes needed.'
                : diff > 0
                    ? `ML suggests eating ${diff} kcal MORE than the formula (your metabolism is faster).`
                    : `ML suggests eating ${Math.abs(diff)} kcal LESS (your metabolism may be slower).`,
        };
    }
};
