-- ==============================================================================
-- DHIPASH HARI DEV M — MASTER PORTFOLIO DATABASE SCHEMA & RLS
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/guldcgtjpchoikyjljsj/sql)
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ADMIN USERS TABLE (Role-Based Access Control)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is active admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
        AND is_active = true
    );
END;
$$;

DROP POLICY IF EXISTS "Admin users can view their own record" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can manage admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow authenticated read own admin status" ON public.admin_users;

-- Direct non-recursive check for viewing admin status
CREATE POLICY "Allow authenticated read own admin status"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Admins can manage admin_users using SECURITY DEFINER is_admin()
CREATE POLICY "Admins can manage admin_users"
    ON public.admin_users FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 2. PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    headline TEXT NOT NULL,
    bio TEXT NOT NULL,
    location TEXT DEFAULT 'Tamil Nadu, India',
    email TEXT NOT NULL,
    phone TEXT,
    profile_image_url TEXT,
    resume_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Admins can insert or update profiles" ON public.profiles;
CREATE POLICY "Admins can insert or update profiles"
    ON public.profiles FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 3. SITE SETTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_title TEXT NOT NULL DEFAULT 'Dhipash Hari Dev M — AI & Data Science × Creative Development',
    site_description TEXT NOT NULL DEFAULT 'AI and Data Science portfolio of Dhipash Hari Dev M featuring machine learning projects, frontend design, motion design and interactive digital experiences.',
    accent_color TEXT NOT NULL DEFAULT '#00E5FF',
    hero_badge TEXT DEFAULT 'AI & DATA SCIENCE / CREATIVE TECHNOLOGY',
    hero_headline TEXT DEFAULT 'BUILDING INTELLIGENT EXPERIENCES.',
    hero_supporting_copy TEXT DEFAULT 'I explore the intersection of artificial intelligence, data, frontend design and motion to create digital experiences that are both functional and visually memorable.',
    resume_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON public.site_settings;
CREATE POLICY "Site settings are viewable by everyone"
    ON public.site_settings FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
CREATE POLICY "Admins can update site settings"
    ON public.site_settings FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. SKILLS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Programming', 'AI / ML', 'Data', 'Frontend', 'Design', 'Motion', 'Tools')),
    description TEXT,
    icon TEXT,
    url TEXT,
    proficiency_label TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Skills are viewable by everyone" ON public.skills;
CREATE POLICY "Skills are viewable by everyone"
    ON public.skills FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Admins can manage skills" ON public.skills;
CREATE POLICY "Admins can manage skills"
    ON public.skills FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. PROJECTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    problem TEXT,
    solution TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    technologies TEXT[] DEFAULT '{}',
    image_url TEXT,
    gallery TEXT[] DEFAULT '{}',
    video_url TEXT,
    github_url TEXT,
    live_url TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published projects are viewable by everyone" ON public.projects;
CREATE POLICY "Published projects are viewable by everyone"
    ON public.projects FOR SELECT
    TO public
    USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage projects" ON public.projects;
CREATE POLICY "Admins can manage projects"
    ON public.projects FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. ACHIEVEMENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    description TEXT,
    year TEXT,
    award_level TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON public.achievements;
CREATE POLICY "Achievements are viewable by everyone"
    ON public.achievements FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Admins can manage achievements" ON public.achievements;
CREATE POLICY "Admins can manage achievements"
    ON public.achievements FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. CERTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date TEXT,
    credential_id TEXT,
    credential_url TEXT,
    certificate_url TEXT,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Certifications are viewable by everyone" ON public.certifications;
CREATE POLICY "Certifications are viewable by everyone"
    ON public.certifications FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Admins can manage certifications" ON public.certifications;
CREATE POLICY "Admins can manage certifications"
    ON public.certifications FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. EDUCATION TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field TEXT NOT NULL,
    start_year TEXT NOT NULL,
    end_year TEXT NOT NULL,
    grade TEXT,
    grade_label TEXT DEFAULT 'CGPA',
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Education details are viewable by everyone" ON public.education;
CREATE POLICY "Education details are viewable by everyone"
    ON public.education FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Admins can manage education" ON public.education;
CREATE POLICY "Admins can manage education"
    ON public.education FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. LANGUAGES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    proficiency TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Languages are viewable by everyone" ON public.languages;
CREATE POLICY "Languages are viewable by everyone"
    ON public.languages FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Admins can manage languages" ON public.languages;
CREATE POLICY "Admins can manage languages"
    ON public.languages FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 10. SOCIAL LINKS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Social links are viewable by everyone" ON public.social_links;
CREATE POLICY "Social links are viewable by everyone"
    ON public.social_links FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Admins can manage social links" ON public.social_links;
