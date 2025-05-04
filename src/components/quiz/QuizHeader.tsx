import type { FC } from 'react';
import { Progress } from "@/components/ui/progress";
import { Clock } from 'lucide-react';

interface QuizHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  timeLeftFormatted: string;
}

const QuizHeader: FC<QuizHeaderProps> = ({ currentQuestionIndex, totalQuestions, timeLeftFormatted }) => {
  const progressValue = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <div className="w-full mb-6 p-4 bg-primary text-primary-foreground rounded-t-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">
          Question {currentQuestionIndex + 1} / {totalQuestions}
        </span>
        <div className="flex items-center space-x-2 text-sm font-semibold bg-white text-primary px-3 py-1 rounded-full shadow-sm">
           <Clock size={16} />
           <span>{timeLeftFormatted}</span>
        </div>
      </div>
      <Progress value={progressValue} className="w-full h-2 bg-primary-foreground/30 [&>div]:bg-primary-foreground" aria-label={`Quiz progress: ${currentQuestionIndex + 1} of ${totalQuestions} questions answered`} />
    </div>
  );
};

export default QuizHeader;
