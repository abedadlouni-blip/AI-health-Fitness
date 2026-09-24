/**
 * AI Health & Fitness - Health Calculator Module
 * Provides scientific formulas for BMI, BMR, TDEE, Macros, Ideal Weight, and Water Intake.
 */

const HealthCalculator = {
  /**
   * Calculates Body Mass Index (BMI)
   * @param {number} weightKg - Weight in kilograms
   * @param {number} heightCm - Height in centimeters
   * @returns {{ bmi: number, category: string, healthRisk: string }}
   */
  calculateBMI(weightKg, heightCm) {
    if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
      return { bmi: 0, category: 'Unknown', healthRisk: 'Invalid input' };
    }
    const heightM = heightCm / 100;
    const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

    let category = '';
    let healthRisk = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      healthRisk = 'Increased risk of nutritional deficiency';
    } else if (bmi < 25.0) {
      category = 'Normal weight';
      healthRisk = 'Low risk (Optimal)';
    } else if (bmi < 30.0) {
      category = 'Overweight';
      healthRisk = 'Moderate risk of metabolic issues';
    } else if (bmi < 35.0) {
      category = 'Obese (Class I)';
      healthRisk = 'High risk of cardiovascular disease';
    } else {
      category = 'Obese (Class II+)';
      healthRisk = 'Very high health risk';
    }

    return { bmi, category, healthRisk };
  },

  /**
   * Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation
   * @param {number} weightKg - Weight in kg
   * @param {number} heightCm - Height in cm
   * @param {number} age - Age in years
   * @param {string} gender - 'male' | 'female'
   * @returns {number} BMR in kcal/day
   */
  calculateBMR(weightKg, heightCm, age, gender) {
    if (!weightKg || !heightCm || !age || weightKg <= 0 || heightCm <= 0 || age <= 0) {
      return 0;
    }
    const baseBMR = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    const genderOffset = (gender && gender.toLowerCase() === 'female') ? -161 : 5;
    return Math.round(baseBMR + genderOffset);
  },

  /**
   * Activity Multipliers based on PAL (Physical Activity Level)
   */
  activityMultipliers: {
    sedentary: 1.2,      // Little or no exercise
    light: 1.375,       // Light exercise 1-3 days/week
    moderate: 1.55,     // Moderate exercise 3-5 days/week
    active: 1.725,      // Heavy exercise 6-7 days/week
    extra_active: 1.9   // Very heavy exercise or physical job
  },

  /**
   * Calculates Total Daily Energy Expenditure (TDEE)
   * @param {number} bmr - Basal Metabolic Rate
   * @param {string} activityLevel - Key of activityMultipliers
   * @returns {number} TDEE in kcal/day
   */
  calculateTDEE(bmr, activityLevel) {
    const multiplier = this.activityMultipliers[activityLevel] || 1.2;
    return Math.round(bmr * multiplier);
  },

  /**
   * Target Calorie adjustments by fitness goal
   */
  goalAdjustments: {
    weight_loss: -500,     // ~0.5kg loss per week
    extreme_loss: -750,    // ~0.75kg loss per week
    maintenance: 0,        // Maintain current weight
    muscle_gain: 300,      // Lean muscle gain
    aggressive_gain: 500   // Weight/mass gain
  },

  /**
   * Calculates Target Daily Calories based on TDEE and Goal
   * @param {number} tdee - TDEE in kcal
   * @param {string} goal - Key of goalAdjustments
   * @returns {number} Target daily calories
   */
  calculateTargetCalories(tdee, goal) {
    const adjustment = this.goalAdjustments[goal] !== undefined ? this.goalAdjustments[goal] : 0;
    const target = tdee + adjustment;
    // Safety lower limit (1200 kcal for general health safety)
    return Math.max(1200, Math.round(target));
  },

  /**
   * Calculates Target Macronutrients (Protein, Carbs, Fats) in grams and calories
   * @param {number} targetCalories - Daily target calorie intake
   * @param {string} goal - Goal type
   * @param {number} weightKg - Weight in kg
   * @returns {{ protein: { grams: number, calories: number, percent: number }, carbs: { grams: number, calories: number, percent: number }, fat: { grams: number, calories: number, percent: number } }}
   */
  calculateMacros(targetCalories, goal, weightKg) {
    if (!targetCalories || targetCalories <= 0) {
      return {
        protein: { grams: 0, calories: 0, percent: 0 },
        carbs: { grams: 0, calories: 0, percent: 0 },
        fat: { grams: 0, calories: 0, percent: 0 }
      };
    }

    let proteinRatio = 0.30;
    let carbsRatio = 0.45;
    let fatRatio = 0.25;

    if (goal === 'weight_loss' || goal === 'extreme_loss') {
      proteinRatio = 0.35;
      carbsRatio = 0.35;
      fatRatio = 0.30;
    } else if (goal === 'muscle_gain' || goal === 'aggressive_gain') {
      proteinRatio = 0.30;
      carbsRatio = 0.50;
      fatRatio = 0.20;
    }

    const proteinCalories = targetCalories * proteinRatio;
    const carbsCalories = targetCalories * carbsRatio;
    const fatCalories = targetCalories * fatRatio;

    return {
      protein: {
        grams: Math.round(proteinCalories / 4),
        calories: Math.round(proteinCalories),
        percent: Math.round(proteinRatio * 100)
      },
      carbs: {
        grams: Math.round(carbsCalories / 4),
        calories: Math.round(carbsCalories),
        percent: Math.round(carbsRatio * 100)
      },
      fat: {
        grams: Math.round(fatCalories / 9),
        calories: Math.round(fatCalories),
        percent: Math.round(fatRatio * 100)
      }
    };
  },

  /**
   * Calculates Daily Recommended Water Intake (in Liters)
   * @param {number} weightKg - Weight in kg
   * @param {string} activityLevel - Activity level
   * @returns {number} Water intake in liters (1 decimal place)
   */
  calculateWaterIntake(weightKg, activityLevel) {
    if (!weightKg || weightKg <= 0) return 2.5;
    let baseLiters = weightKg * 0.033;
    if (activityLevel === 'moderate' || activityLevel === 'active') {
      baseLiters += 0.5;
    } else if (activityLevel === 'extra_active') {
      baseLiters += 0.8;
    }
    return parseFloat(baseLiters.toFixed(1));
  },

  /**
   * Calculates Ideal Body Weight Range using BMI range 18.5 - 24.9
   * @param {number} heightCm - Height in cm
   * @returns {{ minKg: number, maxKg: number }}
   */
  calculateIdealWeightRange(heightCm) {
    if (!heightCm || heightCm <= 0) return { minKg: 0, maxKg: 0 };
    const heightM = heightCm / 100;
    const minKg = Math.round(18.5 * heightM * heightM);
    const maxKg = Math.round(24.9 * heightM * heightM);
    return { minKg, maxKg };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HealthCalculator;
}
if (typeof window !== 'undefined') {
  window.HealthCalculator = HealthCalculator;
}
