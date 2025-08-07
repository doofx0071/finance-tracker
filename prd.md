
---

# 📄 **Product Requirements Document (PRD) — Finance Tracker MVP**  
*(Supabase Auth + Context7 + Playwright + Codacy MCP + Theme — Web App Responsive for Tablet/Mobile)*  
---

## **1️⃣ Product Overview**

**Finance Tracker** is a **Filipino-made web-based personal finance app** that empowers users to log expenses, set budgets, track savings goals, and gain clear financial insights — all within a sleek, high-contrast black & white interface.

- **Primary Platform**: Web App (desktop-first, fully responsive)
- **Responsiveness**: Optimized for desktop, tablet, and mobile
- **Theme**: Monochrome — Black background, white text, grayscale accents
- **Authentication**: Supabase Auth (Email + Google/GitHub)
- **Tech Stack**: Next.js, Tailwind CSS, shadcn/ui, Recharts, Supabase, Vercel
- **QA & Testing**: Context7 MCP (theme), Playwright MCP (E2E), Codacy MCP (security/code quality)

---

## **2️⃣ Goals**

- ✅ Provide **secure, personalized accounts** via Supabase Auth
- ✅ Enable users to **log income & expenses**, set **monthly budgets**, and **track savings goals**
- ✅ Deliver **clear financial insights** via responsive, accessible charts
- ✅ Ensure **responsive layout** that works flawlessly across desktop, tablet, and mobile
- ✅ Enforce a **consistent black & white theme** with zero visual clutter
- ✅ Maintain **auditability and security** with logs for login, export, and user actions

---

## **3️⃣ Target Users**

- Individuals managing daily expenses
- Budget-conscious users saving for short/long-term goals
- Freelancers and micro-business owners tracking cash flow
- Privacy-focused users who value clean, minimal interfaces

---

## **4️⃣ Tech Stack**

| Layer             | Technology                                                                 |
|------------------|----------------------------------------------------------------------------|
| **Frontend**      | Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui            |
| **UI Components** | shadcn/ui (Radix-based), Lucide React (icons)                               |
| **Styling**       | Tailwind CSS + `globals.css` (black & white theme enforced)                 |
| **Backend**       | Supabase (PostgreSQL, Auth, REST APIs, Row Level Security)                  |
| **Charts**        | Recharts (responsive, accessible, no animations)                            |
| **Hosting**       | Vercel (automatic CI/CD, preview branches)                                  |
| **Export**        | PDF (via `react-pdf` or serverless function), CSV (Blob export)             |
| **Testing**       | Playwright (E2E), Context7 MCP (theme), Codacy MCP (linting/security)       |

---

## **5️⃣ Features (MVP)**

### **A. Authentication & User Management**

#### **1. Registration**
- **Fields**: `name`, `email`, `password`, `confirm password`
- **Flow**:
  - User submits form
  - Supabase creates Auth account
  - On success, insert `name`, `email`, `currency` into `profiles` table
- **Validation**:
  - Email format
  - Password ≥8 chars
  - Passwords match
  - Show inline error messages

#### **2. Login**
- **Fields**: `email`, `password`
- **Process**:
  - Supabase handles authentication
  - Session stored securely (HttpOnly cookie or secure localStorage)
  - Redirect to `/dashboard`

#### **3. UI**
- **Desktop**: Centered card with form
- **Tablet/Mobile**: Full-screen form, stacked inputs
- **Theme**: Black background, white inputs, gray borders
- **No animations** — clean, instant transitions

---

### **B. Transactions**

- Add, edit, delete transactions
- Fields: `date`, `amount`, `type` (income/expense), `category`, `notes`
- All transactions linked to `user_id` (private)
- **Form UI**:
  - Desktop: Side modal
  - Tablet/Mobile: Full-screen modal
- **Categories**: Food, Transport, Utilities, Income, Savings, etc.

---

### **C. Budget & Goals**

#### **Budget Planner**
- Set monthly budget per category or total
- Visual **progress bar** (non-animated) showing usage vs. limit
- Reset monthly

#### **Savings Goals**
- Create goals: `name`, `target`, `deadline`
- **Progress bar/circle** (static, no animation) showing current amount
- Manual or auto-update via income

---

### **D. Reports & Insights**

- **Charts (Recharts)**:
  - Pie: Spending by category
  - Line: Income vs. Expense over time
  - Bar: Top spending categories
- **Filters**: By date range, category
- **No chart transitions** — data updates instantly on filter change
- Responsive: Charts resize cleanly on tablet/mobile

---

### **E. Automation & Utilities**

- **Recurring Transactions**: Set up bills, subscriptions, salary
- **Export**:
  - PDF: Summary report (styled with Tailwind)
  - CSV: Raw transaction data
- **UI**:
  - Desktop: Export button in toolbar
  - Mobile/Tablet: Export in dropdown menu

---

### **F. Responsiveness & Theme**

| Device     | Layout                             | Navigation               |
|-----------|------------------------------------|--------------------------|
| **Desktop** | Sidebar + grid dashboard           | Left sidebar             |
| **Tablet**  | Collapsible sidebar, stacked cards | Hamburger toggle         |
| **Mobile**  | Single column, bottom nav          | Bottom navigation bar    |

