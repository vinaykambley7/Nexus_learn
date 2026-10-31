-- ============================================================================
-- NEXUSLEARN DATABASE MIGRATION: 001_initial_schema.sql
-- Next-Gen Full-Stack & AI Learning Ecosystem
-- PostgreSQL with pgvector extension & Row Level Security (RLS)
-- ============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. User Profiles & Roles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'instructor')),
    streak_days INTEGER DEFAULT 0,
    total_hours_learned NUMERIC(8,2) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_settings (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    preferred_theme TEXT DEFAULT 'dark',
    email_notifications BOOLEAN DEFAULT TRUE,
    daily_goal_minutes INTEGER DEFAULT 45,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Curriculum Architecture
CREATE TABLE IF NOT EXISTS public.learning_tracks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT,
    accent_color TEXT NOT NULL,
    level_count INTEGER DEFAULT 1,
    module_count INTEGER DEFAULT 1,
    total_duration_hours INTEGER DEFAULT 40,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.learning_levels (
    id TEXT PRIMARY KEY,
    track_id TEXT REFERENCES public.learning_tracks(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Industry Level')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.roadmap_nodes (
    id TEXT PRIMARY KEY,
    level_id TEXT REFERENCES public.learning_levels(id) ON DELETE CASCADE,
    track_id TEXT REFERENCES public.learning_tracks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    estimated_minutes INTEGER DEFAULT 60,
    status_default TEXT DEFAULT 'available',
    x_coord NUMERIC(6,2) NOT NULL,
    y_coord NUMERIC(6,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.roadmap_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_id TEXT REFERENCES public.learning_tracks(id) ON DELETE CASCADE,
    source_node_id TEXT REFERENCES public.roadmap_nodes(id) ON DELETE CASCADE,
    target_node_id TEXT REFERENCES public.roadmap_nodes(id) ON DELETE CASCADE,
    curve_style TEXT DEFAULT 'smoothstep',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.learning_modules (
    id TEXT PRIMARY KEY,
    node_id TEXT UNIQUE REFERENCES public.roadmap_nodes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT,
    learning_objectives JSONB DEFAULT '[]'::jsonb,
    prerequisites JSONB DEFAULT '[]'::jsonb,
    estimated_minutes INTEGER DEFAULT 60,
    difficulty TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Lessons, Exercises & Quizzes
CREATE TABLE IF NOT EXISTS public.lessons (
    id TEXT PRIMARY KEY,
    module_id TEXT REFERENCES public.learning_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INTEGER DEFAULT 1,
    duration_minutes INTEGER DEFAULT 30,
    video_url TEXT,
    theory_markdown TEXT NOT NULL,
    key_takeaways JSONB DEFAULT '[]'::jsonb,
    code_snippets JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.code_exercises (
    id TEXT PRIMARY KEY,
    module_id TEXT REFERENCES public.learning_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    language TEXT NOT NULL,
    starter_code TEXT NOT NULL,
    solution_code TEXT,
    test_cases JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quizzes (
    id TEXT PRIMARY KEY,
    module_id TEXT REFERENCES public.learning_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    passing_score_percent INTEGER DEFAULT 80,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id TEXT REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_index INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    code_snippet TEXT
);

-- 5. Student Activity & Submissions
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    node_id TEXT REFERENCES public.roadmap_nodes(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed')),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, node_id)
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    quiz_id TEXT REFERENCES public.quizzes(id) ON DELETE CASCADE,
    score_percent INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    answers JSONB,
    attempted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL,
    project_title TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    github_repo_url TEXT NOT NULL,
    live_url TEXT,
    notes TEXT,
    status TEXT DEFAULT 'Pending Review' CHECK (status IN ('Pending Review', 'Approved', 'Changes Requested')),
    admin_feedback TEXT,
    grade TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- 6. AI Tools Directory
CREATE TABLE IF NOT EXISTS public.ai_tools (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    short_description TEXT NOT NULL,
    detailed_description TEXT,
    website_url TEXT NOT NULL,
    logo_url TEXT,
    pricing_type TEXT NOT NULL,
    pricing_details TEXT,
    difficulty TEXT NOT NULL,
    key_features JSONB DEFAULT '[]'::jsonb,
    best_use_cases JSONB DEFAULT '[]'::jsonb,
    starter_prompts JSONB DEFAULT '[]'::jsonb,
    advantages JSONB DEFAULT '[]'::jsonb,
    limitations JSONB DEFAULT '[]'::jsonb,
    privacy_notes TEXT,
    comparison_scores JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.saved_ai_tools (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    tool_id TEXT REFERENCES public.ai_tools(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY(user_id, tool_id)
);

-- 7. Semantic AI Search with pgvector
CREATE TABLE IF NOT EXISTS public.knowledge_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    track_id TEXT REFERENCES public.learning_tracks(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.document_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.knowledge_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    chunk_content TEXT NOT NULL,
    embedding VECTOR(1536), -- Standard OpenAI / text-embedding-3 dimension
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector HNSW Index for sub-millisecond approximate nearest neighbor retrieval
CREATE INDEX IF NOT EXISTS idx_doc_embeddings_hnsw 
ON public.document_embeddings 
USING hnsw (embedding vector_cosine_ops);

-- Vector search match RPC function
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding VECTOR(1536),
  match_count INT DEFAULT 5,
  filter JSONB DEFAULT '{}'::jsonb
) RETURNS TABLE (
  id UUID,
  document_id UUID,
  chunk_content TEXT,
  similarity FLOAT
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    document_embeddings.id,
    document_embeddings.document_id,
    document_embeddings.chunk_content,
    1 - (document_embeddings.embedding <=> query_embedding) AS similarity
  FROM document_embeddings
  ORDER BY document_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 8. Admin Audit Logs
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
