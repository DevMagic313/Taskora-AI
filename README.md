<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-informational?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-green?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-AI-f55a3c?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

# Taskora AI
**AI-Powered Task Management for Modern Teams**

[Live Demo](https://taskora-ai-gh.vercel.app/) · [Report Bug](https://github.com/DevMagic313/Taskora-AI/issues/new?labels=bug&title=%5BBug%5D%3A+) · [Request Feature](https://github.com/DevMagic313/Taskora-AI/issues/new?labels=enhancement&title=%5BFeature%5D%3A+)
</div>

## 📑 Table of Contents
1. [Overview](#-overview)
2. [Features](#-features)
3. [Tech Stack](#️-tech-stack)
4. [Project Structure](#-project-structure)
5. [Getting Started](#-getting-started)
6. [Pages & Features](#-pages--features)
7. [Database Schema](#️-database-schema)
8. [API Routes](#-api-routes)
9. [Security](#-security)
10. [Deployment](#️-deployment)
11. [Contributing](#-contributing)
12. [License](#-license)
13. [Author](#-author)

## 📖 Overview

Taskora AI is a modern, intelligent task management SaaS application designed for high-performing teams. By seamlessly blending traditional task tracking with cutting-edge artificial intelligence, Taskora AI streamlines workflows and maximizes productivity. Whether you're managing daily to-dos or planning complex projects, the platform adapts to your unique needs.

At its core, Taskora AI utilizes the powerful Groq AI engine (llama-3.3-70b-versatile) to help users generate task blueprints, break down complex goals into actionable steps, and even reprioritize workloads dynamically. Backed by a robust Next.js 16 and Supabase architecture, it delivers a fast, secure, and real-time collaborative experience.

## ✨ Features

### 🧠 AI Capabilities
- **AI Task Blueprint Generation**: Convert natural language goals into fully structured tasks with estimated hours and dependencies.
- **Smart Reprioritization**: Analyze your workload and let the AI suggest bulk reprioritization for optimal efficiency.
- **Floating AI Chat Assistant**: Context-aware AI assistant available on every page to answer questions or assist in task planning.

### 💼 Team & Workspace
- **Multi-Role Workspaces**: Granular RBAC supporting Owner, Admin, Member, and Viewer roles.
- **Team Invitations**: Secure email-based workspace invitations with zero-friction automated acceptance upon login via Supabase RPC.
- **Real-time Collaboration**: Instantly synced task updates and workspace activity.
- **Real-time Collaboration**: Instantly synced task updates and workspace activity.

### 📊 Analytics
- **Dynamic Dashboards**: Visualize task completion rates, priority distribution, and recent activity.
- **Custom Charts**: SVG-powered visual representations of generated vs. completed tasks over time.

### 🎨 UI/UX Excellence
- **Extensive Theming**: Light/Dark modes, multiple accent colors, and adjustable sidebar styles.
- **Optimistic Updates**: Instant UI feedback with background state synchronization and automatic error rollback.
- **Responsive Navigation**: Adapts flawlessly to mobile, tablet, and desktop environments.

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | Next.js 16 | React framework, SSR, App router |
| **Frontend** | React 19 | UI component architecture |
| **Styling** | Tailwind CSS v4 | Utility-first styling |
| **Database/Auth** | Supabase | PostgreSQL, SSR Auth, Storage, RLS |
| **AI Engine** | Groq API | LLM functionality (`llama-3.3-70b-versatile`) |
| **State Mgmt** | Zustand | Global client state |
| **Schema Validation** | Zod | Form and API data validation |
| **Forms** | React Hook Form | Efficient client-side form handling |
| **Deployment** | Vercel | Global edge network hosting |

## 📂 Project Structure

```text
Taskora-AI/
├── src/
│   ├── app/
│   │   ├── (app)/               # Protected dashboard & app routes
│   │   ├── (auth)/              # Authentication routes
│   │   ├── (marketing)/         # Public landing, pricing, about pages
│   │   └── api/                 # Next.js API route handlers
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   ├── forms/               # Form components
│   │   ├── layout/              # Navbars, Sidebars, Footers
│   │   └── tasks/               # Task-specific components
│   ├── lib/                     # Utilities, helpers, Supabase clients
│   ├── store/                   # Zustand state stores
│   └── types/                   # TypeScript definitions
├── public/                      # Static assets & Service Worker (sw.js)
├── tailwind.config.ts           # Tailwind CSS configuration
├── next.config.mjs              # Next.js configuration
└── package.json                 # Dependencies & scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+
- npm, yarn, or pnpm
- A Supabase account and project
- A Groq AI API key

### Clone & Install

```bash
git clone https://github.com/DevMagic313/Taskora-AI.git
cd Taskora-AI
npm install
```

### Supabase Setup
1. Create a new Supabase project.
2. Run the SQL migrations to set up the schemas and Row Level Security (RLS) policies.
3. Configure Supabase Auth settings (enable email provider).

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Optional APIs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Locally

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📄 Pages & Features

### 1. Landing Page (`/`)
The front face of Taskora AI, designed to convert visitors into users.
- **Hero Section**: Features visually striking animated gradient text.
- **Stats Section**: Social proof displaying 10K+ tasks, 500+ users, and 99.9% uptime.
- **Features Grid**: Highlights 6 core application capabilities.
- **Pricing**: Compares Starter (Free), Pro ($12), and Team ($49) plans.
- **Testimonials**: 3 user success stories.
- **Navigation & Footer**: Responsive navbar with auth state detection and a comprehensive 4-column footer.

### 2. Authentication
Secure, SSR-compatible authentication utilizing Supabase.
- **`/login`**: Email/password authentication paired with a branded marketing panel.
- **`/register`**: Account creation featuring a dynamic password strength meter.
- **Middleware**: Protected routes that seamlessly redirect authenticated users to `/dashboard`, built with graceful fault-tolerance and fallback mechanisms for Edge network disruptions.
- **Session Management**: Supabase SSR cookie-based sessions without relying on vulnerable `localStorage` tokens.
- **Email Confirmation**: Robust email confirmation flow ensuring valid users.
- **Automated Workspaces**: Securely auto-accepts pending workspace invitations silently in the background via Postgres triggers upon user login.

### 3. Dashboard (`/dashboard`)
The central hub for user productivity.
- **Dynamic Greeting**: Time-based welcome message.
- **Stat Cards**: At-a-glance metrics for Total Tasks, Completed, Pending, and High Priority.
- **Visual Completion Tracker**: Custom SVG circular progress chart showing completion rate.
- **Recent Activity**: List of the 5 most recently interacted tasks.
- **Quick Tools**: Shortcuts linking directly to AI Generation and Analytics.
- **Empty State**: Friendly handling for brand new users without task data.

### 4. Tasks Page (`/tasks`)
The core task management interface with comprehensive full CRUD functionality.
- **TaskCard Component**: Displays task status toggle, priority badges, due dates (with soon/overdue indicators), assigned owner, pending reasons, and action menus (edit/delete).
- **TaskFormModal/TaskEditModal**: Advanced forms to manage titles, descriptions, status, priority, assignments, start/due dates, checked items, and rich comment/note fields.
- **Advanced Filtering & Search**: 300ms debounced searching, complete with status and priority filters adorned with real-time count badges.
- **AI Reprioritize**: Bulk AI optimization that analyzes tasks and opens a `ReprioritizeModal` to review and instantly apply smart suggestions.
- **Execution Rate**: Dynamic percentage display tracking current sprint velocity.
- **Optimistic UI**: Flawless, instant interface updates with built-in rollback in case of API failure.

### 5. AI Planner (`/ai-planning`)
Intelligent task scaffolding using the `llama-3.3-70b-versatile` model.
- **AIGeneratePanel**: Accepts up to 500 characters of natural language goals or offers 4 quick-start prompt templates.
- **Generated Blueprints**: AI returns structured tasks with editable titles, description display, estimated hours, dropdown priority selector, dependencies, and execution steps.
- **Granular Control**: Save individual suggested tasks, save all, discard all, regenerate with same prompt, or remove specific steps.
- **History & Recovery**: Maintains a history of the last 10 generations with one-click restore functionality.
- **Loading & Error**: Smooth skeleton loading animations and intuitive error handling with retry capability.

### 6. Analytics (`/analytics`)
Deep insights into workspace productivity.
- **Stat Cards**: Overview of overall totals and completion rates.
- **Visual Data**: Priority distribution bar charts, category breakdown lists, and a 7-day trailing SVG bar chart comparing task creation vs. completion.
- **Activity Feed**: Timeline of the last 15 actions mapping user interactions.

### 7. AI Chat Assistant (Floating Bubble)
Persistent support and context-aware assistance globally accessible on every page.
- **Floating Sparkles Element**: Anchored at the bottom-right, sliding up into a chat console.
- **Intelligence**: Streams real-time SSE responses from Groq, and possesses context of the user's current tasks.
- **Convenience**: 3 quick-prompt suggestions, complete message history, error handling, and easy dismissal via `Escape` or outer-clicks.

### 8. Settings — Profile (`/settings/profile`)
Personal user customization.
- Features Supabase Storage uploads for Avatars.
- Modifiable display name, timezone search/selector, language preference (English/Urdu), bio string (160 chars max), and email change workflow.
- Includes auto-save on form submissions.

### 9. Settings — Appearance (`/settings/appearance`)
Extensive UI customizability saved directly to `localStorage` and applied instantly.
- **Theme**: Light, Dark, or System Sync.
- **Sidebar**: Default, Compact, or Minimal layouts.
- **Accent Palette**: Blue, Violet, Green, Orange, Pink, and Red options applied instantly dynamically.
- **Font Size**: Default, Comfortable, or Compact typography.

### 10. Settings — Notifications (`/settings/notifications`)
Granular notification preferences saved to `profiles.notification_preferences`.
- **In-App**: Toggles for Task assigned, Task due, Comment mention, Member joined, and AI completed.
- **Email (Coming Soon)**: Placeholders for Weekly summaries, Overdue reminders, and Team digest.

### 11. Settings — Security (`/settings/security`)
Account integrity controls.
- Secure password change interface featuring a 5-level strength meter and show/hide toggles.
- Active session management and readied connected accounts integration (Google/GitHub).

### 12. Settings — Workspace General (`/settings/workspace/general`)
Administrative controls for shared environments.
- Manage workspace branding with logo uploads via Supabase Storage.
- Custom workspace names and auto-generated (or regenerated) slugs.
- Secure operations like workspace deletion require type-to-confirm modal validations. Contains an easily copyable Workspace ID.

### 13. Settings — Members (`/settings/members`)
Workspace user management suite via Supabase RBAC.
- Invite users seamlessly by email (`inviteUserByEmail`).
- Granular Role-Based Access Control (RBAC): Owner, Admin, Member, Viewer.
- Administer the members list (change roles, remove users via confirm modal) and retract pending invites.
- Visual clarity with Avatar/initials and "You" badges.

### 14. Notifications Page (`/notifications`)
Browser push notification hub.
- Push mechanism driven by dedicated Service Worker (`sw.js`).
- Stores FCM tokens securely in user profiles upon granting browser permissions.

### 15. Pricing Page (`/pricing`)
Marketing and conversion centered around available plans.
- Clear breakdown of Starter (Free), Pro ($12/mo), and Team ($49/mo) capabilities.
- Backend-enforced limits directly integrating with Supabase to strictly cap Starter users at 50 tasks and 15 AI generations/month.
- Contains "Coming Soon" badges and "Get notified" waitlist functionality.

### 16. Public Pages
Comprehensive non-authenticated content covering:
- **Company**: `/about` (Mission/Team), `/careers` (Open roles), `/contact` (Form & Info)
- **Product**: `/features` (8 cards), `/ai-engine` (How it works in 4 steps), `/blog` (4 post cards), `/changelog` (Version histories)
- **Integrations**: `/integrations` (6 external app connections)
- **Legal**: `/privacy`, `/terms`, `/cookies`, `/gdpr`

## 🗄️ Database Schema

### `profiles`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary Key (References Auth.users) |
| `avatar_url` | Text | Supabase Storage URL |
| `bio` | Text | Max 160 characters |
| `timezone` | Text | User's local timezone |
| `fcm_token` | Text | Push notification token |
| `notification_preferences` | JSONB | Saved toggle states |

### `workspaces`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary Key |
| `name` | Text | Workspace Name |
| `slug` | Text | Unique URL identifier |
| `logo_url` | Text | Supabase Storage URL |
| `owner_id` | UUID | References `profiles.id` |

### `workspace_members`
| Column | Type | Description |
|--------|------|-------------|
| `workspace_id` | UUID | References `workspaces.id` |
| `user_id` | UUID | References `profiles.id` |
| `role` | Text | Owner, Admin, Member, Viewer |
| `joined_at` | Timestamp | Date of acceptance |

### `workspace_invites`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary Key |
| `email` | Text | E-mail of invitee |
| `role` | Text | Assigned starting role |
| `invited_by` | UUID | References `profiles.id` |
| `accepted_at` | Timestamp | Nullable |

### `tasks`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary Key |
| `title` | Text | Task Headline |
| `description` | Text | Detailed breakdown |
| `priority` | Text | Low, Medium, High |
| `status` | Text | Pending, Completed |
| `start_date` | Timestamp | Standard start |
| `due_date` | Timestamp | Deadline |
| `assigned_to` | UUID | References `profiles.id` |
| `pending_reason` | Text | Context on blocked state |
| `checked` | Boolean | Checkbox state |
| `comments`, `notes`, `remarks` | Text | Extra contextual fields |

### `task_logs`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary Key |
| `task_id` | UUID | References `tasks.id` |
| `action_type` | Text | Created, Updated, Completed, Deleted |
| `created_at` | Timestamp | Action date |

### `ai_generation_history`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary Key |
| `goal` | Text | Input prompt from user |
| `result` | JSONB | Generated schema payload |
| `created_at` | Timestamp | Query date |

## 📡 API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ai/generate-tasks` | `POST` | Interacts with Groq to generate task blueprints. |
| `/api/ai/reprioritize` | `POST` | Analyzes load and suggests task priority changes. |
| `/api/ai/stream` | `POST` | SSE endpoint for the floating Chat Assistant. |
| `/api/ai/history` | `GET/POST` | Fetch or record previous AI generations. |
| `/api/tasks` | `GET/POST` | Read all tasks or Create a new task. |
| `/api/tasks/[id]` | `PUT/DELETE` | Modify or permanently banish a task. |
| `/api/analytics` | `GET` | Calculate and return dashboard chart data. |
| `/api/notifications` | `GET/POST/DELETE` | Manage in-app notification data. |
| `/api/workspace/invite` | `POST` | Trigger email workflow via Supabase Auth. |
| `/api/account/delete` | `DELETE` | Triggers Service Role account purge. |

## 🔐 Security
- **Row Level Security (RLS)**: Enforced comprehensively across every single Supabase table to guarantee data isolation between workspaces.
- **SSR Authentication**: Cookies handled exclusively on the server, mitigating standard XSS vulnerabilities associated with `localStorage` token extraction.
- **Service Role Obfuscation**: The high-privilege `SUPABASE_SERVICE_ROLE_KEY` is completely isolated to server instances and never escapes into the client build.
- **API Proxying**: Sensitive tokens (like Groq API keys and Resend email keys) are never exposed. All requests route through Next.js serverless functions.
- **Webhook Security**: Pre-configured architectural readiness for webhook signature verification.

## ☁️ Deployment

Taskora AI is strictly optimized for Vercel's zero-config edge network.

1. Push your repository to GitHub.
2. Link the repository to Vercel via the Vercel Dashboard.
3. Configure the exact Environment Variables listed in `.env.local` inside the Vercel project settings.
4. Deploy the application. Vercel automatically detects Next.js configurations for instantaneous, seamless deployment.

## 🤝 Contributing

We welcome contributions to make Taskora AI better!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

**Ghulam Hussain (DevMagic)**
- Portfolio: [codewithgh.vercel.app](https://codewithgh.vercel.app)
- GitHub: [@DevMagic313](https://github.com/DevMagic313)
