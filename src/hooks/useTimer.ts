import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for a countdown timer.
 * @param initialSeconds The initial duration of the timer in seconds.
 * @param onTimeout Callback function to execute when the timer reaches zero.
 * @returns An object containing the remaining time in seconds and functions to control the timer.
 */
export const useTimer = (initialSeconds: number, onTimeout: () => void) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutCallbackRef = useRef(onTimeout);

  // Keep the callback ref updated if the parent component re-renders with a new callback
  useEffect(() => {
    timeoutCallbackRef.current = onTimeout;
  }, [onTimeout]);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsRemaining((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearTimerInterval();
            setIsRunning(false);
            timeoutCallbackRef.current(); // Execute the timeout callback
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      clearTimerInterval();
    }

    // Cleanup interval on component unmount or when isRunning changes to false
    return () => clearTimerInterval();
  }, [isRunning, clearTimerInterval]);

  const startTimer = useCallback(() => {
    if (!isRunning && secondsRemaining > 0) {
      setIsRunning(true);
    }
  }, [isRunning, secondsRemaining]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback((newInitialSeconds?: number) => {
    clearTimerInterval();
    setIsRunning(false);
    setSecondsRemaining(newInitialSeconds ?? initialSeconds);
  }, [initialSeconds, clearTimerInterval]);


  // Function to format seconds into MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return {
    secondsRemaining,
    formattedTime: formatTime(secondsRemaining),
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
  };
};
