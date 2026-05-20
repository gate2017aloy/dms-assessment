# SOC Alerts Dashboard

## Deliverables

- **Live Frontend (Vercel):** [https://dms-assessment-git-main-gate2017aloys-projects.vercel.app](https://dms-assessment-git-main-gate2017aloys-projects.vercel.app)
- **Live Backend (Render):** [https://dms-assessment.onrender.com/](https://dms-assessment.onrender.com/)
- **Source Repository:** Submitted Git repository (`dms-assessment`)
- **Analyst Credentials:** 
  - Email: `analyst@soc.com`
  - Password: `password123`

---

## 1. Architecture & Tech Stack

I went with a monorepo setup using Turborepo and pnpm to keep things organized. The project is split into three main parts:

- **Frontend (`web/apps/web`):** Built with Next.js. For the UI, I used shadcn/ui and Tailwind CSS. It gave me a quick way to build clean, consistent components without writing everything from scratch.
- **Backend (`web/apps/api`):** I ended up using Express.js. While Next.js API routes are great, pulling the backend out into its own Express app felt like the right move for a more traditional setup (Controllers -> Services -> Data). It's easier to test and scale this way.
- **Shared Types (`web/packages/*`):** One of the biggest wins of the monorepo is sharing TypeScript types and UI components across the stack. It ensures the frontend and backend are on the same page when it comes to the data structures.

For the database, I went with Prisma and an in-memory SQLite setup. It keeps things simple for anyone running the project locally—no extra Docker containers or Postgres setups required. 

For auth, I stuck to the basics: JWTs stored in HTTP-only cookies. It's a standard and secure way to handle sessions without exposing tokens to XSS.

### Generating the Data
I wrote a seed script (`web/apps/api/prisma/seed.ts`) that runs when the backend starts. It uses weighted random generation to build out 1000 realistic alerts. You'll see a lot of 'info' and 'low' severity stuff, and only a few 'critical' alerts, which is pretty typical for a SOC. The script also builds out the `raw_event` JSON payloads with randomized IPs and domains.

---

## 2. What I Built vs. What I Cut

**What made it in:**
- **API:** Standard REST endpoints that handle pagination, sorting, and filtering. Used Zod for validation.
- **Headless UI:** I pulled a lot of the complex state logic for the dashboard and alert lists into custom hooks (`useAlerts`, `useAlertDetail`). It keeps the components clean and separates the data fetching from the visuals.
- **UI Details:** Added things like loading skeletons, empty states, and error handling. Filters sync to the URL so you can share links to specific views. There's also a syntax-highlighted JSON viewer for digging into the raw events.
- **Triage Workflow:** The alert detail view is split so an analyst can review the raw event on one side while updating the status or severity on the other, or just one-click dismiss it as a false positive.

**What I skipped (due to time):**
- **Real-time updates:** Didn't have time for WebSockets, so you'll have to rely on standard refetching for now.
- **Bulk actions:** The table is nice, but bulk-selecting rows to update them all at once was cut. I focused on getting the single-alert flow right first.
- **Automated tests:** Skipped writing unit and e2e tests to prioritize getting the core app functional.
- **Complex charts:** Kept the dashboard simple with summary stats rather than wiring up a heavy charting library.

---

## 3. Trade-offs

- **In-Memory SQLite vs. Postgres:** SQLite made it easy to package the app, but any changes (like updating an alert status) reset when the server restarts. In the real world, this would just be a Postgres database.
- **Express vs. Next.js backend:** Moving to Express added some deployment overhead (I had to deploy to both Vercel and Render), but it kept the backend code much cleaner than trying to cram all the business logic into Next.js API routes.
- **URL State Syncing:** Syncing state to the URL adds a bit of complexity to the React side of things, but it's a huge UX improvement since users can bookmark or share their current view.

---

## 4. Future Improvements

If I had a few more hours, here's what I'd tackle:
1. **WebSockets:** Getting alerts to push to the client in real-time as they're generated.
2. **Persistent Database:** Swapping SQLite for a real Postgres instance so data changes stick around.
3. **Bulk Actions:** Letting analysts resolve dozens of low-priority alerts with a single click.
4. **End-to-End Tests:** Adding Playwright to cover the main happy paths (login, filter, resolve alert).

---

## 5. Final Thoughts

I'm pretty happy with how the headless component setup and the monorepo turned out. Extracting that logic into hooks made the codebase a lot easier to manage, and sharing types between the frontend and backend is always a win. The split-view for the alert details also ended up feeling really nice for quick triaging.

The only real bump in the road was getting the Express app to deploy smoothly in the monorepo setup on the free-tier platforms. It took some fiddling with build commands that ate up time I would have rather spent building out a timeline chart, but in the end, having a decoupled backend was worth the hassle.