CREATE POLICY "Admins can manage social links"
    ON public.social_links FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 11. CONTACT MESSAGES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert contact messages" ON public.contact_messages;
CREATE POLICY "Public can insert contact messages"
    ON public.contact_messages FOR INSERT
    TO public
    WITH CHECK (length(name) > 0 AND length(email) > 3 AND length(message) > 0);

DROP POLICY IF EXISTS "Admins can view and manage contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view and manage contact messages"
    ON public.contact_messages FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 12. MEDIA METADATA TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    mime_type TEXT,
    size_bytes BIGINT,
    folder TEXT NOT NULL DEFAULT 'general' CHECK (folder IN ('profile', 'projects', 'certifications', 'resume', 'general')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Media records are viewable by everyone" ON public.media;
CREATE POLICY "Media records are viewable by everyone"
    ON public.media FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Admins can manage media records" ON public.media;
CREATE POLICY "Admins can manage media records"
    ON public.media FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 13. STORAGE BUCKET CONFIGURATION & POLICIES ('portfolio-media')
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public portfolio-media access" ON storage.objects;
CREATE POLICY "Public portfolio-media access"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Admin upload to portfolio-media" ON storage.objects;
CREATE POLICY "Admin upload to portfolio-media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admin update in portfolio-media" ON storage.objects;
CREATE POLICY "Admin update in portfolio-media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'portfolio-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admin delete from portfolio-media" ON storage.objects;
CREATE POLICY "Admin delete from portfolio-media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio-media' AND public.is_admin());

-- ------------------------------------------------------------------------------
-- 14. SEED DATA (STRICT FACTUAL RESUME FACTS - 100% VALID HEX UUIDs)
-- ------------------------------------------------------------------------------

-- Profile
INSERT INTO public.profiles (id, full_name, headline, bio, location, email, phone, profile_image_url, resume_url)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'DHIPASH HARI DEV M',
    'AI & Data Science × Frontend Design × Motion',
    'B.Tech Artificial Intelligence and Data Science student at Ramco Institute of Technology. Exploring the convergence of machine learning, data engineering, modern frontend interfaces, and interactive motion design.',
    'Rajapalayam, Tamil Nadu, India',
    'dhipashhari@gmail.com',
    '7598479000',
    null,
    null
) ON CONFLICT (id) DO NOTHING;

-- Site Settings
INSERT INTO public.site_settings (id, site_title, site_description, accent_color, hero_badge, hero_headline, hero_supporting_copy)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'Dhipash Hari Dev M — AI & Data Science × Creative Development',
    'AI and Data Science portfolio of Dhipash Hari Dev M featuring machine learning projects, frontend design, motion design and interactive digital experiences.',
    '#00E5FF',
    'AI & DATA SCIENCE / CREATIVE TECHNOLOGY',
    'BUILDING INTELLIGENT EXPERIENCES.',
    'I explore the intersection of artificial intelligence, data, frontend design and motion to create digital experiences that are both functional and visually memorable.'
) ON CONFLICT (id) DO NOTHING;

-- Education
INSERT INTO public.education (id, institution, degree, field, start_year, end_year, grade, grade_label, description, display_order)
VALUES (
    '00000000-0000-0000-0000-000000000010',
    'Ramco Institute of Technology',
    'B.Tech',
    'Artificial Intelligence and Data Science',
    '2024',
    '2028',
    '7.24',
    'CGPA (Up to Fourth Semester)',
    'Undergraduate engineering student focusing on foundational algorithms, data analysis, machine learning models, and modern web application development.',
    1
) ON CONFLICT (id) DO NOTHING;

-- Languages
INSERT INTO public.languages (id, name, proficiency, display_order)
VALUES 
    ('00000000-0000-0000-0000-000000000020', 'English', 'Professional working proficiency', 1),
    ('00000000-0000-0000-0000-000000000021', 'Tamil', 'Native / Bilingual proficiency', 2)
ON CONFLICT (id) DO NOTHING;

-- Social Links
INSERT INTO public.social_links (id, platform, url, icon, display_order)
VALUES 
    ('00000000-0000-0000-0000-000000000030', 'GitHub', 'https://github.com/dhipash', 'Github', 1),
    ('00000000-0000-0000-0000-000000000031', 'LinkedIn', 'https://linkedin.com', 'Linkedin', 2),
    ('00000000-0000-0000-0000-000000000032', 'Email', 'mailto:dhipashhari@gmail.com', 'Mail', 3)
ON CONFLICT (id) DO NOTHING;

