<div align="center">
  
# Taskora AI

**AI-Powered Task Management for Modern Teams**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/Groq-AI_Engine-f55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Billing-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://opensource.org/licenses/MIT)

[Live Demo](https://codewithgh.vercel.app) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🗄️ Database Schema](#️-database-schema)
- [💳 Subscription Plans](#-subscription-plans)
- [📡 API Routes](#-api-routes)
- [☁️ Deployment](#️-deployment)
- [🔐 Security](#-security)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [👨💻 Author](#-author)

---

## 📖 Overview

**Taskora AI** is a production-ready, AI-powered task management platform designed for modern teams. It bridges the gap between high-level goal setting and day-to-day execution by leveraging advanced LLMs (via Groq API) to automatically break down complex objectives into actionable tasks.

Built with a focus on performance, scalability, and user experience, Taskora AI offers a rich feature set including real-time collaboration, a dynamic Kanban board, comprehensive calendar and table views, and an intelligent streaming chat assistant. Whether you are an individual aiming for peak productivity or an enterprise team coordinating massive projects, Taskora AI adapts to your workflow.

Beyond core task management, the platform includes a complete SaaS foundation with multi-workspace support, role-based access control, Stripe billing integration, and advanced analytics, making it a robust solution right out of the box.

---

## ✨ Features

### 🎯 Core Task Management
- 📋 **Flexible Views:** Switch seamlessly between Kanban Board (drag-and-drop via `@dnd-kit`), Calendar, Table/Spreadsheet, and List views.
- 🗂️ **Advanced Task Attributes:** Support for subtasks, attachments, rich-text comments, custom labels, and estimated hours.
- 🔄 **Recurring Tasks:** Automate repetitive workflows with flexible recurrence rules.
- 👥 **Assignees:** Assign tasks to team members and track accountability.

### 🤖 AI-Powered Features
- ⚡ **AI Task Generator:** Submit a high-level goal, and the Groq LLM inference engine instantly breaks it down into a structured, actionable task list.
- 💬 **Streaming Chat Assistant:** A context-aware AI assistant that knows your tasks and helps you manage your workflow dynamically.
- 🪄 **Auto-Prioritization:** Bulk reprioritize your task backlog intelligently using AI.

### 📊 Analytics & Insights
- 📈 **Advanced Dashboard:** Visualize productivity trends using beautiful `Recharts` charts.
- 🟩 **Activity Heatmap:** GitHub-style contribution heatmap to track daily task completions.

### 🏢 Team & Workspace
- 🏢 **Multi-Workspace Support:** Create and manage multiple distinct workspaces under a single account.
- 🔐 **Role-Based Access (RBAC):** Granular permissions with Owner, Admin, Member, and Viewer roles.
- 🔔 **Real-Time Notifications:** Supabase Realtime-powered in-app alerts and Resend-powered email notifications.
- 🚀 **Smooth Onboarding:** Multi-step, guided onboarding flow for new users and teams.

### 💳 Billing & Plans
- 💰 **Stripe Integration:** Seamless subscription management supporting Free, Pro, Team, and Enterprise plans.
- 📊 **Usage Limits:** Automated tier enforcement for workspaces, members, and AI generations.

### 🎨 UI/UX & Accessibility
- 🌙 **Dark/Light Mode:** First-class dark mode support with smooth transitions.
- 📱 **Fully Responsive:** Optimized layouts for mobile, tablet, and desktop environments.
- 🧩 **Modern Design System:** Built with Tailwind CSS v4 and Lucide React icons.

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16 (App Router)** | React framework for SSR, routing, and API endpoints. |
| **UI Library** | **React 19** | Component-based view library. |
| **Language** | **TypeScript (Strict Mode)** | End-to-end type safety and developer experience. |
| **Styling** | **Tailwind CSS v4** | Utility-first CSS framework for rapid UI development. |
| **State Management** | **Zustand v5** | Lightweight, scalable global state management. |
| **Database** | **PostgreSQL (Supabase)** | Robust relational database with Row Level Security. |
| **Authentication** | **Supabase Auth** | Secure authentication with SSR Cookie Middleware. |
| **AI Engine** | **Groq API** | Ultra-fast LLM inference for task generation and chat. |
| **Billing** | **Stripe** | Subscription payments, webhooks, and customer portal. |
| **Email** | **Resend API** | Reliable delivery for transactional and notification emails. |
| **Deployment** | **Vercel** | Edge network deployment, CI/CD, and hosting. |

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── (marketing)/        # Landing page, pricing, and public docs
│   ├── (auth)/             # Login, signup, forgot password, reset password
│   ├── (app)/              # Protected application routes
│   │   ├── dashboard/      # Main analytics and overview dashboard
│   │   ├── tasks/          # Task views: list, kanban, calendar, table
│   │   ├── analytics/      # Deep-dive metrics and reports
│   │   ├── settings/       # Profile, workspace, members, billing, security
│   │   └── onboarding/     # Multi-step user/workspace initialization
│   └── api/                # Next.js Route Handlers
│       ├── ai/             # Endpoints for generate, stream, reprioritize
│       ├── tasks/          # Task CRUD and operations
│       ├── workspaces/     # Workspace and member management
│       ├── notifications/  # Notification handlers
│       ├── webhooks/stripe/# Stripe event webhooks
│       └── v1/             # Public REST API endpoints
├── components/ui/          # Reusable Design System (Button, Modal, Drawer, etc.)
├── features/               # Domain-specific logic, hooks, and components
│   ├── ai/                 
│   ├── analytics/          
│   ├── auth/               
│   ├── billing/            
│   ├── tasks/              
│   ├── workspaces/         
│   └── notifications/      
└── lib/                    # Core utilities and integrations (supabase, stripe, resend)
```

---

## 🚀 Getting Started

Follow these steps to set up Taskora AI on your local machine.

### Prerequisites
Make sure you have the following installed and set up:
- **Node.js** (v20 or higher)
- **Package Manager**: npm, yarn, pnpm, or bun
- **Supabase Account**: Free tier is sufficient
- **Groq API Key**: Free tier available
- **Stripe Account**: For billing integration
- **Resend Account**: Free tier works for development

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/taskora-ai.git
cd taskora-ai
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from the repository and run the entire SQL script to map out your database tables and RLS policies.

### 4. Environment Variables
Create a `.env.local` file in the root directory and populate it with your credentials:

| Variable | Description | Required |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Base URL of your app (e.g., `http://localhost:3000`) | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon/Public Key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key for backend operations | Yes |
| `GROQ_API_KEY` | API key from Groq console | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key (test/live) | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`| Stripe publishable key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Secret to verify Stripe webhook hits | Yes |
| `RESEND_API_KEY` | Resend API key for sending emails | Yes |

### 5. Run the development server
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

---

## 🗄️ Database Schema

Taskora AI utilizes Supabase (PostgreSQL) as its primary database. Below is a high-level overview of the core tables:

| Table | Key Columns | Purpose |
| :--- | :--- | :--- |
| **`profiles`** | `id`, `display_name`, `avatar_url`, `timezone`, `onboarding_completed` | Extended user data linked to Supabase Auth users. |
| **`workspaces`** | `id`, `name`, `logo_url`, `owner_id`, `created_at` | Top-level containers for teams and projects. |
| **`workspace_members`**| `workspace_id`, `user_id`, `role`, `joined_at` | Junction table managing RBAC (Owner/Admin/Member/Viewer). |
| **`tasks`** | `id`, `workspace_id`, `title`, `description`, `status`, `priority`, `due_date`, `assignee_id`, `labels`, `estimated_hours`, `recurring` | Core workflow items within a workspace. |
| **`task_logs`** | `id`, `task_id`, `workspace_id`, `action`, `user_id`, `created_at` | Audit trail for task updates and history. |
| **`subtasks`** | `id`, `task_id`, `title`, `completed` | Granular checklist items attached to parent tasks. |
| **`comments`** | `id`, `task_id`, `user_id`, `content`, `created_at` | User interactions and discussions on specific tasks. |
| **`notifications`** | `id`, `user_id`, `type`, `read`, `payload`, `created_at` | In-app alerts for assignments, mentions, and updates. |
| **`ai_generation_history`**| `id`, `user_id`, `goal`, `result`, `created_at` | Historical log of AI task breakdown requests. |
| **`subscriptions`** | `id`, `user_id`, `stripe_customer_id`, `plan`, `status`, `period_end` | Tracks user/workspace active Stripe subscriptions. |

---

## 💳 Subscription Plans

| Feature | Free | Pro ($12/mo) | Team ($29/mo) | Enterprise |
| :--- | :--- | :--- | :--- | :--- |
| **Workspaces** | 1 | Unlimited | Unlimited | Unlimited |
| **Members per Workspace**| Up to 3 | Up to 10 | Up to 50 | Custom |
| **Tasks / Month** | 50 | Unlimited | Unlimited | Unlimited |
| **AI Features & Chat**| ❌ | ✅ Included | ✅ Included | ✅ Custom Models |
| **Advanced Analytics** | ❌ | ❌ | ✅ Included | ✅ Included |
| **Support** | Community | Priority Email | Priority Email | Dedicated Account Manager|

---

## 📡 API Routes

All internal and public APIs are handled via Next.js Route Handlers in the `src/app/api` directory.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/ai/generate` | Generates a structured task list from a text goal | Yes |
| **POST** | `/api/ai/stream` | Streams responses for the AI chat assistant | Yes |
| **POST** | `/api/ai/reprioritize` | Analyzes and bulk reprioritizes an array of tasks| Yes |
| **GET / POST** | `/api/tasks` | Fetches or creates new tasks in a workspace | Yes |
| **PATCH / DELETE**| `/api/tasks/[id]` | Updates or deletes a specific task | Yes |
| **GET / POST** | `/api/workspaces` | Manages user workspaces | Yes |
| **GET** | `/api/notifications` | Retrieves unread user notifications | Yes |
| **POST** | `/api/webhooks/stripe`| Handles asynchronous Stripe billing events | No (Webhook Sign) |

---

## ☁️ Deployment

Taskora AI is natively optimized for **Vercel**.

1. Push your code to a GitHub/GitLab repository.
2. In Vercel, create a new project and import your repository.
3. Vercel will auto-detect the **Next.js** framework.
4. Add all required **Environment Variables** (from your `.env.local` file) into the Vercel project settings. Ensure you use production keys for Stripe, Resend, and Supabase.
5. Click **Deploy**. Vercel will automatically run `npm run build` and launch your application globally.

---

## 🔐 Security

Security is built into the core of Taskora AI:

- **Row Level Security (RLS):** Every Supabase table is protected by strictly defined RLS policies. Users can only fetch, mutate, and delete data explicitly connected to their user ID or authorized workspace roles.
- **Server-Side Authentication:** Protected routes and API endpoints verify user identity via strict SSR Cookie Middleware, preventing unauthenticated access.
- **Webhook Verification:** Stripe webhooks strictly validate cryptographic signatures before updating database subscription states, preventing spoofed billing updates.
- **API Key Proxying:** Sensitive keys (`GROQ_API_KEY`, `STRIPE_SECRET_KEY`) only live on the secure Node.js server environment and are _never_ exposed to the client.

---

## 🤝 Contributing

We welcome contributions to making Taskora AI better! 

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Commit your changes**: `git commit -m "Add some feature"`
4. **Push to the branch**: `git push origin feature/your-feature-name`
5. **Open a Pull Request** to the `main` branch.

Please make sure your code passes `npm run lint` and `npm run type-check` before submitting!

---

## 📝 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## 👨💻 Author

### DevMagic
- **Portfolio / Live Project:** [codewithgh.vercel.app](https://codewithgh.vercel.app)
- **Role:** Full-Stack Developer & CS Student

*Built with ❤️ by DevMagic*
