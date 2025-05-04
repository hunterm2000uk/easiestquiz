// src/lib/quizService.ts
import { quizQuestions, type QuizQuestion } from './quizData';

// Function to shuffle an array (Fisher-Yates shuffle)
// This should ideally be run client-side if used, to avoid hydration issues
function shuffleArray<T>(array: T[]): T[] {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }

  return array;
}


// Simulate fetching questions - return a shuffled subset of the hardcoded data
// IMPORTANT: If this service is called from a Server Component, Math.random() can cause hydration mismatches.
// For this simple example, we assume it's called client-side or the shuffling effect isn't critical for the initial render.
// A more robust solution would fetch static order and shuffle client-side in useEffect.
export async function fetchDailyQuizQuestions(count: number = 10): Promise<QuizQuestion[]> {
  // Shuffle the main question list first
  const shuffledQuestions = shuffleArray([...quizQuestions]); // Shuffle a copy

  // Then shuffle options within each selected question
  const selectedQuestions = shuffledQuestions.slice(0, count).map(q => ({
    ...q,
    options: shuffleArray([...q.options]) // Shuffle options for presentation
  }));

  // console.log("Fetched Questions:", selectedQuestions.map(q => ({ q: q.question, o: q.options }))); // Debug log
  return Promise.resolve(selectedQuestions);
}