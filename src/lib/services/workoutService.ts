import { api } from "./apiService";

export interface Workout {
  id: string;
  name: string;
  date: string;
  duration: number;
  exercises: Exercise[];
  userId: string;
  // Add other fields as needed
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  // Add other fields as needed
}

/**
 * Get all workouts for the logged-in user
 */
export async function getUserWorkouts(): Promise<Workout[]> {
  return api.get<Workout[]>("/workouts");
}

/**
 * Get a specific workout by ID
 */
export async function getWorkout(id: string): Promise<Workout> {
  return api.get<Workout>(`/workouts/${id}`);
}

/**
 * Create a new workout
 */
export async function createWorkout(
  workout: Omit<Workout, "id">
): Promise<Workout> {
  return api.post<Workout>("/workouts", workout);
}

/**
 * Update an existing workout
 */
export async function updateWorkout(
  id: string,
  workout: Partial<Workout>
): Promise<Workout> {
  return api.put<Workout>(`/workouts/${id}`, workout);
}

/**
 * Delete a workout
 */
export async function deleteWorkout(id: string): Promise<void> {
  return api.delete(`/workouts/${id}`);
}
