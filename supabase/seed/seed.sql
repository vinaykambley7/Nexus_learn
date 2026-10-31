-- ============================================================================
-- NEXUSLEARN SEED SCRIPT: seed.sql
-- Relational seed data for Tracks, Levels, Modules, and AI Tools
-- ============================================================================

-- Insert Primary Tracks
INSERT INTO public.learning_tracks (id, title, short_description, full_description, accent_color, level_count, module_count, total_duration_hours)
VALUES
('full-stack', 'Full-Stack Web Development', 'Master modern frontend, scalable backends, cloud infrastructure, and enterprise system design.', 'Comprehensive curriculum covering HTML/CSS/JS, React 19, TypeScript, Node.js, Spring Boot, Kafka, and System Design.', '#38BDF8', 6, 18, 120),
('ai-tools', 'AI Tools Mastery & Practical Workflows', 'Master modern AI assistants, research engines, coding agents, automation platforms, and creative studios.', 'Learn when, why, and how to use modern AI tools in real-world professional workflows.', '#F97316', 6, 12, 65),
('ai-engineering', 'AI Engineering & Generative AI Systems', 'Build production-ready LLM applications, RAG pipelines, autonomous agents, and MLOps deployments.', 'Learn the science and engineering of AI: Python, PyTorch, Transformers, Supabase pgvector RAG, FastAPI, and CrewAI.', '#A855F7', 7, 16, 140)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- Insert Levels for Track 1
INSERT INTO public.learning_levels (id, track_id, order_index, title, description, difficulty)
VALUES
('fs-l1', 'full-stack', 1, 'Level 1: Web Development Foundations', 'Semantic markup, modern responsive CSS layout systems, and deep JavaScript ES6+ internals.', 'Beginner'),
('fs-l2', 'full-stack', 2, 'Level 2: Frontend Development & React 19', 'Component architecture, React 19 hooks, TypeScript typing, and performance tuning.', 'Intermediate'),
('fs-l3', 'full-stack', 3, 'Level 3: Backend Services & API Architecture', 'Node.js Express, Java Spring Boot, RESTful design, and JWT middleware.', 'Advanced'),
('fs-l4', 'full-stack', 4, 'Level 4: Databases, Kafka & Distributed Integration', 'PostgreSQL, MongoDB, query indexes, and Apache Kafka messaging.', 'Advanced'),
('fs-l5', 'full-stack', 5, 'Level 5: DevOps, Cloud Infrastructure & Containers', 'Docker, Kubernetes, CI/CD, and AWS/GCP deployments.', 'Advanced'),
('fs-l6', 'full-stack', 6, 'Level 6: System Design & Enterprise Mastery', 'Scalability, caching, consistent hashing, and high-availability architecture.', 'Industry Level')
ON CONFLICT (id) DO NOTHING;

