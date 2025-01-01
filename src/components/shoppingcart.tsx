import { Recipe } from '@/models/recipe';

interface ShoppingCartProps {
	recipes: Recipe[];
	onRemove: (id: string) => void;
	onClear: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ recipes, onRemove, onClear }) => {
	return recipes.length === 0 ? (
		<p>Your cart is empty.</p>
	) : (
		<div>
			<ul>
				{recipes.map((recipe) => (
					<li key={recipe._id}>
						<h3>{recipe.title}</h3>
						<button onClick={() => onRemove(recipe._id)}>Remove</button>
					</li>
				))}
			</ul>
			<button onClick={onClear}>Clear Cart</button>
		</div>
	);
};

export default ShoppingCart;
