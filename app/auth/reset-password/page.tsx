'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'updating' | 'done' | 'error'>('checking')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    // When arriving from the email link, Supabase will have set a recovery session.
    const verify = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        if (!data.session) {
          setStatus('error')
          setErrorMsg('No active reset session. Please request a new password reset link.')
        } else {
          setStatus('idle')
        }
      } catch (err) {
        setStatus('error')
        setErrorMsg('Failed to verify session. Please try again.')
      }
    }
    verify()
  }, [])

  const handleUpdate = async () => {
    setErrorMsg('')
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setErrorMsg('Passwords do not match.')
      return
    }
    setStatus('updating')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setStatus('error')
      setErrorMsg(error.message || 'Failed to update password.')
      return
    }
    setStatus('done')
    setTimeout(() => router.push('/'), 1200)
  }

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner size="lg" className="mx-auto" />
          <h2 className="text-xl font-semibold">Checking reset session…</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Set a new password</h1>
        <p className="text-gray-400 text-sm">Enter and confirm your new password below.</p>

        {errorMsg && (
          <div className="p-3 rounded-md bg-red-100 border border-red-300 text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm">New password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">Confirm new password</label>
          <Input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <Button onClick={handleUpdate} disabled={status === 'updating'} className="w-full">
          {status === 'updating' ? 'Updating…' : 'Update password'}
        </Button>

        {status === 'done' && (
          <p className="text-green-400 text-sm">Password updated! Redirecting…</p>
        )}
      </div>
    </div>
  )
}
