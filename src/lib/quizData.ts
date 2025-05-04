// src/lib/quizData.ts

export interface QuizQuestion {
  question: string;
  type: 'text' | 'numeric';
  correct_answer: string | number;
  options: (string | number)[]; // Combined correct and wrong answers
}

export const quizQuestions: QuizQuestion[] = [
  {
    question: 'What is the capital of France?',
    type: 'text',
    correct_answer: 'Paris',
    options: ['Paris', 'London', 'Berlin', 'Madrid', 'Rome', 'Lisbon'],
  },
  {
    question: 'Which planet is known as the Red Planet?',
    type: 'text',
    correct_answer: 'Mars',
    options: ['Mars', 'Venus', 'Jupiter', 'Saturn', 'Mercury', 'Neptune'],
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    type: 'text',
    correct_answer: 'William Shakespeare',
    options: ['William Shakespeare', 'Leo Tolstoy', 'Charles Dickens', 'Jane Austen', 'Mark Twain', 'F. Scott Fitzgerald'],
  },
  {
    question: 'What is the largest mammal?',
    type: 'text',
    correct_answer: 'Blue whale',
    options: ['Blue whale', 'Elephant', 'Giraffe', 'Hippopotamus', 'Rhino', 'Orca'],
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    type: 'text',
    correct_answer: 'Oxygen',
    options: ['Oxygen', 'Gold', 'Osmium', 'Oganesson', 'Oxygenium', 'Oxium'], // Note: Adjusted some unrealistic options
  },
  {
    question: 'What do bees produce?',
    type: 'text',
    correct_answer: 'Honey',
    options: ['Honey', 'Wax', 'Silk', 'Milk', 'Oil', 'Bread'],
  },
  {
    question: 'Which ocean is the largest?',
    type: 'text',
    correct_answer: 'Pacific',
    options: ['Pacific', 'Atlantic', 'Indian', 'Southern', 'Arctic', 'Mediterranean'],
  },
  {
    question: 'Which country hosts the Eiffel Tower?',
    type: 'text',
    correct_answer: 'France',
    options: ['France', 'Spain', 'Italy', 'Germany', 'Belgium', 'Switzerland'],
  },
  {
    question: 'Which artist painted the Mona Lisa?',
    type: 'text',
    correct_answer: 'Leonardo da Vinci',
    options: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Donatello', 'Caravaggio', 'Van Gogh'],
  },
  {
    question: 'What is the hardest natural substance?',
    type: 'text',
    correct_answer: 'Diamond',
    options: ['Diamond', 'Gold', 'Iron', 'Ruby', 'Quartz', 'Emerald'],
  },
  {
    question: 'Which gas do plants absorb?',
    type: 'text',
    correct_answer: 'Carbon dioxide',
    options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen', 'Methane', 'Helium'],
  },
  {
    question: "Who is known as the 'Father of Computers'?",
    type: 'text',
    correct_answer: 'Charles Babbage',
    options: ['Charles Babbage', 'Alan Turing', 'Thomas Edison', 'Nikola Tesla', 'Isaac Newton', 'Bill Gates'],
  },
  {
    question: 'Which continent is the Sahara Desert on?',
    type: 'text',
    correct_answer: 'Africa',
    options: ['Africa', 'Asia', 'Australia', 'South America', 'North America', 'Europe'],
  },
  {
    question: 'What is H2O commonly known as?',
    type: 'text',
    correct_answer: 'Water',
    options: ['Water', 'Hydrogen peroxide', 'Oxygen', 'Hydrogen', 'Salt', 'Ammonia'],
  },
  {
    question: 'What color do you get when you mix red and white?',
    type: 'text',
    correct_answer: 'Pink',
    options: ['Pink', 'Purple', 'Brown', 'Orange', 'Magenta', 'Grey'],
  },
  {
    question: 'Which instrument has keys, pedals, and strings?',
    type: 'text',
    correct_answer: 'Piano',
    options: ['Piano', 'Violin', 'Guitar', 'Drum', 'Flute', 'Saxophone'],
  },
  {
    question: 'What is the tallest mountain in the world?',
    type: 'text',
    correct_answer: 'Mount Everest',
    options: ['Mount Everest', 'K2', 'Kangchenjunga', 'Lhotse', 'Makalu', 'Cho Oyu'],
  },
  {
    question: "Which fruit is known as the 'king of fruits'?",
    type: 'text',
    correct_answer: 'Durian',
    options: ['Durian', 'Mango', 'Banana', 'Pineapple', 'Apple', 'Papaya'],
  },
  {
    question: 'Which animal is known for its black and white stripes?',
    type: 'text',
    correct_answer: 'Zebra',
    options: ['Zebra', 'Tiger', 'Skunk', 'Panda', 'Donkey', 'Okapi'],
  },
  {
    question: 'What do you call a baby kangaroo?',
    type: 'text',
    correct_answer: 'Joey',
    options: ['Joey', 'Cub', 'Pup', 'Calf', 'Foal', 'Chick'],
  },
  {
    question: 'What is 7 + 5?',
    type: 'numeric',
    correct_answer: 12,
    options: [12, 11, 13, 10, 14, 57],
  },
  {
    question: 'What is 15 * 3?',
    type: 'numeric',
    correct_answer: 45,
    options: [45, 18, 5, 30, 50, 153],
  },
  {
    question: 'What is the square root of 81?',
    type: 'numeric',
    correct_answer: 9,
    options: [9, 8.1, 81, 18, 7, 6561],
  },
  {
    question: 'How many seconds are in a minute?',
    type: 'numeric',
    correct_answer: 60,
    options: [60, 100, 30, 120, 50, 3600],
  },
  {
    question: 'What is 100 divided by 4?',
    type: 'numeric',
    correct_answer: 25,
    options: [25, 104, 96, 20, 50, 400],
  },
  {
    question: 'What is 9 squared?',
    type: 'numeric',
    correct_answer: 81,
    options: [81, 18, 99, 3, 27, 9],
  },
  {
    question: 'How many months are in a year?',
    type: 'numeric',
    correct_answer: 12,
    options: [12, 10, 11, 13, 24, 365],
  },
  {
    question: 'What is 11 - 4?',
    type: 'numeric',
    correct_answer: 7,
    options: [7, 15, 8, 6, 44, -7],
  },
  {
    question: 'What is 5 * 5?',
    type: 'numeric',
    correct_answer: 25,
    options: [25, 10, 55, 1, 5, 125],
  },
  {
    question: 'How many days are in a week?',
    type: 'numeric',
    correct_answer: 7,
    options: [7, 5, 6, 8, 10, 14],
  },
];