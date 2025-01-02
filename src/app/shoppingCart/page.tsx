'use client';
import { Recipe } from '@/models/recipe';
import { RootState } from '@/redux/store';
import ShoppingCart from '@/components/shoppingcart';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, removeRecipeFromCart, updateRecipeQuantity } from '@/redux/cartSlice';
import { aggregateIngredients } from '@/utilities/utilities';
import { update } from 'lodash';

const ShoppingCartPage: React.FC = () => {
	const dispatch = useDispatch();
	const cart = useSelector((state: RootState) => state.cart);
	const recipes = useSelector((state: RootState) => state.recipes.recipes);
	console.log(cart)
	
	const selectedRecipes = cart
		.map((cartItem) => {
			console.log('Cart Item:', cartItem.recipeId);
console.log('Found Recipe:', recipes.find((recipe) => recipe._id === cartItem.recipeId));

			const recipe = recipes.find((recipe) => recipe._id === cartItem.recipeId);
			if (!recipe) {
				console.warn(`Recipe with ID ${cartItem.recipeId} not found.`);
				return null;
			}
			return {...cartItem, recipe , quantity: cartItem.quantity };
		})
		.filter((item) => item !== null) as { recipe: Recipe; quantity: number }[];

	//Handlers
	const handleClearCart = () => dispatch(clearCart());
	const handleRemove = (id: string) => dispatch(removeRecipeFromCart(id));
	const handleQuantityChange = (recipeId: string, quantity: number) => {
		quantity < 1 ? dispatch(removeRecipeFromCart(recipeId)) : dispatch(updateRecipeQuantity({ recipeId, quantity }));
	};

	const handleExportCart = () => {
		const shoppingList = aggregateIngredients(selectedRecipes);
		console.log("Aggregated Shopping List:", shoppingList); // Debug the output
		console.log("Selected Recipes:", selectedRecipes);

		if (shoppingList.length === 0) {
			alert('Your shopping list is empty.');
			return;
		}
		const blob = new Blob([JSON.stringify(shoppingList, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'shopping-list.json';
		link.click();
		alert('Shopping list exported successfully!');
	};
	console.log('Cart State:', cart);
console.log('Recipes in Store:', recipes);
console.log('Selected Recipes:', selectedRecipes);


	return (
		<div>
			<h1>Shopping Cart</h1>
			<button onClick={handleExportCart}>Export Shopping List</button>
			<ShoppingCart
				recipes={selectedRecipes}
				onRemove={handleRemove}
				onClear={handleClearCart}
				onQuantityChange={handleQuantityChange}
			/>
		</div>
	);
};

export default ShoppingCartPage;
