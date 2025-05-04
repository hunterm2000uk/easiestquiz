export type AnswerType = 'text' | 'number';

export interface Question {
  id: string;
  text: string;
  options: string[]; // For text answers, includes correct and incorrect options
  correctAnswer: string; // Could be text or a string representation of a number
  answerType: AnswerType;
}

export interface QuizSession {
  questions: Question[];
  startTime: number;
  endTime?: number;
  currentQuestionIndex: number;
  answers: { [questionId: string]: { answer: string; isCorrect: boolean } };
  score: number;
}
