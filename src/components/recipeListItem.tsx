import React from 'react';
import { Recipe } from '@/models/recipe';
import { useDispatch } from 'react-redux';
import { deleteRecipe } from '@/redux/recipeSlice';
import { deleteRecipe as deleteRecipeApi } from '@/services/api';
import { useRouter } from 'next/navigation';

interface RecipeListItemProps {
	recipe: Recipe;
	isSelected: boolean;
	toggleSelect: (id: string, event: React.MouseEvent) => void;
	onItemClick: (id: string) => void;
}

const RecipeListItem: React.FC<RecipeListItemProps> = React.memo(({ recipe, isSelected, toggleSelect, onItemClick }) => {
	RecipeListItem.displayName = "RecipeListItem";
	const dispatch = useDispatch();
	const router = useRouter();


	const handleDelete = async (event: React.MouseEvent) => {
		event?.stopPropagation();
		if (confirm(`Are you sure you want to delete \"${recipe.title}\"?`)) {
			try {
				await deleteRecipeApi(recipe._id); // Delete from backend
				dispatch(deleteRecipe(recipe._id)); // Update Redux state
				console.log(`Recipe \"${recipe.title}\" deleted successfully.`);
			} catch (error) {
				console.error('Failed to delete recipe:', error);
				alert('Failed to delete recipe. Please try again.');
			}
		}
	};

	return (
		<div
			className="border p-4 m-5 rounded shadow max-w-4xl bg-gray-950 flex flex-col gap-4"
			onClick={(e) => onItemClick(recipe._id)}
		>
			{/* First Row: Title and Buttons */}
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-bold text-gray-300">{recipe.title}</h3>
				<div className="flex gap-2">
					<button
						className={`px-4 py-2 rounded ${
							isSelected ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
						}`}
						onClick={(e) => toggleSelect(recipe._id, e)}
					>
						{isSelected ? 'Remove' : 'Add'}
					</button>
					<button
						className="px-4 py-2 bg-gray-500 text-white rounded"
						onClick={handleDelete}
					>
						Delete
					</button>
				</div>
			</div>

			{/* Second Row: Total Time and Difficulty */}
			<div className="flex justify-between">
				<p className="text-sm text-gray-600">Total Time: {recipe['total time'] || 'N/A'}</p>
				<p className="text-sm text-gray-600">Difficulty: {recipe.difficulty || 'Unknown'}</p>
			</div>

			{/* Third Row: Utensils */}
			<p className="text-sm text-gray-600">Utensils: {recipe.utensils || 'Unknown'}</p>
		</div>
	);
});

export default RecipeListItem;
