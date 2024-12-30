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
			console.error('Error fetching recipe on RecipePage:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async (updatedRecipe: Recipe) => {
		setLoading(true);
		try {
			if (pageMode === pageModeType.ADD) {
				createRecipe(updatedRecipe);
			} else {
				await updateRecipe(updatedRecipe._id, updatedRecipe);
			}
			router.push('/recipe');
		} catch (error) {
			console.error('Error Saving Recipe from RecipePage: ', error);
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
					<p>Total Time {recipe['total time'] || 'N/A'} </p>
					<p>Difficulty: {recipe.difficulty || 'Unknown'}</p>
                    {/*gotta add the other fields here*/}
                    <button onClick={() => setPageMode(pageModeType.EDIT)}>Edit</button>
				</div>
			)}
            {(pageMode === pageModeType.EDIT || pageMode === pageModeType.ADD) && (
                <RecipeForm
                    recipe= {pageMode === pageModeType.EDIT ? recipe : undefined}
                    onSave= {handleSave}
                    onCancel = {() => router.push(`/recipe/${id}`)}
                />
            )}
		</div>
	);
};

export default RecipePage;
