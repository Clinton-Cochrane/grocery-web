'use client';
import { Recipe } from '@/models/recipe';
import { RootState } from '@/redux/store';
import ShoppingCart from '@/components/shoppingcart';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, removeRecipeFromCart } from '@/redux/cartSlice';
import { aggregateIngredients } from '@/utilities/utilities';

const ShoppingCartPage: React.FC = () => {
	const dispatch = useDispatch();
	const selectedRecipeIds = useSelector((state: RootState) => state.cart);
	const recipes = useSelector((state: RootState) => state.recipes.recipes);
	const selectedRecipes = recipes.filter((recipe: Recipe) => selectedRecipeIds.includes(recipe._id));
	//Handlers
	const handleRemove = (id: string) => dispatch(removeRecipeFromCart(id));
	const handleClearCart = () => dispatch(clearCart());
	const handleExportCart = () => {
		const shoppingList = aggregateIngredients(selectedRecipes);
		const blob = new Blob([JSON.stringify(shoppingList, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'shopping-list.json';
		link.click();
	};

	return (
		<div>
			<h1>Shopping Cart</h1>
			<button onClick={handleExportCart}>Export Shopping List</button>
			<ShoppingCart recipes={selectedRecipes} onRemove={handleRemove} onClear={handleClearCart} />
		</div>
	);
};

export default ShoppingCartPage;
