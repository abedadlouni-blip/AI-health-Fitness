/**
 * AI Health & Fitness - AI Workout & Meal Generator Module
 * Generates dynamic customized workout splits, exercises, and meal recommendations.
 */

const AIPlanner = {
  /**
   * Exercise Database broken down by Muscle Group and Fitness Level
   */
  exerciseDatabase: {
    chest: [
      { name: 'Push-ups', level: 'beginner', equipment: 'bodyweight', sets: 3, reps: '10-12', instructions: 'Keep core tight and body straight in plank position.' },
      { name: 'Barbell Bench Press', level: 'intermediate', equipment: 'gym', sets: 4, reps: '8-10', instructions: 'Lower bar smoothly to mid-chest and push up explosively.' },
      { name: 'Dumbbell Incline Press', level: 'intermediate', equipment: 'dumbbells', sets: 3, reps: '10-12', instructions: 'Target upper chest on 30-45 degree angle bench.' },
      { name: 'Cable Chest Flyes', level: 'advanced', equipment: 'gym', sets: 4, reps: '12-15', instructions: 'Squeeze chest at peak contraction.' }
    ],
    back: [
      { name: 'Lat Pulldowns / Assisted Pull-ups', level: 'beginner', equipment: 'gym', sets: 3, reps: '10-12', instructions: 'Pull to upper chest focusing on back contraction.' },
      { name: 'Dumbbell Bent-Over Rows', level: 'intermediate', equipment: 'dumbbells', sets: 4, reps: '10-12', instructions: 'Keep spine neutral and pull dumbbell toward hip.' },
      { name: 'Barbell Deadlifts', level: 'advanced', equipment: 'gym', sets: 4, reps: '6-8', instructions: 'Engage core, drive through heels, keep bar close to shins.' },
      { name: 'Inverted Bodyweight Rows', level: 'beginner', equipment: 'bodyweight', sets: 3, reps: '10-12', instructions: 'Pull chest up to bar with body extended.' }
    ],
    legs: [
      { name: 'Bodyweight Air Squats', level: 'beginner', equipment: 'bodyweight', sets: 3, reps: '15-20', instructions: 'Squat down until thighs are parallel to ground.' },
      { name: 'Barbell Back Squats', level: 'intermediate', equipment: 'gym', sets: 4, reps: '8-10', instructions: 'Brace core, squat deep, drive through mid-foot.' },
      { name: 'Dumbbell Goblet Squats', level: 'beginner', equipment: 'dumbbells', sets: 3, reps: '12-15', instructions: 'Hold dumbbell vertically close to chest.' },
      { name: 'Romanian Deadlifts', level: 'intermediate', equipment: 'dumbbells', sets: 3, reps: '10-12', instructions: 'Hinge at hips feeling stretch in hamstrings.' },
      { name: 'Walking Lunges', level: 'beginner', equipment: 'bodyweight', sets: 3, reps: '12 per leg', instructions: 'Keep torso erect and front knee behind toes.' }
    ],
    shoulders: [
      { name: 'Overhead Dumbbell Press', level: 'intermediate', equipment: 'dumbbells', sets: 3, reps: '10-12', instructions: 'Press weights overhead without arching lower back.' },
      { name: 'Lateral Raises', level: 'beginner', equipment: 'dumbbells', sets: 4, reps: '12-15', instructions: 'Raise arms out to sides until parallel with shoulders.' },
      { name: 'Pike Push-ups', level: 'intermediate', equipment: 'bodyweight', sets: 3, reps: '8-10', instructions: 'Elevate hips in inverted V shape and press shoulders.' }
    ],
    arms: [
      { name: 'Dumbbell Bicep Curls', level: 'beginner', equipment: 'dumbbells', sets: 3, reps: '12-15', instructions: 'Keep elbows tucked into sides during curl.' },
      { name: 'Triceps Dips (Bench / Chair)', level: 'beginner', equipment: 'bodyweight', sets: 3, reps: '12-15', instructions: 'Lower body until upper arms are parallel to floor.' },
      { name: 'Hammer Curls', level: 'intermediate', equipment: 'dumbbells', sets: 3, reps: '10-12', instructions: 'Maintain neutral grip to target brachialis.' }
    ],
    core: [
      { name: 'Plank Hold', level: 'beginner', equipment: 'bodyweight', sets: 3, reps: '45-60 sec', instructions: 'Maintain straight line from head to heels.' },
      { name: 'Bicycle Crunches', level: 'beginner', equipment: 'bodyweight', sets: 3, reps: '20 total', instructions: 'Rotate elbow to opposite knee smoothly.' },
      { name: 'Hanging Leg Raises / Knee Raises', level: 'intermediate', equipment: 'gym', sets: 3, reps: '12-15', instructions: 'Control movement without swinging.' }
    ],
    cardio: [
      { name: 'Jumping Jacks / High Knees', level: 'beginner', equipment: 'bodyweight', sets: 4, reps: '45 sec', instructions: 'Maintain fast paced cadence for heart rate elevation.' },
      { name: 'Burpees', level: 'intermediate', equipment: 'bodyweight', sets: 4, reps: '12-15', instructions: 'Explosive jump from plank into vertical jump.' },
      { name: 'Treadmill Incline Interval Walk/Run', level: 'intermediate', equipment: 'gym', sets: 1, reps: '20 mins', instructions: 'Alternate 1 min high speed with 1 min recovery walk.' }
    ]
  },

  /**
   * Generates a 7-day custom Workout Plan based on user preferences
   * @param {Object} profile - { goal, fitnessLevel, equipmentPreference }
   * @returns {Array<Object>} 7 day workout plan schedule
   */
  generateWorkoutPlan(profile) {
    const goal = profile.goal || 'weight_loss';
    const level = profile.fitnessLevel || 'intermediate';
    const equipment = profile.equipmentPreference || 'all';

    // Structure splits according to goal
    let weeklySplit = [];
    if (goal === 'weight_loss' || goal === 'extreme_loss') {
      weeklySplit = [
        { day: 'Monday', title: 'Full Body HIIT & Cardio', muscleGroups: ['chest', 'legs', 'cardio', 'core'] },
        { day: 'Tuesday', title: 'Upper Body Focus', muscleGroups: ['chest', 'back', 'shoulders', 'arms'] },
        { day: 'Wednesday', title: 'Active Recovery & Core', muscleGroups: ['core', 'cardio'] },
        { day: 'Thursday', title: 'Lower Body & Legs Focus', muscleGroups: ['legs', 'core'] },
        { day: 'Friday', title: 'Full Body Metabolic Conditioning', muscleGroups: ['back', 'legs', 'cardio', 'shoulders'] },
        { day: 'Saturday', title: 'Light Cardio & Core Burn', muscleGroups: ['cardio', 'core'] },
        { day: 'Sunday', title: 'Rest & Mobility Day', muscleGroups: [] }
      ];
    } else if (goal === 'muscle_gain' || goal === 'aggressive_gain') {
      weeklySplit = [
        { day: 'Monday', title: 'Chest & Triceps (Push)', muscleGroups: ['chest', 'shoulders', 'arms'] },
        { day: 'Tuesday', title: 'Back & Biceps (Pull)', muscleGroups: ['back', 'arms'] },
        { day: 'Wednesday', title: 'Legs & Core Hypertrophy', muscleGroups: ['legs', 'core'] },
        { day: 'Thursday', title: 'Rest & Muscle Recovery', muscleGroups: [] },
        { day: 'Friday', title: 'Upper Body Power', muscleGroups: ['chest', 'back', 'shoulders'] },
        { day: 'Saturday', title: 'Lower Body & Core Blast', muscleGroups: ['legs', 'core'] },
        { day: 'Sunday', title: 'Rest Day', muscleGroups: [] }
      ];
    } else {
      // Maintenance / General Health
      weeklySplit = [
        { day: 'Monday', title: 'Full Body Strength A', muscleGroups: ['chest', 'back', 'legs'] },
        { day: 'Tuesday', title: 'Cardio & Abs', muscleGroups: ['cardio', 'core'] },
        { day: 'Wednesday', title: 'Rest Day', muscleGroups: [] },
        { day: 'Thursday', title: 'Full Body Strength B', muscleGroups: ['shoulders', 'legs', 'arms'] },
        { day: 'Friday', title: 'Core & Endurance Conditioning', muscleGroups: ['cardio', 'core'] },
        { day: 'Saturday', title: 'Active Outdoor / Sport', muscleGroups: ['legs', 'cardio'] },
        { day: 'Sunday', title: 'Rest & Stretch', muscleGroups: [] }
      ];
    }

    return weeklySplit.map(dayInfo => {
      if (dayInfo.muscleGroups.length === 0) {
        return {
          day: dayInfo.day,
          title: dayInfo.title,
          isRestDay: true,
          exercises: []
        };
      }

      let dayExercises = [];
      dayInfo.muscleGroups.forEach(group => {
        const pool = this.exerciseDatabase[group] || [];
        // Filter exercises matching equipment if specified
        let filtered = pool;
        if (equipment === 'bodyweight') {
          filtered = pool.filter(ex => ex.equipment === 'bodyweight');
        } else if (equipment === 'dumbbells') {
          filtered = pool.filter(ex => ex.equipment === 'dumbbells' || ex.equipment === 'bodyweight');
        }

        if (filtered.length === 0) filtered = pool; // Fallback to all if none match

        // Pick 1-2 exercises per group
        const selected = filtered.slice(0, 2);
        dayExercises.push(...selected);
      });

      return {
        day: dayInfo.day,
        title: dayInfo.title,
        isRestDay: false,
        estimatedDurationMins: dayExercises.length * 8 + 10,
        estimatedBurnKcal: dayExercises.length * 45 + 50,
        exercises: dayExercises
      };
    });
  },

  /**
   * Meal Recipe Database categorised by dietary preference
   */
  mealDatabase: {
    breakfast: [
      { name: 'Oatmeal with Berries & Whey Protein', calories: 420, protein: 32, carbs: 55, fat: 8, dietary: ['balanced', 'vegetarian', 'high_protein'], description: 'Rolled oats cooked with water, topped with blueberries and protein powder.' },
      { name: 'Avocado Egg Toast & Spinach', calories: 380, protein: 18, carbs: 32, fat: 20, dietary: ['balanced', 'vegetarian'], description: '2 whole poached eggs on whole grain toast with mashed avocado.' },
      { name: 'Protein Berry Smoothie Bowl', calories: 350, protein: 28, carbs: 45, fat: 6, dietary: ['balanced', 'vegan', 'vegetarian', 'high_protein'], description: 'Blended frozen berries, plant/whey protein, almond milk, and chia seeds.' },
      { name: 'Keto Scrambled Eggs with Bacon & Cheese', calories: 520, protein: 30, carbs: 4, fat: 42, dietary: ['keto', 'high_protein'], description: '3 eggs scrambled in butter with cheddar and smoked turkey/pork bacon.' }
    ],
    lunch: [
      { name: 'Grilled Chicken Quinoa Bowl', calories: 550, protein: 45, carbs: 50, fat: 16, dietary: ['balanced', 'high_protein'], description: 'Seasoned chicken breast with fluffy quinoa, roasted veggies, and olive oil dressing.' },
      { name: 'Tofu & Broccoli Stir-Fry with Brown Rice', calories: 460, protein: 24, carbs: 62, fat: 12, dietary: ['vegan', 'vegetarian', 'balanced'], description: 'Crispy pan-seared tofu and fresh broccoli tossed in soy-ginger glaze.' },
      { name: 'Keto Salmon Caesar Salad', calories: 580, protein: 42, carbs: 6, fat: 44, dietary: ['keto', 'high_protein'], description: 'Pan-pitted salmon fillet over crisp romaine lettuce with creamy Caesar dressing.' },
      { name: 'Turkey & Hummus Wrap', calories: 480, protein: 36, carbs: 42, fat: 18, dietary: ['balanced', 'high_protein'], description: 'Lean sliced turkey, lettuce, cucumber, and roasted red pepper hummus.' }
    ],
    dinner: [
      { name: 'Baked Salmon with Sweet Potato & Asparagus', calories: 580, protein: 42, carbs: 40, fat: 22, dietary: ['balanced', 'high_protein'], description: 'Omega-3 rich salmon fillet baked with herbs, served alongside roasted sweet potato.' },
      { name: 'Lean Beef / Turkey Meatballs with Zucchini Noodles', calories: 440, protein: 38, carbs: 14, fat: 24, dietary: ['keto', 'high_protein', 'balanced'], description: 'Homemade lean meatballs in marinara sauce over freshly spiraled zoodles.' },
      { name: 'Lentil & Chickpea Curry with Basmati Rice', calories: 510, protein: 22, carbs: 78, fat: 10, dietary: ['vegan', 'vegetarian', 'balanced'], description: 'Hearty coconut lentils and chickpeas simmered in fragrant curry spices.' },
      { name: 'Grilled Lean Steak with Roasted Cauliflower', calories: 620, protein: 50, carbs: 12, fat: 38, dietary: ['keto', 'high_protein'], description: 'Grass-fed sirloin steak grilled to medium with garlic butter cauliflower.' }
    ],
    snacks: [
      { name: 'Greek Yogurt with Almonds & Honey', calories: 240, protein: 20, carbs: 20, fat: 9, dietary: ['balanced', 'vegetarian', 'high_protein'], description: 'Non-fat plain Greek yogurt with sliced almonds and a drizzle of raw honey.' },
      { name: 'Apple Slices with Natural Peanut Butter', calories: 210, protein: 6, carbs: 26, fat: 11, dietary: ['balanced', 'vegan', 'vegetarian'], description: 'Crisp green apple paired with 2 tbsp all-natural peanut butter.' },
      { name: 'Keto Cottage Cheese & Walnuts', calories: 220, protein: 16, carbs: 5, fat: 15, dietary: ['keto', 'vegetarian'], description: 'Full-fat cottage cheese topped with crushed walnuts.' },
      { name: 'Protein Bar / Shake', calories: 200, protein: 22, carbs: 18, fat: 5, dietary: ['balanced', 'high_protein', 'vegetarian'], description: 'High-protein convenient nutrition bar or shake.' }
    ]
  },

  /**
   * Generates a daily Meal Plan tailored to daily target calories and dietary preferences
   * @param {number} targetCalories - Daily target calorie goal
   * @param {string} preference - 'balanced' | 'vegan' | 'vegetarian' | 'keto' | 'high_protein'
   * @returns {Object} Daily meal breakdown (breakfast, lunch, dinner, snack)
   */
  generateMealPlan(targetCalories = 2000, preference = 'balanced') {
    const filterMeal = (category) => {
      const items = this.mealDatabase[category] || [];
      const matched = items.filter(m => m.dietary.includes(preference));
      const pool = matched.length > 0 ? matched : items;
      return pool[Math.floor(Math.random() * pool.length)];
    };

    const breakfast = filterMeal('breakfast');
    const lunch = filterMeal('lunch');
    const dinner = filterMeal('dinner');
    const snack = filterMeal('snacks');

    const totalCals = breakfast.calories + lunch.calories + dinner.calories + snack.calories;
    const totalProtein = breakfast.protein + lunch.protein + dinner.protein + snack.protein;
    const totalCarbs = breakfast.carbs + lunch.carbs + dinner.carbs + snack.carbs;
    const totalFat = breakfast.fat + lunch.fat + dinner.fat + snack.fat;

    return {
      meals: { breakfast, lunch, dinner, snack },
      totals: {
        calories: totalCals,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat
      },
      targetCalories
    };
  },

  /**
   * Generates response for AI Health Coach Chatbot based on user query
   * @param {string} userMessage - Message typed by user
   * @param {Object} userProfile - User's health profile
   * @returns {string} AI Advice answer
   */
  getAICoachResponse(userMessage, userProfile) {
    const text = userMessage.toLowerCase();
    const name = userProfile ? userProfile.name.split(' ')[0] : 'friend';
    const goal = userProfile ? userProfile.goal : 'health';

    if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
      return `Hello ${name}! Great to see you today. How can I support your fitness journey right now? You can ask about workout tips, nutrition advice, or how to reach your ${goal.replace('_', ' ')} goal faster!`;
    }

    if (text.includes('protein') || text.includes('muscle') || text.includes('hypertrophy')) {
      return `To build muscle efficiently, aim for 1.6 to 2.2 grams of protein per kilogram of body weight daily. Ensure you practice progressive overload in your workouts and get 7-9 hours of quality sleep for recovery!`;
    }

    if (text.includes('weight loss') || text.includes('fat loss') || text.includes('deficit')) {
      return `Fat loss happens in a sustainable calorie deficit (around 300–500 kcal below your TDEE). Focus on high-protein, fiber-rich whole foods to stay full, keep up resistance training to preserve lean muscle, and drink plenty of water!`;
    }

    if (text.includes('water') || text.includes('hydration') || text.includes('drink')) {
      return `Hydration is key for energy and fat metabolism! Aim for around 2.5–3.5 liters daily, depending on your exercise intensity. A good benchmark is tracking your intake in our Water Log on the dashboard!`;
    }

    if (text.includes('creatine') || text.includes('supplement') || text.includes('pre workout')) {
      return `Supplements are great additions to a solid diet! Creatine Monohydrate (3-5g daily) is scientifically proven for strength and muscle volume. Whey protein helps hit daily targets easily. Always prioritize whole nutrition first!`;
    }

    if (text.includes('sore') || text.includes('recovery') || text.includes('rest day')) {
      return `Delayed Onset Muscle Soreness (DOMS) is normal after tough sessions! Stay active with light walking, foam rolling, prioritize 8 hours of sleep, and stay hydrated with proper electrolyte intake.`;
    }

    // Default intelligent AI response
    return `That's a great question regarding your health! For best results with your current ${goal.replace('_', ' ')} goal, focus on consistent daily movement, hitting your macronutrient targets, and tracking your daily meals here in the app. Is there a specific exercise or diet topic you'd like me to break down further?`;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIPlanner;
}
if (typeof window !== 'undefined') {
  window.AIPlanner = AIPlanner;
}
