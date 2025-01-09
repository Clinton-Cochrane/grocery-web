import { Recipe } from '@/models/recipe';

export const aggregateIngredients = (selectedRecipes: { recipe: Recipe; quantity: number }[]) => {
	// Create a Map to store aggregated ingredients by a unique key (name + measurement)
	const ingredientMap = new Map<string, { name: string; amount: number; measurement: string }>();

	selectedRecipes.forEach(({ recipe, quantity }) => {
		recipe.ingredients.forEach((ingredient) => {
			let amount = 0;
			let measurement = "Unknown";
			let name = "";

			// Parse the ingredient if it's stored as an array
			if (Array.isArray(ingredient)) {
				const [rawAmountMeasurement, rawName] = ingredient;
				name = rawName || "Unknown";

				// Extract amount and measurement (e.g., "6 ounce")
				const match = rawAmountMeasurement?.match(/^(\d+)(.*)$/); // Match digits and unit
				if (match) {
					amount = parseFloat(match[1]) || 0; // Parse the amount
					measurement = match[2]?.trim() || "Unknown"; // Extract the measurement
				}
			}

			// Scale amount by quantity
			amount *= quantity;

			// Create a unique key for the ingredient (name + measurement)
			const key = `${name.toLowerCase()}|${measurement.toLowerCase()}`;

			// If the ingredient exists in the map, update the amount
			if (ingredientMap.has(key)) {
				const existing = ingredientMap.get(key)!;
				existing.amount += amount;
			} else {
				// Otherwise, add the new ingredient
				ingredientMap.set(key, { name, amount, measurement });
			}
		});
	});

	// Convert the Map back to an array
	return Array.from(ingredientMap.values());
};

export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
		let timer: ReturnType<typeof setTimeout>;
		return (...args: Parameters<T>) => {
			clearTimeout(timer);
			timer = setTimeout(() => func(...args), delay);
		};
	};


