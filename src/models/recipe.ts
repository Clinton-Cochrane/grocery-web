export interface Ingredient {
	_id?: string;
	name: string;
	amount: number;
	measurement: string;
}

export interface Recipe {
	_id: string;
	fat?: string;
	url?: string;
	title: string;
	fiber?: string;
	sugar?: string;
	sodium?: string;
	protein?: string;
	calories?: string;
	utensils?: string;
	difficulty?: string;
	cholesterol?: string;
	description?: string;
	carbohydrate?: string;
	'total time'?: string;
	saturated_fat?: string;
	ingredients: Ingredient[];
	instructions: { key: string; value: string }[];
}


export const recipeFieldConfig = [
	{ name: 'fat', label: 'Fat', type: 'number' },
	{ name: 'sugar', label: 'Sugar', type: 'number' },
	{ name: 'fiber', label: 'Fiber', type: 'number' },
	{ name: 'sodium', label: 'Sodium', type: 'number' },
	{ name: 'utensils', label: 'Utensils', type: 'text' },
	{ name: 'calories', label: 'Calories', type: 'number' },
	{ name: 'cholesterol', label: 'Cholesterol', type: 'number' },
	{ name: 'title', label: 'Title', type: 'text', required: true },
	{ name: 'carbohydrate', label: 'Carbohydrate', type: 'number' },
	{ name: 'saturatedFat', label: 'Saturated Fat', type: 'number' },
	{ name: 'totalTime', label: 'Total Time', type: 'text', required: true },
	{ name: 'difficulty', label: 'Difficulty', type: 'select', required: true, options: ['Easy', 'Medium', 'Hard'] },
  ];