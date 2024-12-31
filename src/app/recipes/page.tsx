import { debounce } from 'lodash';
import { RootState } from '@/redux/store';
import Spinner from '@/components/spinner';
import Filters from '@/components/Filters';
import { getRecipes } from '@/services/api';
import { setRecipes } from '@/redux/recipeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorMessage } from '@/components/customError';
import React, { useEffect, useState, useCallback } from 'react';
import { FixedSizeList as VirtualizedList, ListOnItemsRenderedProps } from 'react-window';

interface RecipeListPageProps {
	selectedRecipes: Set<string>;
	setSelectedRecipes: React.Dispatch<React.SetStateAction<Set<string>>>;
}

interface Recipe {
	_id: string;
	title: string;
	utensils?: string;
	difficulty?: string;
	total_time?: string;
	ingredients: string[];
	instructions: { key: string; value: string }[];
}

const RecipeListPage: React.FC<RecipeListPageProps> = ({ selectedRecipes, setSelectedRecipes }) => {
	const pageSize = 10;
	const dispatch = useDispatch();
	const [page, setPage] = useState(1);
	const [error, setError] = useState('');
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);
	const [totalPages, setTotalPages] = useState(1);
	const [difficulty, setDifficulty] = useState('');
	const [ingredient, setIngredient] = useState('');
	const recipes: Recipe[] = useSelector((state: RootState) => state.recipes.recipes);
	
	

	const fetchRecipes = useCallback(
		async (currentPage: number) => {
			if (loading || currentPage > totalPages) return;
			setLoading(true);
			try {
				const { recipes: fetchedRecipes, totalPages: fetchedTotalPages } = await getRecipes(
					currentPage,
					pageSize,
					search,
					difficulty,
					ingredient
				);
				dispatch(setRecipes(currentPage === 1 ? fetchedRecipes : [...recipes, ...fetchedRecipes]));
				setTotalPages(fetchedTotalPages);
				setPage(currentPage);
			} catch (err) {
				<ErrorMessage message={err + ''} />;
				setError('Failed to fetch recipes. Please try again.');
			} finally {
				setLoading(false);
			}
		},
		[dispatch, loading, pageSize, search, difficulty, recipes, totalPages]
	);

	useEffect(() => {
		fetchRecipes(1);
	}, [fetchRecipes]);

	const loadMoreRecipes = () => {
		if (!loading && page < totalPages) {
			fetchRecipes(page + 1);
		}
	};

	const debouncedSearch = useCallback(
		debounce((value: string) => {
			fetchRecipes(1);
			setSearch(value);
		}, 300),
		[fetchRecipes]
	);
	
	const handleSearchChange = debouncedSearch;


	const toggleSelectRecipe = (id: string) => {
		setSelectedRecipes((prev) => {
			const updated = new Set(prev);
			updated.has(id) ? updated.delete(id) : updated.add(id);
			return updated;
		});
	};

	const RecipeListItem = React.memo(({ recipe }: { recipe: Recipe }) => {
		const isSelected = selectedRecipes.has(recipe._id);

		return (
			<div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
				<h3>{recipe.title}</h3>
				<p>Total Time: {recipe.total_time || 'N/A'}</p>
				<p>Difficulty: {recipe.difficulty || 'Unknown'}</p>
				<button onClick={() => toggleSelectRecipe(recipe._id)}>
					{isSelected ? 'Remove' : 'Add'}
				</button>
			</div>
		);
	});

	const renderRecipeItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
		const recipe = recipes[index];
		return recipe ? <RecipeListItem recipe={recipe} /> : null;
	};

	return (
		<div>
			{error && <ErrorMessage message={error} />}
			<Filters search={search} setSearch={handleSearchChange} difficulty={difficulty} setDifficulty={setDifficulty} />
			{loading && <Spinner />}
			{!loading && recipes.length === 0 && <p>No recipes found.</p>}
			<VirtualizedList
				height={600}
				width="100%"
				itemCount={recipes.length}
				itemSize={80}
				onItemsRendered={({ visibleStopIndex }: ListOnItemsRenderedProps) => {
					if (visibleStopIndex + 1 === recipes.length) {
						loadMoreRecipes();
					}
				}}
			>
				{renderRecipeItem}
			</VirtualizedList>
		</div>
	);
};

export default RecipeListPage;
