// Database Types for Finance Tracker

export interface Profile {
  id: string
  name: string
  email: string
  currency: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  date: string
  amount: number
  type: 'income' | 'expense'
  category: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Budget {
  id: string
  user_id: string
  month: string // Format: YYYY-MM
  budget_limit: number
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  user_id: string
  goal_name: string
  target_amount: number
  current_amount: number
  deadline?: string
  created_at: string
  updated_at: string
}

export interface RecurringTransaction {
  id: string
  user_id: string
  amount: number
  type: 'income' | 'expense'
  category: string
  interval_type: 'weekly' | 'monthly' | 'yearly'
  next_due_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  user_id?: string
  action: string
  table_name?: string
  record_id?: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  ip_address?: string
  user_agent?: string
  timestamp: string
}

export interface ExportLog {
  id: string
  user_id: string
  export_type: 'PDF' | 'CSV'
  export_date: string
  file_size?: number
  record_count?: number
}

// Form Types
export interface TransactionFormData {
  date: string
  amount: number
  type: 'income' | 'expense'
  category: string
  notes?: string
}

export interface BudgetFormData {
  month: string
  budget_limit: number
}

export interface GoalFormData {
  goal_name: string
  target_amount: number
  current_amount?: number
  deadline?: string
}

// Categories
export const TRANSACTION_CATEGORIES = [
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Income',
  'Savings',
  'Other'
] as const

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number]
