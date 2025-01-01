'use client';

import { debounce } from 'lodash';
import { RootState } from '@/redux/store';
import Spinner from '@/components/spinner';
import Filters from '@/components/Filters';
import { getRecipes } from '@/services/api';
import { deleteRecipe, setRecipes } from '@/redux/recipeSlice';
import { deleteRecipe as deleteRecipeApi } from '@/services/api';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorMessage } from '@/components/customError';
import React, { useEffect, useState, useCallback } from 'react';
import { FixedSizeList as VirtualizedList, ListOnItemsRenderedProps } from 'react-window';
import { Recipe } from '@/models/recipe';

interface RecipeListPageProps {
	selectedRecipes: Set<string>; //just pass in ids not the objects
	setSelectedRecipes: React.Dispatch<React.SetStateAction<Set<string>>>;
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
					difficulty
				);
				dispatch(setRecipes(currentPage === 1 ? fetchedRecipes : [...recipes, ...fetchedRecipes]));
				setTotalPages(fetchedTotalPages);
				setPage(currentPage);
			} catch (error) {
				<ErrorMessage message={error + ''} />;
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
		const handleDelete = async () => {
			if (confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
				try {
					await deleteRecipeApi(recipe._id); // First, delete from the backend
					dispatch(deleteRecipe(recipe._id)); // Then update the Redux state
					console.log(`Recipe "${recipe.title}" deleted successfully.`);
				} catch (error) {
					console.error('Failed to delete recipe:', error);
					alert('Failed to delete recipe. Please try again.');
				}
			}
		};

		return (
			<div>
				<h3>{recipe.title}</h3>
				<p>Total Time: {recipe['total time'] || 'N/A'}</p>
				<p>Difficulty: {recipe.difficulty || 'Unknown'}</p>
				<button onClick={() => toggleSelectRecipe(recipe._id)}>{isSelected ? 'Remove' : 'Add'}</button>
				<button onClick={handleDelete}>Delete Recipe</button>
			</div>
		);
	});

	const renderRecipeItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
		const recipe = recipes[index];
		return recipe ? (
			<div key={recipe._id} style={style}>
				<RecipeListItem recipe={recipe} />
			</div>
		) : null;
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
