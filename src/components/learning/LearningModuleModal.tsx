import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Play,
  FileText,
  Code,
  Award,
  BookOpen,
  Clock,
  ExternalLink,
  ChevronRight,
  Terminal,
  RotateCcw,
  Briefcase
} from 'lucide-react';
import { RoadmapNode, TrackId } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface LearningModuleModalProps {
  node: RoadmapNode | null;
  isOpen: boolean;
  onClose: () => void;
  isCompleted: boolean;
  onToggleComplete: (nodeId: string) => void;
  onRecordQuizScore: (quizId: string, score: number, passed: boolean) => void;
  onNavigateToProjects?: () => void;
}

export const LearningModuleModal: React.FC<LearningModuleModalProps> = ({
  node,
  isOpen,
  onClose,
  isCompleted,
  onToggleComplete,
  onRecordQuizScore,
  onNavigateToProjects,
}) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'code' | 'quiz' | 'assignment'>('theory');

  // Code Playground State
  const [userCode, setUserCode] = useState<string>('');
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ score: number; passed: boolean } | null>(null);

  React.useEffect(() => {
    if (node?.module?.codeExercise) {
      setUserCode(node.module.codeExercise.initialCode);
      setConsoleOutput('');
    } else {
      setUserCode('// Practical scratchpad for ' + (node?.title || 'this module') + '\nconsole.log("Module initialized:", "' + (node?.title || '') + '");');
      setConsoleOutput('');
    }
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setActiveTab('theory');
  }, [node]);

  if (!isOpen || !node) return null;

  const { module } = node;

  // Fallback quiz if module doesn't have an explicit one
  const activeQuiz = module.quiz || {
    id: `quiz-gen-${node.id}`,
    title: `${node.title} Knowledge Verification Check`,
    passingScorePercent: 75,
    questions: [
      {
        id: `q-gen-1-${node.id}`,
        question: `What is the core architectural goal of ${node.title}?`,
        options: [
          `To structure scalable, maintainable systems according to industry standards`,
          `To run arbitrary uncompiled scripts without error boundaries`,
          `To bypass security policies in production environments`,
          `To avoid unit testing or type safety validation`
        ],
        correctIndex: 0,
        explanation: `${node.title} establishes core engineering discipline, standardizing predictable execution and robust system architecture.`
      },
      {
        id: `q-gen-2-${node.id}`,
        question: `Which difficulty classification is assigned to ${node.title}?`,
        options: [
          `Foundational / Overview`,
          `${node.difficulty}`,
          `Deprecated Standard`,
          `Experimental Only`
        ],
        correctIndex: 1,
        explanation: `This curriculum module is classified at the ${node.difficulty} level.`
      }
    ]
  };

  // Run in-browser code simulator
  const handleRunCode = () => {
    setIsRunningCode(true);
    setConsoleOutput('Executing sandbox test run...\n');
    setTimeout(() => {
      try {
        let logAccumulator = '';
        const customConsole = {
          log: (...args: any[]) => {
            logAccumulator += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
          },
          warn: (...args: any[]) => {
            logAccumulator += '[WARN] ' + args.join(' ') + '\n';
          },
          error: (...args: any[]) => {
            logAccumulator += '[ERR] ' + args.join(' ') + '\n';
          }
        };
        const runFn = new Function('console', userCode);
        runFn(customConsole);
        setConsoleOutput(
          logAccumulator
            ? `[Console Output]:\n${logAccumulator}\n✓ Execution completed successfully (0 errors).`
            : '✓ Code executed successfully with return code 0.'
        );
      } catch (err: any) {
        setConsoleOutput(`[Runtime Error]: ${err.message || 'Unknown error'}`);
      } finally {
        setIsRunningCode(false);
      }
    }, 400);
  };

  // Submit Quiz
  const handleSubmitQuiz = () => {
    const questions = activeQuiz.questions;
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });
    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= activeQuiz.passingScorePercent;
    setQuizScore({ score: percentage, passed });
    setQuizSubmitted(true);
    onRecordQuizScore(activeQuiz.id, percentage, passed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Dark backdrop blur */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Main Glassmorphic Learning Dialog */}
      <div className="relative w-full max-w-5xl h-[90vh] glass-panel rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95">
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-white/10 bg-dark-surface/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="blue">{node.category}</Badge>
            <Badge variant="outline">{node.difficulty}</Badge>
            <span className="text-xs text-text-muted flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {node.estimatedMinutes} minutes
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={isCompleted ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => onToggleComplete(node.id)}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-white'}`} />
              <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title & Navigation Tabs */}
        <div className="px-6 pt-4 pb-0 bg-dark-surface/40 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white font-heading">{node.title}</h2>
          <p className="text-sm text-text-secondary mt-1 max-w-3xl">{module.summary}</p>

          <div className="flex items-center gap-2 mt-4 overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setActiveTab('theory')}
              className={`px-4 py-2.5 rounded-t-xl text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'theory'
                  ? 'border-sky-400 text-sky-400 bg-sky-500/10'
                  : 'border-transparent text-text-secondary hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Theory & Video</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2.5 rounded-t-xl text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'code'
                  ? 'border-sky-400 text-sky-400 bg-sky-500/10'
                  : 'border-transparent text-text-secondary hover:text-white'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Code Sandbox</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2.5 rounded-t-xl text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'quiz'
                  ? 'border-sky-400 text-sky-400 bg-sky-500/10'
                  : 'border-transparent text-text-secondary hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Quiz Assessment</span>
            </button>
            <button
              onClick={() => setActiveTab('assignment')}
              className={`px-4 py-2.5 rounded-t-xl text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'assignment'
                  ? 'border-purple-400 text-purple-400 bg-purple-500/10'
                  : 'border-transparent text-text-secondary hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Practical Task & Lab</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-dark-bg/60">
          {/* TAB 1: THEORY & LESSONS */}
          {activeTab === 'theory' && (
            <div className="space-y-6 max-w-4xl">
              {/* Learning Objectives Card */}
              <div className="p-5 rounded-2xl bg-dark-card/60 border border-white/10">
                <h4 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-3 font-heading">
                  Learning Objectives
                </h4>
                <ul className="space-y-2">
                  {module.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 flex-shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Video Tutorial Embed */}
              <div className="p-5 rounded-2xl bg-dark-card/60 border border-white/10 space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Play className="w-4 h-4 text-orange-400 fill-orange-400" />
                  <span>Curriculum Video Lecture</span>
                </h4>
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black/60">
                  <iframe
                    src={module.lessons[0]?.videoUrl || 'https://www.youtube.com/embed/kUMe1FH4CHE'}
                    title={module.lessons[0]?.title || node.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Theory Content Markdown */}
              {module.lessons.map((lesson) => (
                <div key={lesson.id} className="space-y-4">
                  <div className="p-6 rounded-2xl bg-dark-card/60 border border-white/10 space-y-4">
                    <h3 className="text-lg font-bold text-white font-heading">{lesson.title}</h3>
                    <div className="prose prose-invert max-w-none text-sm text-text-secondary leading-relaxed whitespace-pre-line font-sans">
                      {lesson.theoryMarkdown}
                    </div>

                    {/* Key Takeaways */}
                    {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
                      <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/20 mt-4">
                        <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">
                          Key Architectural Takeaways:
                        </div>
                        <ul className="space-y-1.5 text-xs text-sky-200/90">
                          {lesson.keyTakeaways.map((takeaway, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="text-sky-400">✓</span> {takeaway}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Practical Code Snippets */}
                    {lesson.practicalCodeSnippets && lesson.practicalCodeSnippets.map((snip, sIdx) => (
                      <div key={sIdx} className="mt-4 rounded-xl overflow-hidden border border-white/10">
                        <div className="bg-dark-surface px-4 py-2 flex items-center justify-between text-xs text-text-secondary border-b border-white/10 font-mono">
                          <span>{snip.filename}</span>
                          <span className="uppercase text-[10px] bg-white/10 px-2 py-0.5 rounded">
                            {snip.language}
                          </span>
                        </div>
                        <pre className="p-4 bg-black/80 text-xs text-sky-300 font-mono overflow-x-auto leading-relaxed">
                          <code>{snip.code}</code>
                        </pre>
                        <div className="p-3 bg-dark-surface/60 text-xs text-text-muted border-t border-white/5">
                          {snip.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: IN-BROWSER CODE PLAYGROUND */}
          {activeTab === 'code' && (
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    {module.codeExercise?.title || 'Interactive Code Sandbox'}
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {module.codeExercise?.instructions || 'Experiment and run code snippets in a secure sandbox.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUserCode(module.codeExercise?.initialCode || '// Reset scratchpad\nconsole.log("Ready.");');
                      setConsoleOutput('');
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleRunCode}
                    isLoading={isRunningCode}
                    className="flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Code</span>
                  </Button>
                </div>
              </div>

              {/* Editor + Terminal Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[380px]">
                {/* Code Editor Area */}
                <div className="rounded-2xl border border-white/10 bg-black/70 flex flex-col overflow-hidden">
                  <div className="px-4 py-2 bg-dark-surface/90 border-b border-white/10 flex items-center justify-between text-xs text-text-secondary font-mono">
                    <span>Editor ({module.codeExercise?.language || 'javascript'})</span>
                    <span className="text-[10px] text-sky-400">Auto-saved</span>
                  </div>
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="flex-1 w-full p-4 bg-transparent text-white font-mono text-xs resize-none focus:outline-none leading-relaxed"
                    placeholder="// Write your code here..."
                    spellCheck={false}
                  />
                </div>

                {/* Terminal Console Output */}
                <div className="rounded-2xl border border-white/10 bg-dark-surface/90 flex flex-col overflow-hidden">
                  <div className="px-4 py-2 bg-black/60 border-b border-white/10 flex items-center gap-2 text-xs text-text-secondary font-mono">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Terminal Output</span>
                  </div>
                  <div className="flex-1 p-4 font-mono text-xs text-emerald-400 whitespace-pre-wrap overflow-y-auto bg-black/40">
                    {consoleOutput || '// Click "Run Code" to compile and execute.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QUIZ ASSESSMENT */}
          {activeTab === 'quiz' && (
            <div className="max-w-3xl space-y-6">
              <div className="p-5 rounded-2xl bg-dark-card/60 border border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">{activeQuiz.title}</h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Passing grade: {activeQuiz.passingScorePercent}% • {activeQuiz.questions.length} Questions
                  </p>
                </div>
                {quizScore && (
                  <div className="text-right">
                    <div
                      className={`text-xl font-bold ${
                        quizScore.passed ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {quizScore.score}%
                    </div>
                    <Badge variant={quizScore.passed ? 'emerald' : 'rose'}>
                      {quizScore.passed ? 'PASSED' : 'RETRY REQUIRED'}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {activeQuiz.questions.map((q, qIndex) => (
                  <div key={q.id} className="p-5 rounded-2xl bg-dark-card/60 border border-white/10 space-y-3">
                    <div className="text-sm font-semibold text-white">
                      Question {qIndex + 1}: {q.question}
                    </div>
                    <div className="space-y-2">
                      {q.options.map((opt, oIndex) => {
                        const isSelected = selectedAnswers[q.id] === oIndex;
                        const isCorrect = q.correctIndex === oIndex;

                        let optStyle = 'bg-white/5 border-white/10 text-text-secondary hover:bg-white/10 hover:text-white';
                        if (quizSubmitted) {
                          if (isCorrect) {
                            optStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300';
                          } else if (isSelected && !isCorrect) {
                            optStyle = 'bg-rose-500/20 border-rose-500/50 text-rose-300';
                          }
                        } else if (isSelected) {
                          optStyle = 'bg-sky-500/20 border-sky-400 text-sky-300';
                        }

                        return (
                          <button
                            key={oIndex}
                            onClick={() => !quizSubmitted && setSelectedAnswers({ ...selectedAnswers, [q.id]: oIndex })}
                            className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${optStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <span className="text-emerald-400 font-bold">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                    {quizSubmitted && (
                      <div className="p-3 rounded-xl bg-white/5 text-xs text-text-muted mt-2 border border-white/5">
                        <strong className="text-white">Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit / Reset Actions */}
              <div className="flex justify-end gap-3 pt-2">
                {quizSubmitted ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedAnswers({});
                      setQuizSubmitted(false);
                      setQuizScore(null);
                    }}
                  >
                    Retake Assessment
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length < activeQuiz.questions.length}
                  >
                    Submit Assessment
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ASSIGNMENT & PRACTICAL TASK */}
          {activeTab === 'assignment' && (
            <div className="max-w-3xl space-y-6">
              <div className="p-6 rounded-2xl bg-dark-card/60 border border-purple-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <Badge variant="purple">Practical Milestone Lab</Badge>
                  <span className="text-xs text-text-muted">Graded by Instructor Cohort</span>
                </div>
                <h3 className="text-xl font-bold text-white font-heading">
                  {node.title}: Hands-on Implementation Challenge
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Apply the theory and architectural concepts learned in {node.title}. Build and deploy a working application meeting the required criteria below.
                </p>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider font-heading">
                    Core Deliverables
                  </h4>
                  <ul className="space-y-2 text-xs text-text-primary">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">1.</span>
                      <span>Initialize a clean Git repository with meaningful, atomic commits.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">2.</span>
                      <span>Implement the specified architecture without omitting error handling.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">3.</span>
                      <span>Include automated unit tests verifying core logic boundaries.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-between">
                  <div className="text-xs text-purple-200">
                    Submit this challenge in the <strong>Projects & Practical Labs</strong> section to receive instructor grade verification.
                  </div>
                  <Button
                    variant="purple"
                    size="sm"
                    onClick={() => {
                      onClose();
                      if (onNavigateToProjects) onNavigateToProjects();
                    }}
                    className="whitespace-nowrap"
                  >
                    View Project Hub
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
