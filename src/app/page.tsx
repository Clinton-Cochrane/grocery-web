'use client';

import { Recipe } from '@/models/recipe';
import { RootState } from '@/redux/store';
import Spinner from '@/components/spinner';
import Filters from '@/components/Filters';
import { getRecipes } from '@/services/api';
import { useRouter } from 'next/navigation';
import { setRecipes } from '@/redux/recipeSlice';
import { useDispatch, useSelector } from 'react-redux';
import RecipeListItem from '@/components/recipeListItem';
import React, { useEffect, useState, useCallback } from 'react';
import { addRecipeToCart, removeRecipeFromCart } from '@/redux/cartSlice';
import { FixedSizeList as VirtualizedList, ListOnItemsRenderedProps } from 'react-window';
import dynamic from 'next/dynamic';
const FaPlus = dynamic(() => import('react-icons/fa').then((mod) => mod.FaPlus), {
	ssr: false,
});

const RecipeListPage: React.FC = () => {
	const recipes: Recipe[] = useSelector((state: RootState) => state.recipes.recipes);
	const recipesInCart = useSelector((state: RootState) => state.cart);
	const [difficulty, setDifficulty] = useState('');
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');
	const [error, setError] = useState('');
	const [page, setPage] = useState(1);
	const dispatch = useDispatch();
	const router = useRouter();

	const pageSize = 10;

	const fetchRecipes = useCallback(
		async (currentPage: number, searchQuery = search) => {
			if (loading || currentPage > totalPages) return;
			setLoading(true);
			try {
				const { recipes: fetchedRecipes, totalPages } = await getRecipes(
					currentPage,
					pageSize,
					searchQuery,
					difficulty
				);
				dispatch(setRecipes(currentPage === 1 ? fetchedRecipes : [...recipes, ...fetchedRecipes]));
				setTotalPages(totalPages);
				setPage(currentPage);
			} catch (error) {
				setError('Failed to laod recipes. Please Try Again Later.');
				console.error('Fetch failed:', error);
			} finally {
				setLoading(false);
			}
		},
		[dispatch, loading, pageSize, search, difficulty, totalPages]
	);

	useEffect(() => {
		fetchRecipes(1);
	}, []);

	const loadMoreRecipes = () => {
		if (!loading && page < totalPages) {
			console.log('Loading more recipes: currentPage =', page + 1);
			fetchRecipes(page + 1);
		}
	};

	const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
		let timer: ReturnType<typeof setTimeout>;
		return (...args: Parameters<T>) => {
			clearTimeout(timer);
			timer = setTimeout(() => func(...args), delay);
		};
	};

	const debouncedSearch = useCallback(
		debounce((value: string) => {
			fetchRecipes(1, value);
		}, 300),
		[fetchRecipes]
	);

	const handleSearchChange = (value: string) => {
		setSearch(value);
		debouncedSearch(value);
	};

	const toggleSelectRecipe = (id: string, event: React.MouseEvent) => {
		event.stopPropagation();
		const isInCart = recipesInCart.some((item) => item.recipeId === id);
		if (isInCart) {
			dispatch(removeRecipeFromCart(id));
		} else {
			dispatch(addRecipeToCart({ recipeId: id }));
		}
	};

	const addNewRecipe = () => {
		router.push('/recipes/add');
	};

	const renderRecipeItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
		const recipe = recipes[index];
		const isSelected = recipesInCart.some((item) => item.recipeId === recipe._id);

		return recipe ? (
			<div key={recipe._id} style={style}>
				<RecipeListItem
					recipe={recipe}
					isSelected={isSelected}
					toggleSelect={(id, event) => toggleSelectRecipe(id, event)}
				/>
			</div>
		) : null;
	};

	return (
		<div className="flex flex-col min-h-screen">
			{error && <p className="text-red-500 text-center">{error}</p>}
			{/* Filters Section */}
			<div className="p-4">
				<Filters search={search} setSearch={handleSearchChange} difficulty={difficulty} setDifficulty={setDifficulty} />
				{loading && <Spinner />}
			</div>

			{/* Virtualized List Section */}
			<div className="flex-grow">
				{!loading && recipes.length === 0 && <p>No recipes found.</p>}
				<VirtualizedList
					height={900}
					width="100%"
					itemCount={recipes.length}
					itemSize={200}
					onItemsRendered={({ visibleStopIndex }: ListOnItemsRenderedProps) => {
						if (!loading && visibleStopIndex + 1 === recipes.length && page < totalPages) {
							console.log('Triggering loadMoreRecipes for page =', page + 1);
							loadMoreRecipes();
						}
					}}
				>
					{({ index, style }: { index: number; style: React.CSSProperties }) => renderRecipeItem({ index, style })}
				</VirtualizedList>
				{/* FAB */}
				<button onClick={addNewRecipe} className="fixed bottom-4 right-8 p-4 bg-teal-500 text-black rounded-full">
					<FaPlus className="text-xl" />
				</button>
			</div>
		</div>
	);
};

export default RecipeListPage;
