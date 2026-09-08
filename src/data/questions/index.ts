import type { Category, Question } from '@/types/question';
import { technologyQuestions } from './subjectA.technology';
import { managementQuestions } from './subjectA.management';
import { strategyQuestions } from './subjectA.strategy';
import { pseudocodeQuestions } from './subjectB.pseudocode';
import { algorithmQuestions } from './subjectB.algorithm';
import { datastructureQuestions } from './subjectB.datastructure';
import { securityQuestions } from './subjectB.security';

export const ALL_QUESTIONS: Question[] = [
  ...technologyQuestions,
  ...managementQuestions,
  ...strategyQuestions,
  ...pseudocodeQuestions,
  ...algorithmQuestions,
  ...datastructureQuestions,
  ...securityQuestions,
];

export const QUESTIONS_BY_CATEGORY: Record<Category, Question[]> = {
  technology: technologyQuestions,
  management: managementQuestions,
  strategy: strategyQuestions,
  pseudocode: pseudocodeQuestions,
  algorithm: algorithmQuestions,
  datastructure: datastructureQuestions,
  security: securityQuestions,
};

export function getQuestionsBySubject(subject: 'A' | 'B'): Question[] {
  return ALL_QUESTIONS.filter((q) => q.subject === subject);
}

export function getQuestionById(id: string): Question | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}

export {
  technologyQuestions,
  managementQuestions,
  strategyQuestions,
  pseudocodeQuestions,
  algorithmQuestions,
  datastructureQuestions,
  securityQuestions,
};
