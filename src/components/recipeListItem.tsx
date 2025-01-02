import React from 'react';
import { Recipe } from '@/models/recipe';
import { useDispatch } from 'react-redux';
import { deleteRecipe } from '@/redux/recipeSlice';
import { deleteRecipe as deleteRecipeApi } from '@/services/api';

interface RecipeListItemProps {
	recipe: Recipe;
	isSelected: boolean;
	toggleSelect: (id: string) => void;
}

const RecipeListItem: React.FC<RecipeListItemProps> = React.memo(({ recipe, isSelected, toggleSelect }) => {
	const dispatch = useDispatch();

	const handleDelete = async () => {
		if (confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
			try {
				await deleteRecipeApi(recipe._id); // Delete from backend
				dispatch(deleteRecipe(recipe._id)); // Update Redux state
				console.log(`Recipe "${recipe.title}" deleted successfully.`);
			} catch (error) {
				console.error('Failed to delete recipe:', error);
				alert('Failed to delete recipe. Please try again.');
			}
		}
	};

	return (
		<div className="border p-4 m-5 rounded shadow max-w-4xl">
	{/* First Row */}
	<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
		<h3 className="text-lg font-bold">{recipe.title}</h3>
		<div className="flex flex-col items-end gap-2">
			<div className="flex gap-2">
				<button
					className={`px-4 py-2 rounded ${
						isSelected ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
					}`}
					onClick={() => toggleSelect(recipe._id)}
				>
					{isSelected ? 'Remove From Cart' : 'Add To Cart'}
				</button>
				<button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={handleDelete}>
					Delete Recipe
				</button>
			</div>			
		</div>
	</div>

	{/* Second Row */}
	<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
		<div>
			<p >Utensils: {recipe.utensils || 'Unknown'}</p>
			<p>Total Time: {recipe['total time'] || 'N/A'}</p>
		</div>
        <div className="flex flex-col items-end">
				<p>Difficulty: {recipe.difficulty || 'Unknown'}</p>
				<p>Ingredient Count: {recipe.ingredients.length || 'unknown something went wrong'}</p>
			</div>
	</div>
</div>

	);
});

export default RecipeListItem;
