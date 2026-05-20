# dms-assessment

## Overview

This repository contains the **Frontend Engineer Take‑Home Assessment** implementation – a full‑stack Security Operations Center (SOC) alerts dashboard. The project is built with a monorepo structure using **Turbo** and **pnpm**:
- `web/apps/web` – Next.js frontend application.
- `web/apps/api` – Express API backend.
- `web/packages/ui` – Shared UI component library.

## Live Demo

- **Frontend (Vercel):** <https://dms-assessment.vercel.app/>
- **Backend (Render):** <https://dms-assessment.onrender.com/>

## Getting Started

### Prerequisites

- **Node.js** >= 20
- **pnpm** (recommended) – you can install it with `npm i -g pnpm`.

### Installation

```bash
# Clone the repository
git clone <repo‑url>
cd dms-assessment

# Install all workspace dependencies
pnpm install
```

### Running Locally

From the repository root, start each app in its own terminal:

```bash
# In one terminal
cd web/apps/api
pnpm dev

# In another terminal
cd web/apps/web
pnpm dev
```

This will launch both the API (`web/apps/api`) and the Next.js frontend (`web/apps/web`) with hot‑reloading. The frontend is typically available at `http://localhost:3000` and the API at `http://localhost:4000` (or as configured in the `.env` file).

## Project Structure

```
web/
├─ apps/
│  ├─ api/      # Express backend
│  └─ web/      # Next.js frontend
└─ packages/
   └─ ui/       # Shared UI component library
```

## Environment Variables

Create `.env` files in each of `web` and `api` folders, using the sample files `web/apps/api/.env.example` and `web/apps/web/.env.example` as references.

---

Feel free to explore the code, run the app locally, and compare it with the live deployment links above.