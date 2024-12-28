import { useEffect, useState } from "react";

interface InstructionItem {
  key: string;
  value: string;
}

interface StepsInputProps {
  initialSteps: InstructionItem[];
  onStepsChange: (steps: InstructionItem[]) => void;
}

const StepsInput: React.FC<StepsInputProps> = ({
  initialSteps,
  onStepsChange,
}) => {
  const [steps, setSteps] = useState<InstructionItem[]>(initialSteps);

  useEffect(() => {
    setSteps(initialSteps);
  }, [initialSteps]);

  const addStep = () => {
    const updatedSteps = [...steps, { key: `${steps.length}`, value: "" }];
    setSteps(updatedSteps);
    onStepsChange(updatedSteps);
  };

  const removeStep = (index: number) => {
    const updatedSteps = steps.filter((_, i) => i !== index);
    setSteps(updatedSteps);
    onStepsChange(updatedSteps);
  };

  const handleChangeStep = (text: string, index: number) => {
    const updatedSteps = [...steps];
    updatedSteps[index].value = text;
    setSteps(updatedSteps);
    onStepsChange(updatedSteps);
  };

  return (
    <div>
      <ul>
        {steps.map((item, index) => (
          <li key={item.key}>
            <input
              type="text"
              placeholder={`Step ${index + 1}`}
              value={item.value}
              onChange={(e) => handleChangeStep(e.target.value, index)}
            />
            <button onClick={() => removeStep(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={addStep}>Add Step</button>
    </div>
  );
};

export default StepsInput;
