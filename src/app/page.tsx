'use client';

import dynamic from 'next/dynamic';
import { Recipe } from '@/models/recipe';
import { RootState } from '@/redux/store';
import Spinner from '@/components/spinner';
import Filters from '@/components/Filters';
import { getRecipes } from '@/services/api';
import { useRouter } from 'next/navigation';
import { setRecipes } from '@/redux/recipeSlice';
import { debounce } from '@/utilities/utilities';
import { useDispatch, useSelector } from 'react-redux';
import RecipeListItem from '@/components/recipeListItem';
import React, { useEffect, useState, useRef } from 'react';
import { addRecipeToCart, removeRecipeFromCart } from '@/redux/cartSlice';
import { FixedSizeList as VirtualizedList, FixedSizeList } from 'react-window';

const FaPlus = dynamic(() => import('react-icons/fa').then((mod) => mod.FaPlus), {
	ssr: false,
});

const RecipeListPage: React.FC = () => {
	const recipes: Recipe[] = useSelector((state: RootState) => state.recipes.recipes);
	const recipesInCart = useSelector((state: RootState) => state.cart);
	const dispatch = useDispatch();
	const router = useRouter();

	// State
	const [visibleIndex, setVisibleIndex] = useState(0);
	const [difficulty, setDifficulty] = useState('');
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');
	const [error, setError] = useState('');
	const [page, setPage] = useState(1);

	// Refs
	const listRef = useRef<FixedSizeList | null>(null);
	const scrollPositionRef = useRef(0);
	const pageSize = 10;

	// Fetch Recipes
	const fetchRecipes = async (currentPage: number, searchQuery = search) => {
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
			setError('Failed to load recipes. Please try again later.');
			console.error('Fetch failed:', error);
		} finally {
			setLoading(false);
		}
	};

	// Debounced Search
	const debouncedSearch = debounce((value: string) => {
		setSearch(value);
		fetchRecipes(1, value);
	}, 300);

	// Initial Fetch
	useEffect(() => {
		const fetchInitialRecipes = async () => {
			try {
				setLoading(true);
				const { recipes: fetchedRecipes, totalPages } = await getRecipes(1, pageSize, search, difficulty);
				dispatch(setRecipes(fetchedRecipes));
				setTotalPages(totalPages);
			} catch (error) {
				setError('Failed to load recipes. Please try again later.');
				console.error('Fetch failed:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchInitialRecipes();
	}, [dispatch, pageSize, search, difficulty]);

	// Restore Scroll Position
	useEffect(() => {
		if (listRef.current) {
			listRef.current.scrollTo(scrollPositionRef.current);
		}
	}, []);

	// Scroll to Visible Index
	useEffect(() => {
		if (listRef.current) {
			listRef.current.scrollToItem(visibleIndex, 'start');
		}
	}, [visibleIndex]);

	// Handlers
	const handleSearchChange = (value: string) => {
		debouncedSearch(value);
	};

	const handleItemClick = (index: number, recipeId: string) => {
		setVisibleIndex(index);
		if (listRef.current) {
			scrollPositionRef.current = listRef.current.props.itemSize * index;
		}
		router.push(`/recipes/${recipeId}`);
	};

	const handleToggleSelectRecipe = (id: string, event: React.MouseEvent) => {
		event.stopPropagation();
		const isInCart = recipesInCart.some((item) => item.recipeId === id);
		if (isInCart) {
			dispatch(removeRecipeFromCart(id));
		} else {
			dispatch(addRecipeToCart({ recipeId: id }));
		}
	};

	const handleItemsRendered = ({ visibleStartIndex, visibleStopIndex }: { visibleStartIndex: number; visibleStopIndex: number }) => {
		if (visibleStartIndex !== undefined) {
			setVisibleIndex(visibleStartIndex);
			if (listRef.current) {
				scrollPositionRef.current = listRef.current.props.itemSize * visibleStartIndex;
			}
		}
		if (visibleStopIndex !== undefined && !loading && visibleStopIndex + 1 === recipes.length && page < totalPages) {
			fetchRecipes(page + 1);
		}
	};

	const NavigateAddNewRecipe = () => {
		router.push('/recipes/add');
	};

	// Render Recipe Item
	const renderRecipeItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
		const recipe = recipes[index];
		if (!recipe) return null;
		const isSelected = recipesInCart.some((item) => item.recipeId === recipe._id);

		return (
			<div key={recipe._id} style={style}>
				<RecipeListItem
					recipe={recipe}
					isSelected={isSelected}
					toggleSelect={(id, event) => handleToggleSelectRecipe(id, event)}
					onItemClick={() => handleItemClick(index, recipe._id)}
				/>
			</div>
		);
	};

	// Render
	return (
		<div className="flex flex-col min-h-screen">
			{error && <p className="text-red-500 text-center">{error}</p>}
			{/* Filters Section */}
			<div className="p-4">
				<Filters search={search} setSearch={handleSearchChange} difficulty={difficulty} setDifficulty={setDifficulty} />
				{loading && <Spinner />}
			</div>

			{/* Virtualized List */}
			<div className="flex-grow">
				<VirtualizedList
					ref={listRef}
					height={900}
					width="100%"
					itemCount={recipes.length}
					itemSize={200}
					onItemsRendered={handleItemsRendered}
				>
					{({ index, style }: { index: number; style: React.CSSProperties }) => renderRecipeItem({ index, style })}
				</VirtualizedList>
				<button onClick={NavigateAddNewRecipe} className="fixed bottom-4 right-8 p-4 bg-teal-500 text-black rounded-full">
					<FaPlus className="text-xl" />
				</button>
			</div>
		</div>
	);
};

export default RecipeListPage;
