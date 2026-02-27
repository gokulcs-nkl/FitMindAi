// ==========================================
// LOCATION MODULE — FitMind AI
// OpenStreetMap + Overpass API for nearby food
// ==========================================
window.LocationTracker = {

    async getNearbyFood(lat, lon, radius = 500) {
        const query = `[out:json][timeout:15];(node["amenity"~"restaurant|cafe|fast_food|food_court|canteen"](around:${radius},${lat},${lon}););out body 10;`;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
        try {
            const resp = await fetch(url);
            const data = await resp.json();
            return (data.elements || []).map(el => ({
                id: el.id,
                name: el.tags?.name || 'Unnamed Place',
                type: el.tags?.amenity || 'food',
                cuisine: el.tags?.cuisine || 'Indian',
                lat: el.lat, lon: el.lon,
                distance: this.calculateDistance(lat, lon, el.lat, el.lon),
            })).sort((a, b) => a.distance - b.distance);
        } catch {
            return [];
        }
    },

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3;
        const p1 = lat1 * Math.PI / 180, p2 = lat2 * Math.PI / 180;
        const dp = (lat2 - lat1) * Math.PI / 180;
        const dl = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
        return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    },

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) { reject(new Error('Geolocation not supported')); return; }
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });
    },

    // Suggest quick-add foods based on place type
    getSuggestedFoods(placeType, cuisine) {
        const suggestions = {
            restaurant: ['biryani_chicken', 'dal_toor', 'roti_wheat', 'rice_white'],
            cafe: ['black_coffee', 'sandwich', 'bread_brown'],
            fast_food: ['burger', 'samosa', 'vada_pav'],
            canteen: ['rice_white', 'dal_toor', 'sambar', 'roti_wheat'],
        };
        const ids = suggestions[placeType] || suggestions.restaurant;
        return ids.map(id => window.getFoodById(id)).filter(Boolean);
    }
};
