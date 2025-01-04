import { Recipe } from '@/models/recipe';

export interface ValidationResult {
	isValid: boolean;
	errors: Record<string, string>;
}

export const validateRecipe = (data: Recipe): ValidationResult => {
	const errors: Record<string, string> = {};

	//required fields
	if (!data.title) errors.title = 'Title is Required';
	if (!data.difficulty) errors.difficulty = 'Difficulty is Required';
	if (!data['total time']) errors['total time'] = 'Total Time is Required';

	const numericFields = [
		{ name: 'calories', value: data.calories },
		{ name: 'saturatedFat', value: data.saturated_fat },
		{ name: 'carbohydrate', value: data.carbohydrate },
		{ name: 'sugar', value: data.sugar },
		{ name: 'fiber', value: data.fiber },
		{ name: 'protein', value: data.protein },
		{ name: 'cholesterol', value: data.cholesterol },
		{ name: 'sodium', value: data.sodium },
		{ name: 'fat', value: data.fat },
	];

    numericFields.forEach(({name, value}) => {
        if(value && isNaN(Number(value))) {
            errors[name] = `${name.replace(/([A-Z])/g, ' $1')} must be a number.`
        }
    });

    return{isValid: Object.keys(errors).length===0, errors};
};
