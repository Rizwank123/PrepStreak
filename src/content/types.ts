export type ContentCategory = 'dsa' | 'system-design' | 'golang' | 'interview' | 'aws';

export type ResourceType = 'article' | 'video' | 'docs' | 'github' | 'book' | 'course';

export interface Resource {
  title: string;
  url: string;
  type: ResourceType;
  free: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CodeExample {
  language: string;
  label: string;
  code: string;
}

export interface DryRunStep {
  line: number;
  description: string;
  variables: { name: string; value: string }[];
  dataState: string;
  highlight?: number[];
}

export interface DryRun {
  title: string;
  input: string;
  steps: DryRunStep[];
  result: string;
}

export interface ContentQuestion {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  platform: string;
  pattern: string;
  companies: string[];
  tags: string[];
  problemStatement: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string[];
  hints: string[];
  bruteForce: string;
  optimizedSolution: string;
  timeComplexity: string;
  spaceComplexity: string;
  codeExamples: CodeExample[];
  practiceUrls: Record<string, string>;
  related: string[];
  dryRun?: DryRun;
}

export interface TopicContent {
  slug: string;
  title: string;
  category: ContentCategory;
  theory: string;
  examples: string;
  patterns: string;
  interviewTips: string;
  commonMistakes: string;
  revision: string;
  codeExamples: CodeExample[];
  resources: Resource[];
  quiz: QuizQuestion[];
  questions: ContentQuestion[];
}
