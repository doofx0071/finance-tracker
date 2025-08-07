# Finance Tracker Database Setup

This directory contains the database schema and migrations for the Finance Tracker application.

## Database Schema Overview

### Core Tables

1. **profiles** - User profile information
   - Extends Supabase auth.users
   - Stores name, email, currency preference
   - Automatically created on user signup

2. **transactions** - Income and expense records
   - Links to user via user_id
   - Supports income/expense types
   - Categorized transactions with optional notes

3. **budgets** - Monthly budget limits
   - One budget per user per month
   - Tracks spending limits by month

4. **goals** - Savings goals with targets
   - User-defined savings goals
   - Tracks progress toward target amounts
   - Optional deadlines

5. **recurring_transactions** - Automated transactions
   - Weekly, monthly, or yearly recurring transactions
   - Can be activated/deactivated

6. **audit_logs** - Security and compliance tracking
   - Logs all important user actions
   - Includes IP address and user agent
   - Automatic logging via triggers

7. **export_logs** - Export history tracking
   - Tracks PDF and CSV exports
   - File size and record count metadata

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Automatic profile creation on signup
- Audit logging for compliance
- Secure function execution

## Migration Files

1. `001_initial_schema.sql` - Core tables (profiles, transactions)
2. `002_additional_tables.sql` - Additional tables (budgets, goals, etc.)
3. `003_rls_policies.sql` - Security policies and triggers

## Setup Instructions

### Option 1: Manual Setup (Recommended)

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run each migration file in order:
   - Copy and paste `001_initial_schema.sql`
   - Copy and paste `002_additional_tables.sql`
   - Copy and paste `003_rls_policies.sql`

### Option 2: Using Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Initialize Supabase in your project
supabase init

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations
supabase db push
```

## Verification

After running the migrations, verify the setup:

1. Check that all tables are created in the Supabase dashboard
2. Verify RLS policies are enabled
3. Test user signup creates a profile automatically
4. Confirm users can only see their own data

## Environment Variables

Make sure your `.env.local` file contains:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Functions

The schema includes several utility functions:

- `handle_updated_at()` - Automatically updates updated_at timestamps
- `handle_new_user()` - Creates profile on user signup
- `log_audit_event()` - Logs audit events for compliance

## Next Steps

After setting up the database:

1. Test the authentication flow
2. Implement transaction CRUD operations
3. Add budget and goal management
4. Set up audit logging in the application
5. Implement export functionality
