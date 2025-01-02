import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setRecipes } from '@/redux/recipeSlice';
import { getRecipes } from '@/services/api';

const useFetchRecipes = (
	dispatchState: React.Dispatch<any>,
	getCurrentRecipes: () => any[] // Pass a function instead of the recipes array
) => {
	const dispatch = useDispatch();

	const fetchRecipes = useCallback(
		async (currentPage: number, pageSize: number, search: string, difficulty: string) => {
			dispatchState({ type: 'SET_LOADING', payload: true });
			try {
				const { recipes: fetchedRecipes, totalPages: fetchedTotalPages } = await getRecipes(
					currentPage,
					pageSize,
					search,
					difficulty
				);

				const currentRecipes = getCurrentRecipes(); // Get recipes dynamically
				dispatch(setRecipes(currentPage === 1 ? fetchedRecipes : [...currentRecipes, ...fetchedRecipes]));
				dispatchState({ type: 'SET_TOTAL_PAGES', payload: fetchedTotalPages });
				dispatchState({ type: 'SET_PAGE', payload: currentPage });
			} catch (error) {
				console.error('Fetch failed:', error);
				dispatchState({ type: 'SET_ERROR', payload: 'Failed to fetch recipes. Please try again.' });
			} finally {
				dispatchState({ type: 'SET_LOADING', payload: false });
			}
		},
		[dispatch, dispatchState, getCurrentRecipes] // Use the function instead of recipes array
	);

	return fetchRecipes;
};

export default useFetchRecipes;
