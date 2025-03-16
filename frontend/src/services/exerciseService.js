import api from './api';

// Get all exercises with optional pagination and filtering
export const getExercises = async (params = {}) => {
  try {
    const response = await api.get('/exercises', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};

// Get a single exercise by ID
export const getExerciseById = async (id) => {
  try {
    const response = await api.get(`/exercises/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercise with ID ${id}:`, error);
    throw error;
  }
};

// Create a new exercise
export const createExercise = async (exerciseData) => {
  try {
    // Use FormData if there's an image to upload
    if (exerciseData.image instanceof File) {
      const formData = new FormData();
      
      // Append all exercise data to FormData
      Object.keys(exerciseData).forEach(key => {
        formData.append(key, exerciseData[key]);
      });
      
      const response = await api.post('/exercises', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Regular JSON request if no file is being uploaded
      const response = await api.post('/exercises', exerciseData);
      return response.data;
    }
  } catch (error) {
    console.error('Error creating exercise:', error);
    throw error;
  }
};

// Update an existing exercise
export const updateExercise = async (id, exerciseData) => {
  try {
    // Use FormData if there's an image to upload
    if (exerciseData.image instanceof File) {
      const formData = new FormData();
      
      // Append all exercise data to FormData
      Object.keys(exerciseData).forEach(key => {
        formData.append(key, exerciseData[key]);
      });
      
      const response = await api.put(`/exercises/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Regular JSON request if no file is being uploaded
      const response = await api.put(`/exercises/${id}`, exerciseData);
      return response.data;
    }
  } catch (error) {
    console.error(`Error updating exercise with ID ${id}:`, error);
    throw error;
  }
};

// Delete an exercise
export const deleteExercise = async (id) => {
  try {
    const response = await api.delete(`/exercises/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting exercise with ID ${id}:`, error);
    throw error;
  }
};

// Get exercises by muscle group
export const getExercisesByGroup = async (group) => {
  try {
    const response = await api.get(`/exercises/group/${group}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercises for group ${group}:`, error);
    throw error;
  }
}; 