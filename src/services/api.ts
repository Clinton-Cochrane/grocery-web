import axios from 'axios';
const API_BASE_URL = process.env.API_BASE_URL;

interface recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  description?: string;
  total_time?: string;
  prep_time?: string;
  difficulty?: string;
  url?: string;
  saturated_fat?: string;
  fat?: string;
  calories?: string;
  carbohydrate?: string;
  sugar?: string;
  fiber?: string;
  protein?: string;
  cholesterol?: string;
  sodium?: string;
  utensils?: string;
}

export const getRecipes = async (
  newPage: number,
  pageSize: number,
  searchTerm: string,
  difficulty: string,
  ingredient: string,
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes`, {
      params: {
        page: newPage,
        pageSize,
        search: searchTerm,
        difficulty,
        ingredient,
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:");
    throw error;
  }
};

export const createRecipe = async (recipe: recipe) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/recipes`, recipe);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRecipe = async (id: string, recipe: recipe) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/recipes/${id}`, recipe);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRecipe = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/recipes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecipeById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};