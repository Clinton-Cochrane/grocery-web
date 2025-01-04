import { Recipe } from '@/models/recipe';
import React, { useState } from 'react';
import { validateRecipe } from '@/utilities/validation';

interface RecipeFormProps {
	recipe?: Recipe | null;
	onSave: (recipe: Recipe) => void;
	onCancel: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ recipe, onSave, onCancel }) => {
	const [formData, setFormData] = useState<Recipe>({
		_id: recipe?._id || '',
		title: recipe?.title || '',
		difficulty: recipe?.difficulty || '',
		'total time': recipe?.['total time'] || '',
		utensils: recipe?.utensils || '',
		saturated_fat: recipe?.saturated_fat || '',
		calories: recipe?.calories || '',
		carbohydrate: recipe?.carbohydrate || '',
		sugar: recipe?.sugar || '',
		fiber: recipe?.fiber || '',
		protein: recipe?.protein || '',
		cholesterol: recipe?.cholesterol || '',
		sodium: recipe?.sodium || '',
		fat: recipe?.fat || '',
		ingredients: recipe?.ingredients || [],
		instructions: recipe?.instructions || [],
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleChange = (field: string, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const {...simpleFields } = formData;
		const { isValid, errors: validationErrors } = validateRecipe(simpleFields);

		if (!isValid) {
			setErrors(validationErrors);
			return;
		}

		onSave(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded shadow-lg">
			{/* Render inputs for basic fields */}
			{Object.entries(formData).map(([field, value]) => {
				if (['ingredients', 'instructions'].includes(field)) return null;
				return (
					<div key={field} className="col-span-1">
						<label htmlFor={field} className="block text-gray-300">
							{field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
						</label>
						<input
							id={field}
							type={typeof value === 'number' ? 'number' : 'text'}
							value={value as string | number}
							onChange={(e) => handleChange(field, e.target.value)}
							className="w-full p-2 bg-gray-700 text-white rounded"
						/>
						{errors[field] && <p className="text-red-500">{errors[field]}</p>}
					</div>
				);
			})}

			{/* Ingredients Section */}
			<div>
				<h3 className="text-gray-300 text-lg">Ingredients</h3>
				{formData.ingredients.map((ingredient, index) => (
					<div key={index} className="flex gap-4 items-center mb-2">
						<input
							type="text"
							placeholder="Name"
							value={ingredient.name}
							onChange={(e) =>
								setFormData((prev) => {
									const updatedIngredients = [...prev.ingredients];
									updatedIngredients[index].name = e.target.value;
									return { ...prev, ingredients: updatedIngredients };
								})
							}
							className="flex-1 p-2 bg-gray-700 text-white rounded"
						/>
						<input
							type="number"
							placeholder="Quantity"
							value={ingredient.quantity}
							onChange={(e) =>
								setFormData((prev) => {
									const updatedIngredients = [...prev.ingredients];
									updatedIngredients[index].quantity = parseFloat(e.target.value);
									return { ...prev, ingredients: updatedIngredients };
								})
							}
							className="w-20 p-2 bg-gray-700 text-white rounded"
						/>
						<input
							type="text"
							placeholder="Measurement"
							value={ingredient.measurement}
							onChange={(e) =>
								setFormData((prev) => {
									const updatedIngredients = [...prev.ingredients];
									updatedIngredients[index].measurement = e.target.value;
									return { ...prev, ingredients: updatedIngredients };
								})
							}
							className="w-40 p-2 bg-gray-700 text-white rounded"
						/>
						<button
							type="button"
							className="px-4 py-2 bg-red-500 text-white rounded"
							onClick={() =>
								setFormData((prev) => ({
									...prev,
									ingredients: prev.ingredients.filter((_, i) => i !== index),
								}))
							}
						>
							Remove
						</button>
					</div>
				))}
				<button
					type="button"
					className="px-4 py-2 bg-blue-500 text-white rounded"
					onClick={() =>
						setFormData((prev) => ({
							...prev,
							ingredients: [...prev.ingredients, { name: '', quantity: 0, measurement: '' }],
						}))
					}
				>
					Add Ingredient
				</button>
			</div>

			{/* Instructions Section */}
			<div>
				<h3 className="text-gray-300 text-lg">Instructions</h3>
				{formData.instructions.map((instruction, index) => (
					<div key={index} className="flex items-center gap-4 mb-2">
						<textarea
							value={instruction}
							onChange={(e) =>
								setFormData((prev) => {
									const updatedInstructions = [...prev.instructions];
									updatedInstructions[index] = e.target.value;
									return { ...prev, instructions: updatedInstructions };
								})
							}
							rows={3}
							className="flex-1 p-2 bg-gray-700 text-white rounded"
						/>
						<button
							type="button"
							className="px-4 py-2 bg-red-500 text-white rounded"
							onClick={() =>
								setFormData((prev) => ({
									...prev,
									instructions: prev.instructions.filter((_, i) => i !== index),
								}))
							}
						>
							Remove
						</button>
					</div>
				))}
				<button
					type="button"
					className="px-4 py-2 bg-blue-500 text-white rounded"
					onClick={() =>
						setFormData((prev) => ({
							...prev,
							instructions: [...prev.instructions, ''],
						}))
					}
				>
					Add Instruction
				</button>
			</div>

			{/* Buttons */}
			<div className="flex gap-4">
				<button type="submit" className="px-6 py-2 bg-green-600 text-white rounded">
					{recipe ? 'Save Changes' : 'Add Recipe'}
				</button>
				<button type="button" className="px-6 py-2 bg-gray-600 text-white rounded" onClick={onCancel}>
					Cancel
				</button>
			</div>
		</form>
	);
};

export default RecipeForm;
