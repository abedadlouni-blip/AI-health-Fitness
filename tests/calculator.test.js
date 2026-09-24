const test = require('node:test');
const assert = require('node:assert');
const HealthCalculator = require('../js/calculator.js');

test('HealthCalculator - calculateBMI', (t) => {
  const result = HealthCalculator.calculateBMI(75, 178);
  assert.strictEqual(result.bmi, 23.7);
  assert.strictEqual(result.category, 'Normal weight');

  const underweight = HealthCalculator.calculateBMI(50, 180);
  assert.strictEqual(underweight.category, 'Underweight');

  const overweight = HealthCalculator.calculateBMI(90, 175);
  assert.strictEqual(overweight.category, 'Overweight');

  const invalid = HealthCalculator.calculateBMI(0, 0);
  assert.strictEqual(invalid.category, 'Unknown');
});

test('HealthCalculator - calculateBMR', (t) => {
  // Male Mifflin-St Jeor: (10*75) + (6.25*178) - (5*28) + 5 = 750 + 1112.5 - 140 + 5 = 1727.5 -> 1728
  const bmrMale = HealthCalculator.calculateBMR(75, 178, 28, 'male');
  assert.strictEqual(bmrMale, 1728);

  // Female Mifflin-St Jeor: (10*60) + (6.25*165) - (5*25) - 161 = 600 + 1031.25 - 125 - 161 = 1345.25 -> 1345
  const bmrFemale = HealthCalculator.calculateBMR(60, 165, 25, 'female');
  assert.strictEqual(bmrFemale, 1345);

  const invalidBMR = HealthCalculator.calculateBMR(0, 170, 25, 'male');
  assert.strictEqual(invalidBMR, 0);
});

test('HealthCalculator - calculateTDEE', (t) => {
  const bmr = 1728;
  const tdeeSedentary = HealthCalculator.calculateTDEE(bmr, 'sedentary');
  assert.strictEqual(tdeeSedentary, Math.round(1728 * 1.2));

  const tdeeModerate = HealthCalculator.calculateTDEE(bmr, 'moderate');
  assert.strictEqual(tdeeModerate, Math.round(1728 * 1.55));
});

test('HealthCalculator - calculateTargetCalories', (t) => {
  const tdee = 2500;
  assert.strictEqual(HealthCalculator.calculateTargetCalories(tdee, 'weight_loss'), 2000);
  assert.strictEqual(HealthCalculator.calculateTargetCalories(tdee, 'extreme_loss'), 1750);
  assert.strictEqual(HealthCalculator.calculateTargetCalories(tdee, 'maintenance'), 2500);
  assert.strictEqual(HealthCalculator.calculateTargetCalories(tdee, 'muscle_gain'), 2800);
  assert.strictEqual(HealthCalculator.calculateTargetCalories(tdee, 'aggressive_gain'), 3000);
});

test('HealthCalculator - calculateMacros', (t) => {
  const macros = HealthCalculator.calculateMacros(2000, 'weight_loss', 75);
  // Weight loss: 35% protein (700 kcal / 4 = 175g), 35% carbs (175g), 30% fat (600 kcal / 9 = 67g)
  assert.strictEqual(macros.protein.grams, 175);
  assert.strictEqual(macros.carbs.grams, 175);
  assert.strictEqual(macros.fat.grams, 67);
});

test('HealthCalculator - calculateWaterIntake & IdealWeight', (t) => {
  const water = HealthCalculator.calculateWaterIntake(75, 'moderate');
  assert.strictEqual(typeof water, 'number');
  assert.ok(water > 2.0);

  const idealWeight = HealthCalculator.calculateIdealWeightRange(180);
  assert.strictEqual(idealWeight.minKg, 60);
  assert.strictEqual(idealWeight.maxKg, 81);
});
