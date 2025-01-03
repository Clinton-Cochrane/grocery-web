import { Recipe } from '@/models/recipe';
import Extras from './extras';
import { useRouter } from 'next/navigation';

interface ShoppingCartProps {
	recipes: { recipe: Recipe; quantity: number }[];
	onRemove: (id: string, event: React.MouseEvent) => void;
	onClear: () => void;
	onQuantityChange: (id: string, quantity: number, event: React.MouseEvent) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ recipes, onRemove, onClear, onQuantityChange }) => {
	const router = useRouter();
	return recipes.length === 0 ? (
		<p className="text-center text-gray-400">Your cart is empty.</p>
	) : (
		<div className="space-y-4">
			<ul className="space-y-2">
				{recipes.map(({ recipe, quantity }, index) => (
					<li key={`${recipe._id}-${index}-${quantity}`} onClick={()=>router.push(`/recipes/${recipe._id}`)} className="p-4 bg-gray-800 rounded shadow">
						<h3 className="text-lg font-bold">{recipe.title}</h3>
						{recipe._id === 'extras' ? (
							<Extras ingredients={recipe.ingredients} />
						) : (
							<ul className="ml-4 list-disc">
								{recipe.ingredients.map((ingredient, idx) => (
									<li key={idx}>
										{`${ingredient.quantity || 0} ${ingredient.measurement || 'undefined'} ${ingredient.name || 'undefined'}`}
									</li>
								))}
							</ul>
						)}
						{recipe._id !== 'extras' && (
							<>
								<p>Quantity: {quantity}</p>
								<div className="flex space-x-2 mt-2">
									<button
										className="px-3 py-1 bg-secondary text-white rounded"
										onClick={(e) => onQuantityChange(recipe._id, quantity - 1, e)}
									>
										-
									</button>
									<button
										className="px-3 py-1 bg-secondary text-white rounded"
										onClick={(e) => onQuantityChange(recipe._id, quantity + 1, e)}
									>
										+
									</button>
									<button
										className="px-3 py-1 bg-red-600 text-white rounded"
										onClick={(e) => onRemove(recipe._id, e)}
									>
										Remove
									</button>
								</div>
							</>
						)}
					</li>
				))}
			</ul>
			<button onClick={onClear} className="px-4 py-2 bg-red-500 text-white rounded mt-4">
				Clear Cart
			</button>
		</div>
	);
};

export default ShoppingCart;
