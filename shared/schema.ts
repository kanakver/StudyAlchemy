import { z } from 'zod';

// Schema for a basic transformation
export const transformationSchema = z.object({
  id: z.string(),
  title: z.string(),
  text: z.string(),
  type: z.string(),
  subject: z.string(),
  contentType: z.string(),
  options: z.record(z.any()),
  content: z.string(),
  createdAt: z.date(),
});

export type Transformation = z.infer<typeof transformationSchema>;

// Types of transformations supported
export const transformationTypes = [
  'flashcards',
  'summary',
  'mindmap',
  'questions',
  'quiz'
] as const;

export type TransformationType = typeof transformationTypes[number];

// Schema for flashcard items
export const flashcardSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

export type Flashcard = z.infer<typeof flashcardSchema>;

// Schema for summary items
export const summarySchema = z.object({
  points: z.array(z.string()),
});

export type Summary = z.infer<typeof summarySchema>;

// Schema for mind map
export const nodeSchema = z.object({
  id: z.string(),
  text: z.string(),
  parentId: z.string().nullable(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

export const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
});

export const mindMapSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
});

export type Node = z.infer<typeof nodeSchema>;
export type Edge = z.infer<typeof edgeSchema>;
export type MindMap = z.infer<typeof mindMapSchema>;

// Schema for questions
export const questionSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

export type Question = z.infer<typeof questionSchema>;

// Schema for quiz
export const quizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  answers: z.array(z.string()),
  correctAnswerIndex: z.number(),
});

export const quizSchema = z.object({
  questions: z.array(quizQuestionSchema),
});

export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type Quiz = z.infer<typeof quizSchema>;