-- Insert Roadmap Nodes for Track 1
INSERT INTO public.roadmap_nodes (id, level_id, track_id, title, category, description, order_index, difficulty, estimated_minutes, status_default, x_coord, y_coord)
VALUES
('mod-html', 'fs-l1', 'full-stack', 'Semantic HTML5 & Accessibility', 'Foundations', 'Master semantic document trees, forms, ARIA standards, and SEO architecture.', 1, 'Beginner', 180, 'completed', 80.0, 920.0),
('mod-css', 'fs-l1', 'full-stack', 'Modern CSS, Flexbox & CSS Grid', 'Foundations', 'Master the box model, 2D grid systems, flexbox alignment, and CSS variables.', 2, 'Beginner', 240, 'completed', 210.0, 860.0),
('mod-js', 'fs-l1', 'full-stack', 'JavaScript Deep Dive & Async Programming', 'Foundations', 'Prototypes, closures, the Event Loop, Promises, and modern ES6+ async/await.', 3, 'Intermediate', 300, 'in_progress', 360.0, 810.0),
('mod-react19', 'fs-l2', 'full-stack', 'React 19 & Component Architecture', 'Frontend', 'Modern React 19 features, Server Components, Action Hooks, and clean composition.', 4, 'Intermediate', 360, 'available', 520.0, 720.0),
('mod-typescript', 'fs-l2', 'full-stack', 'TypeScript for Scale', 'Frontend', 'Generics, conditional types, discriminated unions, and strict narrowing.', 5, 'Intermediate', 240, 'locked', 680.0, 650.0),
('mod-node-express', 'fs-l3', 'full-stack', 'Node.js & Express REST APIs', 'Backend', 'Scalable routing, JWT authentication, rate limiting, and input validation.', 6, 'Intermediate', 300, 'locked', 750.0, 540.0),
('mod-java-spring', 'fs-l3', 'full-stack', 'Java 21 & Spring Boot Enterprise Services', 'Backend', 'Enterprise dependency injection, Spring Security, Hibernate ORM, and JPA.', 7, 'Advanced', 360, 'locked', 620.0, 460.0),
('mod-sql-nosql', 'fs-l4', 'full-stack', 'PostgreSQL, MongoDB & Data Modeling', 'Databases', 'Relational schemas, B-tree indexes, execution plans, and NoSQL design.', 8, 'Advanced', 300, 'locked', 440.0, 380.0),
('mod-kafka', 'fs-l4', 'full-stack', 'Apache Kafka & Microservices Architecture', 'Integration', 'Event-driven architecture, producer-consumer partitions, and message queues.', 9, 'Advanced', 300, 'locked', 310.0, 300.0),
('mod-docker-k8s', 'fs-l5', 'full-stack', 'Docker Containers & Kubernetes Pods', 'DevOps', 'Multi-stage Docker builds, image layer caching, K8s deployments, and ingress.', 10, 'Advanced', 320, 'locked', 220.0, 200.0),
('mod-system-design', 'fs-l6', 'full-stack', 'High-Scale System Design & Scalability', 'Architecture', 'Architecting for 10M+ users: CAP theorem, consistent hashing, and caching.', 11, 'Industry Level', 400, 'locked', 180.0, 80.0)
ON CONFLICT (id) DO NOTHING;

-- Insert AI Tools
INSERT INTO public.ai_tools (id, name, slug, category, short_description, detailed_description, website_url, logo_url, pricing_type, pricing_details, difficulty, privacy_notes)
VALUES
('tool-chatgpt', 'ChatGPT', 'chatgpt', 'AI Assistants', 'The industry-defining conversational AI with GPT-4o, reasoning models (o1/o3), Custom GPTs, and advanced data analysis.', 'ChatGPT from OpenAI combines frontier general reasoning, multimodal analysis, and interactive Python execution.', 'https://chatgpt.com', 'https://images.unsplash.com/photo-1678286742880-4e6153e70d49?w=128&auto=format&fit=crop&q=80', 'Freemium', 'Free tier with GPT-4o mini; Plus at $20/month', 'Beginner', 'Paid Team and Enterprise plans do not train on user conversation data.'),
('tool-claude', 'Claude', 'claude', 'AI Assistants', 'Anthropic frontier model known for exceptional nuanced coding, 200K token context windows, and Artifacts.', 'Claude specializes in high-fidelity coding, long-document comprehension, and structured outputs with minimal hallucinations.', 'https://claude.ai', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80', 'Freemium', 'Free tier; Pro at $20/month', 'Intermediate', 'Anthropic does not train commercial models on customer inputs.'),
('tool-cursor', 'Cursor IDE', 'cursor', 'Coding & App Development', 'An AI-first fork of VS Code with deep codebase indexing, multi-file Composer, and agentic debugging.', 'Cursor indexes your entire local git repository into vector embeddings, enabling multi-file edits and automated bug fixing.', 'https://cursor.com', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=128&auto=format&fit=crop&q=80', 'Freemium', 'Free tier; Pro at $20/month', 'Intermediate', 'Privacy Mode prevents customer code from being stored.')
ON CONFLICT (id) DO NOTHING;
