# FitAI - AI Health & Fitness Web Application

An intelligent, interactive AI Health & Fitness web application designed to compute scientific metabolic formulas, generate dynamic customized workout routines and daily meal plans, track daily macro/calorie consumption, and provide AI health coach advice.

## Features

- **Personalized Metabolic Calculations**:
  - Basal Metabolic Rate (BMR) via Mifflin-St Jeor formula
  - Total Daily Energy Expenditure (TDEE) based on activity multipliers
  - Target Calorie Calculation customized for Weight Loss, Extreme Deficit, Maintenance, Lean Mass Gain, or Bulking
  - Goal-oriented Macronutrient (Protein, Carbs, Fats) ratio distribution
  - Body Mass Index (BMI) & Ideal Body Weight Range estimation
  - Daily Hydration requirements calculation

- **AI 7-Day Workout Generator**:
  - Dynamically builds custom weekly workout splits based on user goals, experience level, and equipment (bodyweight, dumbbells, or full gym)
  - Full details including exercises, sets, reps, estimated calories burned, and target muscle groups

- **AI Meal Planner & Calorie Log**:
  - Recommends tailored recipe plans for Breakfast, Lunch, Dinner, and Snacks matching dietary preferences (Balanced, High Protein, Keto, Vegetarian, Vegan)
  - Interactive daily meal logger to track calories and macros in real-time

- **AI Health Coach Chatbot**:
  - Interactive health coach assistant offering fitness, form, nutrition, and recovery advice with instant answers and pre-set quick prompts

- **Persistent Storage & Responsive Theme**:
  - Built-in `LocalStorage` persistence with memory fallback
  - Responsive layout for desktop and mobile devices
  - Modern Dark / Light Mode toggle

## Getting Started

### Prerequisites
Node.js v18+ (for running automated tests).

### Run Tests
To run the automated test suite:
```bash
npm test
```

### Run Web Application Locally
To serve the web application locally:
```bash
npm start
```
Or simply open `index.html` in any web browser.
