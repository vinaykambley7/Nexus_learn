import { StudentProgress, ProjectSubmission } from '@/types';

const PROGRESS_STORAGE_KEY = 'nexus_student_progress_v2';
const SUBMISSIONS_STORAGE_KEY = 'nexus_project_submissions_v2';

export const INITIAL_STUDENT_PROGRESS: StudentProgress = {
  userId: 'usr-admin-01',
  completedNodeIds: [],
  inProgressNodeIds: [],
  completedLessonIds: [],
  completedProjectIds: [],
  savedToolIds: [],
  quizScores: {},
  learningStreakDays: 0,
  totalHoursLearned: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export const INITIAL_SUBMISSIONS: ProjectSubmission[] = [];

export const progressService = {
  getProgress(): StudentProgress {
    try {
      const data = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (data) {
        const parsed: StudentProgress = JSON.parse(data);
        if (parsed && Array.isArray(parsed.completedNodeIds)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load progress from localStorage', e);
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
      if (data) {
        let subs: ProjectSubmission[] = JSON.parse(data);
        if (Array.isArray(subs)) {
          // Remove any legacy mock submissions from Alex Mercer
          subs = subs.filter(
            (s) =>
              s.studentEmail.toLowerCase() !== 'alex.mercer@nexuslearn.io' &&
              s.studentName !== 'Alex Mercer'
          );
          localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(subs));
          return subs;
        }
      }
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
    const index = subs.findIndex((s) => s.id === id);
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
  },
};
