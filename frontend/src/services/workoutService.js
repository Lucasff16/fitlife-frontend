import api from './api';

// Get all workouts with optional pagination
export const getWorkouts = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/workouts?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
};

// Get a single workout by ID
export const getWorkoutById = async (id) => {
  try {
    const response = await api.get(`/workouts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching workout with ID ${id}:`, error);
    throw error;
  }
};

// Create a new workout
export const createWorkout = async (workoutData) => {
  try {
    const response = await api.post('/workouts', workoutData);
    return response.data;
  } catch (error) {
    console.error('Error creating workout:', error);
    throw error;
  }
};

// Update an existing workout
export const updateWorkout = async (id, workoutData) => {
  try {
    const response = await api.put(`/workouts/${id}`, workoutData);
    return response.data;
  } catch (error) {
    console.error(`Error updating workout with ID ${id}:`, error);
    throw error;
  }
};

// Delete a workout
export const deleteWorkout = async (id) => {
  try {
    const response = await api.delete(`/workouts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting workout with ID ${id}:`, error);
    throw error;
  }
};

// Update workout status (scheduled, in_progress, completed)
export const updateWorkoutStatus = async (id, status) => {
  try {
    const response = await api.patch(`/workouts/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for workout with ID ${id}:`, error);
    throw error;
  }
}; 