export const dayColors = ["#e03030", "#1a6ebd", "#16a34a", "#8b1a8b", "#f59e0b", "#06b6d4", "#6b7280"];
export const dayNames = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export const schedules = {
  bulking: [
    { day: "Senin",  focus: "Chest & Triceps",  exercises: ["Bench Press", "Incline DB Press", "Tricep Dips"] },
    { day: "Selasa", focus: "Back & Biceps",    exercises: ["Deadlift", "Barbell Row", "Bicep Curl"] },
    { day: "Rabu",   focus: "Rest Day",         exercises: ["Stretching", "Light Walk"] },
    { day: "Kamis",  focus: "Shoulders & Abs",  exercises: ["OHP", "Lateral Raise", "Plank"] },
    { day: "Jumat",  focus: "Legs",             exercises: ["Squat", "Leg Press", "Calf Raise"] },
    { day: "Sabtu",  focus: "Full Body",        exercises: ["Clean & Press", "Pull-ups", "Lunges"] },
    { day: "Minggu", focus: "Rest Day",         exercises: ["Recovery", "Foam Rolling"] },
  ],
  cutting: [
    { day: "Senin",  focus: "HIIT Cardio",      exercises: ["Burpees", "Mountain Climbers", "Jump Squats"] },
    { day: "Selasa", focus: "Upper Body",       exercises: ["Push-ups", "DB Row", "Shoulder Press"] },
    { day: "Rabu",   focus: "Cardio",           exercises: ["Running 30min", "Jump Rope"] },
    { day: "Kamis",  focus: "Lower Body",       exercises: ["Squats", "Lunges", "Calf Raise"] },
    { day: "Jumat",  focus: "HIIT + Core",      exercises: ["Plank", "Russian Twist", "Sprints"] },
    { day: "Sabtu",  focus: "Active Recovery",  exercises: ["Yoga", "Light Jog"] },
    { day: "Minggu", focus: "Rest Day",         exercises: ["Stretching"] },
  ],
  maintenance: [
    { day: "Senin",  focus: "Push Day",         exercises: ["Bench Press", "OHP", "Tricep Extension"] },
    { day: "Selasa", focus: "Pull Day",         exercises: ["Pull-ups", "Barbell Row", "Bicep Curl"] },
    { day: "Rabu",   focus: "Cardio",           exercises: ["Running 20min", "Cycling"] },
    { day: "Kamis",  focus: "Legs",             exercises: ["Squat", "Leg Curl", "Calf Raise"] },
    { day: "Jumat",  focus: "Full Body",        exercises: ["Deadlift", "Dips", "Plank"] },
    { day: "Sabtu",  focus: "Light Cardio",     exercises: ["Swimming", "Walking"] },
    { day: "Minggu", focus: "Rest Day",         exercises: ["Rest & Recover"] },
  ],
};
