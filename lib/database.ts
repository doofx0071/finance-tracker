import { supabase } from './supabase'
import type { 
  Profile, 
  Transaction, 
  Budget, 
  Goal, 
  RecurringTransaction, 
  AuditLog, 
  ExportLog 
} from './types'

// Database utility functions for Finance Tracker

// Profile operations
export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    
    return data
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating profile:', error)
      return null
    }
    
    return data
  },

  async createProfile(profile: Omit<Profile, 'created_at' | 'updated_at'>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating profile:', error)
      return null
    }
    
    return data
  }
}

// Transaction operations
export const transactionService = {
  async getTransactions(userId: string, limit?: number): Promise<Transaction[]> {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
    
    if (limit) {
      query = query.limit(limit)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching transactions:', error)
      return []
    }
    
    return data || []
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating transaction:', error)
      return null
    }
    
    return data
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating transaction:', error)
      return null
    }
    
    return data
  },

  async deleteTransaction(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting transaction:', error)
      return false
    }
    
    return true
  }
}

// Budget operations
export const budgetService = {
  async getBudgets(userId: string): Promise<Budget[]> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .order('month', { ascending: false })
    
    if (error) {
      console.error('Error fetching budgets:', error)
      return []
    }
    
    return data || []
  },

  async getBudgetByMonth(userId: string, month: string): Promise<Budget | null> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('month', month)
      .single()
    
    if (error) {
      console.error('Error fetching budget:', error)
      return null
    }
    
    return data
  },

  async createBudget(budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>): Promise<Budget | null> {
    const { data, error } = await supabase
      .from('budgets')
      .insert(budget)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating budget:', error)
      return null
    }
    
    return data
  },

  async updateBudget(id: string, updates: Partial<Budget>): Promise<Budget | null> {
    const { data, error } = await supabase
      .from('budgets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating budget:', error)
      return null
    }
    
    return data
  }
}

// Goal operations
export const goalService = {
  async getGoals(userId: string): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching goals:', error)
      return []
    }
    
    return data || []
  },

  async createGoal(goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>): Promise<Goal | null> {
    const { data, error } = await supabase
      .from('goals')
      .insert(goal)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating goal:', error)
      return null
    }
    
    return data
  },

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | null> {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating goal:', error)
      return null
    }
    
    return data
  },

  async deleteGoal(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting goal:', error)
      return false
    }
    
    return true
  }
}

// Audit logging
export const auditService = {
  async logEvent(
    action: string,
    tableName?: string,
    recordId?: string,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>
  ): Promise<void> {
    try {
      await supabase.rpc('log_audit_event', {
        p_action: action,
        p_table_name: tableName,
        p_record_id: recordId,
        p_old_values: oldValues,
        p_new_values: newValues
      })
    } catch (error) {
      console.error('Error logging audit event:', error)
    }
  }
}
