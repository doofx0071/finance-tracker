import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white hover:text-gray-200 transition-colors duration-300">
            Finance Tracker
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto animate-fade-in-delay-1">
            A Filipino-made personal finance app that empowers you to log expenses,
            set budgets, track savings goals, and gain clear financial insights.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 animate-fade-in-delay-2">
          <Card className="bg-gray-900 border-gray-800 card-hover transition-all duration-300 hover:border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">Track Expenses</CardTitle>
              <CardDescription className="text-gray-400">
                Log your income and expenses with detailed categories
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-900 border-gray-800 card-hover transition-all duration-300 hover:border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">Set Budgets</CardTitle>
              <CardDescription className="text-gray-400">
                Create monthly budgets and track your progress
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-900 border-gray-800 card-hover transition-all duration-300 hover:border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">Savings Goals</CardTitle>
              <CardDescription className="text-gray-400">
                Set and achieve your financial goals with deadlines
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 animate-fade-in-delay-3">
          <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all duration-200">
            <Link href="/auth/register">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-gray-600 text-white hover:bg-gray-800 hover:scale-105 transition-all duration-200">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-16 text-gray-400 text-sm animate-fade-in-delay-3">
          <p>Built with Next.js, Supabase, and Tailwind CSS</p>
          <p className="mt-2">Monochrome design • Subtle animations • Privacy-focused</p>
        </div>
      </div>
    </div>
  )
}
