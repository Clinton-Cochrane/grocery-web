import { Recipe } from '@/models/recipe';

interface ShoppingCartProps {
	recipes: {recipe:Recipe, quantity: number }[];
	onRemove: (id: string) => void;
	onClear: () => void;
	onQuantityChange: (id: string, quantity: number) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ recipes, onRemove, onClear, onQuantityChange }) => {
	return recipes.length === 0 ? (
		<p>Your cart is empty.</p>
	) : (
		<div>
			<ul>
				{recipes.map(({recipe, quantity}) => (
					<li key={'{recipe._id} -${quantity}'}>
						<h3>{recipe.title}</h3>
						<p>Quantity: {quantity} </p>
						<button onClick={() => onQuantityChange(recipe._id, quantity - 1)}>-</button>
						<button onClick={() => onQuantityChange(recipe._id, quantity + 1)}>+</button>
						<button onClick={() => onRemove(recipe._id)}>Remove</button>
					</li>
				))}
			</ul>
			<button onClick={onClear}>Clear Cart</button>
		</div>
	);
};

export default ShoppingCart;
