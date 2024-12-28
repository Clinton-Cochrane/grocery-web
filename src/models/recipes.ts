export interface Recipe {
    _id: string;
    title: string;
    ingredients: string[];
    instructions: {key: string, value: string}[];
    "total time"?: string;
    utensils?: string;
    difficulty?: string;
}