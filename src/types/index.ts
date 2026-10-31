export type TrackId = 'full-stack' | 'ai-tools' | 'ai-engineering';

export type NodeStatus = 'completed' | 'in_progress' | 'available' | 'locked';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Industry Level';

export interface LearningTrack {
  id: TrackId;
  title: string;
  shortDescription: string;
  description: string;
  color: string;
  accentColor: string;
  iconName: string;
  levelCount: number;
  moduleCount: number;
  totalDurationHours: number;
  levels: LearningLevel[];
}

export interface LearningLevel {
  id: string;
  trackId: TrackId;
  order: number;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  nodes: RoadmapNode[];
}

export interface RoadmapNode {
  id: string;
  levelId: string;
  trackId: TrackId;
  title: string;
  category: string;
  description: string;
  order: number;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  prerequisites: string[]; // module ids
  status: NodeStatus;
  // Normalized 2D coordinates for SVG curved roadmap positioning (0 to 1000 width, 0 to 1200 height)
  x: number;
  y: number;
  module: LearningModule;
}

export interface LearningModule {
  id: string;
  nodeId: string;
  title: string;
  summary: string;
  learningObjectives: string[];
  prerequisites: string[];
  estimatedMinutes: number;
  difficulty: DifficultyLevel;
  lessons: Lesson[];
  codeExercise?: CodeExercise;
  quiz?: Quiz;
  assignment?: Assignment;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  videoUrl?: string;
  theoryMarkdown: string;
  keyTakeaways: string[];
  practicalCodeSnippets: {
    language: string;
    filename: string;
    code: string;
    explanation: string;
  }[];
}

export interface CodeExercise {
  id: string;
  title: string;
  instructions: string;
  initialCode: string;
  language: 'javascript' | 'python' | 'html' | 'css';
  solutionCode: string;
  testCases: {
    input: string;
    expectedOutput: string;
    description: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  codeSnippet?: string;
}

export interface Quiz {
  id: string;
  title: string;
  passingScorePercent: number;
  questions: QuizQuestion[];
}

export interface Assignment {
  id: string;
  title: string;
  instructions: string;
  starterRepositoryUrl?: string;
  deliverables: string[];
  gradingCriteria: {
    criterion: string;
    points: number;
  }[];
}

export interface ProjectLab {
  id: string;
  trackId: TrackId;
  title: string;
  subtitle: string;
  difficulty: DifficultyLevel;
  estimatedHours: number;
  technologies: string[];
  description: string;
  learningObjectives: string[];
  stepByStepMilestones: {
    milestone: string;
    description: string;
    deliverable: string;
  }[];
  githubTemplateUrl?: string;
  liveDemoUrl?: string;
  submissionRequirements: string[];
}

export interface AITool {
  id: string;
  name: string;
  slug: string;
  category: AIToolCategory;
  shortDescription: string;
  detailedDescription: string;
  websiteUrl: string;
  logo: string;
  pricingType: 'Free' | 'Freemium' | 'Paid' | 'Enterprise';
  pricingDetails: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  keyFeatures: string[];
  bestUseCases: string[];
  starterPrompts: {
    title: string;
    prompt: string;
    category: string;
  }[];
  tutorials: {
    title: string;
    duration: string;
    url: string;
  }[];
  advantages: string[];
  limitations: string[];
  privacyNotes: string;
  comparisonScores: {
    coding: number;
    research: number;
    writing: number;
    reasoning: number;
    documentAnalysis: number;
    multimodal: number;
    integrations: number;
  };
}

export type AIToolCategory =
  | 'AI Assistants'
  | 'Research & Deep Search'
  | 'Productivity & Second Brain'
  | 'Coding & App Development'
  | 'Automation & Agents'
  | 'Creative & Media Tools'
  | 'Voice & Audio'
  | 'Data Analysis';

export interface StudentProgress {
  userId: string;
  completedNodeIds: string[];
  inProgressNodeIds: string[];
  completedLessonIds: string[];
  completedProjectIds: string[];
  savedToolIds: string[];
  quizScores: Record<string, { score: number; passed: boolean; completedAt: string }>;
  learningStreakDays: number;
  totalHoursLearned: number;
  lastActiveDate: string;
}

export interface ProjectSubmission {
  id: string;
  projectId: string;
  projectTitle: string;
  studentName: string;
  studentEmail: string;
  githubRepoUrl: string;
  liveUrl?: string;
  notes: string;
  submittedAt: string;
  status: 'Pending Review' | 'Approved' | 'Changes Requested';
  adminFeedback?: string;
  grade?: string;
}
