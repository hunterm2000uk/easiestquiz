import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionDisplayProps {
  questionText: string;
}

const QuestionDisplay: FC<QuestionDisplayProps> = ({ questionText }) => {
  return (
    <Card className="w-full mb-6 text-center shadow-sm border-none bg-transparent">
       <CardContent className="p-0">
        <p className="text-xl md:text-2xl font-semibold text-foreground">
          {questionText}
        </p>
      </CardContent>
    </Card>
  );
};

export default QuestionDisplay;
