import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRecipes } from '@/redux/recipeSlice';
import { getRecipes } from '@/services/api';
import { debounce } from 'lodash';
import { RootState } from '@/redux/store';
import { Recipe } from '@/models/recipe';
import Spinner from '@/components/spinner';
import Filters from '@/components/Filters';
import { ErrorMessage } from '@/components/customError';

interface RecipeListPageProps {
	selectedRecipes: Set<string>;
	setSelectedRecipes: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const RecipeListItem: React.FC<{
	recipe: Recipe;
	isSelected: boolean;
	toggleSelect: () => void;
}> = ({ recipe, isSelected, toggleSelect }) => (
	<li>
		<h3>{recipe.title}</h3>
		<button onClick={toggleSelect}>{isSelected ? 'Remove From Cart' : 'Add to Cart'}</button>
		<p>Total Time: {recipe['total time'] || 'N/A'}</p>
		<p>Difficulty: {recipe.difficulty || 'Unknown'}</p>
	</li>
);

const RecipeListPage: React.FC<RecipeListPageProps> = ({ selectedRecipes, setSelectedRecipes }) => {
	const dispatch = useDispatch();
	const recipes: Recipe[] = useSelector((state: RootState) => state.recipes);
	const [search, setSearch] = useState('');
	const [difficulty, setDifficulty] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [page, setPage] = useState(1);

	const fetchRecipes = useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			const { recipes: fetchedRecipes } = await getRecipes(page, 10, search, difficulty, '');
			dispatch(setRecipes(fetchedRecipes));
		} catch (error) {
			error && <ErrorMessage message={error + ''} />;
			setError('Failed to Fetch Recipes');
		} finally {
			setLoading(false);
		}
	}, [dispatch, page, search, difficulty]);

	const fetchMoreRecipes = useCallback(async () => {
		setLoading(true);
		try {
			const { recipes: moreRecipes } = await getRecipes(page + 1, 10, search, difficulty, '');
			dispatch(setRecipes([...recipes, ...moreRecipes]));
			setPage(page + 1);
		} catch (error) {
			error && <ErrorMessage message={error + ''} />;
			setError('Error Loading Recipes');
		} finally {
			setLoading(false);
		}
	}, [dispatch, page, search, difficulty, recipes]);

	const debouncedFetchRecipes = useRef(
		debounce((value: string) => {
			setSearch(value);
			fetchRecipes();
		}, 300)
	).current;

	useEffect(() => {
		fetchRecipes();
		return () => {
			debouncedFetchRecipes.cancel();
		};
	}, [fetchRecipes, debouncedFetchRecipes]);

	const handleSearchChange = (value: string) => {
		debouncedFetchRecipes(value);
	};

	const toggleSelectRecipe = (id: string) => {
		setSelectedRecipes((prev) => {
			const updated = new Set(prev);
			if (updated.has(id)) {
				updated.delete(id);
			} else {
				updated.add(id);
			}
			return updated;
		});
	};

	return (
		<div>
			{error && <p style={{ color: 'red' }}>{error}</p>}

			<Filters
				search={search}
				setSearch={(value) => handleSearchChange(value)}
				difficulty={difficulty}
				setDifficulty={setDifficulty}
			/>

			{loading && <Spinner />}
			{!loading && recipes.length === 0 && (
				<div>
					<p>No recipes found. Try adjusting your search or filters.</p>
					<button
						onClick={() => {
							setSearch('');
							setDifficulty('');
						}}
					>
						Reset Filters
					</button>
				</div>
			)}
			<ul>
				{recipes.map((recipe) => (
					<RecipeListItem
						key={recipe._id}
						recipe={recipe}
						isSelected={selectedRecipes.has(recipe._id)}
						toggleSelect={() => toggleSelectRecipe(recipe._id)}
					/>
				))}
			</ul>
			<button onClick={fetchMoreRecipes} disabled={loading}>
				Load More
			</button>
		</div>
	);
};

export default RecipeListPage;
