'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Moon, Sun, Eye, EyeOff, CreditCard, Target, BarChart3 } from 'lucide-react'

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // TODO: Implement authentication logic
    console.log('Form submitted:', formData)
    setIsLoading(false)

    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Mobile Backdrop */}
      {showAuthForm && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setShowAuthForm(false)}
        />
      )}

      {/* Dark Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={toggleDarkMode}
          variant="outline"
          size="icon"
          className={`transition-all duration-300 hover:scale-110 ${
            isDarkMode
              ? 'border-gray-600 bg-black hover:bg-gray-800'
              : 'border-gray-300 bg-white hover:bg-gray-100'
          }`}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Side - Hero Section */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="max-w-2xl space-y-6 lg:space-y-8 text-center lg:text-left">
            {/* Hero Content */}
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold transition-all duration-500 hover:scale-105 ${
                  isDarkMode ? 'text-white hover:text-gray-200' : 'text-black hover:text-gray-800'
                }`}>
                  Finance Tracker
                </h1>
                <p className={`text-lg md:text-xl lg:text-2xl max-w-xl mx-auto lg:mx-0 animate-fade-in-delay-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  A Filipino-made personal finance app that empowers you to log expenses,
                  set budgets, track savings goals, and gain clear financial insights.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-delay-2">
                <div className={`flex items-center space-x-3 p-4 rounded-lg transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'
                }`}>
                  <CreditCard className={`h-8 w-8 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>Track Expenses</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Log transactions</p>
                  </div>
                </div>

                <div className={`flex items-center space-x-3 p-4 rounded-lg transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'
                }`}>
                  <Target className={`h-8 w-8 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>Set Budgets</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Monthly limits</p>
                  </div>
                </div>

                <div className={`flex items-center space-x-3 p-4 rounded-lg transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'
                }`}>
                  <BarChart3 className={`h-8 w-8 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>Analytics</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Insights & reports</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="animate-fade-in-delay-3 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={() => setShowAuthForm(true)}
                  size="lg"
                  className={`px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    isDarkMode
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  Get Started Free
                </Button>
                <Button
                  onClick={() => {
                    setShowAuthForm(true)
                    setIsLogin(true)
                  }}
                  variant="outline"
                  size="lg"
                  className={`px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    isDarkMode
                      ? 'border-gray-600 text-white hover:bg-gray-800'
                      : 'border-gray-300 text-black hover:bg-gray-100'
                  }`}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className={`flex-1 flex items-center justify-center p-4 lg:p-8 transition-all duration-500 ${
          isDarkMode ? 'bg-gray-950' : 'bg-gray-50'
        } ${showAuthForm ? 'translate-x-0 lg:translate-x-0' : 'translate-x-full lg:translate-x-full'} ${
          showAuthForm ? 'fixed inset-0 z-40 lg:relative lg:inset-auto lg:z-auto' : 'hidden lg:flex'
        }`}>
          <Card className={`w-full max-w-md transition-all duration-500 ${
            isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          } ${showAuthForm ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAuthForm(false)}
                  className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
                >
                  ✕
                </Button>
              </div>
              <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {isLogin ? 'Sign in to your account' : 'Sign up to get started'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className={isDarkMode ? 'text-white' : 'text-black'}>Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white'
                          : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-black'
                      }`}
                      required={!isLogin}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className={isDarkMode ? 'text-white' : 'text-black'}>Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white'
                        : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-black'
                    }`}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className={isDarkMode ? 'text-white' : 'text-black'}>Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pr-10 transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white'
                          : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-black'
                      }`}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      ) : (
                        <Eye className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      )}
                    </Button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className={isDarkMode ? 'text-white' : 'text-black'}>Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white'
                          : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-black'
                      }`}
                      required={!isLogin}
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full transition-all duration-300 hover:scale-105 disabled:hover:scale-100 ${
                    isDarkMode
                      ? 'bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400'
                      : 'bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      {isLogin ? 'Signing In...' : 'Creating Account...'}
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setIsLogin(!isLogin)}
                    className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
                  >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className={`fixed bottom-4 left-4 text-sm transition-colors duration-500 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <p>Built with Next.js, Supabase, and Tailwind CSS</p>
      </div>
    </div>
  )
}
