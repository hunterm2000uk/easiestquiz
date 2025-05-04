import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Clock } from 'lucide-react';

interface QuizCompleteProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void; // Or navigate somewhere else
  timeUp?: boolean;
}

const QuizComplete: FC<QuizCompleteProps> = ({ score, totalQuestions, onRestart, timeUp = false }) => {
  const percentage = totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(0) : 0;

  return (
    <Card className="w-full max-w-md text-center shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            {timeUp ? <><Clock className="text-destructive" /> Time's Up!</> : <><Award className="text-success" /> Quiz Complete!</>}
        </CardTitle>
         <CardDescription>
          {timeUp ? "You ran out of time." : "You've completed the daily quiz."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         <div className="text-4xl font-bold text-primary">
          {score} / {totalQuestions}
        </div>
         <p className="text-lg text-muted-foreground">
          That's {percentage}% correct!
        </p>
        {/* Add more stats or encouragement here */}
      </CardContent>
      <CardFooter className="flex justify-center">
         {/* In a real app, this might submit results or navigate away */}
        <Button onClick={onRestart} size="lg">
           Play Again Tomorrow
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizComplete;
