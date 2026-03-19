// ==========================================
// DASHBOARD MODULE — FitMind AI
// Chart.js powered progress visualization
// ==========================================
window.Dashboard = {
    charts: {},

    destroyCharts() {
        Object.values(this.charts).forEach(c => { if (c) c.destroy(); });
        this.charts = {};
    },

    chartDefaults() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#8899bb', font: { family: 'Inter', size: 11 } } },
                tooltip: {
                    backgroundColor: '#131d35',
                    borderColor: 'rgba(79,142,247,0.3)',
                    borderWidth: 1,
                    titleColor: '#e8eaf6',
                    bodyColor: '#8899bb',
                }
            },
            scales: {
                x: { ticks: { color: '#8899bb', font: { size: 11 } }, grid: { color: 'rgba(79,142,247,0.08)' } },
                y: { ticks: { color: '#8899bb', font: { size: 11 } }, grid: { color: 'rgba(79,142,247,0.08)' } }
            }
        };
    },

    initWeightChart(canvasId, weightLog) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        if (this.charts[canvasId]) this.charts[canvasId].destroy();

        const last14 = weightLog.slice(-14);
        const labels = last14.map(e => {
            const d = new Date(e.date);
            return `${d.getDate()}/${d.getMonth() + 1}`;
        });
        const data = last14.map(e => e.weight);

        this.charts[canvasId] = new Chart(canvas, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Weight (kg)',
                    data,
                    borderColor: '#4f8ef7',
                    backgroundColor: 'rgba(79,142,247,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4f8ef7',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                }]
            },
            options: {
                ...this.chartDefaults(),
                plugins: { ...this.chartDefaults().plugins, legend: { display: false } }
            }
        });
    },

    initCalorieChart(canvasId, days) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        if (this.charts[canvasId]) this.charts[canvasId].destroy();

        const labels = days.map(d => {
            const date = new Date(d.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        });
        const plan = window.Store.getDietPlan();
        const target = plan?.calorieTarget || 2000;

        const logData = days.map(d => {
            if (!d.log?.foods) return 0;
            return Math.round(d.log.foods.reduce((s, f) => s + (f.kcal || 0) * (f.quantity || 1), 0));
        });

        this.charts[canvasId] = new Chart(canvas, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Calories Eaten',
                        data: logData,
                        backgroundColor: logData.map(d => d > target * 1.1 ? 'rgba(255,82,82,0.7)' : d > target * 0.85 ? 'rgba(0,230,118,0.7)' : 'rgba(79,142,247,0.7)'),
                        borderRadius: 6,
                    },
                    {
                        label: 'Target',
                        data: Array(days.length).fill(target),
                        type: 'line',
                        borderColor: '#4f8ef7',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false,
                    }
                ]
            },
            options: this.chartDefaults()
        });
    },

    initMacroChart(canvasId, totals, macros) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        if (this.charts[canvasId]) this.charts[canvasId].destroy();

        this.charts[canvasId] = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: ['Protein', 'Carbs', 'Fat'],
                datasets: [{
                    data: [totals.protein || 0, totals.carbs || 0, totals.fat || 0],
                    backgroundColor: ['rgba(79,142,247,0.85)', 'rgba(255,112,67,0.85)', 'rgba(255,215,64,0.85)'],
                    borderColor: ['#4f8ef7', '#ff7043', '#ffd740'],
                    borderWidth: 2,
                    hoverOffset: 6,
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#8899bb', font: { family: 'Inter', size: 11 }, padding: 12 } },
                    tooltip: this.chartDefaults().plugins.tooltip,
                },
                cutout: '65%',
            }
        });
    },

    initWorkoutChart(canvasId, days) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        if (this.charts[canvasId]) this.charts[canvasId].destroy();

        const allLogs = window.Store.get(window.Store.KEYS.DAILY_LOG, {});
        const labels = days.map(d => {
            const date = new Date(d.date);
            return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
        });
        const workoutData = days.map(d => allLogs[d.date]?.workoutDone ? 1 : 0);

        this.charts[canvasId] = new Chart(canvas, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Workout Done',
                    data: workoutData,
                    backgroundColor: workoutData.map(d => d ? 'rgba(0,230,118,0.8)' : 'rgba(79,142,247,0.2)'),
                    borderRadius: 8,
                    barPercentage: 0.6,
                }]
            },
            options: {
                ...this.chartDefaults(),
                scales: {
                    ...this.chartDefaults().scales,
                    y: { ...this.chartDefaults().scales.y, max: 1, ticks: { callback: v => v === 1 ? '✅' : '❌', color: '#8899bb' } }
                }
            }
        });
    }
};
