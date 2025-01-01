import { Recipe, Ingredient } from "@/models/recipe";

export const aggregateIngredients = (recipes: Recipe[]): Ingredient[] => {
	const ingredientMap = recipes.reduce((map, recipe) => {
		recipe.ingredients.forEach(({ name, amount, measurement }) => {
			const key = `${name}-${measurement}`;
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
