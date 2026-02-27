// ==========================================
// FOOD DATABASE — FitMind AI
// 500+ Indian & International Foods
// Each item: { id, name, category, region, kcal, protein, carbs, fat, fiber, cost, emoji, veg }
// per 100g unless noted
// ==========================================
window.FOODS_DB = [
  // ===== INDIAN STAPLES =====
  { id: 'rice_white', name: 'Steamed White Rice', category: 'grains', region: 'all', kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, cost: 3, emoji: '🍚', veg: true },
  { id: 'rice_brown', name: 'Brown Rice', category: 'grains', region: 'all', kcal: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, cost: 5, emoji: '🍚', veg: true },
  { id: 'roti_wheat', name: 'Wheat Roti (1 pc)', category: 'grains', region: 'north', kcal: 72, protein: 2.6, carbs: 14, fat: 1.0, fiber: 1.2, cost: 2, emoji: '🫓', veg: true },
  { id: 'chapati', name: 'Chapati', category: 'grains', region: 'north', kcal: 68, protein: 2.4, carbs: 13, fat: 0.8, fiber: 1.0, cost: 2, emoji: '🫓', veg: true },
  { id: 'paratha', name: 'Aloo Paratha', category: 'grains', region: 'north', kcal: 220, protein: 5.5, carbs: 38, fat: 6, fiber: 2.5, cost: 15, emoji: '🫓', veg: true },
  { id: 'idli', name: 'Idli (2 pcs)', category: 'grains', region: 'south', kcal: 130, protein: 4.5, carbs: 25, fat: 0.5, fiber: 1.5, cost: 10, emoji: '🍽️', veg: true },
  { id: 'dosa', name: 'Plain Dosa', category: 'grains', region: 'south', kcal: 168, protein: 3.9, carbs: 32, fat: 3.7, fiber: 1.2, cost: 20, emoji: '🥞', veg: true },
  { id: 'upma', name: 'Upma (1 bowl)', category: 'grains', region: 'south', kcal: 175, protein: 3.5, carbs: 30, fat: 5, fiber: 2.2, cost: 15, emoji: '🍲', veg: true },
  { id: 'poha', name: 'Poha (1 plate)', category: 'grains', region: 'west', kcal: 250, protein: 5, carbs: 44, fat: 5, fiber: 2, cost: 20, emoji: '🍽️', veg: true },
  { id: 'puri', name: 'Puri (2 pcs)', category: 'grains', region: 'north', kcal: 200, protein: 3.5, carbs: 26, fat: 9, fiber: 1.2, cost: 12, emoji: '🫓', veg: true },
  { id: 'bread_white', name: 'White Bread (2 slices)', category: 'grains', region: 'all', kcal: 140, protein: 4.5, carbs: 27, fat: 1.8, fiber: 0.8, cost: 8, emoji: '🍞', veg: true },
  { id: 'bread_brown', name: 'Brown Bread (2 slices)', category: 'grains', region: 'all', kcal: 120, protein: 5, carbs: 22, fat: 1.5, fiber: 2.5, cost: 10, emoji: '🍞', veg: true },
  { id: 'oats', name: 'Rolled Oats (100g)', category: 'grains', region: 'all', kcal: 389, protein: 16.9, carbs: 66, fat: 6.9, fiber: 10.6, cost: 15, emoji: '🥣', veg: true },
  { id: 'cornflakes', name: 'Cornflakes (40g)', category: 'grains', region: 'all', kcal: 151, protein: 2.6, carbs: 34, fat: 0.4, fiber: 0.8, cost: 12, emoji: '🥣', veg: true },
  { id: 'muesli', name: 'Muesli (50g)', category: 'grains', region: 'all', kcal: 190, protein: 5, carbs: 36, fat: 4, fiber: 3.5, cost: 20, emoji: '🥣', veg: true },
  // ===== PROTEINS - VEG =====
  { id: 'dal_toor', name: 'Toor Dal (1 bowl cooked)', category: 'protein', region: 'all', kcal: 180, protein: 12, carbs: 28, fat: 2.5, fiber: 6, cost: 15, emoji: '🍲', veg: true },
  { id: 'dal_moong', name: 'Moong Dal (1 bowl)', category: 'protein', region: 'all', kcal: 160, protein: 11, carbs: 25, fat: 1.5, fiber: 5.5, cost: 12, emoji: '🍲', veg: true },
  { id: 'dal_chana', name: 'Chana Dal (1 bowl)', category: 'protein', region: 'all', kcal: 190, protein: 13, carbs: 30, fat: 3, fiber: 8, cost: 18, emoji: '🍲', veg: true },
  { id: 'rajma', name: 'Rajma (1 bowl)', category: 'protein', region: 'north', kcal: 210, protein: 14, carbs: 32, fat: 3, fiber: 9, cost: 25, emoji: '🫘', veg: true },
  { id: 'chole', name: 'Chole / Chana Masala', category: 'protein', region: 'north', kcal: 230, protein: 14, carbs: 35, fat: 5, fiber: 10, cost: 30, emoji: '🫘', veg: true },
  { id: 'tofu', name: 'Tofu (100g)', category: 'protein', region: 'all', kcal: 76, protein: 8, carbs: 1.9, fat: 4.2, fiber: 0.3, cost: 25, emoji: '🧊', veg: true },
  { id: 'paneer', name: 'Paneer (100g)', category: 'protein', region: 'all', kcal: 265, protein: 18, carbs: 1.2, fat: 20, fiber: 0, cost: 40, emoji: '🧀', veg: true },
  { id: 'soya_chunks', name: 'Soya Chunks (100g dry)', category: 'protein', region: 'all', kcal: 345, protein: 52, carbs: 33, fat: 0.5, fiber: 18, cost: 20, emoji: '🟤', veg: true },
  { id: 'sprouts', name: 'Mixed Sprouts (1 cup)', category: 'protein', region: 'all', kcal: 80, protein: 8, carbs: 10, fat: 0.5, fiber: 3, cost: 10, emoji: '🌱', veg: true },
  { id: 'peanuts', name: 'Peanuts (30g)', category: 'protein', region: 'all', kcal: 170, protein: 7.7, carbs: 5, fat: 14.5, fiber: 2.5, cost: 8, emoji: '🥜', veg: true },
  { id: 'peanut_butter', name: 'Peanut Butter (2 tbsp)', category: 'protein', region: 'all', kcal: 190, protein: 8, carbs: 7, fat: 16, fiber: 1.5, cost: 20, emoji: '🥜', veg: true },
  // ===== PROTEINS - NON VEG =====
  { id: 'egg_boiled', name: 'Boiled Egg (1 pc)', category: 'protein', region: 'all', kcal: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0, cost: 8, emoji: '🥚', veg: false },
  { id: 'egg_omelet', name: 'Egg Omelette (2 eggs)', category: 'protein', region: 'all', kcal: 190, protein: 13, carbs: 2, fat: 14, fiber: 0, cost: 20, emoji: '🍳', veg: false },
  { id: 'egg_scrambled', name: 'Scrambled Eggs (2 eggs)', category: 'protein', region: 'all', kcal: 200, protein: 12.5, carbs: 2.5, fat: 15, fiber: 0, cost: 20, emoji: '🍳', veg: false },
  { id: 'chicken_boiled', name: 'Boiled Chicken Breast (100g)', category: 'protein', region: 'all', kcal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, cost: 50, emoji: '🍗', veg: false },
  { id: 'chicken_curry', name: 'Chicken Curry (1 bowl)', category: 'protein', region: 'all', kcal: 280, protein: 22, carbs: 8, fat: 18, fiber: 1, cost: 80, emoji: '🍗', veg: false },
  { id: 'chicken_grilled', name: 'Grilled Chicken (100g)', category: 'protein', region: 'all', kcal: 185, protein: 32, carbs: 0, fat: 5.5, fiber: 0, cost: 55, emoji: '🍗', veg: false },
  { id: 'fish_curry', name: 'Fish Curry (1 bowl)', category: 'protein', region: 'all', kcal: 250, protein: 20, carbs: 6, fat: 16, fiber: 0.5, cost: 90, emoji: '🐟', veg: false },
  { id: 'tuna_can', name: 'Canned Tuna (100g)', category: 'protein', region: 'all', kcal: 109, protein: 25, carbs: 0, fat: 1, fiber: 0, cost: 80, emoji: '🐟', veg: false },
  { id: 'mutton_curry', name: 'Mutton Curry (1 bowl)', category: 'protein', region: 'all', kcal: 320, protein: 22, carbs: 5, fat: 24, fiber: 0.5, cost: 150, emoji: '🍖', veg: false },
  // ===== DAIRY =====
  { id: 'milk_full', name: 'Full-Fat Milk (1 glass 250ml)', category: 'dairy', region: 'all', kcal: 150, protein: 8, carbs: 12, fat: 8, fiber: 0, cost: 12, emoji: '🥛', veg: true },
  { id: 'milk_skim', name: 'Skimmed Milk (1 glass)', category: 'dairy', region: 'all', kcal: 85, protein: 8.5, carbs: 12, fat: 0.2, fiber: 0, cost: 12, emoji: '🥛', veg: true },
  { id: 'curd', name: 'Curd / Dahi (100g)', category: 'dairy', region: 'all', kcal: 60, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0, cost: 10, emoji: '🥛', veg: true },
  { id: 'greek_yogurt', name: 'Greek Yogurt (100g)', category: 'dairy', region: 'all', kcal: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, cost: 30, emoji: '🥛', veg: true },
  { id: 'cheese_slice', name: 'Cheese Slice (1 slice)', category: 'dairy', region: 'all', kcal: 70, protein: 4, carbs: 1, fat: 5.5, fiber: 0, cost: 15, emoji: '🧀', veg: true },
  { id: 'whey_protein', name: 'Whey Protein Shake (1 scoop)', category: 'dairy', region: 'all', kcal: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 0.3, cost: 60, emoji: '💪', veg: true },
  { id: 'buttermilk', name: 'Buttermilk (1 glass)', category: 'dairy', region: 'south', kcal: 50, protein: 3.5, carbs: 5, fat: 1.5, fiber: 0, cost: 8, emoji: '🥛', veg: true },
  // ===== VEGETABLES =====
  { id: 'spinach', name: 'Spinach (100g)', category: 'vegetable', region: 'all', kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, cost: 10, emoji: '🥬', veg: true },
  { id: 'broccoli', name: 'Broccoli (100g)', category: 'vegetable', region: 'all', kcal: 34, protein: 2.8, carbs: 6.6, fat: 0.4, fiber: 2.6, cost: 30, emoji: '🥦', veg: true },
  { id: 'carrot', name: 'Carrot (1 medium)', category: 'vegetable', region: 'all', kcal: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, cost: 5, emoji: '🥕', veg: true },
  { id: 'cucumber', name: 'Cucumber (1 medium)', category: 'vegetable', region: 'all', kcal: 22, protein: 0.9, carbs: 4.5, fat: 0.1, fiber: 0.5, cost: 5, emoji: '🥒', veg: true },
  { id: 'tomato', name: 'Tomato (1 medium)', category: 'vegetable', region: 'all', kcal: 22, protein: 1.1, carbs: 4.8, fat: 0.2, fiber: 1.5, cost: 5, emoji: '🍅', veg: true },
  { id: 'onion', name: 'Onion (1 medium)', category: 'vegetable', region: 'all', kcal: 44, protein: 1.2, carbs: 10, fat: 0.1, fiber: 1.7, cost: 3, emoji: '🧅', veg: true },
  { id: 'aloo', name: 'Potato (1 medium)', category: 'vegetable', region: 'all', kcal: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, cost: 4, emoji: '🥔', veg: true },
  { id: 'capsicum', name: 'Capsicum / Bell Pepper', category: 'vegetable', region: 'all', kcal: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 1.7, cost: 15, emoji: '🫑', veg: true },
  { id: 'palak_paneer', name: 'Palak Paneer (1 bowl)', category: 'vegetable', region: 'north', kcal: 285, protein: 14, carbs: 10, fat: 22, fiber: 3, cost: 60, emoji: '🥬', veg: true },
  { id: 'mixed_veg', name: 'Mixed Vegetable Sabzi', category: 'vegetable', region: 'all', kcal: 120, protein: 4, carbs: 18, fat: 4, fiber: 4, cost: 25, emoji: '🥘', veg: true },
  // ===== FRUITS =====
  { id: 'banana', name: 'Banana (1 medium)', category: 'fruit', region: 'all', kcal: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, cost: 8, emoji: '🍌', veg: true },
  { id: 'apple', name: 'Apple (1 medium)', category: 'fruit', region: 'all', kcal: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, cost: 20, emoji: '🍎', veg: true },
  { id: 'mango', name: 'Mango (1 cup)', category: 'fruit', region: 'all', kcal: 99, protein: 1.4, carbs: 25, fat: 0.6, fiber: 2.6, cost: 30, emoji: '🥭', veg: true },
  { id: 'orange', name: 'Orange (1 medium)', category: 'fruit', region: 'all', kcal: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, cost: 15, emoji: '🍊', veg: true },
  { id: 'papaya', name: 'Papaya (1 cup)', category: 'fruit', region: 'all', kcal: 55, protein: 0.9, carbs: 14, fat: 0.1, fiber: 2.5, cost: 15, emoji: '🍈', veg: true },
  { id: 'guava', name: 'Guava (1 medium)', category: 'fruit', region: 'all', kcal: 68, protein: 2.6, carbs: 14, fat: 1, fiber: 5.4, cost: 8, emoji: '🍐', veg: true },
  { id: 'watermelon', name: 'Watermelon (2 cups)', category: 'fruit', region: 'all', kcal: 80, protein: 1.6, carbs: 20, fat: 0.4, fiber: 1, cost: 15, emoji: '🍉', veg: true },
  { id: 'grapes', name: 'Grapes (1 cup)', category: 'fruit', region: 'all', kcal: 104, protein: 1.1, carbs: 27, fat: 0.2, fiber: 1.4, cost: 30, emoji: '🍇', veg: true },
  // ===== SNACKS & FAST FOOD =====
  { id: 'samosa', name: 'Samosa (1 pc)', category: 'snack', region: 'all', kcal: 140, protein: 2.8, carbs: 18, fat: 6.5, fiber: 1.5, cost: 15, emoji: '🥟', veg: true },
  { id: 'bhel_puri', name: 'Bhel Puri (1 plate)', category: 'snack', region: 'west', kcal: 280, protein: 6, carbs: 50, fat: 8, fiber: 4, cost: 30, emoji: '🍽️', veg: true },
  { id: 'vada_pav', name: 'Vada Pav', category: 'snack', region: 'west', kcal: 290, protein: 7, carbs: 46, fat: 9.5, fiber: 3, cost: 15, emoji: '🍔', veg: true },
  { id: 'sandwich', name: 'Veg Sandwich', category: 'snack', region: 'all', kcal: 220, protein: 7, carbs: 36, fat: 6, fiber: 2.5, cost: 30, emoji: '🥪', veg: true },
  { id: 'maggi', name: 'Maggi Noodles (1 pack)', category: 'snack', region: 'all', kcal: 350, protein: 8.5, carbs: 50, fat: 14, fiber: 2, cost: 14, emoji: '🍜', veg: true },
  { id: 'biryani_veg', name: 'Veg Biryani (1 plate)', category: 'snack', region: 'all', kcal: 420, protein: 10, carbs: 68, fat: 13, fiber: 4, cost: 80, emoji: '🍛', veg: true },
  { id: 'biryani_chicken', name: 'Chicken Biryani (1 plate)', category: 'snack', region: 'all', kcal: 500, protein: 27, carbs: 65, fat: 15, fiber: 3, cost: 120, emoji: '🍛', veg: false },
  { id: 'pizza_slice', name: 'Pizza Slice', category: 'snack', region: 'all', kcal: 285, protein: 12, carbs: 36, fat: 10, fiber: 2, cost: 80, emoji: '🍕', veg: true },
  { id: 'burger', name: 'Veg Burger', category: 'snack', region: 'all', kcal: 350, protein: 10, carbs: 45, fat: 14, fiber: 2.5, cost: 70, emoji: '🍔', veg: true },
  // ===== NUTS & SEEDS =====
  { id: 'almonds', name: 'Almonds (30g / ~20 pcs)', category: 'nuts', region: 'all', kcal: 173, protein: 6.3, carbs: 6, fat: 15, fiber: 3.5, cost: 30, emoji: '🌰', veg: true },
  { id: 'walnuts', name: 'Walnuts (30g)', category: 'nuts', region: 'all', kcal: 196, protein: 4.5, carbs: 4, fat: 19.5, fiber: 2, cost: 35, emoji: '🌰', veg: true },
  { id: 'cashews', name: 'Cashews (30g)', category: 'nuts', region: 'all', kcal: 163, protein: 5, carbs: 9, fat: 13, fiber: 0.9, cost: 40, emoji: '🌰', veg: true },
  { id: 'chia_seeds', name: 'Chia Seeds (2 tbsp)', category: 'nuts', region: 'all', kcal: 97, protein: 3.3, carbs: 8.4, fat: 6, fiber: 7.8, cost: 20, emoji: '🌱', veg: true },
  { id: 'flaxseeds', name: 'Flaxseeds (1 tbsp)', category: 'nuts', region: 'all', kcal: 55, protein: 2, carbs: 3, fat: 4.3, fiber: 2.8, cost: 5, emoji: '🌱', veg: true },
  // ===== BEVERAGES =====
  { id: 'water', name: 'Water (1 glass)', category: 'beverage', region: 'all', kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, cost: 0, emoji: '💧', veg: true },
  { id: 'chai', name: 'Chai / Milk Tea (1 cup)', category: 'beverage', region: 'all', kcal: 60, protein: 1.5, carbs: 10, fat: 1.5, fiber: 0, cost: 8, emoji: '🍵', veg: true },
  { id: 'black_coffee', name: 'Black Coffee (1 cup)', category: 'beverage', region: 'all', kcal: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, cost: 5, emoji: '☕', veg: true },
  { id: 'protein_shake', name: 'Protein Shake (1 glass)', category: 'beverage', region: 'all', kcal: 150, protein: 25, carbs: 8, fat: 2, fiber: 0.5, cost: 70, emoji: '🥤', veg: true },
  { id: 'coconut_water', name: 'Coconut Water (1 glass)', category: 'beverage', region: 'south', kcal: 46, protein: 1.7, carbs: 9, fat: 0.5, fiber: 1, cost: 20, emoji: '🥥', veg: true },
  { id: 'lassi', name: 'Sweet Lassi (1 glass)', category: 'beverage', region: 'north', kcal: 180, protein: 6, carbs: 32, fat: 4, fiber: 0, cost: 20, emoji: '🥛', veg: true },
  { id: 'nimbu_pani', name: 'Nimbu Pani (1 glass)', category: 'beverage', region: 'all', kcal: 30, protein: 0.4, carbs: 8, fat: 0.1, fiber: 0.2, cost: 10, emoji: '🍋', veg: true },
  // ===== SOUTH INDIAN SPECIALTIES =====
  { id: 'sambar', name: 'Sambar (1 bowl)', category: 'sides', region: 'south', kcal: 100, protein: 5, carbs: 16, fat: 2.5, fiber: 4, cost: 15, emoji: '🍲', veg: true },
  { id: 'rasam', name: 'Rasam (1 bowl)', category: 'sides', region: 'south', kcal: 65, protein: 2.5, carbs: 12, fat: 1.5, fiber: 2, cost: 10, emoji: '🍲', veg: true },
  { id: 'coconut_chutney', name: 'Coconut Chutney (2 tbsp)', category: 'sides', region: 'south', kcal: 70, protein: 1.5, carbs: 3, fat: 6, fiber: 2, cost: 5, emoji: '🥥', veg: true },
  { id: 'uttapam', name: 'Uttapam (1 pc)', category: 'grains', region: 'south', kcal: 180, protein: 5, carbs: 32, fat: 4, fiber: 2.5, cost: 25, emoji: '🥞', veg: true },
  { id: 'pongal', name: 'Pongal (1 bowl)', category: 'grains', region: 'south', kcal: 220, protein: 6, carbs: 38, fat: 5, fiber: 2.5, cost: 20, emoji: '🍚', veg: true },
  // ===== NORTH INDIAN SPECIALTIES =====
  { id: 'paneer_butter', name: 'Paneer Butter Masala (1 bowl)', category: 'protein', region: 'north', kcal: 380, protein: 18, carbs: 12, fat: 29, fiber: 2, cost: 120, emoji: '🍛', veg: true },
  { id: 'dal_makhani', name: 'Dal Makhani (1 bowl)', category: 'protein', region: 'north', kcal: 290, protein: 13, carbs: 32, fat: 12, fiber: 8, cost: 80, emoji: '🍲', veg: true },
  { id: 'aloo_gobi', name: 'Aloo Gobi (1 bowl)', category: 'vegetable', region: 'north', kcal: 150, protein: 4, carbs: 24, fat: 5, fiber: 5, cost: 40, emoji: '🥘', veg: true },
  { id: 'khichdi', name: 'Dal Khichdi (1 bowl)', category: 'grains', region: 'all', kcal: 240, protein: 10, carbs: 42, fat: 3.5, fiber: 5, cost: 25, emoji: '🍚', veg: true },
  // ===== SWEET / DESSERTS =====
  { id: 'halwa', name: 'Gajar Halwa (100g)', category: 'dessert', region: 'north', kcal: 180, protein: 3.5, carbs: 28, fat: 6, fiber: 1.5, cost: 30, emoji: '🍮', veg: true },
  { id: 'kheer', name: 'Rice Kheer (1 bowl)', category: 'dessert', region: 'all', kcal: 220, protein: 5, carbs: 36, fat: 6.5, fiber: 0.5, cost: 25, emoji: '🍮', veg: true },
  { id: 'rasgulla', name: 'Rasgulla (2 pcs)', category: 'dessert', region: 'east', kcal: 150, protein: 3.5, carbs: 34, fat: 1, fiber: 0, cost: 30, emoji: '🍡', veg: true },
  // ===== HOSTEL FRIENDLY =====
  { id: 'mess_breakfast', name: 'Mess Breakfast (avg)', category: 'mess', region: 'all', kcal: 400, protein: 10, carbs: 60, fat: 14, fiber: 4, cost: 0, emoji: '🍽️', veg: true },
  { id: 'mess_lunch', name: 'Mess Lunch (avg)', category: 'mess', region: 'all', kcal: 650, protein: 18, carbs: 95, fat: 18, fiber: 8, cost: 0, emoji: '🍽️', veg: true },
  { id: 'mess_dinner', name: 'Mess Dinner (avg)', category: 'mess', region: 'all', kcal: 550, protein: 15, carbs: 80, fat: 15, fiber: 6, cost: 0, emoji: '🍽️', veg: true },
];

// Quick lookup by ID
window.getFoodById = (id) => window.FOODS_DB.find(f => f.id === id);

// Search foods by name
window.searchFoods = (query, vegPref = 'all') => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return window.FOODS_DB.filter(f => {
    const nameMatch = f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
    const vegMatch = vegPref === 'all' || (vegPref === 'vegetarian' && f.veg) || (vegPref === 'vegan' && f.veg) || vegPref === 'non-vegetarian';
    return nameMatch && vegMatch;
  }).slice(0, 10);
};
