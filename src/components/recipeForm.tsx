import { Recipe } from '@/models/recipe';
import React, { useState } from 'react';

interface RecipeFormProps {
	recipe?: Recipe | null;
	onSave: (recipe: Recipe) => void;
	onCancel: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ recipe, onSave, onCancel }) => {
	const [title, setTitle] = useState(recipe?.title || '');
	const [difficulty, setDifficulty] = useState(recipe?.difficulty || '');
	const [totalTime, setTotalTime] = useState(recipe?.['total time'] || '');
	const [utensils, setUtensils] = useState(recipe?.utensils || '');
	const [saturatedFat, setSaturatedFat] = useState(recipe?.saturated_fat || '');
	const [calories, setCalories] = useState(recipe?.calories || '');
	const [carbohydrate, setCarbohydrate] = useState(recipe?.carbohydrate || '');
	const [sugar, setSugar] = useState(recipe?.sugar || '');
	const [fiber, setFiber] = useState(recipe?.fiber || '');
	const [protein, setProtein] = useState(recipe?.protein || '');
	const [cholesterol, setCholesterol] = useState(recipe?.cholesterol || '');
	const [sodium, setSodium] = useState(recipe?.sodium || '');
    const [fat, setFat] = useState(recipe?.fat || '');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave({
			_id: recipe?._id || '',
			title,
			difficulty,
			'total time': totalTime,
			ingredients: recipe?.ingredients || [],
			instructions: recipe?.instructions || [],
			utensils,
            fat,
			saturated_fat: saturatedFat,
			calories,
			carbohydrate,
			sugar,
			fiber,
			protein,
			cholesterol,
			sodium,
		});
	};
	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="title">Title</label>
				<input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />

				<label>Total Time</label>
				<input value={totalTime} onChange={(e) => setTotalTime(e.target.value)} />

				<label>Utensils</label>
				<input value={utensils} onChange={(e) => setUtensils(e.target.value)} />

				<label>Saturated Fat</label>
				<input value={saturatedFat} onChange={(e) => setSaturatedFat(e.target.value)} />

				<label>Calories</label>
				<input value={calories} onChange={(e) => setCalories(e.target.value)} />

				<label htmlFor="totalTime">Total Time</label>
				<input id="totalTime" value={totalTime} onChange={(e) => setTotalTime(e.target.value)} />

				<label htmlFor="difficulty">Difficulty</label>
				<select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
					<option value="">Select</option>
					<option value="Easy">Easy</option>
					<option value="Medium">Medium</option>
					<option value="Hard">Hard</option>
				</select>

				<label>Saturated Fat</label>
				<input value={saturatedFat} onChange={(e) => setSaturatedFat(e.target.value)} />

				<label>Fat</label>
				<input value={fat} onChange={(e) => setFat(e.target.value)} />

				<label>Calories</label>
				<input value={calories} onChange={(e) => setCalories(e.target.value)} />

				<label>Carbohydrate</label>
				<input value={carbohydrate} onChange={(e) => setCarbohydrate(e.target.value)} />

				<label>Sugar</label>
				<input value={sugar} onChange={(e) => setSugar(e.target.value)} />

				<label>Fiber</label>
				<input value={fiber} onChange={(e) => setFiber(e.target.value)} />

				<label>Protein</label>
				<input value={protein} onChange={(e) => setProtein(e.target.value)} />

				<label>Cholesterol</label>
				<input value={cholesterol} onChange={(e) => setCholesterol(e.target.value)} />

				<label>Sodium</label>
				<input value={sodium} onChange={(e) => setSodium(e.target.value)} />
			</div>
			<button type="submit">{recipe ? 'Save Changes' : 'Add Recipe'};</button>
			<button type="button" onClick={onCancel}>
				Cancel
			</button>
		</form>
	);
};

export default RecipeForm;
