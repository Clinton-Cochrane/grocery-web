'use client';
import { Ingredient, Recipe } from '@/models/recipe';
import { RootState } from '@/redux/store';
import ShoppingCart from '@/components/shoppingcart';
import { useDispatch, useSelector } from 'react-redux';
import { addRecipeToCart, clearCart, removeRecipeFromCart, updateRecipeQuantity } from '@/redux/cartSlice';
import { aggregateIngredients } from '@/utilities/utilities';
import { update } from 'lodash';
import { FaPlus } from 'react-icons/fa';

const ShoppingCartPage: React.FC = () => {
	const dispatch = useDispatch();
	const cart = useSelector((state: RootState) => state.cart);
	const recipes = useSelector((state: RootState) => state.recipes.recipes);

	const selectedRecipes = cart
		.map((cartItem) => {
			if (cartItem.recipeId === 'extras') {
				return { ...cartItem, recipe: { _id: 'extras', title: 'Extras', ingredients: cartItem.ingredients || [] } };
			}

			const recipe = recipes.find((recipe) => recipe._id === cartItem.recipeId);
			if (!recipe) {
				console.warn(`Recipe with ID ${cartItem.recipeId} not found.`);
				return null;
			}
			return { ...cartItem, recipe, quantity: cartItem.quantity };
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
		console.log('Aggregated Shopping List:', shoppingList); // Debug the output
		console.log('Selected Recipes:', selectedRecipes);

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

	const addExtraItem = () => {
		const name = prompt('What item do you need?');
		if (!name) return;
		const quantity = parseFloat(prompt(`How much ${name} do you need?`, '1') || '1');
		if (isNaN(quantity)) return alert('Invalid quantity');
		const measurement = prompt(`What unit of measurement for ${name}?`, 'pieces');
		if (!measurement) return;

		if (!name || !quantity || !measurement) {
			alert('Please fill out all fields');
			return;
		}

		const newIngredient: Ingredient = { name, quantity, measurement };
		console.log('Adding extra item:', newIngredient);
		dispatch(addRecipeToCart({ recipeId: 'extras', ingredient: newIngredient }));
	};

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
			{/* FAB */}
			<button
				onClick={addExtraItem}
				className="fixed bottom-4 right-4 bg-teal-500 text-white p-4 rounded-full shadow-lg hover:bg-teal-700 focus:outline-none"
				aria-label="Add items to your cart"
			>
				<FaPlus className="text-xl" />
			</button>
		</div>
	);
};

export default ShoppingCartPage;
