// Shared constants

export const TRANSACTION_TYPES = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
] as const

export const CATEGORIES = [
  // Income
  { value: 'Salary', type: 'income' },
  { value: 'Freelance', type: 'income' },
  { value: 'Investments', type: 'income' },
  { value: 'Other Income', type: 'income' },
  // Expense
  { value: 'Food', type: 'expense' },
  { value: 'Transport', type: 'expense' },
  { value: 'Bills', type: 'expense' },
  { value: 'Entertainment', type: 'expense' },
  { value: 'Health', type: 'expense' },
  { value: 'Shopping', type: 'expense' },
  { value: 'Education', type: 'expense' },
  { value: 'Other Expense', type: 'expense' },
] as const

