import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { prisma } from './lib/prisma.js';
import { authRouter } from './routes/auth.js';
import { dashboardRouter } from './routes/dashboard.js';
import { alertsRouter } from './routes/alerts.js';
import { seed } from '../prisma/seed.js';

const app = express();
const PORT = process.env.PORT || 4000;

// --- Middleware ---
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Required for cookie-based auth
}));
app.use(express.json());
app.use(cookieParser());

// --- Routes ---
// Auth routes mounted at /api (login, logout) — keeps backward compat with frontend
app.use('/api', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/alerts', alertsRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Create tables in the in-memory SQLite database using raw SQL.
 * This is necessary because `prisma db push` runs as a separate process
 * and gets its own in-memory DB that doesn't share with this process.
 */
async function createTables() {
  console.log('📦 Creating tables in in-memory database...');

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL,
      "passwordHash" TEXT NOT NULL,
      "name" TEXT NOT NULL
    )
  `);
  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")
  `);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Alert" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "timestamp" DATETIME NOT NULL,
      "title" TEXT NOT NULL,
      "severity" TEXT NOT NULL,
      "status" TEXT NOT NULL,
      "category" TEXT NOT NULL,
      "source" TEXT NOT NULL,
      "affectedAsset" TEXT NOT NULL,
      "assignee" TEXT,
      "description" TEXT NOT NULL,
      "rawEvent" TEXT NOT NULL
    )
  `);

  console.log('✅ Tables created successfully');
}

// --- Startup ---
async function start() {
  try {
    // Create tables in the in-memory SQLite DB
    await createTables();

    // Seed the in-memory database
    await seed(prisma);

    app.listen(PORT, () => {
      console.log(`🚀 API server running on http://localhost:${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start API server:', error);
    process.exit(1);
  }
}

start();
