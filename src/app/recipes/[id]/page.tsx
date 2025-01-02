'use client';

import { createRecipe, getRecipeById, updateRecipe } from '@/services/api';
import { ErrorMessage } from '@/components/customError';
import RecipeForm from '@/components/recipeForm';
import { useEffect, useState } from 'react';
import Spinner from '@/components/spinner';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Recipe } from '@/models/recipe';
import { useRouter, useParams } from 'next/navigation';

enum pageModeType {
	ADD = 'ADD',
	EDIT = 'EDIT',
	VIEW = 'VIEW',
}

const RecipePage = () => {
	const router = useRouter();
	const { id } = useParams();
	const [loading, setLoading] = useState(false);
	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const recipes = useSelector((state: RootState) => state.recipes.recipes);
	const [pageMode, setPageMode] = useState<pageModeType>(pageModeType.EDIT);

	useEffect(() => {
		if (!id) return;
		if (id === pageModeType.ADD) setPageMode(pageModeType.ADD);
		else {
			const existingRecipe = recipes.find((r) => r._id === id);
			if (existingRecipe) {
				setRecipe(existingRecipe);
				setPageMode(pageModeType.VIEW);
			}
		}
	}, [id, recipes]);

	const handleSave = async (updatedRecipe: Recipe) => {
		setLoading(true);
		try {
			pageMode === pageModeType.ADD
				? await createRecipe(updatedRecipe)
				: await updateRecipe(updatedRecipe._id, updatedRecipe);
			router.push('/recipes');
		} catch (error) {
			<ErrorMessage message={error + ''} />;
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <Spinner />;

	return (
		<div>
			{(pageMode === pageModeType.EDIT || pageMode === pageModeType.ADD) && (
				<RecipeForm recipe={recipe} onSave={handleSave} onCancel={() => router.back()} />
			)}
			{pageMode === pageModeType.VIEW && recipe && (
				<div>
					<h1>{recipe.title}</h1>
					<p>Description: {recipe.description || 'N/A'}</p>
					<p>Total Time: {recipe['total time'] || 'N/A'}</p>
					<p>Difficulty: {recipe.difficulty || 'Unknown'}</p>
					<p>Utensils: {recipe.utensils || 'None'}</p>

					<h2>Ingredients:</h2>
					{recipe.ingredients.length === 0 ? (
						<p>No ingredients available.</p>
					) : (
						<ul>
							{recipe.ingredients.map((ingredient, index) => (
								<li key={index}>{ingredient}</li>
							))}
						</ul>
					)}

					<h2>Instructions:</h2>
					{recipe.instructions && (recipe.instructions.length === 0 ? (
						<p> No Instructions on this one</p>
					) : (
						<ol>
							{recipe.instructions.map((instruction, index) => (
								<li key={instruction.key || index}>{instruction.value}</li>
							))}
						</ol>
					))}

					<h2>Nutritional Information:</h2>
					<ul>
						<li>Fat: {recipe.fat || 'N/A'}</li>
						<li>Sugar: {recipe.sugar || 'N/A'}</li>
						<li>Fiber: {recipe.fiber || 'N/A'}</li>
						<li>Sodium: {recipe.sodium || 'N/A'}</li>
						<li>Protein: {recipe.protein || 'N/A'}</li>
						<li>Calories: {recipe.calories || 'N/A'}</li>
						<li>Cholesterol: {recipe.cholesterol || 'N/A'}</li>
						<li>Carbohydrate: {recipe.carbohydrate || 'N/A'}</li>
						<li>Saturated Fat: {recipe.saturated_fat || 'N/A'}</li>
					</ul>
					<button onClick={() => setPageMode(pageModeType.EDIT)}>Edit</button>
				</div>
			)}
		</div>
	);
};

export default RecipePage;
