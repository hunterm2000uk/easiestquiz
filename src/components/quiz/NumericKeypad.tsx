import type { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Check } from 'lucide-react';

interface NumericKeypadProps {
  onSubmitAnswer: (answer: string) => void;
  currentInput: string;
  setCurrentInput: (input: string) => void;
  disabled: boolean; // Disable keypad after submission
  isCorrect: boolean | null; // For feedback display
  correctAnswer: string | null; // To show correct answer if wrong
}

const NumericKeypad: FC<NumericKeypadProps> = ({
  onSubmitAnswer,
  currentInput,
  setCurrentInput,
  disabled,
  isCorrect,
  correctAnswer
}) => {
  const handleKeyPress = (key: string) => {
    if (disabled) return;
    if (key === 'clear') {
      setCurrentInput('');
    } else if (key === 'backspace') {
      setCurrentInput(currentInput.slice(0, -1));
    } else {
      // Limit input length if necessary, e.g., max 6 digits
      if (currentInput.length < 6) {
        setCurrentInput(currentInput + key);
      }
    }
  };

  const handleSubmit = () => {
    if (currentInput.length > 0 && !disabled) {
      onSubmitAnswer(currentInput);
    }
  };

  const feedbackIcon = isCorrect === true ? <Check className="text-success animate-feedback-pop" size={24} /> :
                       isCorrect === false ? <X className="text-destructive animate-feedback-pop" size={24} /> : null;

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto">
       <div className="relative w-full mb-4">
        <Input
          type="text" // Use text to allow empty string and easier manipulation
          value={currentInput}
          readOnly
          placeholder="Enter number"
          className={`text-center text-2xl font-semibold h-14 pr-10 ${
            isCorrect === true ? 'border-success ring-2 ring-success' :
            isCorrect === false ? 'border-destructive ring-2 ring-destructive' :
            'border-input'
          }`}
          aria-label="Numeric answer input"
          aria-invalid={isCorrect === false}
        />
        {feedbackIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {feedbackIcon}
          </div>
        )}
      </div>
       {isCorrect === false && correctAnswer && (
        <p className="text-destructive mb-2 text-sm">Correct answer: {correctAnswer}</p>
      )}
      <div className="grid grid-cols-3 gap-2 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="outline"
            size="lg"
            className="text-xl h-14"
            onClick={() => handleKeyPress(String(num))}
            disabled={disabled}
            aria-label={`Number ${num}`}
          >
            {num}
          </Button>
        ))}
         <Button
            variant="outline"
            size="lg"
            className="text-xl h-14"
            onClick={() => handleKeyPress('0')}
            disabled={disabled || currentInput.length === 0 && currentInput.length >= 6}
             aria-label="Number 0"
          >
            0
          </Button>
        <Button
          variant="outline"
          size="lg"
          className="text-destructive hover:bg-destructive/10 h-14"
          onClick={() => handleKeyPress('backspace')}
          disabled={disabled || currentInput.length === 0}
          aria-label="Backspace"
        >
          <X size={24} />
        </Button>
        <Button
          variant="default"
          size="lg"
          className="text-xl h-14 bg-primary hover:bg-primary/90"
          onClick={handleSubmit}
          disabled={disabled || currentInput.length === 0}
          aria-label="Submit Answer"
        >
          <Check size={24} />
        </Button>
      </div>

    </div>
  );
};

export default NumericKeypad;