- **Theme**:
  - Background: `#000000`
  - Text: `#FFFFFF`
  - Accents: `#333333`, `#CCCCCC`
  - No animations anywhere
  - All components follow shadcn/ui base styles (modified for monochrome)

---

## **6️⃣ Database Schema (Supabase)**

### **1. Profiles**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  currency TEXT DEFAULT 'PHP',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **2. Transactions**
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT CHECK (type IN ('income','expense')) NOT NULL,
  category TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **3. Budgets**
```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  budget_limit DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **4. Goals**
```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  goal_name TEXT NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  deadline DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **5. Recurring Transactions**
```sql
CREATE TABLE recurring_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT CHECK (type IN ('income','expense')) NOT NULL,
  category TEXT NOT NULL,
  interval TEXT CHECK (interval IN ('weekly','monthly','yearly')) NOT NULL,
  next_due_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **6. Audit Logs**
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- LOGIN_SUCCESS, EXPORT_DATA, etc.
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### **7. Export Logs**
```sql
CREATE TABLE export_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  export_type TEXT CHECK (export_type IN ('PDF','CSV')) NOT NULL,
  export_date TIMESTAMP DEFAULT NOW()
);
```

---

## **7️⃣ User Stories & Acceptance Criteria**

| Feature | Acceptance Criteria |
|--------|---------------------|
| **Login** | User logs in with email/password → redirected to dashboard |
| **Register** | Name, email, password saved → profile created in Supabase |
| **Add Transaction** | Form appears → data saved → list updates instantly |
| **View Budget** | Monthly limit shown → progress bar updates on transaction |
| **See Charts** | Charts render on load → resize on mobile → no animation |
| **Export Data** | Click export → CSV/PDF downloads → log entry created |
| **Responsive** | Layout adapts to desktop/tablet/mobile → no overflow |

---

## **8️⃣ Security & Compliance**

- 🔒 **HTTPS enforced**
- 🔐 **Supabase Auth** with short-lived JWTs and refresh tokens
- 🛡️ **Row Level Security (RLS)** enabled on all tables
- ✅ **Input validation** (client + server)
- 🧼 **XSS/SQLi prevention** via parameterized queries
- 📜 **Audit logs** for all sensitive actions
- 👤 **Profile data minimal** (no PII beyond name/email)

---

## **9️⃣ Testing Strategy**

### **A. Tools**
- **Context7 MCP**: Validate black & white theme
- **Playwright**: E2E responsive testing
- **Codacy MCP**: Code quality, security, linting

### **B. Playwright Test Plan**
```bash
# Test breakpoints
Desktop: 1280x720
Tablet:  768x1024
Mobile:  375x667
```
- ✅ Layout integrity
- ✅ Form visibility
- ✅ Chart rendering
- ✅ Modal behavior (no animation)

### **C. Context7 Theme Tests**
```js
// tests/context7/theme.test.js
import { test, expect } from '@context7/mcp';

test('Black background enforced', async ({ page }) => {
  await page.goto('/');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(0, 0, 0)');
});

test('White text enforced', async ({ page }) => {
  const color = await page.evaluate(() => getComputedStyle(document.body).color);
  expect(color).toBe('rgb(255, 255, 255)');
});
```

### **D. Codacy**
- Enforce TypeScript best practices
- Detect security vulnerabilities
- Prevent code smells

---

## **🔟 Installation & Setup**

### **Create App**
```bash
npx create-next-app@latest finance-tracker --typescript --eslint --app --tailwind
cd finance-tracker
```

### **Install Dependencies**
```bash
npm install @supabase/supabase-js lucide-react class-variance-authority clsx tailwind-merge
npm install @context7/mcp @playwright/test codacy-mcp --save-dev
npx playwright install
```

### **Supabase Setup**
```ts
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default supabase;
```

---

## **1️⃣1️⃣ Project Structure**
```
/app
  /auth
    /login/page.tsx
    /register/page.tsx
  /dashboard/page.tsx
  /transactions/page.tsx
  /budgets/page.tsx
  /reports/page.tsx
/components
  /ui          → shadcn/ui base
  /forms       → AuthForm, TransactionForm
  /charts      → PieChart, LineChart (no animations)
  /layout      → Sidebar, BottomNav
/hooks
  useAuth.ts
  useTransactions.ts
/lib
  supabase.ts
  utils.ts
/styles
  globals.css     → @import 'tailwindcss'; body { background: #000; color: #FFF; }
/tests
  /playwright
  /context7
```

---

## **1️⃣2️⃣ Final Notes**

- 🎨 **Design Philosophy**: Minimalist, functional, high-contrast — no distractions
- ⚙️ **Performance**: No animations = faster load, smoother UX
- 🌐 **Accessibility**: High contrast, semantic HTML, keyboard navigation
- 🔍 **Auditability**: Every export and login is logged
- 🚀 **Production Ready**: Secure, tested, scalable

---
