# Qivaro

Qivaro is the premier Lost and Found network designed exclusively for Lovely Professional University. Built to seamlessly connect students who have lost valuable items with those who have found them.

## Tech Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Supabase (Backend & Database)

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables
Create a `.env` file in the root of your project based on `.env.example`:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Features
- **Modern Gen-Z Aesthetic**: Fast, beautiful, and fully responsive UI for mobile devices.
- **Reporting System**: Distinct flows for dropping pins on found items vs seeking lost items.
- **Matching Algorithm**: Quickly browse and filter the public dashboard.
- **Progressive Web App**: Fully installable on iOS and Android from the browser.
- **Secure Architecture**: Row Level Security explicitly configured to block public manipulation of active campus reports.
