# Dhipash Hari Dev M — Premium AI & Data Science Portfolio

> **Building intelligent digital experiences where data, technology and design meet.**

An award-winning creative developer and AI/Data Science personal portfolio website engineered for **DHIPASH HARI DEV M**. Combines editorial typography, fluid React Three Fiber 3D interactions, physics-driven Framer Motion choreography, and a Supabase-powered headless CMS with database-level Row Level Security (RLS) and storage management.

---

## 🌟 Core Brand & Factual Resume Grounding

- **Name:** DHIPASH HARI DEV M
- **Primary Positioning:** AI & Data Science × Frontend Design × Motion
- **Institution:** Ramco Institute of Technology
- **Degree:** B.Tech in Artificial Intelligence and Data Science (2024–2028)
- **Academic Performance:** CGPA 7.24 (Up to Fourth Semester)
- **Technical Skills:** Python, Machine Learning, Power BI, MySQL, Pandas, NumPy, HTML, CSS, Framer Motion, Playwright CLI, Microsoft Tools
- **Featured Projects:**
  1. **Red Lenz:** Real-time computer vision project detecting exposed body content in live camera streams and applying automatic blur filters for privacy safeguarding.
  2. **Mark Analysis:** AI-based academic performance analysis system evaluating and comparing student mark percentages across two academic years.
  3. **Sri Thirumalai Kalaikoodam:** Official responsive web platform featuring structured event management and curated cultural content delivery.
  4. **Quiz Master:** Real-time multiplayer quiz application inspired by Kahoot with host/player synchronization, document-based question import, and animated leaderboards.
- **Accolades & Achievements:**
  - 1st Prize — Paper Presentation at J.P. College of Engineering
  - 2nd Prize — Paper Presentation at Francis Xavier Engineering College
  - 3rd Prize — Project Expo at Francis Xavier Engineering College
  - Merit Certificates — Competitive Hackathons at Ramco Institute of Technology & SRM Easwari Engineering College
- **Certifications:**
  - Python Certification — CodeChef
  - Python Certification — Cisco
  - Data Science / Cisco Networking Basics — Cisco
