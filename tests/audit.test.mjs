// ============================================================================
// NEXUSLEARN AUDIT & VERIFICATION SUITE
// Tests all data structures, curriculum integrity, auth flows, & progress engine
// ============================================================================

import assert from 'node:assert/strict';

console.log('--- 🧪 STARTING NEXUSLEARN COMPREHENSIVE AUDIT ---');

// Mock localStorage for Node runtime
const storage = new Map();
globalThis.localStorage = {
  getItem: (k) => storage.get(k) || null,
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k),
  clear: () => storage.clear(),
};

globalThis.importMeta = {
  env: {
    VITE_SUPABASE_URL: '',
    VITE_SUPABASE_ANON_KEY: '',
  }
};

// 1. AUDIT CURRICULUM
console.log('1. Auditing Curriculum Data Integrity...');
const { LEARNING_TRACKS } = await import('../src/features/curriculum/curriculumData.ts');

assert.equal(LEARNING_TRACKS.length, 3, 'Must have exactly 3 primary tracks');
const trackIds = LEARNING_TRACKS.map(t => t.id);
assert.deepEqual(trackIds, ['full-stack', 'ai-tools', 'ai-engineering']);

let totalNodes = 0;
LEARNING_TRACKS.forEach(track => {
  assert.ok(track.title, `Track ${track.id} has title`);
  assert.ok(track.levels.length > 0, `Track ${track.id} has levels`);
  track.levels.forEach(lvl => {
    assert.ok(lvl.nodes.length > 0, `Level ${lvl.id} has nodes`);
    lvl.nodes.forEach(node => {
      totalNodes++;
      assert.ok(node.title, `Node ${node.id} has title`);
      assert.ok(typeof node.x === 'number' && typeof node.y === 'number', `Node ${node.id} has 2D coords`);
      assert.ok(node.module, `Node ${node.id} has module`);
      assert.ok(node.module.learningObjectives.length > 0, `Module ${node.module.id} has objectives`);
    });
  });
});
console.log(`   ✓ Verified ${LEARNING_TRACKS.length} tracks with ${totalNodes} total nodes and syllabi.`);

// 2. AUDIT AI TOOLS DIRECTORY
console.log('2. Auditing AI Tools Directory & Comparison Matrix...');
const { AI_TOOLS, AI_TOOL_CATEGORIES } = await import('../src/features/ai-tools/aiToolsData.ts');

assert.ok(AI_TOOLS.length >= 10, 'Must have at least 10 featured AI tools');
assert.ok(AI_TOOL_CATEGORIES.length >= 6, 'Must have at least 6 categories');

AI_TOOLS.forEach(tool => {
  assert.ok(tool.name, 'Tool must have name');
  assert.ok(tool.websiteUrl.startsWith('http'), `Tool ${tool.name} has valid URL`);
  assert.ok(tool.keyFeatures.length > 0, `Tool ${tool.name} has features`);
  assert.ok(tool.bestUseCases.length > 0, `Tool ${tool.name} has use cases`);
  
  // Verify comparison scores
  const scores = tool.comparisonScores;
  ['coding', 'research', 'writing', 'reasoning', 'documentAnalysis', 'multimodal'].forEach(key => {
    assert.ok(typeof scores[key] === 'number' && scores[key] >= 0 && scores[key] <= 100,
      `Tool ${tool.name} score ${key} is between 0 and 100`);
  });
});
console.log(`   ✓ Verified ${AI_TOOLS.length} AI tools with complete comparison matrices.`);

// 3. AUDIT CAPSTONE PROJECTS
console.log('3. Auditing Practical Projects & Milestones...');
const { PRACTICAL_PROJECTS } = await import('../src/features/projects/projectsData.ts');

assert.ok(PRACTICAL_PROJECTS.length >= 4, 'Must have capstone projects');
PRACTICAL_PROJECTS.forEach(proj => {
  assert.ok(proj.title, 'Project must have title');
  assert.ok(proj.stepByStepMilestones.length >= 2, `Project ${proj.title} has step milestones`);
  assert.ok(proj.submissionRequirements.length > 0, `Project ${proj.title} has requirements`);
});
console.log(`   ✓ Verified ${PRACTICAL_PROJECTS.length} practical capstone projects.`);

// 4. AUDIT AUTH SERVICE & ADMIN STUDENT CREATION
console.log('4. Auditing Authentication, Password Validation & Admin Student Provisioning...');
const { authService } = await import('../src/services/supabase/auth.ts');

// Test default student sign in
const studentSession = await authService.signIn('alex.mercer@nexuslearn.io', 'nexus123');
assert.equal(studentSession.email, 'alex.mercer@nexuslearn.io');
assert.equal(studentSession.role, 'student');

// Test default admin sign in
const adminSession = await authService.signIn('admin@nexuslearn.io', 'admin123');
assert.equal(adminSession.email, 'admin@nexuslearn.io');
assert.equal(adminSession.role, 'admin');

// Test password failure
await assert.rejects(
  async () => {
    await authService.signIn('alex.mercer@nexuslearn.io', 'wrong_pass');
  },
  /Incorrect password/,
  'Must reject incorrect password'
);

// Test Admin Creating a New Student Account with explicit login credentials
const newStudent = await authService.adminCreateStudent(
  'Priya Sharma',
  'priya.sharma@nexuslearn.io',
  'passcode2026',
  'AI Engineering & Generative AI'
);
assert.equal(newStudent.email, 'priya.sharma@nexuslearn.io');
assert.equal(newStudent.role, 'student');

// Test that the newly created student can immediately log in with their created credentials
const newStudentSession = await authService.signIn('priya.sharma@nexuslearn.io', 'passcode2026');
assert.equal(newStudentSession.email, 'priya.sharma@nexuslearn.io');
assert.equal(newStudentSession.fullName, 'Priya Sharma');
console.log('   ✓ Verified admin student creation and immediate credential login.');

// 5. AUDIT PROGRESS & SUBMISSIONS ENGINE
console.log('5. Auditing Progress Persistence & Instructor Grading...');
const { progressService } = await import('../src/services/storage/progressService.ts');

const initialProgress = progressService.getProgress();
assert.ok(Array.isArray(initialProgress.completedNodeIds), 'Has completed nodes array');

// Mark node completed
const updatedProgress = progressService.markNodeCompleted('mod-react19');
assert.ok(updatedProgress.completedNodeIds.includes('mod-react19'), 'Module marked as completed');

// Submit Project
const submission = progressService.addSubmission({
  projectId: 'proj-fs-1',
  projectTitle: 'Enterprise Authentication & Multi-Tenant RBAC',
  studentName: 'Priya Sharma',
  studentEmail: 'priya.sharma@nexuslearn.io',
  githubRepoUrl: 'https://github.com/priyasharma/auth-service',
  notes: 'Completed with JWT rotation and rate limiting',
});
assert.equal(submission.status, 'Pending Review');

// Instructor grades submission
const gradedList = progressService.updateSubmissionStatus(
  submission.id,
  'Approved',
  'Outstanding code architecture and test suite.',
  '99 / 100'
);
const gradedSub = gradedList.find(s => s.id === submission.id);
assert.equal(gradedSub.status, 'Approved');
assert.equal(gradedSub.grade, '99 / 100');
console.log('   ✓ Verified student project submission and instructor evaluation flow.');

console.log('\n--- 🎉 ALL 5 AUDIT DOMAINS PASSED 100% CLEANLY! ---');
