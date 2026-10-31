import { AITool, AIToolCategory } from '@/types';

export const AI_TOOL_CATEGORIES: AIToolCategory[] = [
  'AI Assistants',
  'Research & Deep Search',
  'Productivity & Second Brain',
  'Coding & App Development',
  'Automation & Agents',
  'Creative & Media Tools',
  'Voice & Audio',
  'Data Analysis',
];

export const AI_TOOLS: AITool[] = [
  {
    id: 'tool-chatgpt',
    name: 'ChatGPT',
    slug: 'chatgpt',
    category: 'AI Assistants',
    shortDescription: 'The industry-defining conversational AI with GPT-4o, reasoning models (o1/o3), Custom GPTs, and advanced data analysis.',
    detailedDescription: 'ChatGPT from OpenAI combines frontier general reasoning, multimodal analysis, interactive Python code execution, and web browsing. With custom instructions and GPT store capabilities, it serves as a versatile personal copilot for engineering and business operations.',
    websiteUrl: 'https://chatgpt.com',
    logo: 'https://images.unsplash.com/photo-1678286742880-4e6153e70d49?w=128&auto=format&fit=crop&q=80',
    pricingType: 'Freemium',
    pricingDetails: 'Free tier with GPT-4o mini; Plus at $20/month; Team at $25/user/month; Enterprise custom.',
    difficulty: 'Beginner',
    keyFeatures: [
      'Frontier multimodal reasoning (text, vision, audio)',
      'Advanced Data Analysis with sandboxed Python runtime',
      'Custom GPTs creation with custom API actions',
      'Canvas interface for interactive code and writing collaboration'
    ],
    bestUseCases: [
      'Complex prompt-driven conceptual explanations',
      'Rapid data cleaning and exploratory charts from CSVs',
      'Drafting technical documentation and emails',
      'Debugging code with step-by-step reasoning'
    ],
    starterPrompts: [
      {
        title: 'Algorithm Optimization',
        prompt: 'Analyze this algorithm for time and space complexity. Provide three distinct optimization strategies with benchmarks: [PASTE_CODE]',
        category: 'Coding'
      },
      {
        title: 'Executive Architecture Summary',
        prompt: 'Act as a CTO. Summarize the trade-offs between monolithic and event-driven microservices for an early-stage fintech application.',
        category: 'Architecture'
      }
    ],
    tutorials: [
      {
        title: 'Mastering ChatGPT for Full-Stack Developers',
        duration: '18 mins',
        url: 'https://www.youtube.com'
      }
    ],
    advantages: [
      'Huge ecosystem of plugins and Custom GPTs',
      'Interactive Python sandbox for real-time charting',
      'High voice mode conversational fluency'
    ],
    limitations: [
      'Knowledge cutoff caveats on free models',
      'Can occasionally provide outdated syntax for rapidly evolving libraries'
    ],
    privacyNotes: 'Paid Team and Enterprise plans do not train on user conversation data by default.',
    comparisonScores: {
      coding: 92,
      research: 88,
      writing: 95,
      reasoning: 94,
      documentAnalysis: 90,
      multimodal: 96,
      integrations: 92
    }
  },
  {
    id: 'tool-claude',
    name: 'Claude',
    slug: 'claude',
    category: 'AI Assistants',
    shortDescription: 'Anthropic\'s frontier model known for exceptional nuanced coding, 200K token context windows, and Artifacts.',
    detailedDescription: 'Claude (Sonnet 3.7 & Opus) specializes in high-fidelity coding, long-document comprehension, and structured outputs with minimal hallucinations. Artifacts allow developers to view and test interactive React components and SVGs directly within the chat interface.',
    websiteUrl: 'https://claude.ai',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    pricingType: 'Freemium',
    pricingDetails: 'Free tier with Claude 3.5 Sonnet limits; Pro at $20/month; Team at $30/user/month.',
    difficulty: 'Intermediate',
    keyFeatures: [
      '200,000+ token context window (entire books or codebases in one prompt)',
      'Claude Artifacts for live rendered UI components and documents',
      'Claude Projects to maintain persistent team repositories and knowledge',
      'Industry-leading human-like prose and nuance'
    ],
    bestUseCases: [
      'Refactoring large TypeScript & React codebases',
      'Auditing legal contracts and complex architectural whitepapers',
      'Live UI prototyping with interactive React components'
    ],
    starterPrompts: [
      {
        title: 'System Architecture Refactor',
        prompt: 'Review the attached multi-file project and propose a clean domain-driven architecture that separates database queries from business rules.',
        category: 'Coding'
      }
    ],
    tutorials: [
      {
        title: 'Building Interactive Prototypes with Claude Artifacts',
        duration: '15 mins',
        url: 'https://www.youtube.com'
      }
    ],
    advantages: [
      'Superior coding accuracy and subtle architectural reasoning',
      'Artifacts eliminate copying and pasting between external editors',
      'Minimal corporate robotic tone'
    ],
    limitations: [
      'Message rate limits can be restrictive during peak hours',
      'No built-in native Python execution sandbox in free tier'
    ],
    privacyNotes: 'Anthropic does not train commercial models on user inputs unless explicitly opted in.',
    comparisonScores: {
      coding: 98,
      research: 92,
      writing: 98,
      reasoning: 96,
      documentAnalysis: 97,
      multimodal: 91,
      integrations: 85
    }
  },
  {
    id: 'tool-gemini',
    name: 'Google Gemini',
    slug: 'gemini',
    category: 'AI Assistants',
    shortDescription: 'Google\'s natively multimodal AI with up to 1M–2M token context, integrated with Google Workspace and search.',
    detailedDescription: 'Gemini 2.0 Flash and Pro are designed from the ground up for native multimodality across audio, video, images, and text. Seamless integration with Google Drive, Gmail, Docs, and Google Cloud makes it a workhorse for enterprise teams.',
    websiteUrl: 'https://gemini.google.com',
    logo: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=128&auto=format&fit=crop&q=80',
    pricingType: 'Freemium',
    pricingDetails: 'Free tier with Gemini Flash; Advanced at $20/month (Google One AI Premium).',
    difficulty: 'Beginner',
    keyFeatures: [
      'Massive 1M+ token context window',
      'Native multimodal understanding (analyze hour-long video files and audio directly)',
      'Real-time Google Search grounding with direct source links',
      'Google Workspace extension integration (Drive, Docs, Sheets)'
    ],
    bestUseCases: [
      'Analyzing hour-long conference recordings or YouTube lectures',
      'Searching across personal Google Drive archives',
      'Fact-checking claims against current Google Search results'
    ],
    starterPrompts: [
      {
        title: 'Video Analysis Prompt',
        prompt: 'Review this 45-minute lecture video. Extract a chronological bulleted outline with timestamps and technical code concepts.',
        category: 'Multimodal'
      }
    ],
    tutorials: [
      {
        title: 'Leveraging Gemini 1M Token Context Windows',
        duration: '14 mins',
        url: 'https://www.youtube.com'
      }
    ],
    advantages: [
      'Unrivaled context window length',
      'Deep integration with Android and Google productivity apps',
      'Fast inference speeds on Gemini 2.0 Flash'
    ],
    limitations: [
      'Coding output can occasionally be overly verbose',
      'UI features like live component rendering lag behind Claude Artifacts'
    ],
    privacyNotes: 'Google Workspace Enterprise accounts are shielded from model training data loops.',
    comparisonScores: {
      coding: 89,
      research: 94,
      writing: 90,
      reasoning: 92,
      documentAnalysis: 99,
      multimodal: 99,
      integrations: 95
    }
  },
  {
    id: 'tool-perplexity',
    name: 'Perplexity AI',
    slug: 'perplexity',
    category: 'Research & Deep Search',
    shortDescription: 'AI-powered conversational search engine delivering cited, real-time factual answers from the live web.',
    detailedDescription: 'Perplexity replaces traditional search engines with synthesized answers backed by inline numerical citations. Pro Search breaks queries into multi-step investigative research workflows, querying authoritative databases, academic papers, and technical docs.',
    websiteUrl: 'https://perplexity.ai',
    logo: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=128&auto=format&fit=crop&q=80',
    pricingType: 'Freemium',
    pricingDetails: 'Free basic search; Pro at $20/month ($200/year) with 300+ Pro searches daily.',
    difficulty: 'Beginner',
    keyFeatures: [
      'Inline numbered citations to verify every claim',
      'Pro Search multi-step reasoning with clarifying questions',
      'Focus filters: Academic (arXiv), Writing, YouTube, Reddit, Computational',
      'Collections to organize research workflows and shared knowledge'
    ],
    bestUseCases: [
      'Technical API research for brand-new SDK releases',
      'Literature reviews and market competitor analysis',
      'Fact verification with instant access to underlying source links'
    ],
    starterPrompts: [
      {
        title: 'Competitive Market Breakdown',
        prompt: 'Compare the pricing and technical limits of the top 4 vector databases in 2026. Include sources and direct documentation links.',
        category: 'Research'
      }
    ],
    tutorials: [
      {
        title: 'How Engineers Use Perplexity for Real-Time Debugging',
        duration: '12 mins',
        url: 'https://www.youtube.com'
      }
    ],
    advantages: [
      'Zero hallucination tolerance due to source citations',
      'Choice between leading frontier models (Claude 3.5 Sonnet, GPT-4o, Sonar)',
      'Clean mobile app experience'
    ],
    limitations: [
      'Not optimized for continuous multi-file software engineering tasks',
      'Pro search limit caps on free accounts'
    ],
    privacyNotes: 'Users can toggle off data retention in account settings.',
    comparisonScores: {
      coding: 85,
      research: 99,
      writing: 88,
      reasoning: 91,
      documentAnalysis: 93,
      multimodal: 85,
      integrations: 82
    }
  },
  {
    id: 'tool-notebooklm',
    name: 'NotebookLM',
    slug: 'notebooklm',
    category: 'Research & Deep Search',
    shortDescription: 'Google\'s source-grounded research notebook that synthesizes up to 50 documents and generates Audio Overviews.',
    detailedDescription: 'NotebookLM is built specifically for deep study and document analysis. Upload PDFs, Google Docs, slides, and websites, and it creates a custom AI model grounded strictly in your uploaded material with audio podcasts and study guides.',
    websiteUrl: 'https://notebooklm.google',
    logo: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=128&auto=format&fit=crop&q=80',
    pricingType: 'Free',
    pricingDetails: 'Completely free during current preview with a Google account.',
    difficulty: 'Beginner',
    keyFeatures: [
      'Strict grounding: Answers only from your uploaded sources',
      'Audio Overview: Two AI hosts generate a natural conversational podcast about your notes',
      'Instant study guides, FAQs, timelines, and briefing docs',
      'Up to 50 sources per notebook with 500,000 words per source'
    ],
    bestUseCases: [
      'Studying for technical certifications and academic exams',
      'Synthesizing enterprise compliance documentation',
      'Listening to 60-page PDF reports as audio podcasts during commutes'
    ],
    starterPrompts: [
      {
        title: 'Synthesize Cross-Document Architecture',
        prompt: 'Identify the discrepancies between the frontend PRD document and the backend API specification document.',
        category: 'Research'
      }
    ],
    tutorials: [
      {
        title: 'Supercharging Engineering Research with NotebookLM',
        duration: '11 mins',
        url: 'https://www.youtube.com'
      }
    ],
    advantages: [
      'Completely eliminated hallucinations outside uploaded sources',
      'Remarkable natural conversational audio generation',
      'Zero subscription cost'
    ],
    limitations: [
      'Does not answer questions outside provided source files',
      'Audio generation cannot be edited or steered granularly yet'
    ],
    privacyNotes: 'Your source files and queries are never used to train public Google AI models.',
    comparisonScores: {
      coding: 78,
      research: 97,
      writing: 91,
      reasoning: 90,
      documentAnalysis: 99,
      multimodal: 80,
      integrations: 88
    }
  },
  {
    id: 'tool-cursor',
    name: 'Cursor IDE',
    slug: 'cursor',
    category: 'Coding & App Development',
    shortDescription: 'An AI-first fork of VS Code with deep codebase indexing, multi-file Composer, and agentic debugging.',
    detailedDescription: 'Cursor is the premier code editor built for AI pair-programming. It indexes your entire local git repository into vector embeddings, enabling developers to prompt across dozens of files, perform multi-file diffs, and generate production features autonomously.',
    websiteUrl: 'https://cursor.com',
    logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=128&auto=format&fit=crop&q=80',
    pricingType: 'Freemium',
    pricingDetails: 'Free tier with basic completions; Pro at $20/month; Business at $40/user/month.',
    difficulty: 'Intermediate',
    keyFeatures: [
      'Cursor Tab: Predictive multi-line code completions and smart jump edits',
      '@codebase semantic search across all local files and symbols',
      'Composer: Multi-file code generation and unified git diff review',
      'Terminal AI: Natural language command generation and error correction'
    ],
    bestUseCases: [
      'Full-stack TypeScript / React / Node.js development',
      'Executing comprehensive codebase refactorings',
      'Onboarding into unfamiliar enterprise repositories'
    ],
    starterPrompts: [
      {
        title: 'Multi-File Feature Scaffold',
        prompt: '@codebase Create a new payments checkout flow with Stripe webhooks. Follow our existing controller and service patterns in /src/services.',
        category: 'Coding'
      }
    ],
    tutorials: [
      {
        title: 'Mastering Cursor: The Modern AI Developer Workflow',
        duration: '22 mins',
        url: 'https://www.youtube.com'
      }
    ],
    advantages: [
      'Familiar VS Code UI and full extension compatibility',
      'Context-aware multi-file editing is best-in-class',
      'Saves dozens of hours on boilerplate and test writing'
    ],
    limitations: [
      'Pro plan fast-request credits can deplete on intensive Composer tasks',
      'Requires decent hardware for local indexing caches'
    ],
    privacyNotes: 'Privacy Mode prevents customer code from being stored or used for model training.',
    comparisonScores: {
      coding: 99,
      research: 82,
      writing: 80,
      reasoning: 95,
      documentAnalysis: 92,
      multimodal: 80,
      integrations: 94
    }
  },
  {
    id: 'tool-lovable',
    name: 'Lovable',
    slug: 'lovable',
    category: 'Coding & App Development',
    shortDescription: 'Prompt-based full-stack web app builder that generates React, Supabase backends, and live deployments in minutes.',
    detailedDescription: 'Lovable takes natural language descriptions and creates fully functional, production-ready web applications. It automatically constructs UI layouts with Tailwind and shadcn/ui, configures database tables and authentication with Supabase, and provisions live hosting with GitHub sync.',
    websiteUrl: 'https://lovable.dev',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80',
    pricingType: 'Freemium',
    pricingDetails: 'Free tier for experimenting; Starter at $20/month; Pro at $50/month.',
    difficulty: 'Intermediate',
    keyFeatures: [
      'Natural language fullstack web app generation',
      'Automatic Supabase database schema creation and RLS integration',
      'Two-way GitHub synchronisation',
      'Interactive visual preview with point-and-click edit triggers'
    ],
    bestUseCases: [
      'Launching MVPs and client SaaS prototypes in hours instead of weeks',
      'Internal operations tools with database tables and auth',
      'Marketing landing pages with active backend lead capture forms'
    ],
    starterPrompts: [
      {
        title: 'Fullstack SaaS Boilerplate',
        prompt: 'Build a customer feedback dashboard with user authentication, upvoting, category filters, and a Supabase PostgreSQL database.',
        category: 'Coding'
      }
    ],
    tutorials: [
      {
        title: 'Building a SaaS with Lovable and Supabase in 20 Minutes',
        duration: '19 mins',
        url: 'https://www.youtube.com'
      }
    ],
    advantages: [
      'Generates real, clean TypeScript and React code—not locked proprietary runtimes',
      'Seamless database wiring and authentication setup',
      'Direct GitHub repository export'
    ],
    limitations: [
      'Requires careful prompt discipline for high-complexity domain logic',
      'Credit consumption on iterative revisions'
    ],
    privacyNotes: 'Enterprise contracts offer private code isolation and custom Supabase instances.',
    comparisonScores: {
      coding: 94,
      research: 75,
      writing: 80,
      reasoning: 88,
      documentAnalysis: 82,
      multimodal: 88,
      integrations: 92
    }
  },
  {
    id: 'tool-v0',
    name: 'v0.dev',
    slug: 'v0',
    category: 'Coding & App Development',
    shortDescription: 'Vercel\'s generative UI tool that translates prompts and design screenshots into copy-paste React + Tailwind components.',
    detailedDescription: 'v0 by Vercel specializes in front-end UI generation. Using shadcn/ui, Radix, and modern Tailwind CSS, it produces beautiful, accessible, and responsive components that can be installed directly into your React/Next.js codebase via the shadcn CLI.',
    websiteUrl: 'https://v0.dev',
    logo: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=128&auto=format&fit=crop&q=80',
    pricingType: 'Freemium',
    pricingDetails: 'Free tier with monthly credits; Premium at $20/month with priority generations.',
    difficulty: 'Beginner',
    keyFeatures: [
      'High-aesthetic UI generation utilizing modern shadcn/ui design standards',
      'Image-to-code: Upload design mockups or screenshots to recreate them',
      'Interactive component sandboxing with stateful React toggles',
      'Direct integration with Vercel and shadcn CLI installation commands'
    ],
    bestUseCases: [
      'Creating complex dashboard widgets, tables, and settings pages',
      'Replicating Dribbble/Figma designs into production React code',
      'Rapid design system expansion'
    ],
    starterPrompts: [
      {
        title: 'Futuristic Dark Analytics Card',
        prompt: 'Create a dark charcoal glassmorphic stats card with a sparkline chart, trend badge (+14%), and interactive tooltip in Tailwind CSS.',
        category: 'Frontend'
      }
    ],
    tutorials: [
      {
        title: 'v0.dev to Production: Speed Running Frontend Development',
        duration: '16 mins',
        url: 'https://www.youtube.com'
      }
    ],
    advantages: [
      'Flawless Tailwind and accessibility compliance',
      'Works seamlessly with existing modern React setups',
      'Visual iteration on individual elements without regenerating whole pages'
    ],
    limitations: [
      'Focused strictly on frontend UI—does not manage backend server logic',
      'Requires developer assembly for complex multi-route systems'
    ],
    privacyNotes: 'Private generations available on paid subscriptions.',
    comparisonScores: {
      coding: 92,
      research: 70,
      writing: 78,
      reasoning: 85,
      documentAnalysis: 80,
      multimodal: 94,
      integrations: 90
    }
  },
  {
    id: 'tool-make',
    name: 'Make.com',
    slug: 'make',
    category: 'Automation & Agents',
    shortDescription: 'Visual automation platform for designing complex multi-branch AI workflows, webhooks, and API integrations.',
    detailedDescription: 'Make (formerly Integromat) allows engineers and operations leaders to visually orchestrate workflows connecting hundreds of web apps. With native OpenAI, Anthropic, and webhook modules, developers build autonomous pipelines that process leads, analyze documents, and run automated routines.',
    websiteUrl: 'https://make.com',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=128&auto=format&fit=crop&q=80',
    pricingType: 'Freemium',
    pricingDetails: 'Free plan with 1,000 operations/month; Core at $9/month; Pro at $16/month.',
    difficulty: 'Intermediate',
    keyFeatures: [
      'Drag-and-drop visual workflow canvas with live execution tracing',
      'Advanced routers, iterators, aggregators, and error handlers',
      'Direct integration with OpenAI, Claude, Google Gemini, and custom HTTP APIs',
      'Real-time data inspection for each execution step'
    ],
    bestUseCases: [
      'Automated customer support ticket triage with sentiment analysis',
      'Ingesting PDF invoices from email, extracting data via LLMs, and writing to SQL',
      'Autonomous social media scheduling and cross-posting pipelines'
    ],
    starterPrompts: [
      {
        title: 'Automated Invoice Extraction Pipeline',
        prompt: 'Configure a scenario: Listen for Gmail with PDF attachment -> Parse text with OpenAI -> Validate totals with math module -> Insert row into Supabase -> Send Slack alert.',
        category: 'Automation'
      }
    ],
    tutorials: [
      {
        title: 'Building Production AI Automation Scenarios in Make',
        duration: '24 mins',
        url: 'https://www.youtube.com'
      }
    ],
    advantages: [
      'Far more powerful data transformation logic than simple linear tools',
      'Visual debugging allows you to inspect payload values at every node',
      'Cost-effective operation pricing'
    ],
    limitations: [
      'Steeper learning curve for data arrays and iteration structures',
      'Complex scenarios require careful error handling configuration'
    ],
    privacyNotes: 'SOC2 Type II certified and GDPR compliant.',
    comparisonScores: {
      coding: 82,
      research: 80,
      writing: 75,
      reasoning: 87,
      documentAnalysis: 92,
      multimodal: 84,
      integrations: 99
    }
  },
  {
    id: 'tool-elevenlabs',
    name: 'ElevenLabs',
    slug: 'elevenlabs',
    category: 'Voice & Audio',
    shortDescription: 'The gold standard in AI voice generation, natural speech synthesis, and ethical voice cloning in 30+ languages.',
    detailedDescription: 'ElevenLabs delivers human-indistinguishable text-to-speech with emotional inflections, pauses, and tone modulation. With instant and professional voice cloning, speech-to-speech conversion, and an enterprise API, it powers audiobooks, gaming NPCs, and voice agents.',
    websiteUrl: 'https://elevenlabs.io',
    logo: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=128&auto=format&fit=crop&q=80',
    pricingType: 'Freemium',
    pricingDetails: 'Free plan with 10k characters/month; Starter at $5/month; Creator at $22/month; Pro at $99/month.',
    difficulty: 'Beginner',
    keyFeatures: [
      'Ultra-realistic human voice generation with dynamic emotion controls',
      'Professional voice cloning with biometric verification safeguards',
      'Voice Design: Create brand new synthetic voices from text descriptions',
      'Conversational AI Agent platform with sub-second voice latency'
    ],
    bestUseCases: [
      'Interactive voice assistants and customer service telephone bots',
      'Professional voiceovers for product tutorials and videos',
      'Dynamic in-game character dialogues'
    ],
    starterPrompts: [
      {
        title: 'Audiobook Narrator Settings',
        prompt: 'Voice: Brian. Stability: 0.45. Similarity: 0.85. Style Exaggeration: 0.20. Text: [ENTER_TECHNICAL_MANUSCRIPT]',
        category: 'Audio'
      }
    ],
    tutorials: [
      {
        title: 'Integrating ElevenLabs Streaming Audio API in Node.js',
        duration: '17 mins',
        url: 'https://www.youtube.com'
      }
    ],
    advantages: [
      'Undisputed leader in natural audio cadence and emotional realism',
      'Robust streaming API with WebSockets for real-time applications',
      'Multilingual support across 32 languages'
    ],
    limitations: [
      'Character-based billing can scale quickly on massive audio catalogs',
      'Professional cloning requires clean audio sample recordings'
    ],
    privacyNotes: 'Strict voice safety filters and biometric proof of consent required for voice cloning.',
    comparisonScores: {
      coding: 70,
      research: 72,
      writing: 85,
      reasoning: 80,
      documentAnalysis: 75,
      multimodal: 98,
      integrations: 92
    }
  }
];
