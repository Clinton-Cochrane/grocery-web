import { Recipe, Ingredient } from "@/models/recipe";

export const aggregateIngredients = (recipes: {recipe: Recipe; quantity: number}[]): Ingredient[] => {
	const ingredientMap = recipes.reduce((map, {recipe, quantity}) => {
		recipe.ingredients.forEach(({ name, amount, measurement }) => {
			const key = `${name}-${measurement}`;
			amount = amount * quantity;
			if (map.has(key)) {
				map.get(key)!.amount += amount;
			} else {
				map.set(key, { name, amount, measurement });
			}
		});
		return map;
	}, new Map<string, Ingredient>());

	return Array.from(ingredientMap.values());
};
