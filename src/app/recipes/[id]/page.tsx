'use client';
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { createRecipe, updateRecipe } from '@/services/api';
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
	const uniqueInstructions = Array.from(new Set<string>(recipe?.instructions || []));

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
			router.push('/');
		} catch (error) {
			<ErrorMessage message={error + ''} />;
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <Spinner />;

	return (
		<div className="p-8 min-h-screen overflow-scroll">
			{(pageMode === pageModeType.EDIT || pageMode === pageModeType.ADD) && (
				<RecipeForm recipe={recipe} onSave={handleSave} onCancel={() => router.back()} />
			)}
			{pageMode === pageModeType.VIEW && recipe && (
				<div className="max-w-4xl mx-auto bg-gray-950 shadow-lg rounded-lg p-6">
					<h1 className="text-2xl font-bold text-teal-500">{recipe.title}</h1>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<p className="mt-4 text-teal-600">
							<span className="font-semibold">Total Time:</span> {recipe['total time'] || 'N/A'}
						</p>
						<p className="mt-2 text-teal-700">
							<span className="font-semibold">Utensils:</span> {recipe.utensils || 'None'}
						</p>
						<p className="mt-2 text-teal-600">
							<span className="font-semibold">Difficulty:</span> {recipe.difficulty || 'Unknown'}
						</p>
					</div>
					<p className="mb-4 mt-2 text-teal-700">
						<span className="font-semibold">Description:</span>{' '}
						{recipe.description || 'Food...maybe. Idk there is nothing saved'}
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
						<div>
							<h2 className="mt-6 text-xl font-semibold text-teal-800">Ingredients:</h2>
							{recipe.ingredients.length === 0 ? (
								<p className="mt-2 text-pink-600">No ingredients available.</p>
							) : (
								<ul className="mt-2 space-y-1">
									{recipe.ingredients.map((ingredient, index) => (
										<li key={index} className="text-purple-950">
											{ingredient.quantity} {ingredient.measurement} {ingredient.name}
										</li>
									))}
								</ul>
							)}
						</div>
						<div className="right-4 align-middle">
							<h2 className="mt-6 text-xl font-semibold text-teal-800">Nutritional Information:</h2>
							<ul className="mt-2 space-y-1 text-purple-950">
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
						</div>
					</div>
					<h2 className="mt-6 text-xl font-semibold text-teal-800">Instructions:</h2>
					{recipe.instructions &&
						(recipe.instructions.length === 0 ? (
							<p>No Instructions on this one</p>
						) : (
							<ol className="mt-4  mb-8 list-decimal list-inside space-y-2">
								{uniqueInstructions.map((instruction, index) => (
									<li key={instruction + index} className="text-gray-700 pl-2 relative ">
										{instruction}
									</li>
								))}
							</ol>
						))}

					<button onClick={() => setPageMode(pageModeType.EDIT)}>Edit</button>
				</div>
			)}
		</div>
	);
};

export default RecipePage;
