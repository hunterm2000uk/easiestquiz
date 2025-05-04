'use client';

import type { QuizQuestion } from '@/lib/quizData';
import { fetchDailyQuizQuestions } from '@/lib/quizService';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import * as React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from "@/components/ui/skeleton";


export default function Quiz() {
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | number | null>(null);
  const [score, setScore] = React.useState(0);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [quizComplete, setQuizComplete] = React.useState(false);

  React.useEffect(() => {
    async function loadQuestions() {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedQuestions = await fetchDailyQuizQuestions(10); // Fetch 10 questions
        if (fetchedQuestions.length === 0) {
            setError("No questions were loaded. Please try again later.");
        } else {
             // Shuffle options client-side after fetch to avoid hydration issues if service was server-called
             const questionsWithOptionsShuffled = fetchedQuestions.map(q => ({
                ...q,
                options: [...q.options].sort(() => Math.random() - 0.5)
            }));
            setQuestions(questionsWithOptionsShuffled);
            // console.log("Questions set in state:", questionsWithOptionsShuffled.map(q => ({ q: q.question, o: q.options }))); // Debug log
        }
      } catch (err) {
        console.error('Failed to fetch questions:', err);
        setError('Failed to load quiz questions. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestions();
  }, []);

  const handleAnswerSelect = (answer: string | number) => {
    if (showFeedback) return; // Don't allow changing answer after submission
    setSelectedAnswer(answer);
    // console.log("Answer selected:", answer); // Debug log
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const correct = selectedAnswer === currentQuestion.correct_answer;

    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }
    setShowFeedback(true);
    // console.log("Submitted:", selectedAnswer, "Correct:", correct); // Debug log
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setIsCorrect(null);
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestartQuiz = () => {
    // Re-fetch and shuffle questions for a new attempt
    setIsLoading(true);
    setError(null);
    setQuizComplete(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(null);
    async function loadQuestions() {
      try {
        const fetchedQuestions = await fetchDailyQuizQuestions(10);
         if (fetchedQuestions.length === 0) {
            setError("No questions were loaded. Please try again later.");
        } else {
             const questionsWithOptionsShuffled = fetchedQuestions.map(q => ({
                ...q,
                options: [...q.options].sort(() => Math.random() - 0.5)
            }));
            setQuestions(questionsWithOptionsShuffled);
        }
      } catch (err) {
        console.error('Failed to fetch questions:', err);
        setError('Failed to load quiz questions. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestions();
  };


  if (isLoading) {
    return (
       <Card className="w-full max-w-2xl mx-auto p-4 md:p-8 shadow-xl">
          <CardHeader>
             <Skeleton className="h-8 w-3/4 mx-auto" /> {/* Header Placeholder */}
          </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[400px]">
                <Skeleton className="h-4 w-1/2" /> {/* Progress Placeholder */}
                <Skeleton className="h-10 w-full" /> {/* Question Placeholder */}
                <Skeleton className="h-12 w-full" /> {/* Option 1 */}
                <Skeleton className="h-12 w-full" /> {/* Option 2 */}
                 <Skeleton className="h-12 w-full" /> {/* Option 3 */}
                 <Skeleton className="h-12 w-full" /> {/* Option 4 */}
                 <Skeleton className="h-10 w-1/3 mt-4" /> {/* Button Placeholder */}
            </CardContent>
        </Card>
    );
  }

   if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
         <div className="flex items-center justify-center min-h-screen">
             <Alert className="w-full max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Questions</AlertTitle>
                <AlertDescription>No quiz questions available at the moment. Please check back later.</AlertDescription>
            </Alert>
        </div>
       );
   }


  if (quizComplete) {
    return (
      <Card className="w-full max-w-md mx-auto p-6 shadow-lg text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-4">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">Your final score is:</p>
          <p className="text-4xl font-bold mb-6">{score} / {questions.length}</p>
          <Button onClick={handleRestartQuiz}>Play Again</Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // console.log("Rendering Question:", currentQuestionIndex, currentQuestion?.question); // Debug log
  // console.log("Options for current question:", currentQuestion?.options); // Debug log


  return (
    <Card className="w-full max-w-2xl mx-auto p-4 md:p-8 shadow-xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold mb-2">Daily Quiz</CardTitle>
        <Progress value={progress} className="w-full h-2 mb-6" />
        <p className="text-center text-sm text-muted-foreground mb-4">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <h2 className="text-lg font-medium text-center">{currentQuestion.question}</h2>
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
                ? 'border-green-500 bg-green-100 dark:bg-green-900/30' // Correct answer style
                : isChecked // If checked but wrong
                ? 'border-red-500 bg-red-100 dark:bg-red-900/30' // Incorrect selected answer style
                : 'border-border opacity-70' // Other incorrect options
              : 'border-border hover:bg-accent'; // Default style

            return (
              <Label
                key={index}
                htmlFor={optionValue}
                className={cn(
                  "flex items-center space-x-3 p-4 border rounded-lg transition-colors cursor-pointer",
                   feedbackClass,
                   showFeedback ? 'cursor-default' : 'cursor-pointer'
                )}
              >
                <RadioGroupItem value={optionValue} id={optionValue} className="shrink-0"/>
                <span className="flex-1 text-sm">{option}</span>
                {showFeedback && isChecked && (
                  isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600 animate-feedback-pop" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 animate-feedback-pop" />
                  )
                )}
                 {showFeedback && !isChecked && isCorrectOption && (
                    <CheckCircle className="h-5 w-5 text-green-600" /> // Show checkmark for correct answer even if not selected
                 )}
              </Label>
            );
          })}
        </RadioGroup>

        <div className="flex justify-center mt-6">
          {!showFeedback ? (
            <Button onClick={handleSubmit} disabled={selectedAnswer === null}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          )}
        </div>

        {/* Optional: Show immediate feedback message */}
        {/* {showFeedback && isCorrect !== null && (
          <Alert variant={isCorrect ? 'success' : 'destructive'} className="mt-4">
             {isCorrect ? <CheckCircle className="h-4 w-4"/> : <XCircle className="h-4 w-4"/>}
            <AlertTitle>{isCorrect ? 'Correct!' : 'Incorrect'}</AlertTitle>
          </Alert>
        )} */}
      </CardContent>
    </Card>
  );
}
