import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Cpu,
  HelpCircle,
  X
} from 'lucide-react';
import { LEARNING_TRACKS } from '@/features/curriculum/curriculumData';
import { Quiz, QuizQuestion } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface QuizzesSectionProps {
  quizScores: Record<string, { score: number; passed: boolean; completedAt: string }>;
  onRecordQuizScore: (quizId: string, score: number, passed: boolean) => void;
}

export const QuizzesSection: React.FC<QuizzesSectionProps> = ({
  quizScores,
  onRecordQuizScore,
}) => {
  // Collect all quizzes across curriculum
  const allQuizzes: { quiz: Quiz; trackTitle: string; trackColor: string; moduleTitle: string }[] = [];

  LEARNING_TRACKS.forEach((track) => {
    track.levels.forEach((level) => {
      level.nodes.forEach((node) => {
        if (node.module.quiz) {
          allQuizzes.push({
            quiz: node.module.quiz,
            trackTitle: track.title,
            trackColor: track.accentColor,
            moduleTitle: node.title,
          });
        }
      });
    });
  });

  // Additional comprehensive domain quizzes
  const EXTRA_QUIZZES: { quiz: Quiz; trackTitle: string; trackColor: string; moduleTitle: string }[] = [
    {
      trackTitle: 'AI Tools Mastery',
      trackColor: '#F97316',
      moduleTitle: 'ChatGPT & Claude Prompting Mastery',
      quiz: {
        id: 'quiz-ai-prompting',
        title: 'Frontier AI Prompt Engineering & Reasoning Quiz',
        passingScorePercent: 75,
        questions: [
          {
            id: 'q-prompt-1',
            question: 'What is the primary benefit of the RTCC (Role, Task, Context, Constraints) prompting framework?',
            options: [
              'It forces the model to run faster by skipping tokens',
              'It anchors the LLM with deterministic behavioral boundaries and eliminates ambiguity',
              'It bypasses rate limit quotas on OpenAI servers',
              'It automatically fine-tunes the model weights locally'
            ],
            correctIndex: 1,
            explanation: 'RTCC provides explicit context, clear persona constraints, and strict output definitions, eliminating vague hallucinations.'
          },
          {
            id: 'q-prompt-2',
            question: 'When should Claude Artifacts be preferred over standard chat answers?',
            options: [
              'When you need a standalone React component, SVG, or document that can be tested in isolation',
              'When asking single-sentence factual trivia questions',
              'When calculating simple arithmetic without code',
              'Only when using Python backend servers'
            ],
            correctIndex: 0,
            explanation: 'Claude Artifacts are designed for significant, self-contained content (React UIs, SVGs, code files) that users will modify, run, or reuse.'
          }
        ]
      }
    },
    {
      trackTitle: 'AI Engineering',
      trackColor: '#A855F7',
      moduleTitle: 'RAG & Vector Database Architecture',
      quiz: {
        id: 'quiz-rag-pgvector',
        title: 'Enterprise RAG & Supabase pgvector Architecture',
        passingScorePercent: 80,
        questions: [
          {
            id: 'q-rag-1',
            question: 'Why is cosine similarity commonly favored over Euclidean distance for high-dimensional embeddings?',
            options: [
              'It evaluates the orientation/direction of the semantic vectors rather than length differences',
              'It produces numbers strictly greater than 1000',
              'It requires no mathematical dot products',
              'It works only on unquantized 32-bit floats'
            ],
            correctIndex: 0,
            explanation: 'Cosine similarity focuses on the angle between two embedding vectors, making it invariant to document word count or length scale.'
          },
          {
            id: 'q-rag-2',
            question: 'In Supabase pgvector, which index type provides faster approximate nearest neighbor queries at scale?',
            options: [
              'HNSW (Hierarchical Navigable Small World)',
              'B-Tree Single Column',
              'GIN JSON Index',
              'Hash Index'
            ],
            correctIndex: 0,
            explanation: 'HNSW builds multi-layer graphs enabling sub-millisecond approximate nearest neighbor searches with high recall.'
          }
        ]
      }
    }
  ];

  const fullQuizList = [...allQuizzes, ...EXTRA_QUIZZES];

  // Active quiz modal state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{ score: number; passed: boolean } | null>(null);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setSelectedAnswers({});
    setSubmitted(false);
    setScoreResult(null);
  };

  const handleAnswer = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIndex });
  };

  const submitQuiz = () => {
    if (!activeQuiz) return;
    let correct = 0;
    activeQuiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) correct++;
    });
    const percentage = Math.round((correct / activeQuiz.questions.length) * 100);
    const passed = percentage >= activeQuiz.passingScorePercent;
    setScoreResult({ score: percentage, passed });
    setSubmitted(true);
    onRecordQuizScore(activeQuiz.id, percentage, passed);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="rounded-3xl p-8 glass-panel border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <Badge variant="emerald" size="md">
            Verified Knowledge Checks
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Assessments & Quizzes
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Test your comprehension of core web protocols, modern frontend frameworks, LLM prompting principles, and vector search engineering. Review detailed rationales and track your verification scores.
          </p>
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fullQuizList.map(({ quiz, trackTitle, trackColor, moduleTitle }) => {
          const attempt = quizScores[quiz.id];

          return (
            <div
              key={quiz.id}
              className="rounded-3xl p-6 glass-card glass-card-hover border border-white/10 flex flex-col justify-between group shadow-lg relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg border font-mono"
                    style={{
                      color: trackColor,
                      borderColor: trackColor + '40',
                      backgroundColor: trackColor + '15',
                    }}
                  >
                    {trackTitle}
                  </span>

                  {attempt && (
                    <Badge variant={attempt.passed ? 'emerald' : 'rose'}>
                      {attempt.score}% {attempt.passed ? 'PASSED' : 'RETRY'}
                    </Badge>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-heading group-hover:text-emerald-300 transition-colors">
                    {quiz.title}
                  </h3>
                  <div className="text-xs text-text-muted mt-1">{moduleTitle}</div>
                </div>

                <div className="text-xs text-text-secondary flex items-center gap-3 pt-2">
                  <span className="flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                    {quiz.questions.length} Questions
                  </span>
                  <span>•</span>
                  <span>Passing Score: {quiz.passingScorePercent}%</span>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-white/10">
                <Button
                  variant={attempt?.passed ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => startQuiz(quiz)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{attempt ? 'Retake Quiz' : 'Start Assessment'}</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quiz Modal */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setActiveQuiz(null)} />
          <div className="relative w-full max-w-3xl max-h-[92vh] glass-panel rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/10 bg-dark-surface/90 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">{activeQuiz.title}</h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Passing Score: {activeQuiz.passingScorePercent}% • {activeQuiz.questions.length} Questions
                </p>
              </div>
              <button
                onClick={() => setActiveQuiz(null)}
                className="p-1.5 rounded-xl text-text-secondary hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-dark-bg/60">
              {scoreResult && (
                <div
                  className={`p-5 rounded-2xl border flex items-center justify-between ${
                    scoreResult.passed
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <div>
                    <h3 className="text-base font-bold">
                      {scoreResult.passed ? 'Assessment Passed! 🎉' : 'Passing Grade Not Met'}
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      You scored {scoreResult.score}%. {scoreResult.passed ? 'Excellent mastery demonstrated.' : 'Review the explanations below and retake when ready.'}
                    </p>
                  </div>
                  <div className="text-2xl font-black font-heading">{scoreResult.score}%</div>
                </div>
              )}

              {activeQuiz.questions.map((q, idx) => (
                <div key={q.id} className="p-5 rounded-2xl bg-dark-card/60 border border-white/10 space-y-3">
                  <div className="text-sm font-semibold text-white">
                    <span className="text-sky-400 font-bold mr-2">Q{idx + 1}.</span>
                    {q.question}
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[q.id] === oIdx;
                      const isCorrect = q.correctIndex === oIdx;

                      let style = 'bg-white/5 border-white/10 text-text-secondary hover:bg-white/10 hover:text-white';
                      if (submitted) {
                        if (isCorrect) {
                          style = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold';
                        } else if (isSelected && !isCorrect) {
                          style = 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-semibold';
                        }
                      } else if (isSelected) {
                        style = 'bg-sky-500/20 border-sky-400 text-sky-300 font-semibold';
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleAnswer(q.id, oIdx)}
                          className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${style}`}
                        >
                          <span>{opt}</span>
                          {submitted && isCorrect && <span className="text-emerald-400 font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-text-muted mt-2">
                      <strong className="text-white">Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-white/10 bg-dark-surface/90 flex items-center justify-between">
              <span className="text-xs text-text-muted">
                {Object.keys(selectedAnswers).length} of {activeQuiz.questions.length} answered
              </span>

              {submitted ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedAnswers({});
                    setSubmitted(false);
                    setScoreResult(null);
                  }}
                >
                  Retake Assessment
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={submitQuiz}
                  disabled={Object.keys(selectedAnswers).length < activeQuiz.questions.length}
                >
                  Submit Answers
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
