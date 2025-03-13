This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Highlights
- Tech stack: Next.js App Router, Postgres, Prisma, Clerk & TypeScript
- Server Components, Layouts, Route Handlers, Server Actions
- Special Next.js files: loading.tsx, error.tsx, not-found.tsx
- API Integration using Route Handlers
- Data Fetching, Caching & Revalidation
- Client & Server Components
- Dynamic & Static Routes
- Styling with Tailwind & Shadcn
- Authentication & Authorization
- File Uploads with UploadThing
- Database Integration with Prisma
- Server Actions & Forms

## Steps
- Next.js, Tailwind;
- Autentication with Clerk, added secrets and auth middleware;
    - clerk.com
- ui.shadcn lib (Button, ToggleMode for theme);
- Navbar and tags with Tailwind
    - more Tailwind
    - use SSR for Navbar desctop for performance, and CSR for Navbar for interactivity
- Connecting to Postgres
    - use Neon, integrate prisma
    - instal Prisma locally
    - create schema with relationships locally
    - push schema to the Noen instance

