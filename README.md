# Qivaro | Campus Lost & Found Network

Qivaro is the premier, high-performance Lost and Found network designed exclusively for academic campuses. Built to seamlessly connect students who have lost valuable items with those who have found them using real-time matching technology.

## Quick Links
- Technical Specifications: [TECHNICAL_README.md](./TECHNICAL_README.md)
- Platform Dashboard: [Local Preview](http://localhost:8080)
- Security Overview: [Database Policies](./supabase/migrations/)

## Key Features
- AI-Driven Matching: Automated scoring system that identifies potential matches between lost and found items.
- Student Verification: Secure onboarding using university registration numbers and departmental cross-referencing.
- Modern PWA: Installable on both Android and iOS devices directly from the browser for a native-app experience.
- Real-time Alerts: Instant notifications for match candidates and campus-wide alerts.

## Tech Stack
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion.
- Backend/DB: Supabase (PostgreSQL), PL/pgSQL Triggers, PostgREST.
- Architecture: Serverless BaaS with Edge Optimization.

## Development Setup

1. Install Dependencies:
   ```bash
   npm install
   ```

2. Environment Configuration:
   Create a .env file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

3. Start Project:
   ```bash
   npm run dev
   ```

## Security
The project implements Row Level Security (RLS). All database interactions are governed by server-side policies ensuring that student data is protected and private by default.

Version: 1.0.0
Project Owner: Bibekananda Behera
