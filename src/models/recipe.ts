export interface Recipe {
	_id: string;
	title: string;
	ingredients: string[];
	instructions: { key: string; value: string }[];
	'total time'?: string;
	utensils?: string;
	difficulty?: string;
	description?: string;
	url?: string;
	saturated_fat?: string;
	fat?: string;
	calories?: string;
	carbohydrate?: string;
	sugar?: string;
	fiber?: string;
	protein?: string;
	cholesterol?: string;
	sodium?: string;
}