# 🚀 DevAssess — Developer Assessment & Technical Hiring Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16%20(App%20Router)-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
</p>

A state-of-the-art developer assessment and technical hiring platform built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS**. Designed for evaluating engineering candidates through automated code challenges, real-time proctored examinations, and collaborative recruiter evaluation workflows.

---

## 📑 Table of Contents

- [🌟 Platform Overview](#-platform-overview)
- [✨ Core Modules & User Journeys](#-core-modules--user-journeys)
  - [1. 👨‍💻 Candidate Portal & Exam Sandbox](#1--candidate-portal--exam-sandbox)
  - [2. 🏢 Recruiter Console & Evaluation Workflow](#2--recruiter-console--evaluation-workflow)
  - [3. 🛡️ System Administration & Catalog Hub](#3-️-system-administration--catalog-hub)
- [⚡ Key Innovations & Architecture](#-key-innovations--architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Directory Structure](#-project-directory-structure)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [🚀 Quick Start & Local Setup](#-quick-start--local-setup)
- [👥 Demo Test Credentials](#-demo-test-credentials)
- [🌐 Deployment](#-deployment)
- [📄 License](#-license)

---

## 🌟 Platform Overview

**DevAssess** bridges the gap between hiring managers and top engineering talent:
* **Recruiters** dispatch multi-candidate assessment invitations, track real-time test progress, inspect code submissions with AST analysis, and submit hiring verdicts.
* **Candidates** receive tokenized proctored exam invites, solve multi-language algorithmic problems in an interactive code runner, and track their certification status.
* **Administrators** maintain user role privileges, author problem catalogs, monitor real-time anti-cheat telemetry, and inspect audit logs.

---

## ✨ Core Modules & User Journeys

### 1. 👨‍💻 Candidate Portal & Exam Sandbox

* **Role-Adaptive Dashboard:**
  * **Dynamic KPI Stat Cards:** Instant metrics for *Active Challenges*, *Completed Tests*, *Average Score*, and *Coding Streak* featuring smooth micro-interactions and gradient aesthetics.
  * **Active Assessment Hero Card:** Shows pending recruiter invitation, challenge time limit, difficulty, required skills, and one-click entrance to the exam room.
  * **Real-time Recruiter Verdict Synchronization:** Live status badges that reflect recruiter decisions:
    * ⏳ `Under Recruiter Review`
    * 🎉 `Accepted by Recruiter`
    * ❌ `Declined`
    * ✓ `Passed / Completed`
  * **Evaluation History & Scores:** Detailed timeline of previous submissions with individual score progress bars and skill badges.

* **Proctored Assessment Room (`/assessment/attempt`):**
  * **Multi-Language Sandbox:** Code execution and syntax highlighting for **JavaScript**, **TypeScript**, and **Python**.
  * **Live Unit Test Runner:** Verifies candidate solutions against sample and hidden test cases with execution time metrics.
  * **Anti-Cheat Telemetry:** Detects and flags tab switching, focus loss, paste anomalies, and excessive latency.

---

### 2. 🏢 Recruiter Console & Evaluation Workflow

* **Bulk Candidate Invitation Modal:**
  * **Multi-Select & Bulk Dispatch:** Select individual candidates or use **"Select All / Deselect All"** with real-time candidate chip previews.
  * **Dynamic Credit Tracking:** Live computation showing remaining recruiter assessment balance.
  * **Direct Database Synchronization:** Validates assessment UUIDs and persists invitations directly to the PostgreSQL `assessment_invitations` table.
  * **Auto-Provisioning & Renewal:** Automatically creates recruiter/candidate profiles if missing and renews existing invitations with fresh tokens.

* **Candidate Evaluation Queue:**
  * Filter candidate submissions by challenge, candidate name, hiring status, or anti-cheat flags.
  * **Instant Verdict Updating:** Dropdown menu allowing recruiters to transition candidate state (`Accepted ✓`, `Under Review`, `Rejected`) in real time.
  * **Detailed Code & Test Inspector:** Review candidate source code, test-case pass rates, execution efficiency, and leave private recruiter evaluation notes.

---

### 3. 🛡️ System Administration & Catalog Hub

* **User Management & Role Switching:**
  * View, filter, and manage users across `ADMIN`, `RECRUITER`, and `CANDIDATE` roles.
  * Instant portal switcher to test views and workflows as different roles without logging out.
* **Assessment & Question Catalog:**
  * Create, edit, and publish coding challenges with custom benchmark constraints and time limits.
* **Audit Trails & Security:**
  * Real-time logging of user logins, role modifications, invitation dispatches, and anti-cheat triggers.

---

## ⚡ Key Innovations & Architecture

1. **Dual-Layer Persistence (PostgreSQL + Local Cache):**  
   Every transaction syncs directly with PostgreSQL via Prisma ORM on the backend, with client-side reactive caches ensuring smooth offline and low-latency interaction.
2. **Strict Email-Attributed Scoping:**  
   Candidate stats, past submissions, and active invitations are strictly filtered by normalized candidate email addresses to eliminate cross-profile data leakage.
3. **One-Click Demo Authentication:**  
   Pre-configured single-click demo logins for all three primary roles (`Admin`, `Recruiter`, `Candidate`) that automatically authenticate against the live backend database.

---

## 🛠️ Tech Stack

### Frontend Architecture
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) | React Server & Client Components, Turbopack |
| **Core UI** | [React 19](https://react.dev) | Modern reactive state and transitions |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) | Dynamic styling, glassmorphism, gradient tokens |
| **Icons** | [Lucide React](https://lucide.dev) | Modern vector icon set |
| **State Management** | [TanStack React Query v5](https://tanstack.com/query) | Server-state caching, automatic refetching |
| **Form Handling** | [TanStack Form](https://tanstack.com/form) + [Zod](https://zod.dev) | Strict type-safe form validation |
| **HTTP Client** | [ofetch](https://github.com/unjs/ofetch) | HTTP request client with Bearer auth handling |
| **Linter & Formatter** | [Biome](https://biomejs.dev) | High-performance code quality tooling |

### Backend & Database (Microservice)
| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime** | Node.js + Express.js | REST API service layer |
| **Database** | PostgreSQL (Supabase / Prisma Data Platform) | Primary relational data store |
| **ORM** | Prisma ORM | Type-safe database queries and migrations |
| **Auth** | JWT (JSON Web Tokens) + Bcrypt | Secure authentication and password hashing |

---

## 📂 Project Directory Structure

```text
a6-developer-frontend-a7/
├── src/
│   ├── api/                              # Centralized API service methods
│   │   ├── auth.api.ts                   # User authentication & profile fetching
│   │   ├── assessment.api.ts             # Assessments, invitations & question APIs
│   │   └── payment.api.ts                # Payment transactions & credit billing
│   ├── app/                              # Next.js App Router structure
│   │   ├── (public)/                     # Public marketing & authentication routes
│   │   │   ├── login/                    # Login portal with 1-click demo buttons
│   │   │   └── register/                 # Candidate registration
│   │   ├── admin/                        # Admin dashboard, user management & audit
│   │   ├── recruiter/                    # Recruiter console & candidate evaluation
│   │   ├── dashboard/                    # Candidate adaptive dashboard & profile
│   │   └── assessment/                   # Assessment exam runner sandbox
│   ├── components/                       # Modular UI components
│   │   ├── form/                         # Form modules (Login, Registration, etc.)
│   │   ├── layout/                       # Navbars, Sidebars, Footers & Shells
│   │   ├── modules/                      # Domain-specific components
│   │   │   ├── candidate-dashboard/      # Adaptive KPI cards & live verdict views
│   │   │   ├── recruiter-evaluations/    # Multi-select invite modal & task queue
│   │   │   ├── admin-manage/             # User tables & assessment editor
│   │   │   └── admin-reports/            # Telemetry & security audit logs
│   │   └── ui/                           # Atomic primitives (Button, Card, Badge, Modal)
│   ├── hooks/                            # Custom React hooks (auth, filters, mutations)
│   ├── lib/                              # Session helpers, ofetch apiClient, utility logic
│   └── middleware.ts                     # Role-based route guard & cookie protection
├── public/                               # Static brand assets, favicon, mock files
├── .env.local                            # Local environment configuration
├── package.json                          # Dependencies and build scripts
└── tsconfig.json                         # TypeScript compiler configuration
```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Backend REST API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

> **Production Deployment:**  
> Set `NEXT_PUBLIC_API_BASE_URL` to your production backend endpoint (e.g. `https://your-api.domain.com/api/v1`).

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
```

### 3. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 👥 Demo Test Credentials

You can use the **1-Click Quick Demo Login** buttons on the login screen (`/login`) or sign in manually with these pre-seeded accounts:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@100.com` | `Password@100` | Full administrative control, user permissions, audit telemetry |
| **Recruiter** | `recruiter@100.com` | `Password@100` | Candidate invitations, evaluation queue, score verdicts |
| **Candidate** | `candidate@100.com` | `Password@100` | Assessment test room, live dashboard, submissions |
| **Candidate (Amy)** | `scstanley17111991@gmail.com` | `Password@100` | Pre-registered candidate with active assessment history |

---

## 🌐 Deployment

This application is optimized for deployment on **Vercel**:

1. Push your latest commits to your GitHub repository.
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Configure the **Environment Variables**:
   * `NEXT_PUBLIC_API_BASE_URL`: Your live backend API URL.
4. Click **Deploy**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
