// ==========================================
// MEAL PLAN TEMPLATES — FitMind AI
// Pre-built meal templates by goal & region
// ==========================================
window.MEAL_TEMPLATES = {
    gain: {
        north: {
            breakfast: [
                { foods: ['milk_full', 'oats', 'banana', 'peanut_butter'], label: 'Power Oats + Milk' },
                { foods: ['bread_brown', 'egg_omelet', 'milk_full', 'almonds'], label: 'Egg Toast + Almonds' },
                { foods: ['paratha', 'curd', 'banana', 'milk_full'], label: 'Paratha Combo' },
            ],
            lunch: [
                { foods: ['roti_wheat', 'roti_wheat', 'dal_toor', 'paneer', 'aloo_gobi'], label: 'Roti + Dal + Paneer' },
                { foods: ['rice_white', 'rajma', 'curd', 'aloo_gobi'], label: 'Rajma Chawal' },
                { foods: ['roti_wheat', 'roti_wheat', 'dal_makhani', 'curd'], label: 'Dal Makhani Roti' },
            ],
            dinner: [
                { foods: ['khichdi', 'curd', 'papad', 'milk_full'], label: 'Khichdi + Milk' },
                { foods: ['roti_wheat', 'paneer_butter', 'rice_white'], label: 'Paneer Curry + Rice' },
                { foods: ['roti_wheat', 'roti_wheat', 'chole', 'curd'], label: 'Chole Roti' },
            ],
            snacks: [
                { foods: ['peanuts', 'banana', 'milk_full'], label: 'High-Cal Snack' },
                { foods: ['almonds', 'walnuts', 'banana'], label: 'Nut Mix' },
                { foods: ['protein_shake', 'banana'], label: 'Post-Workout Shake' },
            ]
        },
        south: {
            breakfast: [
                { foods: ['idli', 'sambar', 'coconut_chutney', 'milk_full'], label: 'Idli Sambar Combo' },
                { foods: ['dosa', 'sambar', 'coconut_chutney', 'milk_full'], label: 'Dosa Meal' },
                { foods: ['pongal', 'sambar', 'banana', 'milk_full'], label: 'Pongal Breakfast' },
            ],
            lunch: [
                { foods: ['rice_white', 'sambar', 'dal_toor', 'rasam', 'curd'], label: 'South Thali' },
                { foods: ['rice_white', 'dal_toor', 'egg_boiled', 'egg_boiled', 'curd'], label: 'Rice + Dal + Eggs' },
                { foods: ['rice_brown', 'sambar', 'mixed_veg', 'curd'], label: 'Brown Rice Thali' },
            ],
            dinner: [
                { foods: ['uttapam', 'sambar', 'coconut_chutney', 'milk_full'], label: 'Uttapam Dinner' },
                { foods: ['rice_white', 'rasam', 'curd', 'dal_toor'], label: 'Light Rice Dinner' },
                { foods: ['idli', 'idli', 'sambar', 'milk_full'], label: 'Idli Night' },
            ],
            snacks: [
                { foods: ['coconut_water', 'banana', 'peanuts'], label: 'Coconut Water Snack' },
                { foods: ['buttermilk', 'almonds', 'banana'], label: 'Buttermilk Snack' },
            ]
        },
        west: {
            breakfast: [
                { foods: ['poha', 'milk_full', 'banana', 'almonds'], label: 'Poha Breakfast' },
                { foods: ['upma', 'milk_full', 'banana'], label: 'Upma Meal' },
            ],
            lunch: [
                { foods: ['roti_wheat', 'roti_wheat', 'dal_toor', 'mixed_veg', 'curd'], label: 'Maharashtrian Thali' },
                { foods: ['rice_white', 'chole', 'curd'], label: 'Chole Rice' },
            ],
            dinner: [
                { foods: ['khichdi', 'curd', 'milk_full'], label: 'Gujarati Khichdi' },
                { foods: ['roti_wheat', 'palak_paneer', 'curd'], label: 'Palak Paneer Roti' },
            ],
            snacks: [
                { foods: ['peanuts', 'banana', 'chai'], label: 'Evening Snack' },
            ]
        },
        east: {
            breakfast: [
                { foods: ['bread_white', 'egg_omelet', 'milk_full', 'banana'], label: 'Bengali Breakfast' },
                { foods: ['oats', 'milk_full', 'banana', 'almonds'], label: 'Oats Bowl' },
            ],
            lunch: [
                { foods: ['rice_white', 'dal_moong', 'fish_curry', 'spinach'], label: 'Rice Dal Fish' },
                { foods: ['rice_white', 'dal_toor', 'egg_boiled', 'egg_boiled', 'spinach'], label: 'Rice Egg Combo' },
            ],
            dinner: [
                { foods: ['roti_wheat', 'roti_wheat', 'dal_chana', 'curd'], label: 'Roti Dal' },
                { foods: ['rice_white', 'dal_moong', 'curd'], label: 'Light Rice Dinner' },
            ],
            snacks: [
                { foods: ['rasgulla', 'milk_full'], label: 'Sweet Snack' },
                { foods: ['peanuts', 'chai', 'banana'], label: 'Tea Snack' },
            ]
        }
    },
    lose: {}, // Will use gain templates with reduced portions (modifier: 0.8)
    maintain: {} // Will use gain templates (modifier: 1.0)
};

// Apply region fallback - if no specific region template use 'north'
window.getMealTemplate = (goal, region, mealType) => {
    const g = window.MEAL_TEMPLATES[goal] || window.MEAL_TEMPLATES.gain;
    const r = g[region] || g.north;
    const meals = r[mealType] || [];
    return meals[Math.floor(Math.random() * meals.length)] || { foods: [], label: 'Custom Meal' };
};
