import { api } from './apiService';

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface Workout {
  _id: string;
  name: string;
  exercises: Exercise[];
}

/**
 * Get workouts for a specific user
 */
export async function getUserWorkouts(username: string): Promise<Workout[]> {
  return api.get<Workout[]>(`/users/${username}/workouts`);
}

/**
 * Get a specific workout by ID
 */
export async function getWorkout(workoutId: string): Promise<Workout> {
  return api.get<Workout>(`/workouts/${workoutId}`);
}

/**
 * Create a new workout
 */
export async function createWorkout(workoutData: Omit<Workout, '_id'>): Promise<Workout> {
  return api.post<Workout>('/workouts', workoutData);
}

/**
 * Update an existing workout
 */
export async function updateWorkout(
  workoutId: string,
  workoutData: Partial<Workout>
): Promise<Workout> {
  return api.put<Workout>(`/workouts/${workoutId}`, workoutData);
}

/**
 * Delete a workout
 */
export async function deleteWorkout(workoutId: string): Promise<{ message: string }> {
  return api.delete<{ message: string }>(`/workouts/${workoutId}`);
}
