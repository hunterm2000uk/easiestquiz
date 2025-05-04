import type { Question } from '@/types/quiz';

// Mock data - Replace with actual Firebase fetching logic
const mockQuestions: Question[] = [
  { id: 'q1', text: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctAnswer: '4', answerType: 'number' },
  { id: 'q2', text: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome', 'London', 'Oslo'], correctAnswer: 'Paris', answerType: 'text' },
  { id: 'q3', text: 'What is 10 - 3?', options: ['6', '7', '8', '9'], correctAnswer: '7', answerType: 'number' },
  { id: 'q4', text: 'Which planet is known as the Red Planet?', options: ['Earth', 'Mars', 'Jupiter', 'Saturn', 'Venus', 'Mercury'], correctAnswer: 'Mars', answerType: 'text' },
  { id: 'q5', text: 'What is 5 * 3?', options: ['12', '15', '18', '20'], correctAnswer: '15', answerType: 'number' },
  // Add more mock questions up to 30 if needed for testing.
  // Ensure a mix of 'text' and 'number' answerTypes.
   { id: 'q6', text: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific', 'Southern', 'Caribbean'], correctAnswer: 'Pacific', answerType: 'text' },
  { id: 'q7', text: 'What is 9 / 3?', options: ['1', '2', '3', '4'], correctAnswer: '3', answerType: 'number' },
  { id: 'q8', text: 'Who wrote "Hamlet"?', options: ['Charles Dickens', 'Leo Tolstoy', 'William Shakespeare', 'Mark Twain', 'Jane Austen', 'George Orwell'], correctAnswer: 'William Shakespeare', answerType: 'text' },
  { id: 'q9', text: 'What is the square root of 64?', options: ['6', '7', '8', '9'], correctAnswer: '8', answerType: 'number' },
  { id: 'q10', text: 'What gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen', 'Helium', 'Methane'], correctAnswer: 'Carbon Dioxide', answerType: 'text' },
  // Fill up to 30...
  { id: 'q11', text: 'What is 7 + 8?', options: ['13', '14', '15', '16'], correctAnswer: '15', answerType: 'number' },
  { id: 'q12', text: 'In which country are the pyramids of Giza located?', options: ['Mexico', 'Peru', 'Egypt', 'Sudan', 'Greece', 'Italy'], correctAnswer: 'Egypt', answerType: 'text' },
  { id: 'q13', text: 'What is 20 / 4?', options: ['4', '5', '6', '7'], correctAnswer: '5', answerType: 'number' },
  { id: 'q14', text: 'What is the chemical symbol for water?', options: ['O2', 'H2O', 'CO2', 'NaCl', 'H2', 'HO'], correctAnswer: 'H2O', answerType: 'text' },
  { id: 'q15', text: 'What is 6 * 6?', options: ['30', '36', '42', '48'], correctAnswer: '36', answerType: 'number' },
  { id: 'q16', text: 'What is the longest river in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi', 'Congo', 'Mekong'], correctAnswer: 'Nile', answerType: 'text' }, // Nile is often cited, though Amazon is close/contested
  { id: 'q17', text: 'What is 100 - 25?', options: ['70', '75', '80', '85'], correctAnswer: '75', answerType: 'number' },
  { id: 'q18', text: 'What is the currency of Japan?', options: ['Dollar', 'Euro', 'Yen', 'Won', 'Peso', 'Rupee'], correctAnswer: 'Yen', answerType: 'text' },
  { id: 'q19', text: 'What is 11 * 3?', options: ['30', '31', '32', '33'], correctAnswer: '33', answerType: 'number' },
  { id: 'q20', text: 'Who painted the Mona Lisa?', options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo', 'Claude Monet', 'Rembrandt'], correctAnswer: 'Leonardo da Vinci', answerType: 'text' },
  { id: 'q21', text: 'What is 50 + 15?', options: ['60', '65', '70', '75'], correctAnswer: '65', answerType: 'number' },
  { id: 'q22', text: 'What is the main ingredient in guacamole?', options: ['Tomato', 'Onion', 'Avocado', 'Lime', 'Pepper', 'Corn'], correctAnswer: 'Avocado', answerType: 'text' },
  { id: 'q23', text: 'What is 8 * 7?', options: ['49', '54', '56', '63'], correctAnswer: '56', answerType: 'number' },
  { id: 'q24', text: 'How many continents are there?', options: ['5', '6', '7', '8', '9', '10'], correctAnswer: '7', answerType: 'text' }, // Commonly accepted number
  { id: 'q25', text: 'What is 12 + 13?', options: ['24', '25', '26', '27'], correctAnswer: '25', answerType: 'number' },
  { id: 'q26', text: 'What is the primary color of the Smurfs?', options: ['Red', 'Green', 'Blue', 'Yellow', 'Purple', 'White'], correctAnswer: 'Blue', answerType: 'text' },
  { id: 'q27', text: 'What is 30 / 5?', options: ['5', '6', '7', '8'], correctAnswer: '6', answerType: 'number' },
  { id: 'q28', text: 'What is the hardest natural substance on Earth?', options: ['Gold', 'Iron', 'Quartz', 'Diamond', 'Topaz', 'Steel'], correctAnswer: 'Diamond', answerType: 'text' },
  { id: 'q29', text: 'What is 9 * 9?', options: ['72', '81', '90', '99'], correctAnswer: '81', answerType: 'number' },
  { id: 'q30', text: 'What is the boiling point of water in Celsius?', options: ['0', '50', '90', '100', '110', '120'], correctAnswer: '100', answerType: 'text' }, // Representing as text for consistency
];

// Function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};


// Function to prepare options based on answer type
const prepareOptions = (question: Question): string[] => {
    if (question.answerType === 'number') {
        // For number types, the 'options' array in mock data might be suggestions or distractors
        // but the input method is keypad. We don't need explicit options for display.
        // However, if we wanted MCQs for numbers too, we'd use the options.
        // For this implementation, keypad is used, so options array isn't directly shown.
         return []; // Return empty or handle as needed if numbers could also be MCQ
    } else { // 'text'
        // Ensure the correct answer is included and shuffle
        const optionsSet = new Set(question.options);
        optionsSet.add(question.correctAnswer);

        // Ensure we have exactly 6 options for text questions
        const finalOptions = Array.from(optionsSet);
        while (finalOptions.length < 6) {
           // Add plausible distractors if needed, or just repeat? For simplicity, let's ensure the mock data has enough.
           // This part depends heavily on how distractors are generated/stored.
           // Example: Add a placeholder if mock data is insufficient.
           finalOptions.push(`Option ${finalOptions.length + 1}`); // Placeholder
        }

        // Shuffle and take the first 6
        return shuffleArray(finalOptions).slice(0, 6);
    }
};


export const fetchDailyQuizQuestions = async (): Promise<Question[]> => {
  // In a real app:
  // 1. Check if the user has already played today (Firestore).
  // 2. If not, fetch/generate 30 questions (Firestore/Functions).
  //    - Use a pool of questions.
  //    - Ensure randomness and variety.
  //    - Store the generated set for the user for the day.
  // 3. Return the questions.

  console.log("Fetching mock questions...");
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Prepare and shuffle mock questions
  const shuffledQuestions = shuffleArray(mockQuestions).slice(0, 30);

  // Prepare options for each question based on its type
  const preparedQuestions = shuffledQuestions.map(q => ({
      ...q,
      options: prepareOptions(q) // Adjust options based on type
  }));


  return preparedQuestions;
};

// Add functions for submitting results, checking daily status, etc.
// e.g., submitQuizResults(userId, results)
