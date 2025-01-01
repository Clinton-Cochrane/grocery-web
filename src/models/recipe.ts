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
