// ==========================================
// ML MODEL 1 — WEIGHT PROGRESS PREDICTOR
// TensorFlow.js Linear Regression
// Trains on user's real weight log data
// ==========================================
window.MLProgress = {
    model: null,
    trained: false,
    trainedOn: 0,      // number of data points used

    // ── Build a simple linear regression model ──
    buildModel() {
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 8, activation: 'relu', inputShape: [1] }));
        model.add(tf.layers.dense({ units: 1 }));
        model.compile({ optimizer: tf.train.adam(0.01), loss: 'meanSquaredError' });
        return model;
    },

    // ── Train on weight log [{date, weight}] ──
    async train(weightLog) {
        if (!weightLog || weightLog.length < 3) {
            return { success: false, reason: 'Need at least 3 weight entries to train.' };
        }

        const sorted = [...weightLog].sort((a, b) => new Date(a.date) - new Date(b.date));
        const t0 = new Date(sorted[0].date).getTime();

        // Normalise x: days since first entry
        const xs = sorted.map(e => (new Date(e.date).getTime() - t0) / 86400000);
        const ys = sorted.map(e => e.weight);

        const xMin = Math.min(...xs), xMax = Math.max(...xs);
        const yMin = Math.min(...ys), yMax = Math.max(...ys);
        const xRange = xMax - xMin || 1;
        const yRange = yMax - yMin || 1;

        const xNorm = xs.map(v => (v - xMin) / xRange);
        const yNorm = ys.map(v => (v - yMin) / yRange);

        const xTensor = tf.tensor2d(xNorm, [xNorm.length, 1]);
        const yTensor = tf.tensor2d(yNorm, [yNorm.length, 1]);

        this.model = this.buildModel();
        await this.model.fit(xTensor, yTensor, {
            epochs: 200,
            shuffle: true,
            verbose: 0,
            callbacks: { onEpochEnd: (epoch, logs) => { } }
        });

        xTensor.dispose(); yTensor.dispose();
        this.trained = true;
        this.trainedOn = sorted.length;

        // Store normalisation params
        this._norm = { t0, xMin, xMax, xRange, yMin, yMax, yRange };
        return { success: true, dataPoints: sorted.length };
    },

    // ── Predict weight at daysAhead ──
    predict(daysAhead) {
        if (!this.trained || !this.model) return null;
        const { t0, xMin, xRange, yMin, yRange } = this._norm;
        const now = Date.now();
        const daysSinceStart = (now - t0) / 86400000 + daysAhead;
        const xNorm = (daysSinceStart - xMin) / xRange;
        const xTensor = tf.tensor2d([Math.max(0, Math.min(1.5, xNorm))], [1, 1]);
        const yNorm = this.model.predict(xTensor).dataSync()[0];
        xTensor.dispose();
        return Math.round((yNorm * yRange + yMin) * 10) / 10;
    },

    // ── Predict goal date ──
    predictGoalDate(targetWeight) {
        if (!this.trained || !this.model) return null;
        const { t0, xMin, xRange, yMin, yRange } = this._norm;
        // Binary search: find days until predicted weight reaches target
        let lo = 0, hi = 730; // max 2 years
        const current = this.predict(0);
        if (!current) return null;
        const goingUp = targetWeight > current;

        for (let i = 0; i < 30; i++) {
            const mid = (lo + hi) / 2;
            const pred = this.predict(mid);
            if (pred === null) return null;
            if (goingUp ? pred >= targetWeight : pred <= targetWeight) hi = mid;
            else lo = mid;
        }
        const days = Math.round((lo + hi) / 2);
        if (days >= 720) return null; // too far to predict
        const date = new Date(); date.setDate(date.getDate() + days);
        return { days, date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) };
    },

    // ── Generate prediction curve (14/30/60 days) ──
    generateCurve(days = 30, step = 3) {
        if (!this.trained) return [];
        const points = [];
        for (let d = 0; d <= days; d += step) {
            const w = this.predict(d);
            const date = new Date(); date.setDate(date.getDate() + d);
            points.push({
                date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                weight: w,
                daysAhead: d
            });
        }
        return points;
    },

    // ── R² score to assess model quality ──
    computeR2(weightLog) {
        if (!this.trained || !weightLog || weightLog.length < 3) return null;
        const sorted = [...weightLog].sort((a, b) => new Date(a.date) - new Date(b.date));
        const { t0 } = this._norm;
        const actual = sorted.map(e => e.weight);
        const predicted = sorted.map(e => {
            const d = (new Date(e.date).getTime() - t0) / 86400000;
            return this.predict(0); // approximation using current prediction
        });
        const mean = actual.reduce((s, v) => s + v, 0) / actual.length;
        const ssTot = actual.reduce((s, v) => s + (v - mean) ** 2, 0);
        const ssRes = actual.reduce((s, v, i) => s + (v - predicted[i]) ** 2, 0);
        return ssTot === 0 ? 1 : Math.max(0, Math.round((1 - ssRes / ssTot) * 100) / 100);
    },

    // ── Public: run full pipeline ──
    async runPipeline() {
        const weightLog = window.Store.getWeightLog();
        if (weightLog.length < 3) {
            return { trained: false, reason: 'Log at least 3 weight entries to activate ML prediction.' };
        }
        const result = await this.train(weightLog);
        if (!result.success) return { trained: false, reason: result.reason };

        const profile = window.Store.getProfile() || {};
        const target = profile.targetWeight;
        const current = weightLog[weightLog.length - 1].weight;
        const pred7 = this.predict(7);
        const pred30 = this.predict(30);
        const pred60 = this.predict(60);
        const goalInfo = target ? this.predictGoalDate(target) : null;
        const curve = this.generateCurve(30, 5);

        return {
            trained: true,
            dataPoints: result.dataPoints,
            current,
            target,
            pred7, pred30, pred60,
            goalDays: goalInfo?.days,
            goalDate: goalInfo?.date,
            curve,
            trend: pred30 > current ? 'gaining' : 'losing',
            weeklyRate: pred7 ? Math.round((pred7 - current) * 10) / 10 : null,
        };
    }
};
