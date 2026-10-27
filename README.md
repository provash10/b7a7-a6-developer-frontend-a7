# 🚀 DevAssess — Developer Assessment & Remote Hiring Platform

A modern, high-performance developer assessment and technical hiring platform built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS**. Designed for evaluating engineering candidates through automated code challenges, real-time proctored examinations, and collaborative recruiter evaluation workflows.

---

## 📑 Table of Contents

- [✨ Key Features by Category](#-key-features-by-category)
  - [👨‍💻 Candidate Portal & Exam Sandbox](#1-candidate-portal--exam-sandbox)
  - [🏢 Recruiter Console & Evaluation Queue](#2-recruiter-console--evaluation-queue)
  - [🛡️ Admin Intelligence & System Management](#3-admin-intelligence--system-management)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
- [📂 Project Directory Structure](#-project-directory-structure)
- [⚙️ Environment Variables](#️-environment-variables)
- [🚀 Quick Start & Local Setup](#-quick-start--local-setup)
- [🌐 Production Deployment (Vercel)](#-production-deployment-vercel)
- [👥 Demo Test Credentials](#-demo-test-credentials)

---

## ✨ Key Features by Category

### 1. 👨‍💻 Candidate Portal & Exam Sandbox
- **Adaptive Role Dashboard:**
  - **Dynamic KPI Stat Cards:** Real-time metrics for *Active Assessments*, *Completed Tests*, *Average Score*, and *Coding Streak* with bold typography, custom dual-tone gradients, and micro-hover animations.
  - **Hero Assessment Invitation Card:** Displays tokenized invitation alerts, challenge difficulty, time limits, required tech stacks, and anti-cheat status.
  - **Live Verdict Synchronization:** Instant visual badges reflecting recruiter decisions in real time:
    - ⏳ `Under Recruiter Review`
    - 🎉 `Accepted by Recruiter`
    - ❌ `Evaluation Declined`
    - ✓ `Exam Completed & Submitted`
  - **Score Progress Bars & History:** Interactive timeline of all previous challenges with score progress bars, test metrics, and skill tags.
- **Proctored Coding Exam Room:**
  - Tokenized assessment entrance (`/assessment/attempt?id=...&token=...`).
  - Integrated code editor supporting JavaScript, TypeScript, and Python.
  - Real-time test-case runner with unit test verification and AST syntax validation.
  - Anti-cheat telemetry tracking tab-switches and submission latency.

---

### 2. 🏢 Recruiter Console & Evaluation Queue
- **Candidate Evaluation Task Queue:**
  - Instant search and multi-criteria filters by role, challenge, status, and anti-cheat telemetry.
  - In-place **Review Verdict Dropdown** (`Pending`, `In Review`, `Accept`, `Reject`) that updates candidate views and database state in real time.
  - Detailed **Score & Review Modal** for inspecting unit test results, code structure, and submitting final hiring decisions.
- **Candidate Invitation System:**
  - Send tokenized assessment links with configurable expiry deadlines.
  - **Saved Candidates Dropdown:** Quick-pick menu with checkmarks to invite previously saved candidates with a single click.
  - Automatic local and cloud synchronization.
- **Recruiter Credit Management:**
  - Credit recharge banner with bKash tokenized integration.

---

### 3. 🛡️ Admin Intelligence & System Management
- **Directory & Permission Hub:**
  - Centralized user directory with multi-role permissions (`ADMIN`, `RECRUITER`, `CANDIDATE`).
  - Active session switcher for previewing portal states across roles without relogging.
- **Assessment & Question Bank:**
  - CRUD operations for coding assessments, problem descriptions, benchmark test cases, and supported programming languages.
- **Audit Logs & Telemetry:**
  - Real-time audit trail capturing administrative modifications, scoring actions, and anti-cheat alerts.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org) (Turbopack) | Modern React framework with App Router and Server/Client Components |
| **Library** | [React 19](https://react.dev) | Modern reactive UI foundation |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) | Utility-first CSS engine with custom glassmorphism and gradient systems |
| **Icons** | [Lucide React](https://lucide.dev) | Crisp, modern vector icons |
| **State & Data** | [TanStack React Query](https://tanstack.com/query) | Async state synchronization, caching, and server state management |
| **Forms & Schema** | [TanStack Form](https://tanstack.com/form) + [Zod](https://zod.dev) | Type-safe form validation and schema parsing |
| **Network Client** | [ofetch](https://github.com/unjs/ofetch) | Lightweight, robust HTTP client |
| **Code Quality** | [Biome](https://biomejs.dev) | High-speed linter and code formatter |

---

## 📂 Project Directory Structure

```text
a6-developer-frontend-a7/
├── src/
│   ├── api/                    # Centralized API service functions
│   │   ├── auth.api.ts         # User authentication & token management
│   │   └── assessment.api.ts   # Assessment, attempts, and question endpoints
│   ├── app/                    # Next.js App Router pages
│   │   ├── (public)/           # Public landing and authentication pages
│   │   ├── admin/              # Admin intelligence & management portal
│   │   ├── recruiter/          # Recruiter evaluation & invitation portal
│   │   ├── dashboard/          # Candidate dashboard & profile pages
│   │   └── assessment/         # Assessment exam room & test runners
│   ├── components/             # Reusable UI component modules
│   │   ├── layout/             # Header, sidebar, and dashboard shell
│   │   ├── modules/            # Domain-specific feature modules
│   │   │   ├── candidate-dashboard/   # Adaptive cards & verdict UI
│   │   │   ├── recruiter-evaluations/ # Task queue & invite modals
│   │   │   ├── admin-manage/          # Users & question bank tables
│   │   │   └── admin-reports/         # Audit logs & telemetry view
│   │   └── ui/                 # Atomic design components (Card, Badge, Button, etc.)
│   ├── hooks/                  # Custom React hooks (URL state, table filters)
│   ├── lib/                    # Client utilities, session helpers, and API client
│   └── middleware.ts           # Route protection, role-based access & cookie guards
├── public/                     # Static media assets & badges
├── Docs/                       # System documentation and workflow guides
├── .env.local                  # Environment configuration
└── package.json                # Project dependencies and script definitions
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# Backend REST API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

> **For Production (Vercel):**  
> Replace `http://localhost:5000/api/v1` with your live backend production URL (e.g. `https://your-backend.vercel.app/api/v1`).

---

## 🚀 Quick Start & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/provash10/b7a7-a6-developer-frontend-a7.git
cd a6-developer-frontend-a7
```

### 2. Install dependencies
```bash
npm install
# or
bun install
```

### 3. Start the development server
```bash
npm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🌐 Production Deployment (Vercel)

Deploying this Next.js frontend to **Vercel** takes just a few steps:

### Option A: Via Vercel CLI
```bash
# 1. Login to Vercel (if not already logged in)
npx vercel login

# 2. Deploy to production
npx vercel --prod
```

### Option B: Via Vercel Git Integration
1. Push your code to your GitHub / GitLab repository.
2. Visit [Vercel Dashboard](https://vercel.com/new) and click **"Add New"** > **"Project"**.
3. Import this repository.
4. Under **Environment Variables**, add:
   - **Key:** `NEXT_PUBLIC_API_BASE_URL`
   - **Value:** `https://your-backend.vercel.app/api/v1`
5. Click **"Deploy"**.

---

## 👥 Demo Test Credentials

You can use the built-in portal switcher in the bottom-left sidebar or sign in using these demo accounts:

| Portal Role | Demo Email | Access Permissions |
| :--- | :--- | :--- |
| **System Admin** | `admin@100.com` | Full platform control, directory management, questions, audit logs |
| **Recruiter** | `recruiter@100.com` | Candidate invitations, code evaluation queue, scoring verdicts |
| **Candidate** | `candidate@100.com` | Assessment test room, live dashboard, submissions, certification |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
