import { supabase } from './supabase'
import { auditService } from './database'
import type { User, AuthError } from '@supabase/supabase-js'

// Authentication service functions

export interface SignUpData {
  email: string
  password: string
  name: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthResponse {
  user: User | null
  error: AuthError | null
  message?: string
}

// Sign up with email and password
export async function signUp({ email, password, name }: SignUpData): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name.trim()
        }
      }
    })

    if (error) {
      console.error('Sign up error:', error)
      await auditService.logEvent('SIGNUP_FAILED', 'auth', undefined, undefined, { email, error: error.message })
      return { user: null, error, message: getErrorMessage(error) }
    }

    if (data.user) {
      await auditService.logEvent('SIGNUP_SUCCESS', 'auth', data.user.id, undefined, { email })
      
      // Check if email confirmation is required
      if (!data.session) {
        return { 
          user: data.user, 
          error: null, 
          message: 'Please check your email for a confirmation link.' 
        }
      }
    }

    return { user: data.user, error: null }
  } catch (error) {
    console.error('Sign up error:', error)
    return { 
      user: null, 
      error: error as AuthError, 
      message: 'An unexpected error occurred during sign up.' 
    }
  }
}

// Sign in with email and password
export async function signIn({ email, password }: SignInData): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Sign in error:', error)
      await auditService.logEvent('SIGNIN_FAILED', 'auth', undefined, undefined, { email, error: error.message })
      return { user: null, error, message: getErrorMessage(error) }
    }

    if (data.user) {
      await auditService.logEvent('SIGNIN_SUCCESS', 'auth', data.user.id, undefined, { email })
    }

    return { user: data.user, error: null }
  } catch (error) {
    console.error('Sign in error:', error)
    return { 
      user: null, 
      error: error as AuthError, 
      message: 'An unexpected error occurred during sign in.' 
    }
  }
}

// Sign out
export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Sign out error:', error)
      return { error }
    }

    if (user) {
      await auditService.logEvent('SIGNOUT_SUCCESS', 'auth', user.id)
    }

    return { error: null }
  } catch (error) {
    console.error('Sign out error:', error)
    return { error: error as AuthError }
  }
}

// Sign in with Google
export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      console.error('Google sign in error:', error)
      await auditService.logEvent('GOOGLE_SIGNIN_FAILED', 'auth', undefined, undefined, { error: error.message })
      return { user: null, error, message: getErrorMessage(error) }
    }

    return { user: null, error: null } // OAuth redirects, so no immediate user
  } catch (error) {
    console.error('Google sign in error:', error)
    return { 
      user: null, 
      error: error as AuthError, 
      message: 'An unexpected error occurred during Google sign in.' 
    }
  }
}

// Sign in with GitHub
export async function signInWithGitHub(): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      console.error('GitHub sign in error:', error)
      await auditService.logEvent('GITHUB_SIGNIN_FAILED', 'auth', undefined, undefined, { error: error.message })
      return { user: null, error, message: getErrorMessage(error) }
    }

    return { user: null, error: null } // OAuth redirects, so no immediate user
  } catch (error) {
    console.error('GitHub sign in error:', error)
    return { 
      user: null, 
      error: error as AuthError, 
      message: 'An unexpected error occurred during GitHub sign in.' 
    }
  }
}

// Reset password
export async function resetPassword(email: string): Promise<{ error: AuthError | null; message?: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (error) {
      console.error('Reset password error:', error)
      await auditService.logEvent('PASSWORD_RESET_FAILED', 'auth', undefined, undefined, { email, error: error.message })
      return { error, message: getErrorMessage(error) }
    }

    await auditService.logEvent('PASSWORD_RESET_REQUESTED', 'auth', undefined, undefined, { email })
    return { error: null, message: 'Password reset email sent. Please check your inbox.' }
  } catch (error) {
    console.error('Reset password error:', error)
    return { 
      error: error as AuthError, 
      message: 'An unexpected error occurred while requesting password reset.' 
    }
  }
}

// Update password
export async function updatePassword(newPassword: string): Promise<{ error: AuthError | null; message?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      console.error('Update password error:', error)
      return { error, message: getErrorMessage(error) }
    }

    if (user) {
      await auditService.logEvent('PASSWORD_UPDATED', 'auth', user.id)
    }

    return { error: null, message: 'Password updated successfully.' }
  } catch (error) {
    console.error('Update password error:', error)
    return { 
      error: error as AuthError, 
      message: 'An unexpected error occurred while updating password.' 
    }
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Get user error:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}

// Helper function to get user-friendly error messages
function getErrorMessage(error: AuthError): string {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Invalid email or password. Please try again.'
    case 'Email not confirmed':
      return 'Please confirm your email address before signing in.'
    case 'User already registered':
      return 'An account with this email already exists.'
    case 'Password should be at least 6 characters':
      return 'Password must be at least 6 characters long.'
    case 'Unable to validate email address: invalid format':
      return 'Please enter a valid email address.'
    case 'Signup is disabled':
      return 'Account registration is currently disabled.'
    default:
      return error.message || 'An unexpected error occurred.'
  }
}

// Validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long.' }
  }
  
  if (password.length > 72) {
    return { isValid: false, message: 'Password must be less than 72 characters long.' }
  }
  
  return { isValid: true }
}

export function validateName(name: string): { isValid: boolean; message?: string } {
  const trimmedName = name.trim()
  
  if (trimmedName.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long.' }
  }
  
  if (trimmedName.length > 50) {
    return { isValid: false, message: 'Name must be less than 50 characters long.' }
  }
  
  return { isValid: true }
}
