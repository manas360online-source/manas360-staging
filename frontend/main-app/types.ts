
export type QuestionType = 'multiple-choice' | 'text' | 'slider' | 'checkbox';

export interface Option {
  id: string;
  label: string;
  nextQuestionId?: string; // For branching logic
  score?: number;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: Option[]; // For multiple-choice/checkbox
  min?: number; // For slider
  max?: number; // For slider
  step?: number; // For slider
  minLabel?: string;
  maxLabel?: string;
  required?: boolean;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  version: number;
  questions: Question[];
  createdAt: number;
  updatedAt: number;
}

export interface Answer {
  questionId: string;
  value: string | number | string[];
}
