// ==========================================
// IMAGE-TO-CALORIE ESTIMATOR — FitMind AI
// Uses TensorFlow.js + MobileNet in the browser
// ==========================================
window.CalorieScanner = {
    model: null,
    modelLoading: false,

    // Food class name to food DB ID mapping (MobileNet top classes)
    FOOD_MAPPING: {
        'banana': 'banana', 'pizza': 'pizza_slice', 'burger': 'burger', 'hamburger': 'burger',
        'sandwich': 'sandwich', 'hot dog': 'sandwich', 'french fries': 'aloo',
        'coffee': 'black_coffee', 'espresso': 'black_coffee', 'tea': 'chai',
        'bread': 'bread_white', 'bagel': 'bread_brown', 'pretzel': 'bread_white',
        'apple': 'apple', 'orange': 'orange', 'mango': 'mango', 'pineapple': 'watermelon',
        'strawberry': 'apple', 'blueberry': 'grapes', 'grape': 'grapes',
        'rice': 'rice_white', 'noodles': 'maggi', 'spaghetti': 'maggi',
        'broccoli': 'broccoli', 'carrot': 'carrot', 'cucumber': 'cucumber',
        'egg': 'egg_boiled', 'omelette': 'egg_omelet', 'fried egg': 'egg_omelet',
        'ice cream': 'kheer', 'cake': 'halwa', 'cookie': 'halwa',
        'milk': 'milk_full', 'yogurt': 'curd', 'cheese': 'paneer',
        'chicken': 'chicken_boiled', 'fish': 'fish_curry', 'beef': 'mutton_curry',
        'waffle': 'bread_white', 'pancake': 'dosa', 'croissant': 'bread_white',
        'donut': 'vada_pav', 'muffin': 'bread_brown', 'cupcake': 'halwa',
        'soup': 'sambar', 'salad': 'mixed_veg', 'sushi': 'rice_white',
        'burrito': 'roti_wheat', 'taco': 'roti_wheat', 'corn': 'aloo',
    },

    async loadModel() {
        if (this.model) return this.model;
        if (this.modelLoading) {
            // Wait for existing load
            return new Promise(resolve => {
                const check = setInterval(() => {
                    if (this.model) { clearInterval(check); resolve(this.model); }
                }, 200);
            });
        }
        this.modelLoading = true;
        try {
            this.model = await window.mobilenet.load({ version: 2, alpha: 1.0 });
            this.modelLoading = false;
            return this.model;
        } catch (e) {
            this.modelLoading = false;
            throw new Error('Failed to load AI model. Check internet connection.');
        }
    },

    async classifyImage(imgElement) {
        const model = await this.loadModel();
        const predictions = await model.classify(imgElement, 10);
        return predictions;
    },

    findBestFoodMatch(predictions) {
        for (const pred of predictions) {
            const className = pred.className.toLowerCase();
            for (const [keyword, foodId] of Object.entries(this.FOOD_MAPPING)) {
                if (className.includes(keyword)) {
                    const food = window.getFoodById(foodId);
                    if (food) return { food, confidence: pred.probability, rawClass: pred.className };
                }
            }
        }
        // Fallback: check all predictions for any vaguely food-related word
        const foodWords = ['food', 'meal', 'dish', 'plate', 'bowl', 'fruit', 'vegetable', 'meat', 'drink'];
        for (const pred of predictions) {
            for (const word of foodWords) {
                if (pred.className.toLowerCase().includes(word)) {
                    return { food: window.getFoodById('rice_white'), confidence: pred.probability * 0.5, rawClass: pred.className, uncertain: true };
                }
            }
        }
        return null;
    },

    // Estimate portion size from confidence / typical serving
    estimatePortion(food, confidence) {
        const portionMults = { very_high: 1.2, high: 1.0, medium: 0.9, low: 0.8 };
        const confLevel = confidence > 0.7 ? 'very_high' : confidence > 0.4 ? 'high' : confidence > 0.2 ? 'medium' : 'low';
        return portionMults[confLevel];
    },

    async analyzeImage(imgElement) {
        const predictions = await this.classifyImage(imgElement);
        const match = this.findBestFoodMatch(predictions);

        if (!match) {
            return {
                success: false,
                message: 'Could not identify food in image. Please try a clearer photo.',
                predictions: predictions.slice(0, 5)
            };
        }

        const portionMult = this.estimatePortion(match.food, match.confidence);
        const estimatedKcal = Math.round(match.food.kcal * portionMult);

        return {
            success: true,
            food: match.food,
            rawClass: match.rawClass,
            confidence: Math.round(match.confidence * 100),
            portionSize: portionMult >= 1 ? 'Regular Portion' : 'Small Portion',
            estimatedKcal,
            estimatedProtein: Math.round(match.food.protein * portionMult * 10) / 10,
            estimatedCarbs: Math.round(match.food.carbs * portionMult * 10) / 10,
            estimatedFat: Math.round(match.food.fat * portionMult * 10) / 10,
            uncertain: match.uncertain || false,
            allPredictions: predictions.slice(0, 5)
        };
    }
};
