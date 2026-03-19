// ==========================================
// HOSTEL MODE — FitMind AI
// ==========================================
window.HostelMode = {
    ADDONS: [
        { id: 'banana', icon: '🍌', name: 'Banana (2 pcs)', kcal: 178, protein: 2.2, carbs: 46, fat: 0.6, cost: 16, benefit: 'Quick energy, potassium', qty: 2 },
        { id: 'milk_full', icon: '🥛', name: 'Full Milk (1 glass)', kcal: 150, protein: 8, carbs: 12, fat: 8, cost: 12, benefit: 'Complete protein + calcium', qty: 1 },
        { id: 'egg_boiled', icon: '🥚', name: 'Boiled Eggs (2)', kcal: 156, protein: 12.6, carbs: 1.2, fat: 10.6, cost: 16, benefit: 'Best protein per rupee', qty: 2 },
        { id: 'peanuts', icon: '🥜', name: 'Peanuts (50g)', kcal: 283, protein: 12.8, carbs: 8, fat: 24, cost: 10, benefit: 'Calorie dense, cheap fat', qty: 1 },
        { id: 'almonds', icon: '🌰', name: 'Almonds (20 pcs)', kcal: 139, protein: 5, carbs: 5, fat: 12, cost: 20, benefit: 'Healthy fats + Vitamin E', qty: 1 },
        { id: 'curd', icon: '🥛', name: 'Curd (100g)', kcal: 60, protein: 3.5, carbs: 4.7, fat: 3.3, cost: 10, benefit: 'Probiotics + gut health', qty: 1 },
        { id: 'bread_brown', icon: '🍞', name: 'Brown Bread (2 slices)', kcal: 120, protein: 5, carbs: 22, fat: 1.5, cost: 10, benefit: 'Complex carbs + fiber', qty: 2 },
        { id: 'protein_biscuits', icon: '🍪', name: 'Protein Biscuits (4 pcs)', kcal: 160, protein: 8, carbs: 22, fat: 5, cost: 15, benefit: 'Convenient protein snack', qty: 4 },
        { id: 'coconut_water', icon: '🥥', name: 'Coconut Water', kcal: 46, protein: 1.7, carbs: 9, fat: 0.5, cost: 20, benefit: 'Electrolytes + hydration', qty: 1 },
        { id: 'peanut_butter', icon: '🥜', name: 'Peanut Butter (2 tbsp)', kcal: 190, protein: 8, carbs: 7, fat: 16, cost: 20, benefit: 'High-cal healthy fats', qty: 1 },
        { id: 'oats', icon: '🥣', name: 'Oats with Milk', kcal: 280, protein: 12, carbs: 44, fat: 5, cost: 25, benefit: 'Fiber + slow-release energy', qty: 1 },
        { id: 'sprouts', icon: '🌱', name: 'Mixed Sprouts', kcal: 80, protein: 8, carbs: 10, fat: 0.5, cost: 10, benefit: 'High protein, very cheap', qty: 1 },
    ],

    getAddonsForGoal(goal, calorieBudget, budget) {
        const sortedByValue = this.ADDONS.map(a => ({
            ...a,
            proteinPerRupee: a.protein / Math.max(a.cost, 1),
            kcalPerRupee: a.kcal / Math.max(a.cost, 1),
        }));

        if (goal === 'gain') {
            return sortedByValue.sort((a, b) => b.kcalPerRupee - a.kcalPerRupee).slice(0, 6);
        } else if (goal === 'lose') {
            return sortedByValue.filter(a => a.kcal < 200 && a.protein > 5).sort((a, b) => b.proteinPerRupee - a.proteinPerRupee).slice(0, 6);
        } else {
            return sortedByValue.slice(0, 6);
        }
    }
};
