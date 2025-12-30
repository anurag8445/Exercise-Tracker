
export type ExerciseType = 'Strength' | 'Cardio' | 'Flexibility' | 'Sport' | 'HIIT';

export interface Workout {
  id: string;
  date: string;
  name: string;
  type: ExerciseType;
  duration: number;
  calories: number;
  intensity: 'Low' | 'Medium' | 'High';
  notes?: string;
}

export interface UserStats {
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  streakDays: number;
}

export interface AICoachResponse {
  analysis: string;
  recommendations: string[];
  encouragement: string;
}

export type FitnessGoal = 'Muscle Gain' | 'Weight Loss' | 'Endurance' | 'General Fitness';
export type FitnessLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface PlannedWorkout {
  day: string;
  title: string;
  description: string;
  duration: number;
  type: ExerciseType;
}

export interface WorkoutPlan {
  goal: FitnessGoal;
  level: FitnessLevel;
  schedule: PlannedWorkout[];
  tips: string[];
}
