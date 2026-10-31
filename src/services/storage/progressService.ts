import { StudentProgress, ProjectSubmission } from '@/types';

const PROGRESS_STORAGE_KEY = 'nexus_student_progress_v1';
const SUBMISSIONS_STORAGE_KEY = 'nexus_project_submissions_v1';

export const INITIAL_STUDENT_PROGRESS: StudentProgress = {
  userId: 'usr-student-demo-01',
  completedNodeIds: ['mod-html', 'mod-css', 'mod-chatgpt-mastery', 'mod-python-math'],
  inProgressNodeIds: ['mod-js', 'mod-claude-gemini', 'mod-scikit-learn'],
  completedLessonIds: ['les-html-1', 'les-css-1', 'les-gpt-1', 'les-py-1'],
  completedProjectIds: [],
  savedToolIds: ['tool-chatgpt', 'tool-claude', 'tool-cursor', 'tool-perplexity'],
  quizScores: {
    'quiz-html': { score: 100, passed: true, completedAt: '2026-10-28T14:22:00Z' },
  },
  learningStreakDays: 14,
  totalHoursLearned: 38,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export const INITIAL_SUBMISSIONS: ProjectSubmission[] = [
  {
    id: 'sub-001',
    projectId: 'proj-fs-1',
    projectTitle: 'Enterprise Authentication & Multi-Tenant RBAC',
    studentName: 'Alex Mercer',
    studentEmail: 'alex.mercer@nexuslearn.io',
    githubRepoUrl: 'https://github.com/alexmercer/enterprise-auth-service',
    liveUrl: 'https://auth-demo.nexuslearn.io',
    notes: 'Implemented argon2 hashing and refresh token rotation with HTTP-only cookies as specified.',
    submittedAt: '2026-10-25T11:45:00Z',
    status: 'Approved',
    adminFeedback: 'Excellent architecture! Clean separation of token rotation logic and high test coverage.',
    grade: '98 / 100'
  }
];

export const progressService = {
  getProgress(): StudentProgress {
    try {
      const data = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load progress from localStorage, using initial demo state', e);
    }
    return INITIAL_STUDENT_PROGRESS;
  },

  saveProgress(progress: StudentProgress): void {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  },

  markNodeCompleted(nodeId: string): StudentProgress {
    const current = this.getProgress();
    if (!current.completedNodeIds.includes(nodeId)) {
      current.completedNodeIds.push(nodeId);
      current.inProgressNodeIds = current.inProgressNodeIds.filter((id) => id !== nodeId);
      current.totalHoursLearned += 3;
      this.saveProgress(current);
    }
    return current;
  },

  toggleBookmarkTool(toolId: string): StudentProgress {
    const current = this.getProgress();
    if (current.savedToolIds.includes(toolId)) {
      current.savedToolIds = current.savedToolIds.filter((id) => id !== toolId);
    } else {
      current.savedToolIds.push(toolId);
    }
    this.saveProgress(current);
    return current;
  },

  recordQuizScore(quizId: string, score: number, passed: boolean): StudentProgress {
    const current = this.getProgress();
    current.quizScores[quizId] = {
      score,
      passed,
      completedAt: new Date().toISOString(),
    };
    this.saveProgress(current);
    return current;
  },

  getSubmissions(): ProjectSubmission[] {
    try {
      const data = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load submissions', e);
    }
    return INITIAL_SUBMISSIONS;
  },

  addSubmission(submission: Omit<ProjectSubmission, 'id' | 'submittedAt' | 'status'>): ProjectSubmission {
    const subs = this.getSubmissions();
    const newSub: ProjectSubmission = {
      ...submission,
      id: `sub-${Date.now().toString(36)}`,
      submittedAt: new Date().toISOString(),
      status: 'Pending Review',
    };
    subs.unshift(newSub);
    try {
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(subs));
    } catch (e) {
      console.error('Failed to save submission', e);
    }
    return newSub;
  },

  updateSubmissionStatus(id: string, status: ProjectSubmission['status'], feedback?: string, grade?: string): ProjectSubmission[] {
    const subs = this.getSubmissions();
    const index = subs.findIndex(s => s.id === id);
    if (index !== -1) {
      subs[index].status = status;
      if (feedback) subs[index].adminFeedback = feedback;
      if (grade) subs[index].grade = grade;
      try {
        localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(subs));
      } catch (e) {
        console.error('Failed to update submission', e);
      }
    }
    return subs;
  }
};
