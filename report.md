# SOC Alerts Dashboard

## Deliverables

- **Live Frontend (Vercel):** [https://dms-assessment-git-main-gate2017aloys-projects.vercel.app](https://dms-assessment-git-main-gate2017aloys-projects.vercel.app)
- **Live Backend (Render):** [https://dms-assessment.onrender.com/](https://dms-assessment.onrender.com/)
- **Source Repository:** Available in the submitted Git repository (`dms-assessment`).
- **Analyst Credentials:** 
  - **Email:** `analyst@soc.com`
  - **Password:** `password123`

---

## 1. Architecture & Main Tech Choices

To ensure a clean separation of concerns and a robust development experience, I adopted a **Monorepo Architecture** powered by **Turborepo** and **pnpm**. The project is split into three main packages:

- **Frontend (`web/apps/web`):** Built with **Next.js**. It provides a highly interactive and responsive user interface. For styling and UI components, I utilized a shared component library built on top of Tailwind CSS and Radix UI primitives (similar to shadcn/ui), ensuring accessible and visually consistent components.
- **Backend (`web/apps/api`):** Built with **Express.js**. Initially, Next.js API routes might seem sufficient, but extracting the backend to a dedicated Express server allowed for a more traditional layered architecture (Controllers -> Services -> Data/Repository). This decoupled architecture improves testability and prepares the system for independent scaling.
- **Shared Types & UI (`web/packages/*`):** A critical architectural choice was to share TypeScript definitions and UI components across the monorepo. This prevents duplication and ensures the frontend and backend are always in sync regarding data contracts (e.g., Alert schemas).

**Database & ORM:** I utilized **Prisma** with an **in-memory SQLite** database. This provided type-safe queries and rapid iteration while requiring zero external dependencies to run the project.

**Authentication:** Implemented a secure, standard approach using **JWTs stored in HTTP-only cookies**. This prevents XSS attacks from easily accessing the token while maintaining a smooth session experience.

### Data Generation Approach
The dataset is generated dynamically upon the backend server's startup via a custom script (`web/apps/api/prisma/seed.ts`). I intentionally avoided static JSON files or LLM generation at runtime. Instead, the script uses **weighted randomization** to accurately simulate a SOC environment (e.g., generating a long tail of 'info'/'low' alerts and rare 'critical' alerts). It selects from various attack templates (Malware, Phishing, Unauthorized Access) and generates deeply nested, realistic `raw_event` JSON payloads complete with randomized IPs, hostnames, and domains. Exactly 1000 records are seeded on every fresh start.

---

## 2. What I Built vs. What I Cut

**Built:**
- **Robust API:** Fully paginated, sortable, and filterable endpoints with rigorous payload validation using **Zod**. 
- **Headless UI Architecture:** The complex state management for the Dashboard, Alerts List, and Alert Details views was extracted into custom React hooks (`useAlerts`, `useAlertDetail`). This decouples data fetching, filtering, and side effects from the visual representation.
- **Polished UI/UX:** Implemented skeleton loading states, informative empty states, seamless error handling, URL-synced filters (making views shareable), and a collapsible, syntax-highlighted JSON viewer for raw events.
- **Actionable Details:** A split-view Alert Detail pane that allows an analyst to quickly change severity/status, assign themselves, or execute a one-click "False Positive" dismissal.

**Cut (Given the 6-8 hr constraint):**
- **Real-time updates:** Polling or WebSockets were omitted in favor of standard refetching upon actions.
- **Bulk Actions:** While the table is robust, selecting multiple rows to dismiss them simultaneously was cut to prioritize the core single-alert triage experience.
- **Automated Tests:** Comprehensive unit and e2e testing was scoped out to focus on architecture and product completeness.
- **Complex Charting:** The dashboard focuses on clean, aggregated summary statistics and distribution bars rather than implementing a heavy charting library for timeline trends.

---

## 3. Key Trade-offs and Decisions

- **In-Memory SQLite vs. Persistent DB (PostgreSQL):** I chose an in-memory database to make the assessment incredibly easy to evaluate and run locally. The trade-off is that data mutations (like changing an alert's status) do not survive a server restart. In a production environment, simply changing the Prisma provider to Postgres would resolve this.
- **Express vs. Next.js Route Handlers:** I explicitly migrated the API out of Next.js into a standalone Express app. Next.js API routes are convenient, but mixing heavy backend business logic (like layered services) into a frontend framework can become unwieldy. The trade-off was increased deployment complexity (deploying on Vercel *and* Render), but the architectural cleanliness was worth it.
- **URL State Syncing:** I decided to sync list filters (severity, status, pagination) to the URL search parameters. This requires slightly more complex state management hook logic but creates a significantly better UX, as analysts can bookmark or share specific filtered views with their peers.

---

## 4. What I'd Tackle Next With More Time

1. **Real-time Engine:** I would integrate WebSockets (or Server-Sent Events) so that when a new alert is generated by a detection system, it instantly appears on the analyst's dashboard without requiring a page refresh.
2. **PostgreSQL Persistence:** Swap the SQLite in-memory database for a managed PostgreSQL instance to persist state across sessions and deployments.
3. **Advanced Triage Workflows:** Implement bulk actions (e.g., selecting 50 "low" severity firewall alerts and marking them all as false positives at once).
4. **End-to-End Testing:** Add Playwright to ensure the critical paths (login -> filter alerts -> view details -> resolve alert) remain unbroken.

---

## 5. Reflections

**What I'm proud of:**
I am particularly proud of the **Headless Component Architecture** and the **Monorepo setup**. By extracting complex logic into hooks and sharing types globally between the Next.js frontend and Express backend, the codebase remains incredibly readable and maintainable. The split-view Alert Detail interface also feels very premium and highly practical for an analyst who needs to reference JSON data while simultaneously updating alert statuses.

**What didn't go as hoped:**
Deploying the standalone Express app in a monorepo setup to free-tier cloud providers presented minor friction (specifically getting build drivers on platforms like Railway/Render to recognize the sub-directory build steps). It took a bit of extra configuration time that I would have rather spent building out a timeline chart for the dashboard. However, resolving it resulted in a much cleaner overall deployment architecture.
