
## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **pnpm** / **yarn**

### 2. Installation
```bash
# Clone the repository

# Install dependencies
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```
*(Note: If left empty, the application automatically uses local fallback mode without breaking).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 🗄️ Database Setup (Supabase)

To enable live persistence for wishes, flower counts, and RSVPs:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Copy and run the SQL code from [`supabase_schema.sql`](supabase_schema.sql).
4. From **Project Settings -> API**, copy your **Project URL** and **anon public key** into your `.env` file or hosting provider's environment settings.

---

## 🌐 Deployment to Vercel (Custom Domain)

1. Import the repository `princekumar828/wedding-invite-deepasumit` in [Vercel](https://vercel.com/new).
2. Add your environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
3. Deploy!
4. Under **Project Settings -> Domains**, add `deepasumit.in` and follow the DNS instructions for your domain registrar.

---
