// src/types/index.ts
export interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
}

export interface Assessment {
  assessment_id: string;
  topic: string;
  grade: string;
  questions: Question[];
}