-- Skills
INSERT INTO public.skills (id, name, category, description, icon, display_order, featured)
VALUES
    ('00000000-0000-0000-0000-000000000101', 'Python', 'Programming', 'Core language for algorithmic development, data science, scripting, and backend workflows.', 'Code2', 1, true),
    ('00000000-0000-0000-0000-000000000102', 'Machine Learning', 'AI / ML', 'Predictive modeling, classification, and computer vision integration for real-time applications.', 'Cpu', 2, true),
    ('00000000-0000-0000-0000-000000000103', 'Pandas', 'Data', 'High-performance data manipulation, exploratory data analysis, and tabular data structuring.', 'Table', 3, true),
    ('00000000-0000-0000-0000-000000000104', 'NumPy', 'Data', 'Multi-dimensional numerical computing, vector algebra, and high-performance array operations.', 'Binary', 4, true),
    ('00000000-0000-0000-0000-000000000105', 'Power BI', 'Data', 'Data visualization, business intelligence dashboards, and comparative metric tracking.', 'BarChart3', 5, true),
    ('00000000-0000-0000-0000-000000000106', 'MySQL', 'Programming', 'Relational database schema modeling, indexing, and complex analytical queries.', 'Database', 6, true),
    ('00000000-0000-0000-0000-000000000107', 'HTML', 'Frontend', 'Semantic markup, accessible page architectures, and modern web structural foundations.', 'FileCode', 7, false),
    ('00000000-0000-0000-0000-000000000108', 'CSS', 'Frontend', 'Responsive layouts, modern styling systems, CSS variables, and layout precision.', 'Palette', 8, false),
    ('00000000-0000-0000-0000-000000000109', 'Frontend Design', 'Design', 'Interface composition, visual hierarchy, typography, and contemporary editorial aesthetic design.', 'Layout', 9, true),
    ('00000000-0000-0000-0000-000000000110', 'Framer Motion', 'Motion', 'Physics-based spring animations, gesture-driven interactions, and smooth page transitions.', 'Sparkles', 10, true),
    ('00000000-0000-0000-0000-000000000111', 'Motion Design', 'Motion', 'Choreographed UI animation, scroll-driven narratives, and deliberate interactive transitions.', 'Film', 11, true),
    ('00000000-0000-0000-0000-000000000112', 'Playwright CLI', 'Tools', 'End-to-end browser automation, headless test verification, and automated UI workflows.', 'Terminal', 12, true),
    ('00000000-0000-0000-0000-000000000113', 'Microsoft Tools', 'Tools', 'Productivity suite, Office analytics, and developer collaboration utilities.', 'Boxes', 13, false)
ON CONFLICT (id) DO NOTHING;