- **Contact:**
  - Email: `dhipashhari@gmail.com`
  - Phone: `7598479000`
  - GitHub: [github.com/dhipash](https://github.com/dhipash)

---

## 🚀 Technology Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS v4, Framer Motion, React Three Fiber (Three.js & Drei), Lucide React
- **Forms & Validation:** React Hook Form, Zod
- **Backend & CMS:** Supabase (Auth, PostgreSQL, Storage, Row Level Security)
- **3D & Motion:** Procedural shader geometry, magnetic button physics, 3D card tilt, kinetic text reveals, custom desktop cursor with aura trail
- **Audio/Sensory Effects:** Canvas-confetti feedback

---

## 📂 Project Architecture

```
portfolio/
├── public/
│   ├── favicon.svg          # Sleek geometric monogram favicon
│   ├── robots.txt           # Crawling instructions & sitemap link
│   └── sitemap.xml          # Canonical sitemap
├── src/
│   ├── assets/              # Static branding and graphics
│   ├── components/
│   │   ├── about/           # Editorial about narrative & factual profile
│   │   ├── achievements/    # Honors timeline & award cards
│   │   ├── admin/           # ProtectedRoute and CMS dialogs
│   │   ├── common/          # CustomCursor, MagneticButton, SVG brand Icons
│   │   ├── contact/         # Contact section, copy-to-clipboard & message dispatch
│   │   ├── credentials/     # Education, Certifications & Languages
│   │   ├── hero/            # Editorial asymmetric hero & matrix tags
│   │   ├── layout/          # Footer and navigation containers
│   │   ├── motion/          # Motion / Interaction Lab playground
│   │   ├── navigation/      # Sleek Navbar with active section tracking
│   │   ├── projects/        # Editorial ProjectShowcase cards (01..04)
│   │   ├── skills/          # Interactive Skill Universe & Tools showcase
│   │   └── three/           # React Three Fiber 3D HeroScene with fallback
│   ├── context/
│   │   └── AuthContext.tsx  # Dual-mode authentication (Supabase & Dev mode)
│   ├── data/
│   │   └── initialData.ts   # 100% factual resume data fallback
│   ├── lib/
│   │   └── supabase.ts      # Supabase client & storage helpers
│   ├── pages/
│   │   ├── AdminDashboard.tsx # Complete dark CMS with CRUD & analytics
│   │   ├── AdminLogin.tsx     # Secure admin login portal
│   │   ├── Home.tsx           # Public showcase page
│   │   └── ProjectDetails.tsx # Individual project case study (/projects/:slug)
│   ├── services/
│   │   ├── achievementService.ts
│   │   ├── certificationService.ts
│   │   ├── contactService.ts
│   │   ├── educationService.ts
│   │   ├── mediaService.ts
│   │   ├── profileService.ts
│   │   ├── projectService.ts
│   │   └── skillService.ts
│   ├── types/
│   │   └── portfolio.ts     # Complete TypeScript domain contracts
│   ├── App.tsx              # Router & code-split lazy routes
│   ├── index.css            # Dark theme tokens, cyber utilities & scrollbar
│   └── main.tsx             # Root bootstrap
├── supabase/
│   └── schema.sql           # Complete SQL migration, tables, RLS & seed data
├── .env.example             # Supabase environment variable template
├── package.json
├── tsconfig.json
└── vite.config.ts           # Vite + Tailwind v4 + Rollup chunk optimization
```

---

## ⚡ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live website.

---

## 🔐 Supabase Configuration & CMS Setup

The website has a **graceful fallback architecture**: it works immediately out of the box with 100% factual resume data even before connecting Supabase.

To connect your own live Supabase project:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard and run the entire script in:
   ```
   supabase/schema.sql
   ```
   This will:
   - Create all tables: `profiles`, `skills`, `projects`, `achievements`, `certifications`, `education`, `languages`, `social_links`, `contact_messages`, `admin_users`, `media`, `site_settings`.
   - Configure strict **Row Level Security (RLS)**: Public read-only for published content; full CRUD for authenticated admins.
   - Set up the `portfolio-media` storage bucket with public read and admin upload policies.
   - Insert the factual seed data for Dhipash Hari Dev M.

3. Update your `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

4. Create an Admin User in Supabase:
   - In Supabase Dashboard → **Authentication** → **Users**, click **Add User** (e.g. `dhipashhari@gmail.com`).
   - In SQL Editor, add the user to `admin_users`:
     ```sql
     INSERT INTO public.admin_users (user_id, email, role, is_active)
     VALUES ('YOUR_USER_UUID_FROM_AUTH_USERS', 'dhipashhari@gmail.com', 'admin', true);
     ```

### Local Dev Admin Access (Fallback Mode)
If running without a live Supabase instance:
- Navigate to `/admin/login`
- Login with:
  - **Email:** `admin@dhipash.dev` (or `dhipashhari@gmail.com`)
  - **Password:** `admin123`

---

## 🎨 Motion & Interaction Features

1. **Custom Interactive Cursor:** Small central pinpoint with smooth physics-damped trailing aura that changes size and shows contextual states (`EXPLORE`, `VIEW`, `CODE`, `COPY`, `TILT`). Disabled automatically on touch devices.
2. **Procedural 3D Hero Scene:** Built with React Three Fiber, featuring a fluid distorted core, orbiting crystalline wireframe data structure, and dynamic data particle field responsive to pointer movement.
3. **Motion / Interaction Lab:** Interactive laboratory showcasing:
   - 3D Card Tilt with specular glare reaction
   - Kinetic Text Reveal with customizable replay triggers
   - Matrix Grid Stagger with synchronized entrance
   - Magnetic Button physics with spring pull
4. **Interactive Skill Universe:** Categorized node exploration with detailed technical inspection drawer.
5. **Project Case Studies:** Distinct deep-dive route `/projects/:slug` with technical overview, problem/solution breakdown, and architecture feature specifications.

---

## 📦 Production Build

```bash
npm run build
```

Build artifacts will be written to `dist/` with optimal chunk splitting (`vendor-three`, `vendor-framer`, code-split admin dashboard and case studies).
