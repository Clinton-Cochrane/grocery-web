import { Recipe } from '@/models/recipe';
import axios from 'axios';
const API_BASE_URL = process.env.API_BASE_URL;


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

export const createRecipe = async (recipe: Recipe) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/recipes`, recipe);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRecipe = async (id: string, recipe: Recipe) => {
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