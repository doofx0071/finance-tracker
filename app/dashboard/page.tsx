'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

export default function Dashboard() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner size="lg" className="mx-auto" />
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to home
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome to Finance Tracker</h1>
            <p className="text-gray-400 mt-2">
              Hello, {profile?.name || user.email}! 👋
            </p>
          </div>
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-800"
          >
            Sign Out
          </Button>
        </div>

        {/* Success Message */}
        <Card className="bg-green-900 border-green-700">
          <CardHeader>
            <CardTitle className="text-green-100">🎉 Authentication Successful!</CardTitle>
            <CardDescription className="text-green-200">
              You have successfully signed in to Finance Tracker.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-green-100">
            <div className="space-y-2">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Profile Name:</strong> {profile?.name || 'Not set'}</p>
              <p><strong>Currency:</strong> {profile?.currency || 'PHP'}</p>
              <p><strong>Account Created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Transactions</CardTitle>
              <CardDescription className="text-gray-400">
                Track your income and expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">Coming soon in Phase 3!</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Budgets</CardTitle>
              <CardDescription className="text-gray-400">
                Set and monitor your budgets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">Coming soon in Phase 4!</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Goals</CardTitle>
              <CardDescription className="text-gray-400">
                Track your savings goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">Coming soon in Phase 4!</p>
            </CardContent>
          </Card>
        </div>

        {/* Development Info */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">🚀 Phase 2 Complete!</CardTitle>
            <CardDescription className="text-gray-400">
              Database & Authentication System
            </CardDescription>
          </CardHeader>
          <CardContent className="text-gray-300">
            <div className="space-y-2">
              <p>✅ Database schema with 7 tables</p>
              <p>✅ Row Level Security (RLS) policies</p>
              <p>✅ Email/password authentication</p>
              <p>✅ Google OAuth integration</p>
              <p>✅ User profile management</p>
              <p>✅ Session management</p>
              <p>✅ Audit logging system</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
