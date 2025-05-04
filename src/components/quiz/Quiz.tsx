
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Question } from '@/types/quiz';
import { fetchDailyQuizQuestions } from '@/lib/quizService';
import { useTimer } from '@/hooks/useTimer';
import QuizHeader from './QuizHeader';
import QuestionDisplay from './QuestionDisplay';
import AnswerOptions from './AnswerOptions';
import NumericKeypad from './NumericKeypad';
import QuizComplete from './QuizComplete';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast"; // Import useToast

const QUIZ_DURATION_SECONDS = 120; // 2 minutes

const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [numericInput, setNumericInput] = useState<string>('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false); // To control feedback display timing

  const { toast } = useToast(); // Get toast function

  const handleTimeout = useCallback(() => {
    console.log("Time's up!");
    setQuizFinished(true);
    setTimeUp(true);
    // Optionally submit results automatically
  }, []);

   const { secondsRemaining, formattedTime, startTimer, pauseTimer, resetTimer } = useTimer(QUIZ_DURATION_SECONDS, handleTimeout);

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedQuestions = await fetchDailyQuizQuestions();
        // Ensure we have exactly 30 questions, or handle error/adjust logic
        if (fetchedQuestions.length !== 30) {
             console.warn(`Fetched ${fetchedQuestions.length} questions, expected 30. Adjusting...`);
             // Potentially throw error or use the fetched amount
             // For now, we'll proceed with the fetched amount but log a warning.
        }
        setQuestions(fetchedQuestions.slice(0, 30)); // Ensure max 30
        setQuizFinished(false);
        setTimeUp(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setNumericInput('');
        setIsAnswerCorrect(null);
        setShowFeedback(false);
        resetTimer(QUIZ_DURATION_SECONDS); // Reset timer with the correct duration
        startTimer();
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError("Could not load the quiz. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestions();

    // Cleanup timer on component unmount
     return () => pauseTimer(); // Pause timer if component unmounts
  }, [startTimer, resetTimer, pauseTimer]); // Add timer controls to dependency array


  const handleAnswerSelection = (answer: string) => {
    if (showFeedback) return; // Don't allow changes after feedback is shown

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return; // Safeguard

    setSelectedAnswer(answer); // For visual feedback on MCQ

    const correct = answer === currentQuestion.correctAnswer;
    setIsAnswerCorrect(correct);
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }

    // Show feedback briefly then move to next question
    setShowFeedback(true);
    pauseTimer(); // Pause timer during feedback

    // Use toast for instant feedback
     toast({
      title: correct ? "Correct!" : "Incorrect!",
      description: correct ? `Good job!` : `The correct answer was: ${currentQuestion.correctAnswer}`,
      variant: correct ? "default" : "destructive", // Using default for success, or could add a 'success' variant
       className: correct ? 'bg-success text-success-foreground border-success' : '', // Custom styling for success
      duration: 1500, // Show toast for 1.5 seconds
    });


    setTimeout(() => {
      goToNextQuestion();
      setShowFeedback(false); // Reset feedback visibility for next question
      // Check if quiz is finished *after* goToNextQuestion potentially updates it
       const isFinished = currentQuestionIndex >= questions.length - 1;
      if (!isFinished && !timeUp) { // Only resume timer if quiz is not finished and time is not up
           startTimer(); // Resume timer after feedback
      }
    }, 1500); // Wait 1.5 seconds before moving on
  };

  const handleNumericSubmit = (answer: string) => {
      handleAnswerSelection(answer); // Reuse the same logic
      setNumericInput(answer); // Keep the input displayed during feedback
  };


  const goToNextQuestion = () => {
    setSelectedAnswer(null);
    setNumericInput('');
    setIsAnswerCorrect(null);


    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizFinished(true);
      pauseTimer(); // Stop timer at the end
      // Submit results to Firebase here
    }
  };

   const restartQuiz = () => {
    // In a real app, this would likely check if a new day has started
    // or navigate the user elsewhere. For now, just re-fetch.
     setIsLoading(true);
    setError(null);
    const loadQuestions = async () => {
      try {
        const fetchedQuestions = await fetchDailyQuizQuestions();
         setQuestions(fetchedQuestions.slice(0, 30)); // Ensure max 30
        setQuizFinished(false);
        setTimeUp(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setNumericInput('');
        setIsAnswerCorrect(null);
         setShowFeedback(false);
        resetTimer(QUIZ_DURATION_SECONDS); // Reset timer
        startTimer(); // Start new timer
      } catch (err) {
        console.error("Failed to reload questions:", err);
        setError("Could not reload the quiz. Please try again later.");
      } finally {
         setIsLoading(false);
      }
    };
    loadQuestions();
  };


  if (isLoading) {
    return (
       <Card className="w-full max-w-2xl p-4 md:p-8 shadow-xl">
            <CardContent className="flex flex-col items-center justify-center space-y-4 min-h-[400px]">
                <Skeleton className="h-8 w-3/4 mb-2" /> {/* Header Placeholder */}
                 <Skeleton className="h-4 w-1/2 mb-6" /> {/* Progress Placeholder */}
                <Skeleton className="h-10 w-full mb-6" /> {/* Question Placeholder */}
                 {/* Simulate option placeholders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                 </div>
            </CardContent>
        </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="w-full max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

   if (quizFinished) {
    return <QuizComplete score={score} totalQuestions={questions.length} onRestart={restartQuiz} timeUp={timeUp}/>;
  }

  // Added check for empty questions *after* loading and error checks
   if (questions.length === 0) {
       return (
            <Alert className="w-full max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Questions</AlertTitle>
                <AlertDescription>No quiz questions available at the moment. Please check back later.</AlertDescription>
            </Alert>
       );
   }


  const currentQuestion = questions[currentQuestionIndex];

  // Add a safeguard: Ensure currentQuestion exists before rendering
  // This handles edge cases during transitions or if questions array/index gets into a weird state
  if (!currentQuestion) {
     // Show skeleton again or a simple loading text if currentQuestion is unexpectedly undefined
     return (
       <Card className="w-full max-w-2xl p-4 md:p-8 shadow-xl">
            <CardContent className="flex flex-col items-center justify-center space-y-4 min-h-[400px]">
                <Skeleton className="h-8 w-3/4 mb-2" />
                 <Skeleton className="h-4 w-1/2 mb-6" />
                <Skeleton className="h-10 w-full mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                 </div>
            </CardContent>
        </Card>
     );
  }


  return (
    <Card className="w-full max-w-2xl shadow-xl overflow-hidden">
      <QuizHeader
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        timeLeftFormatted={formattedTime}
      />
      <CardContent className="p-4 md:p-8 flex flex-col items-center">
        <QuestionDisplay questionText={currentQuestion.text} />

        {currentQuestion.answerType === 'text' ? (
          <AnswerOptions
            options={currentQuestion.options}
            onSelectAnswer={handleAnswerSelection}
            selectedAnswer={selectedAnswer}
            correctAnswer={showFeedback ? currentQuestion.correctAnswer : null}
            disabled={showFeedback} // Disable buttons when feedback is shown
          />
        ) : (
          <NumericKeypad
            onSubmitAnswer={handleNumericSubmit}
            currentInput={numericInput}
            setCurrentInput={setNumericInput}
            disabled={showFeedback} // Disable keypad when feedback is shown
            isCorrect={showFeedback ? isAnswerCorrect : null}
            correctAnswer={showFeedback ? currentQuestion.correctAnswer : null}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Quiz;

