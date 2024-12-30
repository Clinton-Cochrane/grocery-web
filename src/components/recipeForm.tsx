import { Recipe } from "@/models/recipe";
import { useState } from "react";

interface RecipeFormProps {
    recipe?: Recipe | null;
    onSave: (recipe: Recipe) => void;
    onCancel: () => void;
  }

const RecipeForm: React.FC<RecipeFormProps> = ({recipe, onSave, onCancel}) => {
    const [title, setTitle] = useState(recipe?.title || "");
    const [difficulty, setDifficulty] = useState(recipe?.difficulty || "");
    const [totalTime, setTotalTime] = useState (recipe?.["total time"] || "");

    const handleSubmit = () => {
        onSave({
            _id: recipe?._id||"",
            title,
            difficulty,
            "total time": totalTime,
            ingredients: recipe?.ingredients || [],
            instructions: recipe?.instructions || []
        });
    };
    return(
        <div>

        </div>
    )



}

export default RecipeForm;