import { Recipe } from '@/models/recipe';

interface ShoppingCartProps {
	recipes: { recipe: Recipe; quantity: number }[];
	onRemove: (id: string) => void;
	onClear: () => void;
	onQuantityChange: (id: string, quantity: number) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ recipes, onRemove, onClear, onQuantityChange }) => {
	return recipes.length === 0 ? (
		<p className="text-center text-gray-400">Your cart is empty.</p>
	) : (
		<div className="space-y-4">
			<ul className="space-y-2">
				{recipes.map(({ recipe, quantity }) => (
					<li key={'{recipe._id} -${quantity}'} className="p-4 bg-gray-800 rounded shadow">
						<h3 className="text-lg font-bold">{recipe.title}</h3>
						<p>Quantity: {quantity} </p>
						<div className="flex space-x-2 mt2">
							<button
								className="px-3 py-1 bg-secondary text-white rounded"
								onClick={() => onQuantityChange(recipe._id, quantity - 1)}
							>
								-
							</button>
							<button
								className="px-3 py-1 bg-secondary text-white rounded"
								onClick={() => onQuantityChange(recipe._id, quantity + 1)}
							>
								+
							</button>
							<button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => onRemove(recipe._id)}>
								Remove
							</button>
						</div>
					</li>
				))}
			</ul>
			<button onClick={onClear}>Clear Cart</button>
		</div>
	);
};

export default ShoppingCart;
