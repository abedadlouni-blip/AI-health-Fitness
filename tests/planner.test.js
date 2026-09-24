const test = require('node:test');
const assert = require('node:assert');
const AIPlanner = require('../js/planner.js');

test('AIPlanner - generateWorkoutPlan', (t) => {
  const profile = {
    goal: 'weight_loss',
    fitnessLevel: 'intermediate',
    equipmentPreference: 'all'
  };

  const plan = AIPlanner.generateWorkoutPlan(profile);
  assert.strictEqual(plan.length, 7); // 7 day schedule
  assert.strictEqual(plan[0].day, 'Monday');

  const restDay = plan.find(d => d.isRestDay);
  assert.ok(restDay);
  assert.strictEqual(restDay.exercises.length, 0);

  const workoutDay = plan.find(d => !d.isRestDay);
  assert.ok(workoutDay);
  assert.ok(workoutDay.exercises.length > 0);
  assert.ok(workoutDay.estimatedDurationMins > 0);
  assert.ok(workoutDay.estimatedBurnKcal > 0);
});

test('AIPlanner - generateMealPlan', (t) => {
  const mealPlan = AIPlanner.generateMealPlan(2000, 'high_protein');
  assert.ok(mealPlan.meals.breakfast);
  assert.ok(mealPlan.meals.lunch);
  assert.ok(mealPlan.meals.dinner);
  assert.ok(mealPlan.meals.snack);

  assert.ok(mealPlan.totals.calories > 0);
  assert.ok(mealPlan.totals.protein > 0);
});

test('AIPlanner - getAICoachResponse', (t) => {
  const profile = { name: 'Alex', goal: 'weight_loss' };

  const greeting = AIPlanner.getAICoachResponse('Hello fit coach!', profile);
  assert.ok(greeting.includes('Alex'));

  const proteinMsg = AIPlanner.getAICoachResponse('How much protein should I eat?', profile);
  assert.ok(proteinMsg.includes('protein'));

  const waterMsg = AIPlanner.getAICoachResponse('How much water should I drink?', profile);
  assert.ok(waterMsg.includes('Hydration'));
});
