import type { FC } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnswerOptionsProps {
  options: string[];
  onSelectAnswer: (answer: string) => void;
  selectedAnswer: string | null;
  correctAnswer: string | null; // Correct answer, revealed after selection
  disabled: boolean; // Disable buttons after an answer is selected
}

const AnswerOptions: FC<AnswerOptionsProps> = ({ options, onSelectAnswer, selectedAnswer, correctAnswer, disabled }) => {
  const getButtonVariant = (option: string): "default" | "destructive" | "success" | "outline" => {
    if (!selectedAnswer) return "outline"; // Default state before selection
    if (option === selectedAnswer) {
      return option === correctAnswer ? "success" : "destructive";
    }
    if (option === correctAnswer) {
       return "success"; // Highlight correct answer if wrong one was selected
    }
    return "outline"; // Non-selected, non-correct options
  };

  const getButtonClass = (option: string): string => {
    const variant = getButtonVariant(option);
    let classes = "justify-start text-left h-auto py-3 px-4 transition-all duration-300 ease-in-out transform hover:scale-[1.02]";

    if (variant === 'success') {
      classes += " btn-success"; // Use custom success class
    } else if (variant === 'destructive') {
        classes += " bg-destructive text-destructive-foreground hover:bg-destructive/90";
    } else {
       classes += " bg-background border-border hover:bg-accent hover:text-accent-foreground";
    }

     if (selectedAnswer && option !== selectedAnswer && option !== correctAnswer) {
       classes += " opacity-60 pointer-events-none"; // Dim unselected/incorrect options
     } else if (selectedAnswer && (option === selectedAnswer || option === correctAnswer)) {
       classes += " scale-105 ring-2 ring-offset-2"; // Emphasize selected/correct
        if(variant === 'success') classes += " ring-success";
        if(variant === 'destructive') classes += " ring-destructive";
     }


    return classes;
  };


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {options.map((option, index) => (
        <Button
          key={index}
          variant={getButtonVariant(option)}
          className={cn(getButtonClass(option))}
          onClick={() => onSelectAnswer(option)}
          disabled={disabled}
          aria-pressed={selectedAnswer === option}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};

export default AnswerOptions;
