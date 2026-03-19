// ==========================================
// NOTIFICATIONS MODULE — FitMind AI
// Browser Notification API + scheduled reminders
// ==========================================
window.NotificationModule = {
    intervals: [],
    checkInterval: null,

    async requestPermission() {
        if (!('Notification' in window)) return false;
        if (Notification.permission === 'granted') return true;
        const perm = await Notification.requestPermission();
        return perm === 'granted';
    },

    hasPermission() { return 'Notification' in window && Notification.permission === 'granted'; },

    send(title, body, icon = '🧠') {
        if (!this.hasPermission()) return;
        new Notification(`FitMind AI — ${title}`, { body, icon: '/favicon.ico', tag: title });
    },

    // Start all reminder checks
    async startReminders() {
        const settings = window.Store.getSettings();
        if (!settings.notifications) return;
        if (!await this.requestPermission()) return;

        // Clear existing intervals
        this.intervals.forEach(id => clearInterval(id));
        this.intervals = [];

        // Check every minute
        this.checkInterval = setInterval(() => this.checkReminders(), 60000);
        this.checkReminders(); // Run immediately
    },

    checkReminders() {
        const settings = window.Store.getSettings();
        if (!settings.notifications) return;

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const times = settings.reminderTimes || {};

        if (settings.mealReminders) {
            if (timeStr === times.breakfast) this.send('Breakfast Time! 🍳', 'Start your day with a nutritious breakfast. Check your meal plan!');
            if (timeStr === times.lunch) this.send('Lunch Time! 🍽️', 'Take a break and fuel your body. View your lunch plan!');
            if (timeStr === times.dinner) this.send('Dinner Time! 🌙', 'End your day with a balanced dinner. Don\'t skip it!');
        }
        if (settings.workoutReminders && timeStr === times.workout) {
            this.send('Workout Time! 💪', 'Time to hit your workout! Check today\'s exercise plan.');
        }
        // Water reminder every 2 hours between 7am-10pm
        if (settings.waterReminders) {
            const h = now.getHours();
            const m = now.getMinutes();
            if (h >= 7 && h <= 22 && h % 2 === 0 && m === 0) {
                this.send('Hydration Reminder! 💧', `Time for a glass of water! Stay hydrated.`);
            }
        }
    },

    stopReminders() {
        if (this.checkInterval) clearInterval(this.checkInterval);
        this.intervals.forEach(id => clearInterval(id));
        this.intervals = [];
    }
};
