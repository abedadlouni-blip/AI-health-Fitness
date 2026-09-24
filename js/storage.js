/**
 * AI Health & Fitness - Data & Storage Management Module
 * Manages user profile, daily logs, workout status, and persistent storage.
 */

const STORAGE_KEYS = {
  USER_PROFILE: 'ai_health_user_profile',
  DAILY_LOGS: 'ai_health_daily_logs',
  WORKOUT_STATUS: 'ai_health_workout_status',
  CUSTOM_MEALS: 'ai_health_custom_meals',
  CHAT_HISTORY: 'ai_health_chat_history'
};

const StorageManager = {
  // Memory fallback if localStorage is disabled or unavailable
  memoryStore: {},

  /**
   * Safe getter for local storage
   */
  getItem(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
    } catch (e) {
      console.warn('LocalStorage error, using memory fallback', e);
    }
    return this.memoryStore[key] ? JSON.parse(JSON.stringify(this.memoryStore[key])) : null;
  },

  /**
   * Safe setter for local storage
   */
  setItem(key, value) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.warn('LocalStorage error, saving to memory fallback', e);
    }
    this.memoryStore[key] = JSON.parse(JSON.stringify(value));
  },

  /**
   * Gets default profile values
   */
  getDefaultProfile() {
    return {
      name: 'Alex Developer',
      age: 28,
      gender: 'male',
      weight: 75, // kg
      height: 178, // cm
      activityLevel: 'moderate',
      goal: 'weight_loss',
      dietaryPreference: 'balanced', // balanced, vegan, keto, high_protein, vegetarian
      fitnessLevel: 'intermediate', // beginner, intermediate, advanced
      createdDate: new Date().toISOString()
    };
  },

  /**
   * Load or initialize User Profile
   */
  getUserProfile() {
    const profile = this.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!profile) {
      const defaultProfile = this.getDefaultProfile();
      this.setUserProfile(defaultProfile);
      return defaultProfile;
    }
    return profile;
  },

  /**
   * Save User Profile
   */
  setUserProfile(profileData) {
    const current = this.getUserProfile() || {};
    const updated = { ...current, ...profileData, lastUpdated: new Date().toISOString() };
    this.setItem(STORAGE_KEYS.USER_PROFILE, updated);
    return updated;
  },

  /**
   * Get formatted Date string (YYYY-MM-DD)
   */
  getTodayKey(date = new Date()) {
    return date.toISOString().split('T')[0];
  },

  /**
   * Get Daily Logs (Meals, Water, Workouts, Weight)
   */
  getDailyLogs() {
    return this.getItem(STORAGE_KEYS.DAILY_LOGS) || {};
  },

  /**
   * Get Log for a Specific Date
   */
  getLogForDate(dateStr = this.getTodayKey()) {
    const logs = this.getDailyLogs();
    if (!logs[dateStr]) {
      return {
        date: dateStr,
        caloriesConsumed: 0,
        proteinConsumed: 0,
        carbsConsumed: 0,
        fatConsumed: 0,
        waterGlasses: 0, // 250ml per glass
        workoutCompleted: false,
        weightLogged: null,
        mealsLogged: []
      };
    }
    return logs[dateStr];
  },

  /**
   * Save Daily Log for a Specific Date
   */
  saveDailyLog(logData, dateStr = this.getTodayKey()) {
    const logs = this.getDailyLogs();
    logs[dateStr] = { ...this.getLogForDate(dateStr), ...logData, date: dateStr };
    this.setItem(STORAGE_KEYS.DAILY_LOGS, logs);
    return logs[dateStr];
  },

  /**
   * Log a consumed meal item
   */
  addMealToLog(mealItem, dateStr = this.getTodayKey()) {
    const currentLog = this.getLogForDate(dateStr);
    const mealsLogged = currentLog.mealsLogged || [];
    mealsLogged.push({
      id: 'meal_' + Date.now(),
      name: mealItem.name,
      calories: Number(mealItem.calories) || 0,
      protein: Number(mealItem.protein) || 0,
      carbs: Number(mealItem.carbs) || 0,
      fat: Number(mealItem.fat) || 0,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    const newCalories = mealsLogged.reduce((sum, m) => sum + m.calories, 0);
    const newProtein = mealsLogged.reduce((sum, m) => sum + m.protein, 0);
    const newCarbs = mealsLogged.reduce((sum, m) => sum + m.carbs, 0);
    const newFat = mealsLogged.reduce((sum, m) => sum + m.fat, 0);

    return this.saveDailyLog({
      mealsLogged,
      caloriesConsumed: newCalories,
      proteinConsumed: newProtein,
      carbsConsumed: newCarbs,
      fatConsumed: newFat
    }, dateStr);
  },

  /**
   * Delete a meal from daily log
   */
  removeMealFromLog(mealId, dateStr = this.getTodayKey()) {
    const currentLog = this.getLogForDate(dateStr);
    const mealsLogged = (currentLog.mealsLogged || []).filter(m => m.id !== mealId);

    const newCalories = mealsLogged.reduce((sum, m) => sum + m.calories, 0);
    const newProtein = mealsLogged.reduce((sum, m) => sum + m.protein, 0);
    const newCarbs = mealsLogged.reduce((sum, m) => sum + m.carbs, 0);
    const newFat = mealsLogged.reduce((sum, m) => sum + m.fat, 0);

    return this.saveDailyLog({
      mealsLogged,
      caloriesConsumed: newCalories,
      proteinConsumed: newProtein,
      carbsConsumed: newCarbs,
      fatConsumed: newFat
    }, dateStr);
  },

  /**
   * Update Water Glasses Intake
   */
  updateWaterGlasses(delta, dateStr = this.getTodayKey()) {
    const currentLog = this.getLogForDate(dateStr);
    const currentGlasses = currentLog.waterGlasses || 0;
    const newGlasses = Math.max(0, currentGlasses + delta);
    return this.saveDailyLog({ waterGlasses: newGlasses }, dateStr);
  },

  /**
   * Get Chat Messages History
   */
  getChatHistory() {
    return this.getItem(STORAGE_KEYS.CHAT_HISTORY) || [
      {
        sender: 'ai',
        text: 'Hello! I am your AI Health & Fitness Coach. Ask me anything about workout routines, meal ideas, macro splitting, or lifestyle habits!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  },

  /**
   * Add a Chat Message to History
   */
  addChatMessage(sender, text) {
    const history = this.getChatHistory();
    history.push({
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    this.setItem(STORAGE_KEYS.CHAT_HISTORY, history);
    return history;
  },

  /**
   * Reset all user data
   */
  resetAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(key);
        }
      } catch (e) {}
    });
    this.memoryStore = {};
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
}
if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
}
