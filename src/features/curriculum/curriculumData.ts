import { LearningTrack } from '@/types';

export const LEARNING_TRACKS: LearningTrack[] = [
  {
    id: 'full-stack',
    title: 'Full-Stack Web Development',
    shortDescription: 'Master modern frontend, scalable backends, cloud infrastructure, and enterprise system design.',
    description: 'An exhaustive curriculum taking you from web fundamentals (HTML5/CSS3/JS) to advanced React 19, TypeScript, Node.js & Java Spring Boot, microservices, cloud deployments, and high-scale architecture.',
    color: 'from-blue-600 to-indigo-600',
    accentColor: '#38BDF8',
    iconName: 'Layers',
    levelCount: 6,
    moduleCount: 18,
    totalDurationHours: 120,
    levels: [
      {
        id: 'fs-l1',
        trackId: 'full-stack',
        order: 1,
        title: 'Level 1: Web Development Foundations',
        description: 'Semantic markup, modern responsive CSS layout systems, and deep JavaScript ES6+ internals.',
        difficulty: 'Beginner',
        nodes: [
          {
            id: 'mod-html',
            levelId: 'fs-l1',
            trackId: 'full-stack',
            title: 'Semantic HTML5 & Accessibility',
            category: 'Foundations',
            description: 'Master semantic document trees, forms, ARIA standards, and SEO architecture.',
            order: 1,
            difficulty: 'Beginner',
            estimatedMinutes: 180,
            prerequisites: [],
            status: 'completed',
            x: 80,
            y: 920,
            module: {
              id: 'm-html',
              nodeId: 'mod-html',
              title: 'Semantic HTML5, Web Accessibility & SEO',
              summary: 'Learn how browsers parse HTML documents, construct the DOM tree, and render accessible semantic interfaces.',
              learningObjectives: [
                'Understand browser DOM tree creation and semantic elements',
                'Design accessible user forms with proper validation and aria attributes',
                'Implement OpenGraph metadata, JSON-LD schema, and SEO best practices'
              ],
              prerequisites: [],
              estimatedMinutes: 180,
              difficulty: 'Beginner',
              lessons: [
                {
                  id: 'les-html-1',
                  title: 'DOM Construction & Semantic Landmark Elements',
                  durationMinutes: 45,
                  videoUrl: 'https://www.youtube.com/embed/kUMe1FH4CHE',
                  theoryMarkdown: `### The Document Object Model (DOM) and Semantic Markup
When a browser receives an HTML document, it follows a 4-step parsing pipeline:
1. **Conversion**: Bytes are converted into characters based on the specified encoding (e.g., UTF-8).
2. **Tokenization**: Characters are converted into distinct tokens (\`<html>\`, \`<body>\`, etc.).
3. **Lexing**: Tokens become node objects with defined properties and rules.
4. **DOM Construction**: Node objects are linked into a tree structure capturing parent-child relationships.

Using semantic elements (\`<main>\`, \`<article>\`, \`<section>\`, \`<nav>\`, \`<header>\`, \`<footer>\`) provides structural landmarks for assistive technologies like screen readers and search engines.`,
                  keyTakeaways: [
                    'Avoid generic <div> tags when a semantic alternative exists.',
                    'Use <nav> for primary navigation bars, <header> for introductory content, and <main> for unique page contents.',
                    'Always provide descriptive alt attributes for content images.'
                  ],
                  practicalCodeSnippets: [
                    {
                      language: 'html',
                      filename: 'semantic-card.html',
                      code: `<article class="learning-card" aria-labelledby="card-title">
  <header>
    <span class="badge">Full-Stack</span>
    <h2 id="card-title">HTML5 Semantic Tree</h2>
  </header>
  <p>Building high-performance accessible web applications.</p>
  <footer>
    <time datetime="2026-10-30">Published Oct 30, 2026</time>
  </footer>
</article>`,
                      explanation: 'Semantic article element with proper header, footer, and aria-labelledby attribute for assistive accessibility.'
                    }
                  ]
                }
              ],
              codeExercise: {
                id: 'ex-html-1',
                title: 'Accessible Registration Form',
                instructions: 'Write a semantic registration form with label associations, email input type, and required validation.',
                language: 'html',
                initialCode: `<form>\n  <!-- Add label and input for email and password -->\n</form>`,
                solutionCode: `<form>\n  <label for="user-email">Email Address</label>\n  <input id="user-email" type="email" required />\n  <label for="user-pass">Password</label>\n  <input id="user-pass" type="password" required minlength="8" />\n  <button type="submit">Register</button>\n</form>`,
                testCases: [
                  {
                    input: 'check-inputs',
                    expectedOutput: 'email and password inputs with valid label associations found',
                    description: 'Form contains properly associated labels and required attributes'
                  }
                ]
              },
              quiz: {
                id: 'quiz-html',
                title: 'Semantic HTML & Web Accessibility Quiz',
                passingScorePercent: 80,
                questions: [
                  {
                    id: 'q1',
                    question: 'Which HTML element should be used for the single primary content section of a page?',
                    options: ['<section>', '<main>', '<div id="content">', '<article>'],
                    correctIndex: 1,
                    explanation: '<main> represents the dominant content of the <body> of a document. There should be only one non-hidden <main> per document.'
                  },
                  {
                    id: 'q2',
                    question: 'What is the purpose of the aria-label attribute?',
                    options: [
                      'Defines CSS styling in Tailwind',
                      'Provides a string label for assistive screen readers when no visual text exists',
                      'Links external JavaScript scripts',
                      'Validates SQL injection queries'
                    ],
                    correctIndex: 1,
                    explanation: 'aria-label provides an accessible name for elements that do not have visible text or where visible text is insufficient.'
                  }
                ]
              }
            }
          },
          {
            id: 'mod-css',
            levelId: 'fs-l1',
            trackId: 'full-stack',
            title: 'Modern CSS, Flexbox & CSS Grid',
            category: 'Foundations',
            description: 'Master the box model, 2D grid systems, flexbox alignment, and CSS variables.',
            order: 2,
            difficulty: 'Beginner',
            estimatedMinutes: 240,
            prerequisites: ['mod-html'],
            status: 'completed',
            x: 210,
            y: 860,
            module: {
              id: 'm-css',
              nodeId: 'mod-css',
              title: 'Modern CSS, Flexbox, Grid & Responsive Layouts',
              summary: 'Deep dive into rendering pipelines, specificity, flexbox mechanics, and modern CSS Grid architectures.',
              learningObjectives: [
                'Understand browser repaint/reflow cycles and CSS specificity',
                'Master 1D Flexbox axis alignments and 2D CSS Grid templates',
                'Implement fluid typography and responsive container queries'
              ],
              prerequisites: ['mod-html'],
              estimatedMinutes: 240,
              difficulty: 'Beginner',
              lessons: [
                {
                  id: 'les-css-1',
                  title: 'CSS Grid vs Flexbox: Architectural Decisions',
                  durationMinutes: 50,
                  theoryMarkdown: `### When to Choose Flexbox vs. CSS Grid
- **Flexbox (1-Dimensional)**: Best suited for distributing items along a single axis (either row or column). Ideal for navbars, pill lists, input groups, and button clusters.
- **CSS Grid (2-Dimensional)**: Built for full page layouts, dashboards, and complex galleries where items align simultaneously across columns and rows.`,
                  keyTakeaways: [
                    'Use gap property instead of margin hacks for spacing flex and grid children.',
                    'Combine minmax() and auto-fit in CSS Grid for zero-media-query responsive grids.',
                    'Leverage CSS custom properties (variables) for dynamic runtime theme tokens.'
                  ],
                  practicalCodeSnippets: [
                    {
                      language: 'css',
                      filename: 'responsive-grid.css',
                      code: `.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}`,
                      explanation: 'Auto-fitting grid columns that automatically wrap gracefully on mobile devices without any media queries.'
                    }
                  ]
                }
              ]
            }
          },
          {
            id: 'mod-js',
            levelId: 'fs-l1',
            trackId: 'full-stack',
            title: 'JavaScript Deep Dive & Async Programming',
            category: 'Foundations',
            description: 'Prototypes, closures, the Event Loop, Promises, and modern ES6+ async/await.',
            order: 3,
            difficulty: 'Intermediate',
            estimatedMinutes: 300,
            prerequisites: ['mod-css'],
            status: 'in_progress',
            x: 360,
            y: 810,
            module: {
              id: 'm-js',
              nodeId: 'mod-js',
              title: 'JavaScript Core Architecture & Asynchronous Runtime',
              summary: 'Master execution contexts, lexical scoping, closures, microtask queue vs macrotask queue, and error handling.',
              learningObjectives: [
                'Analyze the V8 JavaScript call stack, memory heap, and event loop',
                'Write resilient asynchronous code using async/await and Promise.allSettled',
                'Understand functional programming primitives: immutability, map, filter, reduce'
              ],
              prerequisites: ['mod-css'],
              estimatedMinutes: 300,
              difficulty: 'Intermediate',
              lessons: [
                {
                  id: 'les-js-1',
                  title: 'The JavaScript Event Loop & Microtask Queue',
                  durationMinutes: 60,
                  videoUrl: 'https://www.youtube.com/embed/8aGhZQkoFbQ',
                  theoryMarkdown: `### The Event Loop Demystified
JavaScript is single-threaded, meaning it has one call stack and executes one chunk of code at a time. Concurrency is handled by the browser runtime (or Node.js libuv).

#### The Processing Order:
1. Synchronous code on the Call Stack runs to completion.
2. When the call stack is empty, the **Microtask Queue** is processed (Promises, \`queueMicrotask\`, MutationObserver).
3. Once all microtasks are drained, the event loop picks a single task from the **Macrotask Queue** (setTimeout, setInterval, I/O events).
4. Browser performs render update if needed, and repeats.`,
                  keyTakeaways: [
                    'Promise callbacks (.then/catch) execute before setTimeout(..., 0) because microtasks have higher priority.',
                    'Always handle rejected promises to prevent unhandledrejection runtime crashes.',
                    'Use structuredClone() for true deep copies of complex nested objects.'
                  ],
                  practicalCodeSnippets: [
                    {
                      language: 'javascript',
                      filename: 'fetch-retry.js',
                      code: `async function fetchWithRetry(url, retries = 3, delay = 1000) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } catch (err) {
    if (retries <= 1) throw err;
    await new Promise((r) => setTimeout(r, delay));
    return fetchWithRetry(url, retries - 1, delay * 2);
  }
}`,
                      explanation: 'Exponential backoff fetch retry mechanism handling network fluctuations.'
                    }
                  ]
                }
              ],
              codeExercise: {
                id: 'ex-js-1',
                title: 'Build an Async Task Queue',
                instructions: 'Write a JavaScript function that processes an array of asynchronous tasks with a maximum concurrency limit.',
                language: 'javascript',
                initialCode: `async function pLimit(tasks, limit) {\n  // Process tasks with concurrency limit\n}`,
                solutionCode: `async function pLimit(tasks, limit) {\n  const results = [];\n  const executing = new Set();\n  for (const task of tasks) {\n    const p = Promise.resolve().then(() => task());\n    results.push(p);\n    executing.add(p);\n    const clean = () => executing.delete(p);\n    p.then(clean).catch(clean);\n    if (executing.size >= limit) {\n      await Promise.race(executing);\n    }\n  }\n  return Promise.all(results);\n}`,
                testCases: [
                  {
                    input: 'run-queue',
                    expectedOutput: 'concurrency respected',
                    description: 'Limits active asynchronous promises to the specified concurrency cap'
                  }
                ]
              }
            }
          }
        ]
      },
      {
        id: 'fs-l2',
        trackId: 'full-stack',
        order: 2,
        title: 'Level 2: Frontend Development & React 19',
        description: 'Component architecture, React 19 hooks (use, useActionState, useOptimistic), TypeScript typing, and performance tuning.',
        difficulty: 'Intermediate',
        nodes: [
          {
            id: 'mod-react19',
            levelId: 'fs-l2',
            trackId: 'full-stack',
            title: 'React 19 & Component Architecture',
            category: 'Frontend',
            description: 'Learn modern React 19 features, Server Components, Action Hooks, and clean architectural composition.',
            order: 4,
            difficulty: 'Intermediate',
            estimatedMinutes: 360,
            prerequisites: ['mod-js'],
            status: 'available',
            x: 520,
            y: 720,
            module: {
              id: 'm-react19',
              nodeId: 'mod-react19',
              title: 'React 19 Architecture: Actions, Hooks & Transitions',
              summary: 'Master React 19 features including the unified use hook, useActionState for form handling, useOptimistic for instant UI feedback, and the React Compiler.',
              learningObjectives: [
                'Understand React 19 Action hooks and automatic transition handling',
                'Implement optimistic UI updates with useOptimistic',
                'Design resilient state architectures using Context, Custom Hooks, and reducer patterns'
              ],
              prerequisites: ['mod-js'],
              estimatedMinutes: 360,
              difficulty: 'Intermediate',
              lessons: [
                {
                  id: 'les-react-1',
                  title: 'React 19 Actions and useActionState',
                  durationMinutes: 50,
                  theoryMarkdown: `### What Makes React 19 Revolutionary?
React 19 introduces native support for **Actions**—functions that use async transitions.
- Automatic pending states: No more manual \`const [loading, setLoading] = useState(false)\`.
- Automatic optimistic updates: Render UI changes instantly while network queries complete.
- Simplified form handling with \`action\` attributes on \`<form>\`.`,
                  keyTakeaways: [
                    'useActionState replaces boilerplate useState + try/catch submit blocks.',
                    'useOptimistic provides seamless feedback for instant client responsiveness.',
                    'React 19 compiler minimizes manual useMemo and useCallback requirements.'
                  ],
                  practicalCodeSnippets: [
                    {
                      language: 'javascript',
                      filename: 'react19-action.tsx',
                      code: `import { useActionState, useOptimistic } from 'react';

async function updateProfile(prevState, formData) {
  const name = formData.get('name');
  await api.saveName(name);
  return { name };
}

export function ProfileForm({ currentName }) {
  const [state, formAction, isPending] = useActionState(updateProfile, { name: currentName });
  const [optimisticName, setOptimisticName] = useOptimistic(state.name, (_, update) => update);

  return (
    <form action={async (formData) => {
      setOptimisticName(formData.get('name'));
      await formAction(formData);
    }}>
      <h2>Welcome, {optimisticName} {isPending && '(Saving...)'}</h2>
      <input name="name" defaultValue={state.name} />
      <button disabled={isPending}>Save</button>
    </form>
  );
}`,
                      explanation: 'Production React 19 action with useOptimistic and automatic pending indicator.'
                    }
                  ]
                }
              ]
            }
          },
          {
            id: 'mod-typescript',
            levelId: 'fs-l2',
            trackId: 'full-stack',
            title: 'TypeScript for Scale',
            category: 'Frontend',
            description: 'Generics, conditional types, discriminated unions, utility types, and strict type narrowing.',
            order: 5,
            difficulty: 'Intermediate',
            estimatedMinutes: 240,
            prerequisites: ['mod-react19'],
            status: 'locked',
            x: 680,
            y: 650,
            module: {
              id: 'm-typescript',
              nodeId: 'mod-typescript',
              title: 'Advanced TypeScript: Generics & Type-Safe Systems',
              summary: 'Learn how to construct robust, bulletproof enterprise type systems that eliminate entire classes of runtime defects.',
              learningObjectives: [
                'Master generic constraints and generic functions',
                'Leverage discriminated unions for state modeling',
                'Write custom type guards and utility transformations'
              ],
              prerequisites: ['mod-react19'],
              estimatedMinutes: 240,
              difficulty: 'Intermediate',
              lessons: [
                {
                  id: 'les-ts-1',
                  title: 'Discriminated Unions & Exhaustive State Checks',
                  durationMinutes: 45,
                  theoryMarkdown: `### Eliminating Invalid States with Discriminated Unions
Never model complex states with multiple independent booleans (\`isLoading\`, \`isError\`, \`data\`). Instead, use a single tagged discriminant:
\`\`\`typescript
type RequestState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
\`\`\``,
                  keyTakeaways: [
                    'Discriminated unions ensure that data is only accessible when status is "success".',
                    'Use never type in the default switch case for compile-time exhaustive checking.',
                    'Prefer interfaces for public API contracts and types for union/computed definitions.'
                  ],
                  practicalCodeSnippets: [
                    {
                      language: 'typescript',
                      filename: 'state-matcher.ts',
                      code: `function renderState<T>(state: RequestState<T>): string {
  switch (state.status) {
    case 'idle': return 'Click to load';
    case 'loading': return 'Fetching data...';
    case 'success': return \`Received: \${JSON.stringify(state.data)}\`;
    case 'error': return \`Failed: \${state.error.message}\`;
    default: {
      const _exhaustiveCheck: never = state;
      return _exhaustiveCheck;
    }
  }
}`,
                      explanation: 'Compile-time exhaustive state renderer utilizing TypeScript never type.'
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        id: 'fs-l3',
        trackId: 'full-stack',
        order: 3,
        title: 'Level 3: Backend Services & API Architecture',
        description: 'Node.js Express, Java Spring Boot, RESTful design, authentication tokens, and middleware pipelines.',
        difficulty: 'Advanced',
        nodes: [
          {
            id: 'mod-node-express',
            levelId: 'fs-l3',
            trackId: 'full-stack',
            title: 'Node.js & Express REST APIs',
            category: 'Backend',
            description: 'Scalable routing, JWT authentication, rate limiting, and input validation with Zod.',
            order: 6,
            difficulty: 'Intermediate',
            estimatedMinutes: 300,
            prerequisites: ['mod-typescript'],
            status: 'locked',
            x: 750,
            y: 540,
            module: {
              id: 'm-node-express',
              nodeId: 'mod-node-express',
              title: 'Production Express.js & Security Architecture',
              summary: 'Build robust REST APIs with layered controller-service architectures, central error middleware, and token authentication.',
              learningObjectives: [
                'Design clean 3-tier architecture (Controllers, Services, Repositories)',
                'Enforce strict request body validation using Zod',
                'Implement JWT refresh token rotation with HTTP-only cookies'
              ],
              prerequisites: ['mod-typescript'],
              estimatedMinutes: 300,
              difficulty: 'Intermediate',
              lessons: []
            }
          },
          {
            id: 'mod-java-spring',
            levelId: 'fs-l3',
            trackId: 'full-stack',
            title: 'Java 21 & Spring Boot Enterprise Services',
            category: 'Backend',
            description: 'Enterprise dependency injection, Spring Security, Hibernate ORM, and JPA entity management.',
            order: 7,
            difficulty: 'Advanced',
            estimatedMinutes: 360,
            prerequisites: ['mod-node-express'],
            status: 'locked',
            x: 620,
            y: 460,
            module: {
              id: 'm-java-spring',
              nodeId: 'mod-java-spring',
              title: 'Enterprise Backend Development with Java & Spring Boot',
              summary: 'Learn OOP design patterns, inversion of control, multithreading, and enterprise API security with Spring.',
              learningObjectives: [
                'Configure Spring IoC container and bean lifecycles',
                'Map relational tables using JPA and Hibernate criteria queries',
                'Secure endpoints with Spring Security OAuth2/JWT filter chains'
              ],
              prerequisites: ['mod-node-express'],
              estimatedMinutes: 360,
              difficulty: 'Advanced',
              lessons: []
            }
          }
        ]
      },
      {
        id: 'fs-l4',
        trackId: 'full-stack',
        order: 4,
        title: 'Level 4: Databases, Kafka & Distributed Integration',
        description: 'PostgreSQL, MongoDB, query indexes, ACID transactions, and Apache Kafka event-driven messaging.',
        difficulty: 'Advanced',
        nodes: [
          {
            id: 'mod-sql-nosql',
            levelId: 'fs-l4',
            trackId: 'full-stack',
            title: 'PostgreSQL, MongoDB & Data Modeling',
            category: 'Databases',
            description: 'Relational schemas, B-tree indexes, execution plans (EXPLAIN ANALYZE), and NoSQL document design.',
            order: 8,
            difficulty: 'Advanced',
            estimatedMinutes: 300,
            prerequisites: ['mod-node-express'],
            status: 'locked',
            x: 440,
            y: 380,
            module: {
              id: 'm-sql-nosql',
              nodeId: 'mod-sql-nosql',
              title: 'Relational Data Modeling & Database Optimization',
              summary: 'Master normalization, complex joins, indexing strategies, and transaction isolation levels.',
              learningObjectives: [
                'Optimize queries using composite indexes and EXPLAIN ANALYZE',
                'Prevent race conditions with pessimistic and optimistic locking',
                'Design hybrid architectures combining relational and document stores'
              ],
              prerequisites: ['mod-node-express'],
              estimatedMinutes: 300,
              difficulty: 'Advanced',
              lessons: []
            }
          },
          {
            id: 'mod-kafka',
            levelId: 'fs-l4',
            trackId: 'full-stack',
            title: 'Apache Kafka & Microservices Architecture',
            category: 'Integration',
            description: 'Event-driven architecture, producer-consumer partitions, message brokers, and distributed reliability.',
            order: 9,
            difficulty: 'Advanced',
            estimatedMinutes: 300,
            prerequisites: ['mod-sql-nosql'],
            status: 'locked',
            x: 310,
            y: 300,
            module: {
              id: 'm-kafka',
              nodeId: 'mod-kafka',
              title: 'Event-Driven Architectures with Apache Kafka',
              summary: 'Understand partitioned commit logs, consumer groups, exactly-once processing, and asynchronous decouplings.',
              learningObjectives: [
                'Implement event producers, topics, and consumer groups',
                'Handle consumer lag, backpressure, and dead letter queues',
                'Design microservice communication using the Saga pattern'
              ],
              prerequisites: ['mod-sql-nosql'],
              estimatedMinutes: 300,
              difficulty: 'Advanced',
              lessons: []
            }
          }
        ]
      },
      {
        id: 'fs-l5',
        trackId: 'full-stack',
        order: 5,
        title: 'Level 5: DevOps, Cloud Infrastructure & Containers',
        description: 'Docker containerization, Kubernetes orchestration, GitHub Actions CI/CD pipelines, and AWS/GCP deployments.',
        difficulty: 'Advanced',
        nodes: [
          {
            id: 'mod-docker-k8s',
            levelId: 'fs-l5',
            trackId: 'full-stack',
            title: 'Docker Containers & Kubernetes Pods',
            category: 'DevOps',
            description: 'Multi-stage Docker builds, image layer caching, K8s deployments, services, ingress, and secrets.',
            order: 10,
            difficulty: 'Advanced',
            estimatedMinutes: 320,
            prerequisites: ['mod-kafka'],
            status: 'locked',
            x: 220,
            y: 200,
            module: {
              id: 'm-docker-k8s',
              nodeId: 'mod-docker-k8s',
              title: 'Containerization & Kubernetes Orchestration',
              summary: 'Package applications into minimal Alpine containers and orchestrate clusters with automated scaling and health checks.',
              learningObjectives: [
                'Author lightweight multi-stage Dockerfiles under 50MB',
                'Configure Kubernetes Deployments, ClusterIP Services, and Ingress',
                'Implement rolling zero-downtime updates and liveliness probes'
              ],
              prerequisites: ['mod-kafka'],
              estimatedMinutes: 320,
              difficulty: 'Advanced',
              lessons: []
            }
          }
        ]
      },
      {
        id: 'fs-l6',
        trackId: 'full-stack',
        order: 6,
        title: 'Level 6: System Design & Enterprise Mastery',
        description: 'Distributed caching (Redis), CDN edge caching, load balancing algorithms, database sharding, and resilience engineering.',
        difficulty: 'Industry Level',
        nodes: [
          {
            id: 'mod-system-design',
            levelId: 'fs-l6',
            trackId: 'full-stack',
            title: 'High-Scale System Design & Scalability',
            category: 'Architecture',
            description: 'Architecting for 10M+ daily active users: CAP theorem, consistent hashing, rate limiters, and fault tolerance.',
            order: 11,
            difficulty: 'Industry Level',
            estimatedMinutes: 400,
            prerequisites: ['mod-docker-k8s'],
            status: 'locked',
            x: 180,
            y: 80,
            module: {
              id: 'm-system-design',
              nodeId: 'mod-system-design',
              title: 'System Design Interview & Enterprise Architecture',
              summary: 'Learn how to design scalable platforms such as YouTube, Uber, or an E-Commerce checkout pipeline.',
              learningObjectives: [
                'Apply CAP theorem trade-offs to database selection',
                'Design Redis multi-layer caching with cache-aside and write-through patterns',
                'Implement distributed rate limiters using sliding window logs'
              ],
              prerequisites: ['mod-docker-k8s'],
              estimatedMinutes: 400,
              difficulty: 'Industry Level',
              lessons: []
            }
          }
        ]
      }
    ]
  },
  {
    id: 'ai-tools',
    title: 'AI Tools Mastery & Practical Workflows',
    shortDescription: 'Master modern AI assistants, research engines, coding agents, automation platforms, and creative studios.',
    description: 'Learn when, why, and how to use modern AI tools in real-world professional workflows. Includes in-depth masterclasses on ChatGPT, Claude 3.7, Gemini 2.0, Perplexity, Cursor, Lovable, v0, Make, Zapier, ElevenLabs, and Firefly.',
    color: 'from-amber-500 to-orange-600',
    accentColor: '#F97316',
    iconName: 'Sparkles',
    levelCount: 6,
    moduleCount: 12,
    totalDurationHours: 65,
    levels: [
      {
        id: 'ai-t-m1',
        trackId: 'ai-tools',
        order: 1,
        title: 'Module 1: AI Assistants & Reasoning Engines',
        description: 'Deep mastery of ChatGPT, Claude 3.7, and Google Gemini 2.0 for coding, problem-solving, and analysis.',
        difficulty: 'Beginner',
        nodes: [
          {
            id: 'mod-chatgpt-mastery',
            levelId: 'ai-t-m1',
            trackId: 'ai-tools',
            title: 'ChatGPT & Advanced Prompt Engineering',
            category: 'AI Assistants',
            description: 'Master Chain-of-Thought prompting, Custom GPTs, Code Interpreter, and structured output generation.',
            order: 1,
            difficulty: 'Beginner',
            estimatedMinutes: 180,
            prerequisites: [],
            status: 'completed',
            x: 100,
            y: 900,
            module: {
              id: 'm-chatgpt',
              nodeId: 'mod-chatgpt-mastery',
              title: 'ChatGPT: Advanced Prompt Engineering & Problem Solving',
              summary: 'Turn ChatGPT into a powerful daily software engineer, data analyst, and strategic reasoning partner.',
              learningObjectives: [
                'Formulate structured system prompts using role-task-context-constraints framework',
                'Leverage few-shot prompting and step-by-step reasoning triggers',
                'Extract strict JSON schemas for automated downstream processing'
              ],
              prerequisites: [],
              estimatedMinutes: 180,
              difficulty: 'Beginner',
              lessons: [
                {
                  id: 'les-gpt-1',
                  title: 'The RTCC Prompt Engineering Framework',
                  durationMinutes: 40,
                  theoryMarkdown: `### The RTCC Framework (Role, Task, Context, Constraints)
Top engineers achieve 10x higher output quality by avoiding vague single-line prompts.

#### The 4 Pillars of High-Precision Prompts:
1. **Role**: Set domain persona and seniority (e.g., \`You are a Principal Cloud Architect specializing in AWS\`).
2. **Task**: State the exact operational goal.
3. **Context**: Provide background requirements, current dependencies, and constraints.
4. **Constraints**: Define what NOT to do, formatting (JSON/Markdown), and style limits.`,
                  keyTakeaways: [
                    'Always provide clear input schemas and output expectations.',
                    'Instruct the model to think step-by-step for complex mathematical or architectural decisions.',
                    'Use system prompts to eliminate conversational fluff.'
                  ],
                  practicalCodeSnippets: [
                    {
                      language: 'markdown',
                      filename: 'rtcc-prompt-template.md',
                      code: `[ROLE]
You are a Staff Database Engineer specializing in PostgreSQL 16 performance.

[TASK]
Review the attached slow query and provide three optimization strategies.

[CONTEXT]
Table 'orders' contains 25 million records. Query takes 4.2s to run.

[CONSTRAINTS]
Output strictly formatted Markdown with EXPLAIN ANALYZE comparisons. Do not suggest hardware upgrades.`,
                      explanation: 'High-precision prompt template ensuring deterministic, high-value AI output.'
                    }
                  ]
                }
              ]
            }
          },
          {
            id: 'mod-claude-gemini',
            levelId: 'ai-t-m1',
            trackId: 'ai-tools',
            title: 'Claude 3.7 & Google Gemini 2.0',
            category: 'AI Assistants',
            description: 'Long-context workflows (200k+ tokens), Artifacts, multimodal reasoning, and deep architecture planning.',
            order: 2,
            difficulty: 'Intermediate',
            estimatedMinutes: 200,
            prerequisites: ['mod-chatgpt-mastery'],
            status: 'in_progress',
            x: 260,
            y: 820,
            module: {
              id: 'm-claude-gemini',
              nodeId: 'mod-claude-gemini',
              title: 'Claude & Gemini: Long-Context & Multimodal Analysis',
              summary: 'Learn how to utilize 200K - 1M token context windows for full-codebase audits and multimodal video/audio parsing.',
              learningObjectives: [
                'Feed entire git repositories into Claude Projects for architectural analysis',
                'Use Claude Artifacts for rapid prototyping and live React previews',
                'Process multimodal video inputs and technical blueprints with Gemini 2.0'
              ],
              prerequisites: ['mod-chatgpt-mastery'],
              estimatedMinutes: 200,
              difficulty: 'Intermediate',
              lessons: []
            }
          }
        ]
      },
      {
        id: 'ai-t-m2',
        trackId: 'ai-tools',
        order: 2,
        title: 'Module 2: AI Research & Source Verification',
        description: 'Perplexity AI and Google NotebookLM for cited real-time research, PDF synthesis, and study notebooks.',
        difficulty: 'Beginner',
        nodes: [
          {
            id: 'mod-perplexity-notebooklm',
            levelId: 'ai-t-m2',
            trackId: 'ai-tools',
            title: 'Perplexity AI & NotebookLM Deep Search',
            category: 'Research',
            description: 'Real-time citation-backed discovery, academic paper synthesis, audio deep-dives, and research second brains.',
            order: 3,
            difficulty: 'Beginner',
            estimatedMinutes: 160,
            prerequisites: ['mod-chatgpt-mastery'],
            status: 'available',
            x: 440,
            y: 720,
            module: {
              id: 'm-research-tools',
              nodeId: 'mod-perplexity-notebooklm',
              title: 'Source-Grounded Research with Perplexity & NotebookLM',
              summary: 'Conduct verified academic and technical research without AI hallucinations by grounding queries in validated sources.',
              learningObjectives: [
                'Utilize Perplexity Pro Search with domain filtering (GitHub, arXiv, Reddit)',
                'Build grounded research notebooks in NotebookLM from 50+ PDF documents',
                'Generate conversational audio overviews from technical documentation'
              ],
              prerequisites: ['mod-chatgpt-mastery'],
              estimatedMinutes: 160,
              difficulty: 'Beginner',
              lessons: []
            }
          }
        ]
      },
      {
        id: 'ai-t-m3',
        trackId: 'ai-tools',
        order: 3,
        title: 'Module 3: AI Coding & Rapid App Prototyping',
        description: 'Cursor IDE, Lovable, v0.dev, GitHub Copilot, and Bolt.new for 10x software engineering velocity.',
        difficulty: 'Intermediate',
        nodes: [
          {
            id: 'mod-cursor-ide',
            levelId: 'ai-t-m3',
            trackId: 'ai-tools',
            title: 'Cursor IDE: Agent Mode & Codebase Indexing',
            category: 'AI Coding',
            description: 'AI-native IDE mastery: @codebase semantic search, multi-file edits, Composer, and autonomous agent debugging.',
            order: 4,
            difficulty: 'Intermediate',
            estimatedMinutes: 240,
            prerequisites: ['mod-claude-gemini'],
            status: 'locked',
            x: 580,
            y: 600,
            module: {
              id: 'm-cursor',
              nodeId: 'mod-cursor-ide',
              title: 'Cursor IDE Masterclass: The AI-First Developer Workflow',
              summary: 'Transform how you write code with AI codebase indexing, instant refactoring, and agentic multi-file modifications.',
              learningObjectives: [
                'Master @codebase, @docs, and @web indexing symbols',
                'Direct Cursor Composer across multi-file architectural refactors',
                'Write effective .cursorrules to enforce design patterns and team conventions'
              ],
              prerequisites: ['mod-claude-gemini'],
              estimatedMinutes: 240,
              difficulty: 'Intermediate',
              lessons: []
            }
          },
          {
            id: 'mod-lovable-v0',
            levelId: 'ai-t-m3',
            trackId: 'ai-tools',
            title: 'Lovable & v0.dev App Generation',
            category: 'AI Coding',
            description: 'Prompt-to-fullstack application generation, Supabase auto-wiring, and shadcn/ui component rapid generation.',
            order: 5,
            difficulty: 'Intermediate',
            estimatedMinutes: 180,
            prerequisites: ['mod-cursor-ide'],
            status: 'locked',
            x: 720,
            y: 500,
            module: {
              id: 'm-lovable-v0',
              nodeId: 'mod-lovable-v0',
              title: 'Full-Stack Rapid Generation: Lovable & v0.dev',
              summary: 'Learn how modern fullstack prototypes are created from conversational prompts with connected PostgreSQL backends.',
              learningObjectives: [
                'Generate polished React + Tailwind components in v0.dev',
                'Scaffold full-stack web apps in Lovable with authenticated Supabase schemas',
                'Export generated code into clean production git repositories'
              ],
              prerequisites: ['mod-cursor-ide'],
              estimatedMinutes: 180,
              difficulty: 'Intermediate',
              lessons: []
            }
          }
        ]
      },
      {
        id: 'ai-t-m4',
        trackId: 'ai-tools',
        order: 4,
        title: 'Module 4: AI Automation, Webhooks & Agents',
        description: 'Make.com, Zapier, and Lindy AI for autonomous business operations, email processing, and lead pipelines.',
        difficulty: 'Advanced',
        nodes: [
          {
            id: 'mod-make-zapier',
            levelId: 'ai-t-m4',
            trackId: 'ai-tools',
            title: 'Make & Zapier Multi-Step AI Automation',
            category: 'Automation',
            description: 'Connect LLM nodes with webhooks, CRM databases, Google Sheets, Slack alerts, and automated email routers.',
            order: 6,
            difficulty: 'Intermediate',
            estimatedMinutes: 220,
            prerequisites: ['mod-lovable-v0'],
            status: 'locked',
            x: 640,
            y: 380,
            module: {
              id: 'm-make-zapier',
              nodeId: 'mod-make-zapier',
              title: 'Building Enterprise Automation Scenarios with Make & Zapier',
              summary: 'Build autonomous business systems that listen for triggers, enrich data via OpenAI/Anthropic APIs, and execute actions.',
              learningObjectives: [
                'Design branching visual automation scenarios in Make.com',
                'Integrate OpenAI JSON mode inside Zapier action pipelines',
                'Handle errors, fallback routes, and data validation'
              ],
              prerequisites: ['mod-lovable-v0'],
              estimatedMinutes: 220,
              difficulty: 'Intermediate',
              lessons: []
            }
          }
        ]
      },
      {
        id: 'ai-t-m5',
        trackId: 'ai-tools',
        order: 5,
        title: 'Module 5: Creative Media & Voice Generation',
        description: 'Canva AI, ElevenLabs natural voice synthesis, and Adobe Firefly commercial generative imagery.',
        difficulty: 'Intermediate',
        nodes: [
          {
            id: 'mod-creative-media',
            levelId: 'ai-t-m5',
            trackId: 'ai-tools',
            title: 'ElevenLabs, Canva & Adobe Firefly',
            category: 'Creative AI',
            description: 'Voice generation, consent-based cloning, text-to-speech audiobooks, generative fill, and commercial brand assets.',
            order: 7,
            difficulty: 'Intermediate',
            estimatedMinutes: 180,
            prerequisites: ['mod-make-zapier'],
            status: 'locked',
            x: 480,
            y: 260,
            module: {
              id: 'm-creative-media',
              nodeId: 'mod-creative-media',
              title: 'Voice Synthesis & Commercial Visual Design',
              summary: 'Explore cutting-edge generative audio pipelines and copyright-safe visual creation for modern product marketing.',
              learningObjectives: [
                'Create hyper-realistic audio voiceovers with ElevenLabs TTS API',
                'Use Adobe Firefly generative expand and recolor within legal IP bounds',
                'Automate social media asset generation with Canva Magic Studio'
              ],
              prerequisites: ['mod-make-zapier'],
              estimatedMinutes: 180,
              difficulty: 'Intermediate',
              lessons: []
            }
          }
        ]
      },
      {
        id: 'ai-t-m6',
        trackId: 'ai-tools',
        order: 6,
        title: 'Module 6: Tool Evaluation & Strategic Selection',
        description: 'Decision frameworks for choosing the right AI tool, cost vs quality analysis, privacy & enterprise compliance.',
        difficulty: 'Advanced',
        nodes: [
          {
            id: 'mod-tool-evaluation',
            levelId: 'ai-t-m6',
            trackId: 'ai-tools',
            title: 'AI Tool Comparison & Enterprise ROI',
            category: 'Strategy',
            description: 'Benchmarking AI tool capabilities, evaluating data privacy / SOC2 compliance, and building corporate AI toolkits.',
            order: 8,
            difficulty: 'Advanced',
            estimatedMinutes: 160,
            prerequisites: ['mod-creative-media'],
            status: 'locked',
            x: 320,
            y: 120,
            module: {
              id: 'm-evaluation',
              nodeId: 'mod-tool-evaluation',
              title: 'Strategic AI Tool Selection & Enterprise Architecture',
              summary: 'Frameworks to assess whether an organization should adopt ChatGPT Team, Claude Enterprise, Copilot 365, or self-hosted LLMs.',
              learningObjectives: [
                'Perform multi-variable trade-off analysis on latency, cost, and privacy',
                'Establish data governance policies to protect corporate IP',
                'Quantify engineering productivity gains and return on investment'
              ],
              prerequisites: ['mod-creative-media'],
              estimatedMinutes: 160,
              difficulty: 'Advanced',
              lessons: []
            }
          }
        ]
      }
    ]
  },
  {
    id: 'ai-engineering',
    title: 'AI Engineering & Generative AI Systems',
    shortDescription: 'Build production-ready LLM applications, RAG pipelines, autonomous agents, and MLOps deployments.',
    description: 'Learn the technical science and engineering of AI: Python foundations, NumPy/PyTorch, Transformer architecture, Vector embeddings, Supabase pgvector RAG, FastAPI model serving, CrewAI agents, and production MLOps.',
    color: 'from-purple-600 to-indigo-700',
    accentColor: '#A855F7',
    iconName: 'Cpu',
    levelCount: 7,
    moduleCount: 16,
    totalDurationHours: 140,
    levels: [
      {
        id: 'aie-l1',
        trackId: 'ai-engineering',
        order: 1,
        title: 'Level 1: Python, Math & Data Preprocessing',
        description: 'Modern Python 3.13, NumPy vector math, Pandas dataframes, and foundational linear algebra & statistics.',
        difficulty: 'Beginner',
        nodes: [
          {
            id: 'mod-python-math',
            levelId: 'aie-l1',
            trackId: 'ai-engineering',
            title: 'Python for AI & Vector Mathematics',
            category: 'Foundations',
            description: 'Vector dot products, matrix multiplications, NumPy arrays, broadcasting, and Python async concurrency.',
            order: 1,
            difficulty: 'Beginner',
            estimatedMinutes: 240,
            prerequisites: [],
            status: 'completed',
            x: 90,
            y: 910,
            module: {
              id: 'm-python-math',
              nodeId: 'mod-python-math',
              title: 'Python, NumPy & Vector Foundations for AI',
              summary: 'Learn the mathematical language of neural networks and machine learning: matrix operations, dot products, and vectorized computation.',
              learningObjectives: [
                'Perform high-speed vectorized operations using NumPy',
                'Understand dot products, cosine similarity, and Euclidean distance',
                'Handle data normalization and missing value imputation with Pandas'
              ],
              prerequisites: [],
              estimatedMinutes: 240,
              difficulty: 'Beginner',
              lessons: [
                {
                  id: 'les-py-1',
                  title: 'Vector Embeddings & Cosine Similarity Math',
                  durationMinutes: 45,
                  theoryMarkdown: `### The Geometric Foundation of AI Embeddings
When language models convert text into embeddings, each word or document becomes a point in high-dimensional space (e.g., 1536 dimensions for OpenAI text-embedding-3-small).

#### Cosine Similarity Formula:
$$\\text{Cosine Similarity}(\\mathbf{A}, \\mathbf{B}) = \\frac{\\mathbf{A} \\cdot \\mathbf{B}}{\\|\\mathbf{A}\\| \\|\\mathbf{B}\\|} = \\frac{\\sum A_i B_i}{\\sqrt{\\sum A_i^2} \\sqrt{\\sum B_i^2}}$$
- Value ranges from -1 (opposite) to +1 (identical direction).
- Cosine distance = $1 - \\text{Cosine Similarity}$.`,
                  keyTakeaways: [
                    'Cosine similarity measures angle between vectors, independent of magnitude.',
                    'Vector databases like pgvector index embeddings using HNSW or IVFFlat graphs for sub-millisecond retrieval.',
                    'Never calculate vector similarities with Python loops—always use SIMD vectorized NumPy or GPU BLAS operations.'
                  ],
                  practicalCodeSnippets: [
                    {
                      language: 'python',
                      filename: 'cosine_similarity.py',
                      code: `import numpy as np

def cosine_similarity(v1: np.ndarray, v2: np.ndarray) -> float:
    dot_product = np.dot(v1, v2)
    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)
    if norm_v1 == 0 or norm_v2 == 0:
        return 0.0
    return float(dot_product / (norm_v1 * norm_v2))

# Example embeddings
emb_query = np.array([0.24, 0.81, -0.45])
emb_doc = np.array([0.22, 0.79, -0.40])
print(f"Similarity: {cosine_similarity(emb_query, emb_doc):.4f}")`,
                      explanation: 'Pure NumPy vectorized cosine similarity implementation.'
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        id: 'aie-l2',
        trackId: 'ai-engineering',
        order: 2,
        title: 'Level 2: Classical Machine Learning & Scikit-Learn',
        description: 'Supervised and unsupervised learning: linear regression, decision trees, random forests, clustering, and cross-validation.',
        difficulty: 'Intermediate',
        nodes: [
          {
            id: 'mod-scikit-learn',
            levelId: 'aie-l2',
            trackId: 'ai-engineering',
            title: 'Scikit-Learn & Feature Engineering',
            category: 'Machine Learning',
            description: 'Model evaluation metrics (ROC-AUC, F1-score), feature scaling, hyperparameter grid search, and ensemble pipelines.',
            order: 2,
            difficulty: 'Intermediate',
            estimatedMinutes: 260,
            prerequisites: ['mod-python-math'],
            status: 'in_progress',
            x: 230,
            y: 840,
            module: {
              id: 'm-ml-scikit',
              nodeId: 'mod-scikit-learn',
              title: 'Applied Machine Learning with Scikit-Learn',
              summary: 'Train, evaluate, and tune production-ready tabular machine learning models with rigorous validation procedures.',
              learningObjectives: [
                'Implement robust preprocessing pipelines with ColumnTransformer',
                'Train classification algorithms and evaluate confusion matrices',
                'Avoid data leakage during train/test splits and cross-validation'
              ],
              prerequisites: ['mod-python-math'],
              estimatedMinutes: 260,
              difficulty: 'Intermediate',
              lessons: []
            }
          }
        ]
      },
      {
        id: 'aie-l3',
        trackId: 'ai-engineering',
        order: 3,
        title: 'Level 3: Deep Learning & PyTorch',
        description: 'Backpropagation, PyTorch tensors, neural network layers, loss functions, AdamW optimizers, and CNNs.',
        difficulty: 'Advanced',
        nodes: [
          {
            id: 'mod-pytorch-foundations',
            levelId: 'aie-l3',
            trackId: 'ai-engineering',
            title: 'PyTorch Deep Learning & Neural Networks',
            category: 'Deep Learning',
            description: 'Autograd automatic differentiation, nn.Module custom architectures, CUDA GPU acceleration, and DataLoader pipelines.',
            order: 3,
            difficulty: 'Advanced',
            estimatedMinutes: 320,
            prerequisites: ['mod-scikit-learn'],
            status: 'available',
            x: 390,
            y: 750,
            module: {
              id: 'm-pytorch',
              nodeId: 'mod-pytorch-foundations',
              title: 'PyTorch: Building Neural Networks from Scratch',
              summary: 'Understand computational graphs, gradient descent, weight updates, and how to train custom models on GPUs.',
              learningObjectives: [
                'Implement custom neural layers subclassing torch.nn.Module',
                'Write the standard PyTorch training loop with loss backward and optimizer step',
                'Prevent overfitting using dropout, weight decay, and early stopping'
              ],
              prerequisites: ['mod-scikit-learn'],
              estimatedMinutes: 320,
              difficulty: 'Advanced',
              lessons: []
            }
          }
        ]
      },
      {
        id: 'aie-l4',
        trackId: 'ai-engineering',
        order: 4,
        title: 'Level 4: Generative AI & Transformer Architecture',
        description: 'The Attention Is All You Need architecture, multi-head self-attention, tokenization (BPE), Hugging Face, and fine-tuning (LoRA).',
        difficulty: 'Advanced',
        nodes: [
          {
            id: 'mod-transformers-llms',
            levelId: 'aie-l4',
            trackId: 'ai-engineering',
            title: 'Transformers, Attention & Hugging Face',
            category: 'Generative AI',
            description: 'Scale-dot product attention mechanisms, position embeddings, causal decoder vs encoder models, and Hugging Face Transformers.',
            order: 4,
            difficulty: 'Advanced',
            estimatedMinutes: 360,
            prerequisites: ['mod-pytorch-foundations'],
            status: 'locked',
            x: 560,
            y: 650,
            module: {
              id: 'm-transformers',
              nodeId: 'mod-transformers-llms',
              title: 'Transformer Architecture & Open-Source LLMs',
              summary: 'Dissect the core engine powering modern LLMs: Queries, Keys, Values, and KV-caching during auto-regressive generation.',
              learningObjectives: [
                'Compute self-attention mathematically: softmax((QK^T)/sqrt(d_k)) * V',
                'Load and run quantized open-source models with Hugging Face transformers',
                'Fine-tune pre-trained models efficiently using Parameter-Efficient Fine-Tuning (PEFT/LoRA)'
              ],
              prerequisites: ['mod-pytorch-foundations'],
              estimatedMinutes: 360,
              difficulty: 'Advanced',
              lessons: []
            }
          }
        ]
      },
      {
        id: 'aie-l5',
        trackId: 'ai-engineering',
        order: 5,
        title: 'Level 5: RAG Pipelines & Supabase pgvector',
        description: 'Retrieval-Augmented Generation: Document chunking strategies, embeddings, pgvector semantic search, and re-ranking.',
        difficulty: 'Advanced',
        nodes: [
          {
            id: 'mod-rag-pgvector',
            levelId: 'aie-l5',
            trackId: 'ai-engineering',
            title: 'Enterprise RAG with Supabase pgvector',
            category: 'RAG Systems',
            description: 'Chunking algorithms, hybrid search (dense semantic + sparse keyword BM25), vector indexing (HNSW), and contextual reranking.',
            order: 5,
            difficulty: 'Advanced',
            estimatedMinutes: 340,
            prerequisites: ['mod-transformers-llms'],
            status: 'locked',
            x: 710,
            y: 530,
            module: {
              id: 'm-rag',
              nodeId: 'mod-rag-pgvector',
              title: 'Production RAG Architectures with Supabase & LangChain',
              summary: 'Build hallucination-free AI assistants that ingest enterprise PDF documents and answer questions with accurate citation footnotes.',
              learningObjectives: [
                'Configure PostgreSQL with the pgvector extension and create HNSW cosine indexes',
                'Implement semantic chunking with overlap to preserve conceptual coherence',
                'Implement Cross-Encoder Re-Ranking to surface the top 3 most relevant passages'
              ],
              prerequisites: ['mod-transformers-llms'],
              estimatedMinutes: 340,
              difficulty: 'Advanced',
              lessons: []
            }
          }
        ]
      },
      {
        id: 'aie-l6',
        trackId: 'ai-engineering',
        order: 6,
        title: 'Level 6: FastAPI Model Serving & Autonomous Agents',
        description: 'FastAPI microservices, OpenAI function calling, autonomous agent loops, memory management, and multi-agent systems (CrewAI).',
        difficulty: 'Industry Level',
        nodes: [
          {
            id: 'mod-fastapi-agents',
            levelId: 'ai-t-m6',
            trackId: 'ai-engineering',
            title: 'FastAPI & Multi-Agent Systems (CrewAI)',
            category: 'AI Agents',
            description: 'Build asynchronous Python API microservices, tool-calling agents with self-correction, and collaborative multi-agent teams.',
            order: 6,
            difficulty: 'Industry Level',
            estimatedMinutes: 380,
            prerequisites: ['mod-rag-pgvector'],
            status: 'locked',
            x: 620,
            y: 380,
            module: {
              id: 'm-agents',
              nodeId: 'mod-fastapi-agents',
              title: 'Autonomous AI Agents & FastAPI Microservice Architecture',
              summary: 'Transition from basic prompt-response bots to goal-driven autonomous agents capable of browsing the web, executing code, and reasoning.',
              learningObjectives: [
                'Serve AI models with asynchronous FastAPI endpoints and Pydantic validation',
                'Implement ReAct (Reason + Act) prompting loops with tool execution',
                'Coordinate multi-agent workflows using CrewAI for research and code generation'
              ],
              prerequisites: ['mod-rag-pgvector'],
              estimatedMinutes: 380,
              difficulty: 'Industry Level',
              lessons: []
            }
          }
        ]
      },
      {
        id: 'aie-l7',
        trackId: 'ai-engineering',
        order: 7,
        title: 'Level 7: MLOps, Model Monitoring & Production Scale',
        description: 'Containerizing AI microservices, MLflow experiment tracking, latency reduction (vLLM, Ollama), and continuous evaluation.',
        difficulty: 'Industry Level',
        nodes: [
          {
            id: 'mod-mlops-production',
            levelId: 'aie-l7',
            trackId: 'ai-engineering',
            title: 'MLOps, Evaluation & Cloud Deployment',
            category: 'MLOps',
            description: 'Ragas evaluation framework, Docker container optimization, token streaming, rate limits, and production observability.',
            order: 7,
            difficulty: 'Industry Level',
            estimatedMinutes: 320,
            prerequisites: ['mod-fastapi-agents'],
            status: 'locked',
            x: 440,
            y: 200,
            module: {
              id: 'm-mlops',
              nodeId: 'mod-mlops-production',
              title: 'Production MLOps: Serving, Monitoring & Evaluation',
              summary: 'Deploy AI models with high throughput, low time-to-first-token, automated regression benchmarks, and tracing.',
              learningObjectives: [
                'Evaluate RAG accuracy automatically using faithfulness and answer relevancy metrics',
                'Deploy containerized AI microservices on cloud infrastructure with GPU passthrough',
                'Implement LangSmith or OpenTelemetry tracing for multi-step agent debugging'
              ],
              prerequisites: ['mod-fastapi-agents'],
              estimatedMinutes: 320,
              difficulty: 'Industry Level',
              lessons: []
            }
          }
        ]
      }
    ]
  }
];
