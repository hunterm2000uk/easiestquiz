// src/components/quiz/Quiz.tsx
'use client';

import type { QuizQuestion } from '@/lib/quizData';
import { fetchDailyQuizQuestions } from '@/lib/quizService';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, Trophy, Clock, Volume2 } from 'lucide-react';
import * as React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator"; // Import Separator
import { useToast } from "@/hooks/use-toast"; // Import useToast

const POINTS_PER_CORRECT = 10;
const PERFECTION_BONUS = 50;
const MAX_TIME_POINTS_FACTOR = 5; // Max time points = questions.length * this factor
const TIME_DEDUCTION_PER_SECOND = 0.5;
const INITIAL_TIME = 120; // 2 minutes in seconds

// Simple function to play audio - requires sound files in public/sounds/
// Ensure files 'correct.mp3' and 'incorrect.mp3' exist in the public/sounds directory.
const playSound = (soundFile: string) => {
  // Check if window is defined (runs only on client)
  if (typeof window !== 'undefined') {
    const audio = new Audio(`/sounds/${soundFile}`);
    audio.play().catch(error => console.error(`Error playing sound ${soundFile}:`, error));
  }
};

export default function Quiz() {
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | number | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = React.useState(0);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [quizComplete, setQuizComplete] = React.useState(false);
  const [remainingTime, setRemainingTime] = React.useState(INITIAL_TIME); // Countdown state
  const [finalScore, setFinalScore] = React.useState<{
      baseScore: number;
      timeScore: number;
      perfectionBonus: number;
      totalScore: number;
      elapsedTime: number; // Store elapsed time for display consistency
  } | null>(null);
  const [isMuted, setIsMuted] = React.useState(false); // Mute state
  const { toast } = useToast(); // Initialize toast

  const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null); // Ref to hold interval ID

  // Format time in MM:SS
  const formatTime = (totalSeconds: number): string => {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const stopTimer = React.useCallback(() => {
      if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
      }
  }, []);

  // Function to calculate score and end the quiz
  const handleQuizEnd = React.useCallback((isTimeUp = false) => {
      if (quizComplete) return; // Prevent multiple calculations
      stopTimer(); // Ensure timer is stopped

      // Capture the current state at the moment of quiz end
      const finalCorrectCount = correctAnswersCount; // Use state directly
      const finalRemainingTime = remainingTime;     // Use state directly
      const baseScore = finalCorrectCount * POINTS_PER_CORRECT;
      
      setQuizComplete(true); // Mark quiz as complete IMMEDIATELY

      const elapsedTime = isTimeUp ? INITIAL_TIME : INITIAL_TIME - finalRemainingTime;
      const finalElapsedTime = Math.max(0, elapsedTime); // Ensure elapsed time isn't negative

      

      // Calculate time score based on elapsed time
      const maxTimePoints = questions.length * MAX_TIME_POINTS_FACTOR;
      const timeScoreRaw = maxTimePoints - (finalElapsedTime * TIME_DEDUCTION_PER_SECOND);
      const timeScore = Math.max(0, Math.round(timeScoreRaw)); // Ensure time score isn't negative

      const isPerfect = finalCorrectCount === questions.length && !isTimeUp; // Perfection only if not timed out
      const perfectionBonus = isPerfect ? PERFECTION_BONUS : 0;

      const totalScore = baseScore + timeScore + perfectionBonus;

      setFinalScore({
          baseScore,
          timeScore,
          perfectionBonus,
          totalScore,
          elapsedTime: finalElapsedTime, // Store the calculated elapsed time
      });

      // Show completion toast
       toast({
           title: "Quiz Finished!",
           description: `You scored ${totalScore} points.`,
       });

  }, [correctAnswersCount, questions.length, remainingTime, quizComplete, stopTimer, toast]); // Added correctAnswersCount, remainingTime, quizComplete


  const loadQuestions = React.useCallback(async () => {
      try {
        stopTimer(); // Ensure previous timer is stopped
        setIsLoading(true);
        setError(null);
        setQuizComplete(false);
        setCurrentQuestionIndex(0);
        setCorrectAnswersCount(0);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setIsCorrect(null);
        setFinalScore(null);
        setRemainingTime(INITIAL_TIME); // Reset timer

        const fetchedQuestions = await fetchDailyQuizQuestions(10); // Fetch 10 questions
        if (fetchedQuestions.length === 0) {
            setError("No questions were loaded. Please try again later.");
             setIsLoading(false); // Stop loading if no questions
        } else {
            setQuestions(fetchedQuestions);
             // Timer start logic moved to useEffect based on isLoading and quizComplete
            setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch questions:', err);
        setError('Failed to load quiz questions. Please try refreshing the page.');
        setIsLoading(false); // Stop loading on error
      }
    }, [stopTimer]); // Removed handleQuizEnd dependency

  React.useEffect(() => {
    loadQuestions();
    // Ask for user interaction to enable audio playback initially if needed
    // This is a common browser restriction
    const enableAudio = () => {
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
       // You could potentially play a silent sound here to 'unlock' audio
      console.log("Audio context potentially enabled by user interaction.");
    };
    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);

    return () => {
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('touchstart', enableAudio);
        stopTimer(); // Ensure timer is cleared on unmount
    };
  }, [loadQuestions, stopTimer]); // Added stopTimer to dependencies

  // Timer Countdown Effect
  React.useEffect(() => {
      // Start timer only when not loading and quiz is not complete
      if (!isLoading && !quizComplete) {
          // Clear any existing interval before starting a new one
          if (timerIntervalRef.current) {
             clearInterval(timerIntervalRef.current);
          }
          timerIntervalRef.current = setInterval(() => {
              setRemainingTime(prevTime => {
                if (prevTime <= 1) {
                    // Use a callback with setQuizComplete to ensure the latest state
                    setQuizComplete(currentQuizCompleteState => {
                        if (!currentQuizCompleteState) {
                            // handleQuizEnd needs access to the *current* correctAnswersCount
                            // We pass it directly or ensure handleQuizEnd reads the latest state
                            handleQuizEnd(true); // Indicate time ran out
                        }
                        return true; // Update quizComplete state
                    });
                    clearInterval(timerIntervalRef.current!); // Stop the interval
                    timerIntervalRef.current = null;
                    return 0; // Set time to 0
                }
                return prevTime - 1; // Decrement time
              });
          }, 1000);
      } else {
          // If loading or quiz is already complete, ensure the timer is stopped.
          stopTimer();
      }

      // Cleanup function to clear interval when dependencies change or component unmounts
      return () => {
          stopTimer();
      };
      // Added handleQuizEnd as a dependency because it's used inside
  }, [isLoading, quizComplete, handleQuizEnd, stopTimer]);


  // Effect to check if time has run out (now redundant due to logic in setInterval, but safe fallback)
  React.useEffect(() => {
    if (remainingTime <= 0 && !quizComplete) {
        // console.log("Time's up! (Fallback check triggered)"); // Keep for debugging if needed
        // Ensure quiz end logic runs if the interval somehow missed it
         handleQuizEnd(true);
    }
  }, [remainingTime, quizComplete, handleQuizEnd]);


  const handleAnswerSelect = (answer: string | number) => {
    if (showFeedback || quizComplete) return; // Don't allow changes after feedback or completion

    setSelectedAnswer(answer);
    setShowFeedback(true); // Show feedback immediately

    const currentQuestion = questions[currentQuestionIndex];
    const correct = answer === currentQuestion.correct_answer;

    setIsCorrect(correct);

    let scoreChange = 0;
    if (correct) {
      scoreChange = 1; // We'll update the count *after* this handler resolves if needed
      if (!isMuted) playSound('correct.mp3'); // Play correct sound
    } else {
      if (!isMuted) playSound('incorrect.mp3'); // Play incorrect sound
    }

    // Update correct answer count *after* determining correctness for this question
    // Use functional update to ensure we're working with the latest count
    if (correct) {
        setCorrectAnswersCount(prevCount => prevCount + 1);
    }


    // Delay logic before moving to the next question or ending the quiz
    setTimeout(() => {
       // Check quizComplete *again* inside the timeout, as it might have been set by the timer
        if (quizComplete) {
            // If the quiz was completed (e.g., by timeout) while waiting for feedback, don't proceed further.
             // The score calculation in handleQuizEnd already captured the state at the moment of completion.
             return;
         }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setShowFeedback(false);
        setIsCorrect(null);
        setSelectedAnswer(null);
      } else {
        // Last question answered, end the quiz normally
         // Pass false to indicate it wasn't due to time running out
         handleQuizEnd(false);
      }
    }, 500); // Delay for 0.5 seconds
  };


  const handleRestartQuiz = () => {
    loadQuestions(); // Reload questions and reset state
  };

   const toggleMute = () => {
       setIsMuted(!isMuted);
       toast({
           title: isMuted ? "Sound Unmuted" : "Sound Muted",
           description: isMuted ? "Quiz sounds are now active." : "Quiz sounds have been turned off.",
           duration: 2000, // Shorter duration for mute toggle
       });
   };

  if (isLoading) {
    return (
       <Card className="w-full max-w-2xl mx-auto p-4 md:p-8 shadow-xl bg-gradient-to-br from-secondary to-muted/50">
          <CardHeader>
             <Skeleton className="h-8 w-3/4 mx-auto mb-6 bg-muted/70" /> {/* Header Placeholder */}
             <Skeleton className="h-2 w-full mb-4 bg-muted/70" /> {/* Progress Placeholder */}
             <Skeleton className="h-4 w-1/2 mx-auto mb-4 bg-muted/70" /> {/* Question Count Placeholder */}
          </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[300px]">
                <Skeleton className="h-10 w-full text-center mb-6 bg-muted/70" /> {/* Question Placeholder */}
                <Skeleton className="h-12 w-full bg-muted/70" /> {/* Option 1 */}
                <Skeleton className="h-12 w-full bg-muted/70" /> {/* Option 2 */}
                 <Skeleton className="h-12 w-full bg-muted/70" /> {/* Option 3 */}
                 <Skeleton className="h-12 w-full bg-muted/70" /> {/* Option 4 */}
            </CardContent>
             <CardFooter className="pt-6">
                 {/* Mute button skeleton */}
                <Skeleton className="h-10 w-10 rounded-full bg-muted/70 ml-auto"/>
            </CardFooter>
        </Card>
    );
  }

   if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="w-full max-w-md shadow-lg">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Oops! Something went wrong.</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
           <Button onClick={handleRestartQuiz} className="mt-4 w-full">Try Again</Button> {/* Changed to Restart */}
        </Alert>
      </div>
    );
  }

   if (questions.length === 0 && !isLoading) {
       return (
         <div className="flex items-center justify-center min-h-screen p-4">
             <Alert className="w-full max-w-md shadow-md">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>No Questions Available</AlertTitle>
                <AlertDescription>Looks like the quiz isn't ready yet. Please check back later.</AlertDescription>
                 <Button onClick={handleRestartQuiz} className="mt-4 w-full">Try Again</Button>
            </Alert>
        </div>
       );
   }


  if (quizComplete && finalScore) {
    const isPerfect = finalScore.perfectionBonus > 0;
    return (
      <Card className="w-full max-w-lg mx-auto p-4 md:p-8 shadow-2xl text-center bg-gradient-to-b from-background to-secondary/70 border-primary/50 border-2">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-2 animate-pulse">
             {/* Conditional Trophy Icon based on perfection */}
             <Trophy className={`h-10 w-10 ${isPerfect ? 'text-yellow-400 filter drop-shadow(0 0 5px #facc15)' : 'text-primary filter drop-shadow(0 0 3px #3498db)'}`} />
             Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-base md:text-lg">
            {/* Correct Answers Display */}
           <div className="flex justify-between items-center p-3 bg-secondary/80 rounded-lg shadow-inner">
              <span>Correct Answers:</span>
              {/* Badge color depends on perfection */}
              <Badge variant={isPerfect ? "success" : "secondary"} className="text-base">{correctAnswersCount} / {questions.length}</Badge>
          </div>
            {/* Base Score Display */}
           <div className="flex justify-between items-center p-3 bg-secondary/80 rounded-lg shadow-inner">
                <span>Base Score:</span>
                <Badge variant="secondary" className="text-base">{finalScore.baseScore} pts</Badge>
            </div>
            {/* Time Bonus Display */}
             <div className="flex justify-between items-center p-3 bg-secondary/80 rounded-lg shadow-inner">
                <span>Time Bonus:</span>
                 <Badge variant="secondary" className="text-base">+{finalScore.timeScore} pts</Badge>
            </div>
            {/* Perfection Bonus (Conditional) */}
            {isPerfect && (
                <div className="flex justify-between items-center p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-300 shadow-md border border-green-300">
                    <span className="font-semibold">Perfection Bonus:</span>
                    <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-300 font-bold text-base animate-feedback-pop">+{finalScore.perfectionBonus} pts</Badge>
                </div>
            )}
            {/* Time Taken Display */}
            <div className="flex justify-between items-center p-3 bg-secondary/80 rounded-lg shadow-inner mt-4">
                <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-4 w-4"/> Time Taken:</span>
                {/* Display time taken based on stored elapsed time */}
                <Badge variant="outline" className="text-base">{formatTime(finalScore.elapsedTime)}</Badge>
            </div>
          <Separator className="my-4 border-primary/30" />
          <p className="text-xl md:text-2xl font-semibold mb-1 text-foreground/90">Your Final Score:</p>
          <p className="text-4xl md:text-5xl font-bold text-primary drop-shadow-md mb-6">{finalScore.totalScore}</p>
        </CardContent>
        <CardFooter className="flex justify-center pt-6">
            {/* Restart Button */}
           <Button onClick={handleRestartQuiz} size="lg" className="shadow-lg transform hover:scale-105 transition-transform duration-200">
              <Trophy className="mr-2 h-5 w-5"/> Play Again
            </Button>
        </CardFooter>
      </Card>
    );
  }

  // Ensure currentQuestion is defined before accessing properties
  if (questions.length === 0 || currentQuestionIndex >= questions.length) {
     // Should ideally not be reached if loading/error/empty states are handled,
     // but provides a fallback skeleton.
     return (
        <Card className="w-full max-w-2xl mx-auto p-4 md:p-8 shadow-xl bg-gradient-to-br from-secondary to-muted/50">
            <CardHeader>
             <Skeleton className="h-8 w-3/4 mx-auto mb-6 bg-muted/70" />
             <Skeleton className="h-2 w-full mb-4 bg-muted/70" />
             <Skeleton className="h-4 w-1/2 mx-auto mb-4 bg-muted/70" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[300px]">
                <Skeleton className="h-10 w-full text-center mb-6 bg-muted/70" />
                <Skeleton className="h-12 w-full bg-muted/70" />
                <Skeleton className="h-12 w-full bg-muted/70" />
                 <Skeleton className="h-12 w-full bg-muted/70" />
                 <Skeleton className="h-12 w-full bg-muted/70" />
            </CardContent>
             <CardFooter className="pt-6">
                <Skeleton className="h-10 w-10 rounded-full bg-muted/70 ml-auto"/>
            </CardFooter>
        </Card>
     );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;


  return (
    <Card className="w-full max-w-2xl mx-auto p-4 md:p-8 shadow-2xl bg-gradient-to-br from-card via-background to-secondary/30 border">
      <CardHeader>
        <CardTitle className="text-center text-xl md:text-2xl font-semibold mb-2 text-primary drop-shadow-sm">Daily Quiz Challenge</CardTitle>
        <Progress value={progress} className="w-full h-2 mb-2" />
         {/* Timer and Question Count Row */}
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
            <Badge variant="outline">Question {currentQuestionIndex + 1} / {questions.length}</Badge>
            <Badge variant={remainingTime <= 10 && !quizComplete ? "destructive" : "outline"} className={cn(
                 "flex items-center gap-1 transition-colors duration-300",
                 // Pulse animation when time is low and quiz is not complete
                 remainingTime <= 10 && !quizComplete ? "animate-pulse" : ""
             )}>
                 <Clock className="h-4 w-4" />
                 {formatTime(remainingTime)} {/* Display Remaining Time */}
            </Badge>
        </div>
        <h2 className="text-lg md:text-xl font-medium text-center min-h-[3em] flex items-center justify-center p-2 bg-secondary/50 rounded-md shadow-inner">{currentQuestion.question}</h2>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer?.toString()} // Convert to string for RadioGroup value
          onValueChange={(value) => handleAnswerSelect(currentQuestion.type === 'numeric' ? Number(value) : value)} // Convert back if numeric
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          disabled={showFeedback || quizComplete} // Disable options after submission or completion
        >
          {currentQuestion.options.map((option, index) => {
            const optionValue = option.toString(); // Use string value for RadioGroupItem
            const isChecked = selectedAnswer === option;
            const isCorrectOption = option === currentQuestion.correct_answer;

            // Determine feedback styling based on state
            let feedbackClass = 'border-border hover:bg-accent/50 focus-within:ring-2 focus-within:ring-primary/50'; // Default state
            if (showFeedback) {
              if (isCorrectOption) {
                feedbackClass = 'border-green-500 bg-green-100/80 dark:bg-green-900/50 ring-2 ring-green-500/80 animate-correct-answer'; // Correct answer style
              } else if (isChecked) { // Incorrect and selected
                feedbackClass = 'border-red-500 bg-red-100/80 dark:bg-red-900/50 ring-2 ring-red-500/80 animate-incorrect-answer'; // Incorrect selected answer style
              } else { // Incorrect and not selected
                feedbackClass = 'border-border opacity-60 cursor-default'; // Other incorrect options faded
              }
            } else if (isChecked) {
                // Style for the selected item before feedback is shown
                feedbackClass = 'ring-2 ring-primary border-primary bg-accent/30';
            }


            return (
              // Use a div wrapping Label and RadioGroupItem for better layout control and styling consistency
              <div key={`${currentQuestionIndex}-${index}`} className={cn( // Ensure key is unique across questions
                  "relative flex items-center space-x-3 p-4 border rounded-lg transition-all duration-300 ease-in-out shadow-sm",
                   feedbackClass,
                   // Apply cursor and hover effects only when interactive
                   (showFeedback || quizComplete) ? 'cursor-default' : 'cursor-pointer transform hover:scale-[1.03] focus-within:scale-[1.03]',
              )}>
                <RadioGroupItem
                  value={optionValue}
                  id={`${optionValue}-${index}-${currentQuestionIndex}`} // Ensure unique ID includes question index
                  className="absolute top-4 left-4 shrink-0 peer" // Use peer for label association
                  aria-label={`Select option ${option}`}
                  disabled={showFeedback || quizComplete} // Ensure item itself is disabled
                 />
                <Label
                    htmlFor={`${optionValue}-${index}-${currentQuestionIndex}`} // Match ID
                    className={cn(
                        "flex-1 text-sm pl-6", // Use pl for spacing, associate with peer
                         // Adjust cursor based on state
                         (showFeedback || quizComplete) ? 'cursor-default' : 'cursor-pointer peer-disabled:cursor-default'
                    )}
                >
                    {option}
                </Label>
                {/* Feedback Icons positioned absolutely */}
                {showFeedback && (
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                        {isChecked && isCorrect && (
                            // Correct selection icon
                            <CheckCircle className="h-5 w-5 text-green-600 animate-feedback-pop" />
                        )}
                        {isChecked && !isCorrect && (
                            // Incorrect selection icon
                             <XCircle className="h-5 w-5 text-red-600 animate-feedback-pop" />
                        )}
                         {!isChecked && isCorrectOption && (
                            // Icon indicating the correct answer if user chose wrong
                            <CheckCircle className="h-5 w-5 text-green-600 opacity-50" />
                         )}
                    </div>
                )}
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
       {/* Footer with Mute Button */}
       <CardFooter className="flex justify-end pt-6 border-t border-border/50 mt-4">
            {/* Mute Toggle Button */}
           <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute sound" : "Mute sound"}
                className="rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-colors"
            >
               <Volume2 className={`h-5 w-5 ${isMuted ? 'opacity-50' : ''}`} />
                {/* Optional: Add visual indicator for mute state like a small X */}
                {isMuted && <XCircle className="h-3 w-3 absolute bottom-0 right-0 text-destructive" />}
           </Button>
       </CardFooter>
    </Card>
  );
}

    