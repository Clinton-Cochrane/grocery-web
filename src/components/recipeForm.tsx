import { Recipe } from '@/models/recipe';
import React, { useState } from 'react';
import { validateRecipe } from '@/utilities/validation';

interface RecipeFormProps {
	recipe?: Recipe | null;
	onSave: (recipe: Recipe) => void;
	onCancel: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ recipe, onSave, onCancel }) => {
	// Initialize state with all form fields
	const [formData, setFormData] = useState({
		title: recipe?.title || '',
		difficulty: recipe?.difficulty || '',
		totalTime: recipe?.['total time'] || '',
		utensils: recipe?.utensils || '',
		saturatedFat: recipe?.saturated_fat || '',
		calories: recipe?.calories || '',
		carbohydrate: recipe?.carbohydrate || '',
		sugar: recipe?.sugar || '',
		fiber: recipe?.fiber || '',
		protein: recipe?.protein || '',
		cholesterol: recipe?.cholesterol || '',
		sodium: recipe?.sodium || '',
		fat: recipe?.fat || '',
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	// Form field configuration
	const formFields = [
		{ name: 'title', label: 'Title', type: 'text', required: true },
		{ name: 'totalTime', label: 'Total Time', type: 'text', required: true },
		{ name: 'utensils', label: 'Utensils', type: 'text' },
		{ name: 'difficulty', label: 'Difficulty', type: 'select', required: true, options: ['Easy', 'Medium', 'Hard'] },
		{ name: 'calories', label: 'Calories', type: 'number' },
		{ name: 'fat', label: 'Fat', type: 'number' },
		{ name: 'saturatedFat', label: 'Saturated Fat', type: 'number' },
		{ name: 'carbohydrate', label: 'Carbohydrate', type: 'number' },
		{ name: 'sugar', label: 'Sugar', type: 'number' },
		{ name: 'fiber', label: 'Fiber', type: 'number' },
		{ name: 'protein', label: 'Protein', type: 'number' },
		{ name: 'cholesterol', label: 'Cholesterol', type: 'number' },
		{ name: 'sodium', label: 'Sodium', type: 'number' },
	];

	// Handle input changes
	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	// Handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const { isValid, errors: validationErrors } = validateRecipe(formData);

		if (!isValid) {
			setErrors(validationErrors);
			return;
		}

		onSave({
			_id: recipe?._id || '',
			...formData,
			'total time': formData.totalTime,
			ingredients: recipe?.ingredients || [],
			instructions: recipe?.instructions || [],
			saturated_fat: formData.saturatedFat,
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="space-y-4 bg-gray-800 p-6 rounded shadow">
				{formFields.map((field) => (
					<div key={field.name} style={{ marginBottom: '1rem' }}>
						<label htmlFor={field.name}>{field.label}</label>
						{field.type === 'select' ? (
							<select
								id={field.name}
								value={formData[field.name as keyof typeof formData]}
								onChange={(e) => handleChange(field.name, e.target.value)}
							>
								<option value="">Select</option>
								{field.options?.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>
						) : (
							<input
								id={field.name}
								type={field.type}
								value={formData[field.name as keyof typeof formData]}
								onChange={(e) => handleChange(field.name, e.target.value)}
								className="w-full p-2 bg-gray-700 text-white rounded"
							/>
						)}
						{errors[field.name] && <p style={{ color: 'red' }}>{errors[field.name]}</p>}
					</div>
				))}
			</div>
			<button className="px-4 py-2 bg-secondary text-white rounded" type="submit">
				{recipe ? 'Save Changes' : 'Add Recipe'}
			</button>
			<button className="px-4 py-2 bg-gray-600 text-white rounded" type="button" onClick={onCancel}>
				Cancel
			</button>
		</form>
	);
};

export default RecipeForm;