-- Projects
INSERT INTO public.projects (id, title, slug, category, short_description, full_description, problem, solution, features, technologies, github_url, live_url, featured, published, display_order)
VALUES
(
    '00000000-0000-0000-0000-000000000201',
    'Red Lenz',
    'red-lenz',
    'AI / Machine Learning',
    'AI-powered machine learning project detecting exposed body content in live camera streams and applying an automatic blur effect for privacy protection.',
    'Red Lenz is a computer vision and privacy-focused machine learning application. It processes real-time camera video streams to identify exposed or sensitive body content and instantaneously applies a localized blur filter over the detected regions to ensure privacy compliance and protection during live broadcasts or monitoring.',
    'During live video streams, inadvertent exposure of sensitive content can lead to privacy violations, compliance breaches, or distress without manual moderation intervention.',
    'Engineered an automated real-time image processing pipeline that actively monitors video feeds, detects target body regions using visual models, and overlays dynamic blur masks with minimal latency.',
    '["Real-time video stream ingestion", "Object & body region detection", "Instantaneous automated blur masking", "Low-latency frame processing pipeline", "Privacy protection safeguard layer"]'::jsonb,
    ARRAY['Python', 'Machine Learning', 'Computer Vision', 'Image Processing'],
    'https://github.com/dhipash',
    null,
    true,
    true,
    1
),
(
    '00000000-0000-0000-0000-000000000202',
    'Mark Analysis',
    'mark-analysis',
    'AI / Data Analysis',
    'AI-based academic performance analysis system evaluating and comparing student mark percentages across two academic years.',
    'Mark Analysis is a data analysis and visualization tool specifically built to help educators and students understand learning outcomes. It ingests academic records across two successive academic years, computes statistical metrics, identifies weaker performance areas, and produces comparative visualization reports.',
    'Academic performance datasets across multiple terms and years are often disconnected, making it difficult to pinpoint systemic drop-offs or identify specific subject areas where students need intervention.',
    'Constructed an analytical evaluation pipeline that synchronizes academic datasets across two years, computes relative gains and losses, highlights weak subject clusters, and provides clear comparative visualizations.',
    '["Multi-year academic record ingestion", "Year-over-year comparative percentage calculation", "Weaker subject area identification", "Visual metric breakdown and charts", "Actionable analytical reporting"]'::jsonb,
    ARRAY['Python', 'Pandas', 'NumPy', 'Power BI', 'Data Visualization'],
    'https://github.com/dhipash',
    null,
    true,
    true,
    2
),
(
    '00000000-0000-0000-0000-000000000203',
    'Sri Thirumalai Kalaikoodam',
    'sri-thirumalai-kalaikoodam',
    'Web Application',
    'Official web application development project delivering an interactive, responsive platform for event management and content curation.',
    'The official web application developed for Sri Thirumalai Kalaikoodam is designed to provide visitors and participants with an interactive, reliable, and fluid digital hub. The project emphasized responsive layouts, performance optimization, and streamlined content and event management.',
    'The organization required an accessible, modern digital platform capable of presenting cultural events, announcements, and artistic activities with high visual clarity across all devices.',
    'Built an interactive, mobile-first web application featuring structured event management, fast-loading media presentation, and an intuitive user navigation experience.',
    '["Interactive and responsive design", "Structured event management showcase", "Dynamic content presentation", "Mobile-optimized interface", "Performance-tuned asset delivery"]'::jsonb,
    ARRAY['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    'https://github.com/dhipash',
    null,
    true,
    true,
    3
),
(
    '00000000-0000-0000-0000-000000000204',
    'Quiz Master',
    'quiz-master',
    'Flutter / Firebase',
    'Real-time multiplayer quiz application inspired by Kahoot-style experiences with dynamic question import and live leaderboards.',
    'Quiz Master is a real-time multiplayer quiz platform built using Flutter and Firebase Realtime Database. It features host and participant synchronization, live interactive sessions, dynamic quiz authoring, document-based question import, and animated live leaderboards across mobile and web.',
    'Traditional classroom and group quizzes lack engaging real-time feedback loops and often require cumbersome manual question entry.',
    'Engineered a real-time multiplayer application leveraging Firebase Realtime Database for millisecond-latency score synchronization, dynamic question parsing from documents, and animated leaderboard rankings.',
    '["Host and player session orchestration", "Live real-time quiz synchronization", "Dynamic quiz creation and document question import", "Animated real-time leaderboard", "Cross-platform support for Android, iOS, and Web"]'::jsonb,
    ARRAY['Flutter', 'Firebase Realtime Database', 'Android', 'iOS', 'Web'],
    'https://github.com/dhipash',
    null,
    true,
    true,
    4
)
ON CONFLICT (id) DO NOTHING;

-- Achievements
INSERT INTO public.achievements (id, title, organization, description, year, award_level, display_order)
VALUES
(
    '00000000-0000-0000-0000-000000000301',
    'First Prize — Paper Presentation',
    'J.P. College of Engineering',
    'Awarded 1st Prize for research paper presentation demonstrating analytical rigor and technical presentation.',
    'Academic Term',
    'First Prize',
    1
),
(
    '00000000-0000-0000-0000-000000000302',
    'Second Prize — Paper Presentation',
    'Francis Xavier Engineering College',
    'Awarded 2nd Prize for academic paper presentation exploring applied technology concepts.',
    'Academic Term',
    'Second Prize',
    2
),
(
    '00000000-0000-0000-0000-000000000303',
    'Third Prize — Project Expo',
    'Francis Xavier Engineering College',
    'Awarded 3rd Prize in Project Expo for technical innovation and live project demonstration.',
    'Academic Term',
    'Third Prize',
    3
),
(
    '00000000-0000-0000-0000-000000000304',
    'Hackathon Participation & Certificates',
    'Ramco Institute of Technology & SRM Easwari Engineering College',
    'Earned multiple merit certificates through competitive hackathons, prototyping solutions under tight constraints.',
    'Academic Term',
    'Merit Certificate',
    4
)
ON CONFLICT (id) DO NOTHING;

-- Certifications
INSERT INTO public.certifications (id, title, issuer, date, credential_id, credential_url, description, display_order)
VALUES
(
    '00000000-0000-0000-0000-000000000401',
    'Python Certification',
    'CodeChef',
    'Completed',
    'CC-PY-CERT',
    'https://codechef.com',
    'Demonstrated foundational and intermediate algorithmic problem solving and data structures in Python.',
    1
),
(
    '00000000-0000-0000-0000-000000000402',
    'Python Certification',
    'Cisco',
    'Completed',
    'CISCO-PY-01',
    'https://cisco.com',
    'Validated proficiency in Python syntax, object-oriented concepts, modular programming, and practical scripting.',
    2
),
(
    '00000000-0000-0000-0000-000000000403',
    'Data Science / Cisco Networking Basics',
    'Cisco',
    'Completed',
    'CISCO-DS-NET',
    'https://cisco.com',
    'Foundational training in data science concepts, analytical frameworks, and computer networking basics.',
    3
)
ON CONFLICT (id) DO NOTHING;
