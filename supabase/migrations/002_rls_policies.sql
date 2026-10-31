-- ============================================================================
-- NEXUSLEARN ROW LEVEL SECURITY (RLS) POLICIES
-- File: 002_rls_policies.sql
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles: Users can view own profile or admins can view all
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 2. Curriculum content: Publicly readable for authenticated learners, writable only by admins
CREATE POLICY "Curriculum readable by all authenticated"
ON public.learning_tracks FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Curriculum levels readable by all"
ON public.learning_levels FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Roadmap nodes readable by all"
ON public.roadmap_nodes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Modules readable by all"
ON public.learning_modules FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Lessons readable by all"
ON public.lessons FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Quizzes readable by all"
ON public.quizzes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin write access to curriculum"
ON public.learning_tracks FOR ALL
USING (public.is_admin());

-- 3. Student Progress: Students manage own progress, admins can view all
CREATE POLICY "Students manage own progress"
ON public.student_progress FOR ALL
USING (auth.uid() = user_id OR public.is_admin());

-- 4. Quiz Attempts: Students view & insert own attempts
CREATE POLICY "Students manage own quiz attempts"
ON public.quiz_attempts FOR ALL
USING (auth.uid() = user_id OR public.is_admin());

-- 5. Project Submissions: Students submit own, admins review and grade
CREATE POLICY "Students insert and view own submissions"
ON public.project_submissions FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Students insert own submissions"
ON public.project_submissions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins update submissions feedback"
ON public.project_submissions FOR UPDATE
USING (public.is_admin());

-- 6. AI Tools: Publicly readable, admin writable
CREATE POLICY "AI tools readable by all"
ON public.ai_tools FOR SELECT
USING (true);

CREATE POLICY "Admins manage AI tools"
ON public.ai_tools FOR ALL
USING (public.is_admin());

CREATE POLICY "Students manage saved AI tools"
ON public.saved_ai_tools FOR ALL
USING (auth.uid() = user_id);
