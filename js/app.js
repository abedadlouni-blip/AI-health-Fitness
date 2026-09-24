/**
 * AI Health & Fitness - Main Application Controller
 * Handles UI interactions, tab switching, form submissions, state sync, and real-time UI updates.
 */

function initApp() {
  // Initialize State
  let userProfile = StorageManager.getUserProfile();
  let currentLog = StorageManager.getLogForDate();
  let workoutPlan = AIPlanner.generateWorkoutPlan(userProfile);
  let mealPlan = AIPlanner.generateMealPlan(
    HealthCalculator.calculateTargetCalories(
      HealthCalculator.calculateTDEE(
        HealthCalculator.calculateBMR(userProfile.weight, userProfile.height, userProfile.age, userProfile.gender),
        userProfile.activityLevel
      ),
      userProfile.goal
    ),
    userProfile.dietaryPreference
  );

  // Initialize UI Views
  initNavigation();
  initThemeToggle();
  populateProfileForm();
  renderCalculatedMetrics();
  renderDashboard();
  renderWorkoutPlan();
  renderMealPlan();
  renderMealLog();
  renderChatHistory();

  // Event Listeners
  setupFormListeners();
  setupWaterListeners();
  setupChatListeners();

  /**
   * Tab Navigation Setup
   */
  function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        navButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const activeContent = document.getElementById(targetTab);
        if (activeContent) activeContent.classList.add('active');
      });
    });

    const quickLogBtn = document.getElementById('quickLogBtn');
    if (quickLogBtn) {
      quickLogBtn.addEventListener('click', () => {
        const nutritionNav = document.querySelector('[data-tab="nutrition"]');
        if (nutritionNav) nutritionNav.click();
        const mealInput = document.getElementById('mealName');
        if (mealInput) mealInput.focus();
      });
    }
  }

  /**
   * Theme Dark/Light Mode Toggle
   */
  function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    const isDark = StorageManager.getItem('ai_health_dark_theme') || false;

    if (isDark) {
      document.body.setAttribute('data-theme', 'dark');
      if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const currentlyDark = document.body.getAttribute('data-theme') === 'dark';
        if (currentlyDark) {
          document.body.removeAttribute('data-theme');
          themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
          StorageManager.setItem('ai_health_dark_theme', false);
        } else {
          document.body.setAttribute('data-theme', 'dark');
          themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
          StorageManager.setItem('ai_health_dark_theme', true);
        }
      });
    }
  }

  /**
   * Populate Profile Form with Storage Data
   */
  function populateProfileForm() {
    document.getElementById('userName').value = userProfile.name || '';
    document.getElementById('userAge').value = userProfile.age || 25;
    document.getElementById('userGender').value = userProfile.gender || 'male';
    document.getElementById('userWeight').value = userProfile.weight || 70;
    document.getElementById('userHeight').value = userProfile.height || 175;
    document.getElementById('userActivity').value = userProfile.activityLevel || 'moderate';
    document.getElementById('userGoal').value = userProfile.goal || 'weight_loss';
    document.getElementById('userDiet').value = userProfile.dietaryPreference || 'balanced';
    document.getElementById('userLevel').value = userProfile.fitnessLevel || 'intermediate';
  }

  /**
   * Render Calculated Metrics in Profile & Dashboard
   */
  function renderCalculatedMetrics() {
    const bmiData = HealthCalculator.calculateBMI(userProfile.weight, userProfile.height);
    const bmr = HealthCalculator.calculateBMR(userProfile.weight, userProfile.height, userProfile.age, userProfile.gender);
    const tdee = HealthCalculator.calculateTDEE(bmr, userProfile.activityLevel);
    const targetCals = HealthCalculator.calculateTargetCalories(tdee, userProfile.goal);
    const macros = HealthCalculator.calculateMacros(targetCals, userProfile.goal, userProfile.weight);
    const waterLiters = HealthCalculator.calculateWaterIntake(userProfile.weight, userProfile.activityLevel);
    const idealWeight = HealthCalculator.calculateIdealWeightRange(userProfile.height);

    // Profile Tab Updates
    document.getElementById('profileBmiVal').textContent = `${bmiData.bmi} (${bmiData.category})`;
    document.getElementById('profileBmiCat').textContent = bmiData.healthRisk;
    document.getElementById('profileIdealWeightVal').textContent = `${idealWeight.minKg} kg - ${idealWeight.maxKg} kg`;
    document.getElementById('profileBmrVal').textContent = `${bmr.toLocaleString()} kcal/day`;
    document.getElementById('profileTdeeVal').textContent = `${tdee.toLocaleString()} kcal/day`;
    document.getElementById('profileTargetVal').textContent = `${targetCals.toLocaleString()} kcal/day`;
    document.getElementById('profileProteinMacro').textContent = `Protein: ${macros.protein.grams}g (${macros.protein.percent}%)`;
    document.getElementById('profileCarbsMacro').textContent = `Carbs: ${macros.carbs.grams}g (${macros.carbs.percent}%)`;
    document.getElementById('profileFatMacro').textContent = `Fat: ${macros.fat.grams}g (${macros.fat.percent}%)`;

    // Dashboard Updates
    document.getElementById('welcomeGreeting').textContent = `Welcome back, ${userProfile.name}! 👋`;
    document.getElementById('welcomeGoalText').innerHTML = `Your goal is set to <strong>${userProfile.goal.replace('_', ' ').toUpperCase()}</strong>. Here is your daily summary.`;

    document.getElementById('dashBmiValue').textContent = bmiData.bmi;
    document.getElementById('dashBmiCategory').textContent = bmiData.category;
    document.getElementById('dashBmrValue').innerHTML = `${bmr.toLocaleString()} <small>kcal</small>`;
    document.getElementById('dashTdeeValue').innerHTML = `${tdee.toLocaleString()} <small>kcal</small>`;
    document.getElementById('dashTargetCalValue').innerHTML = `${targetCals.toLocaleString()} <small>kcal</small>`;

    const adj = HealthCalculator.goalAdjustments[userProfile.goal] || 0;
    document.getElementById('dashCalorieDeficitLabel').textContent = adj === 0 ? 'Maintenance Goal' : `${adj > 0 ? '+' : ''}${adj} kcal Adjustment`;

    document.getElementById('targetWaterLiters').textContent = `${waterLiters} L`;
    document.getElementById('targetWaterGlasses').textContent = Math.round(waterLiters * 4);
  }

  /**
   * Render Dashboard Progress Bars and Summary
   */
  function renderDashboard() {
    currentLog = StorageManager.getLogForDate();
    const bmr = HealthCalculator.calculateBMR(userProfile.weight, userProfile.height, userProfile.age, userProfile.gender);
    const tdee = HealthCalculator.calculateTDEE(bmr, userProfile.activityLevel);
    const targetCals = HealthCalculator.calculateTargetCalories(tdee, userProfile.goal);
    const macros = HealthCalculator.calculateMacros(targetCals, userProfile.goal, userProfile.weight);

    const consumed = currentLog.caloriesConsumed || 0;
    const remaining = Math.max(0, targetCals - consumed);
    const calPct = Math.min(100, Math.round((consumed / targetCals) * 100));

    document.getElementById('dashConsumedCals').textContent = consumed;
    document.getElementById('dashRemainingCals').textContent = remaining;

    const calBar = document.getElementById('calorieProgressBar');
    if (calBar) {
      calBar.style.width = `${calPct}%`;
      calBar.style.backgroundColor = consumed > targetCals + 200 ? '#ef4444' : 'var(--primary)';
    }

    // Macro Bars
    const protPct = Math.min(100, Math.round(((currentLog.proteinConsumed || 0) / macros.protein.grams) * 100));
    const carbsPct = Math.min(100, Math.round(((currentLog.carbsConsumed || 0) / macros.carbs.grams) * 100));
    const fatPct = Math.min(100, Math.round(((currentLog.fatConsumed || 0) / macros.fat.grams) * 100));

    document.getElementById('proteinMacroLabel').textContent = `${currentLog.proteinConsumed || 0} / ${macros.protein.grams}g`;
    document.getElementById('carbsMacroLabel').textContent = `${currentLog.carbsConsumed || 0} / ${macros.carbs.grams}g`;
    document.getElementById('fatsMacroLabel').textContent = `${currentLog.fatConsumed || 0} / ${macros.fat.grams}g`;

    document.getElementById('proteinBar').style.width = `${protPct}%`;
    document.getElementById('carbsBar').style.width = `${carbsPct}%`;
    document.getElementById('fatsBar').style.width = `${fatPct}%`;

    // Water Count
    document.getElementById('waterGlassesCount').textContent = currentLog.waterGlasses || 0;

    // Today Workout Box
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];
    const todayWorkout = workoutPlan.find(w => w.day === todayName) || workoutPlan[0];

    const todayWorkoutCard = document.getElementById('todayWorkoutCard');
    if (todayWorkoutCard) {
      if (todayWorkout.isRestDay) {
        todayWorkoutCard.innerHTML = `
          <div style="padding:0.5rem 0; text-align:center;">
            <i class="fa-solid fa-bed" style="font-size:1.8rem; color:var(--primary); margin-bottom:0.4rem;"></i>
            <h5>Rest & Active Recovery Day</h5>
            <p style="font-size:0.8rem; color:var(--text-muted);">Focus on stretching, light walking, and muscle hydration today!</p>
          </div>
        `;
      } else {
        todayWorkoutCard.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <strong>${todayWorkout.title}</strong>
            <span class="badge protein-badge">${todayWorkout.estimatedDurationMins} Mins • ~${todayWorkout.estimatedBurnKcal} kcal</span>
          </div>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.5rem;">${todayWorkout.exercises.length} Exercises Scheduled</p>
          <ul style="font-size:0.8rem; padding-left:1.2rem;">
            ${todayWorkout.exercises.slice(0, 3).map(e => `<li>${e.name} (${e.sets} sets x ${e.reps})</li>`).join('')}
          </ul>
        `;
      }
    }
  }

  /**
   * Render AI 7-Day Workout Schedule
   */
  function renderWorkoutPlan() {
    const container = document.getElementById('workoutScheduleContainer');
    if (!container) return;

    container.innerHTML = workoutPlan.map(day => {
      if (day.isRestDay) {
        return `
          <div class="workout-card rest">
            <div class="workout-card-header">
              <h3>${day.day}</h3>
              <span class="badge">Rest Day</span>
            </div>
            <h4>${day.title}</h4>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.5rem;">Take time for active stretching, proper nutrition, and restful sleep.</p>
          </div>
        `;
      }

      return `
        <div class="workout-card">
          <div class="workout-card-header">
            <h3>${day.day}</h3>
            <span class="badge protein-badge">${day.estimatedDurationMins} min | ${day.estimatedBurnKcal} kcal</span>
          </div>
          <h4 style="margin-bottom:0.8rem; color:var(--primary);">${day.title}</h4>
          <ul class="exercise-list">
            ${day.exercises.map(ex => `
              <li class="exercise-item">
                <div class="exercise-name">
                  <span>${ex.name}</span>
                  <span>${ex.sets} × ${ex.reps}</span>
                </div>
                <div class="exercise-meta">${ex.instructions}</div>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }).join('');
  }

  /**
   * Render AI Suggested Daily Meals
   */
  function renderMealPlan() {
    const container = document.getElementById('mealPlanContainer');
    if (!container) return;

    const meals = mealPlan.meals;
    const categories = ['breakfast', 'lunch', 'dinner', 'snack'];

    container.innerHTML = categories.map(cat => {
      const item = meals[cat];
      if (!item) return '';

      return `
        <div class="meal-card">
          <h4><i class="fa-solid fa-utensils"></i> ${cat}</h4>
          <div class="meal-card-title">${item.name}</div>
          <div class="meal-card-desc">${item.description}</div>
          <div class="macro-badges">
            <span class="badge protein-badge">${item.calories} kcal</span>
            <span class="badge protein-badge">P: ${item.protein}g</span>
            <span class="badge carbs-badge">C: ${item.carbs}g</span>
            <span class="badge fat-badge">F: ${item.fat}g</span>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render Meal Log History for Today
   */
  function renderMealLog() {
    const container = document.getElementById('mealsList');
    if (!container) return;

    currentLog = StorageManager.getLogForDate();
    const meals = currentLog.mealsLogged || [];

    if (meals.length === 0) {
      container.innerHTML = '<p style="font-size:0.85rem; color:var(--text-muted); text-align:center; padding:1rem;">No meals logged for today yet.</p>';
      return;
    }

    container.innerHTML = meals.map(meal => `
      <div class="logged-meal-item">
        <div>
          <strong>${meal.name}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">
            ${meal.calories} kcal | P: ${meal.protein}g C: ${meal.carbs}g F: ${meal.fat}g (${meal.timestamp})
          </div>
        </div>
        <button class="delete-meal-btn" data-id="${meal.id}" title="Remove Meal"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    `).join('');

    // Attach delete listeners
    container.querySelectorAll('.delete-meal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        StorageManager.removeMealFromLog(id);
        renderMealLog();
        renderDashboard();
      });
    });
  }

  /**
   * Render AI Coach Chat Messages
   */
  function renderChatHistory() {
    const chatContainer = document.getElementById('chatMessages');
    if (!chatContainer) return;

    const history = StorageManager.getChatHistory();
    chatContainer.innerHTML = history.map(msg => `
      <div class="chat-bubble ${msg.sender}">
        <div>${msg.text}</div>
        <div style="font-size:0.65rem; opacity:0.7; text-align:right; margin-top:0.2rem;">${msg.timestamp}</div>
      </div>
    `).join('');

    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  /**
   * Form Submit Handlers
   */
  function setupFormListeners() {
    // Profile Form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        userProfile = StorageManager.setUserProfile({
          name: document.getElementById('userName').value,
          age: parseInt(document.getElementById('userAge').value, 10),
          gender: document.getElementById('userGender').value,
          weight: parseFloat(document.getElementById('userWeight').value),
          height: parseFloat(document.getElementById('userHeight').value),
          activityLevel: document.getElementById('userActivity').value,
          goal: document.getElementById('userGoal').value,
          dietaryPreference: document.getElementById('userDiet').value,
          fitnessLevel: document.getElementById('userLevel').value
        });

        // Regenerate Workout and Meal Plans
        workoutPlan = AIPlanner.generateWorkoutPlan(userProfile);
        const targetCals = HealthCalculator.calculateTargetCalories(
          HealthCalculator.calculateTDEE(
            HealthCalculator.calculateBMR(userProfile.weight, userProfile.height, userProfile.age, userProfile.gender),
            userProfile.activityLevel
          ),
          userProfile.goal
        );
        mealPlan = AIPlanner.generateMealPlan(targetCals, userProfile.dietaryPreference);

        renderCalculatedMetrics();
        renderDashboard();
        renderWorkoutPlan();
        renderMealPlan();

        alert('Profile and fitness goals updated successfully!');
      });
    }

    // Add Meal Form
    const addMealForm = document.getElementById('addMealForm');
    if (addMealForm) {
      addMealForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const mealItem = {
          name: document.getElementById('mealName').value,
          calories: parseInt(document.getElementById('mealCalories').value, 10),
          protein: parseInt(document.getElementById('mealProtein').value || 0, 10),
          carbs: parseInt(document.getElementById('mealCarbs').value || 0, 10),
          fat: parseInt(document.getElementById('mealFat').value || 0, 10)
        };

        StorageManager.addMealToLog(mealItem);
        addMealForm.reset();

        renderMealLog();
        renderDashboard();
      });
    }

    // Regenerate Workout Plan Button
    const regenWorkoutBtn = document.getElementById('regenerateWorkoutBtn');
    if (regenWorkoutBtn) {
      regenWorkoutBtn.addEventListener('click', () => {
        workoutPlan = AIPlanner.generateWorkoutPlan(userProfile);
        renderWorkoutPlan();
        renderDashboard();
      });
    }

    // Regenerate Meal Plan Button
    const regenMealBtn = document.getElementById('regenerateMealBtn');
    if (regenMealBtn) {
      regenMealBtn.addEventListener('click', () => {
        const targetCals = HealthCalculator.calculateTargetCalories(
          HealthCalculator.calculateTDEE(
            HealthCalculator.calculateBMR(userProfile.weight, userProfile.height, userProfile.age, userProfile.gender),
            userProfile.activityLevel
          ),
          userProfile.goal
        );
        mealPlan = AIPlanner.generateMealPlan(targetCals, userProfile.dietaryPreference);
        renderMealPlan();
      });
    }
  }

  /**
   * Hydration Water Button Controls
   */
  function setupWaterListeners() {
    const addWaterBtn = document.getElementById('addWaterBtn');
    const subWaterBtn = document.getElementById('subWaterBtn');

    if (addWaterBtn) {
      addWaterBtn.addEventListener('click', () => {
        StorageManager.updateWaterGlasses(1);
        renderDashboard();
      });
    }

    if (subWaterBtn) {
      subWaterBtn.addEventListener('click', () => {
        StorageManager.updateWaterGlasses(-1);
        renderDashboard();
      });
    }
  }

  /**
   * AI Chatbot Interaction Handlers
   */
  function setupChatListeners() {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');

    function handleSendMessage(text) {
      if (!text || text.trim() === '') return;

      // Add user message
      StorageManager.addChatMessage('user', text);
      renderChatHistory();

      if (chatInput) chatInput.value = '';

      // Generate AI Coach response after slight natural delay
      setTimeout(() => {
        const responseText = AIPlanner.getAICoachResponse(text, userProfile);
        StorageManager.addChatMessage('ai', responseText);
        renderChatHistory();
      }, 400);
    }

    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSendMessage(chatInput.value);
      });
    }

    // Quick Prompts
    document.querySelectorAll('.quick-prompt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const promptText = btn.getAttribute('data-prompt');
        handleSendMessage(promptText);
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
