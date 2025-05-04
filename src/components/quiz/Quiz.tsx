'use client';

import type { QuizQuestion } from '@/lib/quizData';
import { fetchDailyQuizQuestions } from '@/lib/quizService';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, Trophy, Clock } from 'lucide-react';
import * as React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const POINTS_PER_CORRECT = 10;
const PERFECTION_BONUS = 50;
const MAX_TIME_POINTS_FACTOR = 5; // Max time points = questions.length * this factor
const TIME_DEDUCTION_PER_SECOND = 0.5;

export default function Quiz() {
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | number | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = React.useState(0); // Renamed from score
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [quizComplete, setQuizComplete] = React.useState(false);
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [endTime, setEndTime] = React.useState<number | null>(null);
  const [finalScore, setFinalScore] = React.useState<{
      baseScore: number;
      timeScore: number;
      perfectionBonus: number;
      totalScore: number;
      elapsedTime: number;
  } | null>(null);

  const loadQuestions = React.useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);
        setQuizComplete(false);
        setCurrentQuestionIndex(0);
        setCorrectAnswersCount(0);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setIsCorrect(null);
        setStartTime(null);
        setEndTime(null);
        setFinalScore(null);

        const fetchedQuestions = await fetchDailyQuizQuestions(10); // Fetch 10 questions
        if (fetchedQuestions.length === 0) {
            setError("No questions were loaded. Please try again later.");
        } else {
             // Shuffle options client-side to avoid hydration issues
             const questionsWithOptionsShuffled = fetchedQuestions.map(q => ({
                ...q,
                options: [...q.options].sort(() => Math.random() - 0.5)
            }));
            setQuestions(questionsWithOptionsShuffled);
            setStartTime(Date.now()); // Record start time *after* questions are set
        }
      } catch (err) {
        console.error('Failed to fetch questions:', err);
        setError('Failed to load quiz questions. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    }, []); // Empty dependency array ensures this function is stable

  React.useEffect(() => {
    loadQuestions();
  }, [loadQuestions]); // Run once on mount

  const calculateScore = React.useCallback(() => {
      if (!startTime || !questions.length) return;

      const currentEndTime = Date.now();
      setEndTime(currentEndTime);

      const elapsedTimeSeconds = Math.round((currentEndTime - startTime) / 1000);
      const baseScore = correctAnswersCount * POINTS_PER_CORRECT;

      const maxTimePoints = questions.length * MAX_TIME_POINTS_FACTOR;
      const timeScoreRaw = maxTimePoints - (elapsedTimeSeconds * TIME_DEDUCTION_PER_SECOND);
      const timeScore = Math.max(0, Math.round(timeScoreRaw)); // Ensure time score isn't negative

      const isPerfect = correctAnswersCount === questions.length;
      const perfectionBonus = isPerfect ? PERFECTION_BONUS : 0;

      const totalScore = baseScore + timeScore + perfectionBonus;

      setFinalScore({
          baseScore,
          timeScore,
          perfectionBonus,
          totalScore,
          elapsedTime: elapsedTimeSeconds,
      });
       setQuizComplete(true); // Set quiz complete *after* calculation
  }, [startTime, correctAnswersCount, questions.length]);


  const handleAnswerSelect = (answer: string | number) => {
    if (showFeedback) return; // Don't allow changing answer after submission
    setSelectedAnswer(answer);

    const currentQuestion = questions[currentQuestionIndex];
    const correct = answer === currentQuestion.correct_answer;

    setIsCorrect(correct);
    if (correct) {
      setCorrectAnswersCount(prevCount => prevCount + 1);
    }
    setShowFeedback(true);

    // Delay before moving to the next question or completing the quiz
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowFeedback(false);
        setIsCorrect(null);
        setSelectedAnswer(null);
      } else {
        // Quiz finished, calculate final score
        calculateScore();
      }
    }, 1500); // Delay for 1.5 seconds
  };

  const handleRestartQuiz = () => {
    loadQuestions(); // Reload questions and reset state
  };

   // Format time in MM:SS
   const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };


  if (isLoading) {
    return (
       <Card className="w-full max-w-2xl mx-auto p-4 md:p-8 shadow-xl">
          <CardHeader>
             <Skeleton className="h-8 w-3/4 mx-auto mb-6" /> {/* Header Placeholder */}
             <Skeleton className="h-2 w-full mb-4" /> {/* Progress Placeholder */}
             <Skeleton className="h-4 w-1/2 mx-auto mb-4" /> {/* Question Count Placeholder */}
          </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[300px]">
                <Skeleton className="h-10 w-full text-center mb-6" /> {/* Question Placeholder */}
                <Skeleton className="h-12 w-full" /> {/* Option 1 */}
                <Skeleton className="h-12 w-full" /> {/* Option 2 */}
                 <Skeleton className="h-12 w-full" /> {/* Option 3 */}
                 <Skeleton className="h-12 w-full" /> {/* Option 4 */}
            </CardContent>
             <CardFooter className="pt-6">
                {/* Optionally add a skeleton for footer elements if needed */}
            </CardFooter>
        </Card>
    );
  }

   if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
           <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
        </Alert>
      </div>
    );
  }

   if (questions.length === 0 && !isLoading) {
       return (
         <div className="flex items-center justify-center min-h-screen p-4">
             <Alert className="w-full max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Questions</AlertTitle>
                <AlertDescription>No quiz questions available at the moment. Please check back later.</AlertDescription>
                 <Button onClick={handleRestartQuiz} className="mt-4">Try Again</Button>
            </Alert>
        </div>
       );
   }


  if (quizComplete && finalScore) {
    const isPerfect = finalScore.perfectionBonus > 0;
    return (
      <Card className="w-full max-w-lg mx-auto p-4 md:p-8 shadow-lg text-center">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-2">
             <Trophy className={`h-8 w-8 ${isPerfect ? 'text-yellow-500' : 'text-primary'}`} />
             Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-base md:text-lg">
           <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
              <span>Correct Answers:</span>
              <Badge variant="secondary">{correctAnswersCount} / {questions.length}</Badge>
          </div>
           <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                <span>Base Score:</span>
                <Badge variant="secondary">{finalScore.baseScore} pts</Badge>
            </div>
             <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                <span>Time Score:</span>
                 <Badge variant="secondary">+{finalScore.timeScore} pts</Badge>
            </div>
            {isPerfect && (
                <div className="flex justify-between items-center p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-300">
                    <span>Perfection Bonus:</span>
                    <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-300">+{finalScore.perfectionBonus} pts</Badge>
                </div>
            )}
            <div className="flex justify-between items-center p-3 bg-secondary rounded-lg mt-4">
                <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-muted-foreground"/> Time Taken:</span>
                <Badge variant="outline">{formatTime(finalScore.elapsedTime)}</Badge>
            </div>
          <Separator className="my-4" />
          <p className="text-xl md:text-2xl font-semibold mb-1">Your Final Score:</p>
          <p className="text-4xl md:text-5xl font-bold text-primary mb-6">{finalScore.totalScore}</p>
        </CardContent>
        <CardFooter className="flex justify-center pt-6">
           <Button onClick={handleRestartQuiz} size="lg">Play Again</Button>
        </CardFooter>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;


  return (
    <Card className="w-full max-w-2xl mx-auto p-4 md:p-8 shadow-xl">
      <CardHeader>
        <CardTitle className="text-center text-xl md:text-2xl font-semibold mb-2">Daily Quiz</CardTitle>
        <Progress value={progress} className="w-full h-2 mb-6" />
        <p className="text-center text-sm text-muted-foreground mb-4">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <h2 className="text-lg md:text-xl font-medium text-center min-h-[3em] flex items-center justify-center">{currentQuestion.question}</h2>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer?.toString()} // Convert to string for RadioGroup value
          onValueChange={(value) => handleAnswerSelect(currentQuestion.type === 'numeric' ? Number(value) : value)} // Convert back if numeric
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          disabled={showFeedback} // Disable options after submission
        >
          {currentQuestion.options.map((option, index) => {
            const optionValue = option.toString(); // Use string value for RadioGroupItem
            const isChecked = selectedAnswer === option;
            const isCorrectOption = option === currentQuestion.correct_answer;
            const feedbackClass = showFeedback
              ? isCorrectOption
                ? 'border-green-500 bg-green-100 dark:bg-green-900/30 ring-2 ring-green-500' // Correct answer style
                : isChecked // If checked but wrong
                ? 'border-red-500 bg-red-100 dark:bg-red-900/30 ring-2 ring-red-500' // Incorrect selected answer style
                : 'border-border opacity-60' // Other incorrect options
              : 'border-border hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'; // Default style + focus

            return (
              // Use a div wrapping Label and RadioGroupItem for better layout control and styling consistency
              <div key={index} className={cn(
                  "relative flex items-center space-x-3 p-4 border rounded-lg transition-all duration-300 ease-in-out",
                   feedbackClass,
                   showFeedback ? 'cursor-default' : 'cursor-pointer',
                   !showFeedback && 'hover:scale-[1.02] focus-within:scale-[1.02]', // Subtle hover/focus scale
                   isChecked && !showFeedback && 'ring-2 ring-primary', // Indicate selection before feedback
              )}>
                <RadioGroupItem
                  value={optionValue}
                  id={optionValue}
                  className="absolute top-4 left-4 shrink-0 peer" // Use peer for label association
                  aria-label={`Select option ${option}`}
                  disabled={showFeedback} // Ensure item itself is disabled
                 />
                <Label
                    htmlFor={optionValue}
                    className="flex-1 text-sm pl-6 peer-disabled:cursor-default" // Use pl for spacing, associate with peer
                >
                    {option}
                </Label>
                {/* Feedback Icons positioned absolutely */}
                {showFeedback && (
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                        {isChecked && isCorrect && (
                            <CheckCircle className="h-5 w-5 text-green-600 animate-feedback-pop" />
                        )}
                        {isChecked && !isCorrect && (
                             <XCircle className="h-5 w-5 text-red-600 animate-feedback-pop" />
                        )}
                         {!isChecked && isCorrectOption && (
                            <CheckCircle className="h-5 w-5 text-green-600 opacity-70" /> // Show checkmark for correct answer even if not selected
                         )}
                    </div>
                )}
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
       {/* Footer can be used for additional info if needed, e.g., current score */}
       {/* <CardFooter className="flex justify-end pt-6">
            <Badge variant="outline">Score: {correctAnswersCount * POINTS_PER_CORRECT}</Badge>
       </CardFooter> */}
    </Card>
  );
}
