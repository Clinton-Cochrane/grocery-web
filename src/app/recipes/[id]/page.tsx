import { ErrorMessage } from '@/components/customError';
import RecipeForm from '@/components/recipeForm';
import Spinner from '@/components/spinner';
import { Recipe } from '@/models/recipe';
import { RootState } from '@/redux/store';
import { createRecipe, getRecipeById, updateRecipe } from '@/services/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

enum pageModeType {
	VIEW = 'VIEW',
	EDIT = 'EDIT',
	ADD = 'ADD',
}

const RecipePage = () => {
	const [loading, setLoading] = useState(false);
	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [pageMode, setPageMode] = useState<pageModeType>(pageModeType.EDIT);

	const recipes = useSelector((state: RootState) => state.recipes);
	const dispatch = useDispatch();
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		if (!id) return;
		if (typeof id === 'string' && id === pageModeType.ADD) {
			setPageMode(pageModeType.ADD);
		} else {
			const existingRecipe = recipes.find((r) => r._id === id);
			if (existingRecipe) {
				setRecipe(existingRecipe);
				setPageMode(pageModeType.VIEW); //default to view but control edit in jsx
			}
		}
	}, [id, recipes]);

	const fetchRecipes = async (recipeId: string) => {
		setLoading(true);
		try {
			const fetchedRecipe = await getRecipeById(recipeId);
			setRecipe(fetchedRecipe);
			setPageMode(pageModeType.EDIT);
		} catch (error) {
			error && <ErrorMessage message={error + ''} />;
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async (updatedRecipe: Recipe) => {
		setLoading(true);
		try {
			if (pageMode === pageModeType.ADD) {
				await createRecipe(updatedRecipe);
			} else {
				await updateRecipe(updatedRecipe._id, updatedRecipe);
			}
			router.push('/recipes');
		} catch (error) {
			error && <ErrorMessage message={error + ''} />;
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <Spinner />;

	return (
		<div>
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
					{recipe.ingredients.length === 0 ? (
						<p> No Instructions on this one</p>
					) : (
						<ol>
							{recipe.instructions.map((instruction, index) => (
								<li key={instruction.key || index}>{instruction.value}</li>
							))}
						</ol>
					)}
					<h2>Instructions:</h2>

					<h2>Nutritional Information:</h2>
					<ul>
						<li>Saturated Fat: {recipe.saturated_fat || 'N/A'}</li>
						<li>Fat: {recipe.fat || 'N/A'}</li>
						<li>Calories: {recipe.calories || 'N/A'}</li>
						<li>Carbohydrate: {recipe.carbohydrate || 'N/A'}</li>
						<li>Sugar: {recipe.sugar || 'N/A'}</li>
						<li>Fiber: {recipe.fiber || 'N/A'}</li>
						<li>Protein: {recipe.protein || 'N/A'}</li>
						<li>Cholesterol: {recipe.cholesterol || 'N/A'}</li>
						<li>Sodium: {recipe.sodium || 'N/A'}</li>
					</ul>
					<button onClick={() => setPageMode(pageModeType.EDIT)}>Edit</button>
				</div>
			)}
			{(pageMode === pageModeType.EDIT || pageMode === pageModeType.ADD) && (
				<RecipeForm
					recipe={pageMode === pageModeType.EDIT ? recipe : undefined}
					onSave={handleSave}
					onCancel={() => router.push(`/recipe/${id}`)}
				/>
			)}
		</div>
	);
};

export default RecipePage;
