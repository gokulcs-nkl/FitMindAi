// ==========================================
// WEATHER MODULE — FitMind AI
// Open-Meteo API integration (free, no key)
// ==========================================
window.WeatherModule = {
    cache: null,
    cacheTime: null,

    async getWeather(lat, lon) {
        // Cache for 1 hour
        if (this.cache && this.cacheTime && (Date.now() - this.cacheTime) < 3600000) return this.cache;
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m&timezone=auto`;
            const resp = await fetch(url);
            const data = await resp.json();
            const weather = {
                temp: data.current_weather?.temperature,
                windspeed: data.current_weather?.windspeed,
                weathercode: data.current_weather?.weathercode,
                humidity: data.hourly?.relative_humidity_2m?.[new Date().getHours()] || 60,
                description: this.getWeatherDescription(data.current_weather?.weathercode),
                icon: this.getWeatherIcon(data.current_weather?.weathercode),
            };
            this.cache = weather;
            this.cacheTime = Date.now();
            return weather;
        } catch { return null; }
    },

    getWeatherDescription(code) {
        if (code === 0) return 'Clear Sky';
        if (code <= 3) return 'Partly Cloudy';
        if (code <= 49) return 'Foggy';
        if (code <= 67) return 'Rainy';
        if (code <= 77) return 'Snow';
        if (code <= 82) return 'Showers';
        return 'Thunderstorm';
    },

    getWeatherIcon(code) {
        if (code === 0) return '☀️';
        if (code <= 3) return '⛅';
        if (code <= 49) return '🌫️';
        if (code <= 67) return '🌧️';
        if (code <= 82) return '🌦️';
        return '⛈️';
    },

    // Diet adjustments based on weather
    getDietAdaptations(weather) {
        if (!weather) return [];
        const tips = [];
        if (weather.temp > 38) {
            tips.push({ icon: '💧', tip: 'Extreme heat: Add 1L extra water. Light meals only.', type: 'critical' });
            tips.push({ icon: '🥥', tip: 'Coconut water & nimbu pani are excellent for today.', type: 'food' });
        } else if (weather.temp > 32) {
            tips.push({ icon: '💧', tip: 'Hot weather: Drink 500ml extra water today.', type: 'warning' });
            tips.push({ icon: '🍉', tip: 'Include watermelon, cucumber, buttermilk in meals.', type: 'food' });
        } else if (weather.temp < 15) {
            tips.push({ icon: '🍲', tip: 'Cold weather: Body burns more calories. Add 100-150 kcal.', type: 'info' });
            tips.push({ icon: '☕', tip: 'Warm foods like dal soup and khichdi are ideal today.', type: 'food' });
        }
        if (weather.humidity > 85) {
            tips.push({ icon: '🌊', tip: 'High humidity: Increase water intake by 300ml.', type: 'info' });
        }
        if (weather.description.includes('Rain')) {
            tips.push({ icon: '🏠', tip: 'Rainy day: Great for indoor workout! Core & HIIT session.', type: 'workout' });
        }
        return tips;
    },

    // Enhanced water goal based on weather
    getAdjustedWaterGoal(baseGoalLiters, weather) {
        if (!weather) return baseGoalLiters;
        let adjusted = baseGoalLiters;
        if (weather.temp > 38) adjusted += 1.0;
        else if (weather.temp > 32) adjusted += 0.5;
        else if (weather.temp > 28) adjusted += 0.25;
        if (weather.humidity > 80) adjusted += 0.25;
        return Math.round(adjusted * 10) / 10;
    }
};
