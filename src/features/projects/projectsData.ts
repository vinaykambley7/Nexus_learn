import { ProjectLab } from '@/types';

export const PRACTICAL_PROJECTS: ProjectLab[] = [
  {
    id: 'proj-fs-1',
    trackId: 'full-stack',
    title: 'Enterprise Authentication & Multi-Tenant RBAC',
    subtitle: 'Production-ready authentication system with JWT rotation, session revocation, and Role-Based Access Control.',
    difficulty: 'Intermediate',
    estimatedHours: 18,
    technologies: ['React 19', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Redis'],
    description: 'Design and deploy a secure multi-tenant authentication engine featuring access/refresh token rotation, argon2/bcrypt password hashing, rate limiting against brute force attacks, email verification, and fine-grained permissions.',
    learningObjectives: [
      'Implement RFC 6749 compliant token refresh with token reuse detection',
      'Store refresh tokens securely in HTTP-only, SameSite, Secure cookies',
      'Enforce granular role-based middleware permissions (admin, member, viewer)'
    ],
    stepByStepMilestones: [
      {
        milestone: 'Milestone 1: Database Schema & Password Hashing',
        description: 'Design PostgreSQL tables for users, roles, permissions, and active refresh sessions.',
        deliverable: 'PostgreSQL migration files and seed scripts with bcrypt/argon2 hashing.'
      },
      {
        milestone: 'Milestone 2: Token Issuance & Refresh Rotation',
        description: 'Build /api/auth/register, /api/auth/login, and /api/auth/refresh endpoints with automated token rotation.',
        deliverable: 'Express auth controller and JWT verification middleware.'
      },
      {
        milestone: 'Milestone 3: Client Dashboard & Session Management',
        description: 'Build React 19 client with automatic token refresh on 401 interceptors and an active sessions manager.',
        deliverable: 'Responsive client dashboard with instant session revocation.'
      }
    ],
    submissionRequirements: [
      'GitHub repository with clear README setup instructions',
      'PostgreSQL schema migration scripts',
      'Working demo video or live deployment URL (Vercel/Render)'
    ]
  },
  {
    id: 'proj-fs-2',
    trackId: 'full-stack',
    title: 'Real-Time Collaborative Chat Platform',
    subtitle: 'WebSocket-powered team messaging with channels, typing indicators, read receipts, and message persistence.',
    difficulty: 'Advanced',
    estimatedHours: 25,
    technologies: ['React 19', 'TypeScript', 'Socket.io', 'Node.js', 'PostgreSQL', 'Redis Pub/Sub'],
    description: 'Construct a scalable Slack/Discord-inspired communication app with real-time bidirectional WebSocket communication, Redis pub/sub horizontal scaling, file uploads, and unread notification badges.',
    learningObjectives: [
      'Scale WebSocket state across multiple Node.js instances via Redis pub/sub',
      'Implement optimistic UI message dispatching for instant responsiveness',
      'Handle offline reconnection states and message backlog reconciliation'
    ],
    stepByStepMilestones: [
      {
        milestone: 'Milestone 1: WebSocket Architecture & Heartbeats',
        description: 'Setup Socket.io with JWT handshake authentication and room partitioning.',
        deliverable: 'WebSocket server handling connection, disconnection, and room join events.'
      },
      {
        milestone: 'Milestone 2: Messaging Engine & Persistence',
        description: 'Store messages in PostgreSQL with indexing on (channel_id, created_at).',
        deliverable: 'Paginated message history API and live real-time emission.'
      },
      {
        milestone: 'Milestone 3: Typing Indicators & Unread Badges',
        description: 'Throttle typing status updates using Redis TTL keys and track read timestamps.',
        deliverable: 'Complete responsive team messaging interface with sound alerts and badges.'
      }
    ],
    submissionRequirements: [
      'GitHub repository with automated test scripts',
      'System architecture diagram detailing Redis pub/sub flow',
      'Live deployed application'
    ]
  },
  {
    id: 'proj-aie-1',
    trackId: 'ai-engineering',
    title: 'Enterprise Document RAG with Supabase pgvector',
    subtitle: 'End-to-end question answering pipeline over multi-page PDF documents with source citation footnotes.',
    difficulty: 'Advanced',
    estimatedHours: 28,
    technologies: ['Python 3.13', 'FastAPI', 'Supabase pgvector', 'LangChain', 'OpenAI', 'React 19'],
    description: 'Build a production Retrieval-Augmented Generation (RAG) system that extracts text from complex PDFs, generates semantic embeddings, stores them in Supabase PostgreSQL with HNSW indexing, and performs hybrid search with LLM response synthesis.',
    learningObjectives: [
      'Implement semantic document chunking with metadata preservation (page, chapter)',
      'Query high-dimensional vectors with cosine similarity and HNSW indexes in Supabase',
      'Prevent hallucinations by enforcing strict prompt context boundaries and citation footnotes'
    ],
    stepByStepMilestones: [
      {
        milestone: 'Milestone 1: Document Ingestion & Chunking Pipeline',
        description: 'Extract text from PDFs, chunk into 500-token windows with 10% overlap, and calculate embeddings.',
        deliverable: 'Python ingestion worker script with batch OpenAI embedding generation.'
      },
      {
        milestone: 'Milestone 2: Supabase pgvector & RPC Match Functions',
        description: 'Create PostgreSQL match_documents function with vector similarity scoring and metadata filters.',
        deliverable: 'SQL migration scripts and pgvector HNSW index benchmarks.'
      },
      {
        milestone: 'Milestone 3: FastAPI Backend & React Chat Interface',
        description: 'Build streaming response API with Server-Sent Events (SSE) and clickable source citation cards.',
        deliverable: 'Fullstack application where users upload documents and ask questions with citations.'
      }
    ],
    submissionRequirements: [
      'GitHub repository with docker-compose.yml',
      'Evaluation report comparing chunking sizes (250 vs 500 vs 1000 tokens)',
      'Live demonstration video'
    ]
  },
  {
    id: 'proj-aie-2',
    trackId: 'ai-engineering',
    title: 'Autonomous Multi-Agent Market Research Team',
    subtitle: 'CrewAI multi-agent workflow: Web Searcher, Data Synthesizer, and Technical Writer collaborating autonomously.',
    difficulty: 'Industry Level',
    estimatedHours: 35,
    technologies: ['Python 3.13', 'CrewAI', 'FastAPI', 'Tavily Search API', 'Claude 3.7', 'Docker'],
    description: 'Coordinate a swarm of specialized autonomous AI agents that accept an open-ended research inquiry, search the live web, synthesize quantitative data, verify claims, and format an executive PDF report.',
    learningObjectives: [
      'Configure specialized agent roles, goals, and backstories in CrewAI',
      'Implement sequential and hierarchical task delegation loops',
      'Equip agents with custom tools for web scraping, mathematical calculation, and file writing'
    ],
    stepByStepMilestones: [
      {
        milestone: 'Milestone 1: Crew Specification & Agent Prompts',
        description: 'Define Researcher, Critic, and Writer agents with distinct tool access and validation bounds.',
        deliverable: 'CrewAI configuration files with custom agent definitions.'
      },
      {
        milestone: 'Milestone 2: Custom Tools & Web Scraping Safeguards',
        description: 'Implement rate-limited search tools with fallback caching to prevent API rate limits.',
        deliverable: 'Python tool classes subclassing CrewAI BaseTool.'
      },
      {
        milestone: 'Milestone 3: Execution Engine & Web Dashboard',
        description: 'Expose the multi-agent crew via FastAPI with real-time status streaming to the frontend.',
        deliverable: 'Interactive dashboard showing agent thought chains, tool executions, and final report.'
      }
    ],
    submissionRequirements: [
      'GitHub repository with clear setup guide',
      'Sample multi-page research reports generated autonomously',
      'Agent interaction tracing log'
    ]
  }
];
