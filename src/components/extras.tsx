import React from 'react';
import { useDispatch } from 'react-redux';
import { removeExtraIngredient, updateExtraIngredientQuantity } from '@/redux/cartSlice';
import { Ingredient } from '@/models/recipe';

interface ExtrasProps {
	ingredients: Ingredient[];
}

const Extras: React.FC<ExtrasProps> = ({ ingredients }) => {
	const dispatch = useDispatch();

	return (
		<div>
			<h3 className="text-lg font-bold">Extras</h3>
			<ul className="ml-4">
				{ingredients.map((ingredient, idx) => (
					<li key={idx} className="flex items-center space-x-2">
						<span>{`${ingredient.quantity} ${ingredient.measurement} ${ingredient.name}`}</span>
						<button
							onClick={() => dispatch(removeExtraIngredient(ingredient.name))}
							className="bg-red-500 text-white px-2 py-1 rounded"
						>
							Delete
						</button>
						<button
							onClick={() => dispatch(updateExtraIngredientQuantity({ name: ingredient.name, quantity: -1 }))}
							className="bg-yellow-500 text-white px-2 py-1 rounded"
						>
							-
						</button>
						<button
							onClick={() => dispatch(updateExtraIngredientQuantity({ name: ingredient.name, quantity: 1 }))}
							className="bg-green-500 text-white px-2 py-1 rounded"
						>
							+
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Extras;
