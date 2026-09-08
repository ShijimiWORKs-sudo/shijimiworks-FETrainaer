import type { TraceProgram } from './trace';

export type Subject = 'A' | 'B';

export type CategoryA = 'technology' | 'management' | 'strategy';
export type CategoryB = 'pseudocode' | 'algorithm' | 'datastructure' | 'security';
export type Category = CategoryA | CategoryB;

export interface Choice {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  subject: Subject;
  category: Category;
  difficulty: 1 | 2 | 3;
  title?: string;
  body: string;
  choices: Choice[];
  answerId: string;
  explanation: string;
  trace?: TraceProgram;
  tags?: string[];
}

export const CATEGORY_LABEL: Record<Category, string> = {
  technology: 'テクノロジ',
  management: 'マネジメント',
  strategy: 'ストラテジ',
  pseudocode: '擬似言語',
  algorithm: 'アルゴリズム',
  datastructure: 'データ構造',
  security: 'セキュリティ',
};

export const CATEGORIES_A: CategoryA[] = ['technology', 'management', 'strategy'];
export const CATEGORIES_B: CategoryB[] = ['pseudocode', 'algorithm', 'datastructure', 'security'];
