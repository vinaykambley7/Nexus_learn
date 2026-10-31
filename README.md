# NexusLearn | Next-Generation Full-Stack & AI Engineering Learning Platform

An enterprise-grade, interactive learning ecosystem built with **React 19**, **TypeScript**, **Tailwind CSS**, **Node.js Express**, **Python FastAPI**, and **Supabase PostgreSQL** (`pgvector`).

---

## 🚀 Key Platform Capabilities

### 1. Three Core Learning Tracks
- **Full-Stack Web Development**: Foundations (HTML5/CSS3/ES6+) → Frontend (React 19, TypeScript, Angular) → Backend (Node.js Express, Java Spring Boot) → Databases (PostgreSQL, MongoDB) → Cloud & DevOps (Docker, Kubernetes, CI/CD) → High-Scale System Design.
- **AI Tools Mastery**: In-depth operational masterclasses on ChatGPT (RTCC framework), Claude 3.7 (Artifacts, 200k context), Google Gemini 2.0 (multimodal analysis), Perplexity AI, NotebookLM, Cursor IDE, Lovable, v0.dev, Make.com, Zapier, and ElevenLabs.
- **AI Engineering & Generative AI**: Python 3.13 math & vectors → Classical ML with Scikit-Learn → Deep Learning with PyTorch → Transformer architecture & Hugging Face → Enterprise RAG with Supabase pgvector → Autonomous AI Agents with FastAPI & CrewAI → Production MLOps.

### 2. Nonlinear Curved SVG Roadmap Engine
- Smooth bezier progression path starting bottom-left and curving upward.
- Dynamic node states: **Completed** (emerald check), **In Progress** (cyan pulse), **Available** (amber), and **Locked** (slate lock).
- Interactive Zoom In / Zoom Out / Reset Pan controls.
- Seamless switching between all 3 learning tracks.
- Clicking any node opens the glassmorphic learning drawer.

### 3. Glassmorphic Learning Module System
- **Theory & Video Lecture**: Embedded video tutorials, formatted Markdown explanations, and key architectural takeaways.
- **Runnable Code Playground**: In-browser JavaScript and Python simulator with isolated execution and live terminal console.
- **Knowledge Assessment Quiz**: Multi-choice and code-based questions with instant scoring, passing criteria, and detailed explanations.
- **One-Click Completion**: Progress automatically syncs across the roadmap, progress dashboard, and admin console.

### 4. AI Tools Playground & Side-by-Side Comparison Engine
- Searchable & filterable directory of 10+ frontier AI tools.
- Multi-variable comparison matrix (ChatGPT vs Claude vs Gemini, etc.) scoring reasoning, coding, research, context window, and pricing.
- Complete tool profiles with starter prompts, advantages, limitations, and privacy notes.

### 5. Projects & Practical Labs
- Portfolio capstones across Full-Stack and AI Engineering with step-by-step milestones.
- Functional submission workflow: GitHub repository URL, live deployment URL, and student notes.
- Instructor grading, feedback, and evaluation loop.

### 6. Admin Management Portal
- Cohort student management (activate, suspend, inspect progress).
- Capstones evaluation and grading modal.
- Curriculum and AI tool directory updates.
- Real-time learning analytics and audit logs.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Framer Motion |
| **Styling & Theme** | Dark Charcoal (`#101114`), Glassmorphism, Montserrat & Lato fonts |
| **Backend Primary** | Node.js, Express.js REST API with rate-limiting & Zod validation |
| **AI Microservices** | Python 3.13, FastAPI, NumPy, Uvicorn |
| **Database & Search** | Supabase PostgreSQL, `pgvector` HNSW semantic search, Row Level Security (RLS) |
| **Offline / PWA** | Web App Manifest (`manifest.json`), IndexedDB & localStorage persistence |
| **Deployment** | Docker, Docker Compose, Vercel |

---

## 🏁 Quickstart Guide

### 1. Frontend Development Server
```bash
# Navigate to project directory
cd C:\Users\DELL\.gemini\antigravity\scratch\nextgen-learning-platform

# Install dependencies (already pre-installed)
npm install

# Start Vite development server
npm run dev
# -> Local server available at: http://localhost:3000
```

### 2. Express Backend API
```bash
cd server
npm install
npm start
# -> Express API running on: http://localhost:5000
```

### 3. Python FastAPI AI Service
```bash
cd python-services
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000 --reload
# -> FastAPI documentation: http://localhost:8000/docs
```

### 4. Docker Multi-Container Orchestration
```bash
docker-compose up --build
```

---

## 🗄️ Database Migrations

Apply the Supabase PostgreSQL migrations located in `supabase/migrations/`:
1. `supabase/migrations/001_initial_schema.sql` (Creates all 28 tables, pgvector HNSW indexes, and RPC search functions).
2. `supabase/migrations/002_rls_policies.sql` (Enforces Row Level Security and role-based permissions).
3. `supabase/seed/seed.sql` (Populates complete curriculum levels, roadmap nodes, and AI tools).
