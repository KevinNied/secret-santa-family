# Secret Santa Family 🎅🎁

A modern, full-stack web app for organizing a **Secret Santa** (Amigo Invisible) with your family. Built with a clean, fun stack that's easy to deploy, fast to iterate, and uses technologies that are currently trending.

---

## 🚀 Tech Stack

### **Frontend + Backend (Full-stack in one place)**
- **Next.js 15** – App Router, React Server Components and **Server Actions** to handle backend logic without needing a separate server.
- **React 19** – Interactive, modern UI that's easy to maintain.
- **TailwindCSS** – Utility-first CSS for fast and consistent styling.
- **shadcn/ui** – Accessible UI components with modern design.

### **Database & Auth**
- **Supabase** – Postgres database + Auth + Storage. Perfect for a small but powerful project.

### **Emails**
- **Resend** – Modern, simple service with a free tier sufficient for sending "who you got" emails.

### **Deployment**
- **Vercel** – Perfect integration with Next.js. Instant deploys.

---

## 🧱 Project Structure
```
root
├── app/
│   ├── admin/[token]/    // Admin panel (token-based, no login)
│   ├── participant/[token]/ // Participant panel (token-based)
│   ├── create/           // Draw creation flow (3 steps)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx         // Landing page
├── components/           // Reusable UI components
│   └── ui/              // shadcn/ui components
├── actions/             // Server Actions
│   ├── draws.ts         // Create/manage draws
│   ├── participants.ts  // Add/remove participants
│   ├── assignments.ts   // Generate assignments
│   └── hints.ts         // Send anonymous hints
├── lib/
│   ├── db.ts            // Prisma client
│   ├── db/
│   │   └── queries.ts   // Database queries
│   ├── assignment/      // Secret Santa algorithm
│   │   ├── algorithm.ts // Assignment generation
│   │   └── validator.ts // Exclusion validation
│   ├── email/           // Email templates & sending
│   │   ├── send.ts
│   │   └── templates/
│   └── utils/           // Utility functions
├── prisma/
│   ├── schema.prisma    // Database schema
│   └── seed.ts          // Demo data
└── types/               // TypeScript types
```

See [SETUP.md](./SETUP.md) for complete setup instructions.

---

## 🛠️ Getting Started

### 1. Clone the repo
```
git clone https://github.com/YOUR_USER/secret-santa-family.git
cd secret-santa-family
```

### 2. Install dependencies
```
pnpm install
```

### 3. Environment variables
Copy the template and add your keys:
```bash
cp env.template .env.local
```
Then fill in your actual values in `.env.local`

### 4. Run in development
```
pnpm dev
```

### 5. Deploy to Vercel
```
vercel
```

---

## 📖 Documentation

- [SETUP.md](./SETUP.md) - Complete setup instructions
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture & data model
- [FEATURES.md](./FEATURES.md) - Features, roadmap, and ideas
- [PRISMA_GUIDE.md](./PRISMA_GUIDE.md) - Prisma quick reference
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment variables guide

---

## 📄 License
MIT
