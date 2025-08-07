'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/hooks/useAuth'
import { validateEmail, validatePassword, validateName } from '@/lib/auth'
import { Moon, Sun, Eye, EyeOff, CreditCard, Target, BarChart3, Mail } from 'lucide-react'

export default function Home() {
  const { signIn, signUp, loading: authLoading } = useAuth()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')
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

  const handleCloseAuthForm = () => {
    setIsClosing(true)
    // Wait for exit animation to complete before hiding
    setTimeout(() => {
      setShowAuthForm(false)
      setIsClosing(false)
    }, 600) // Match the animation duration
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      const { signInWithGoogle } = await import('@/lib/auth')
      const { error, message } = await signInWithGoogle()

      if (error) {
        setErrors({ general: message || error.message })
      }
      // Note: Google OAuth will redirect, so no success handling needed here
    } catch (error) {
      console.error('Google sign in error:', error)
      setErrors({ general: 'Failed to sign in with Google. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setSuccessMessage('')

    try {
      // Validate form data
      const validationErrors: Record<string, string> = {}

      if (!validateEmail(formData.email)) {
        validationErrors.email = 'Please enter a valid email address'
      }

      const passwordValidation = validatePassword(formData.password)
      if (!passwordValidation.isValid) {
        validationErrors.password = passwordValidation.message || 'Invalid password'
      }

      if (!isLogin) {
        const nameValidation = validateName(formData.name)
        if (!nameValidation.isValid) {
          validationErrors.name = nameValidation.message || 'Invalid name'
        }

        if (formData.password !== formData.confirmPassword) {
          validationErrors.confirmPassword = 'Passwords do not match'
        }
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        setIsLoading(false)
        return
      }

      // Perform authentication
      if (isLogin) {
        const { user, error, message } = await signIn(formData.email, formData.password)

        if (error) {
          setErrors({ general: message || error.message })
        } else if (user) {
          setSuccessMessage('Successfully signed in!')
          // Close form after successful login
          setTimeout(() => {
            handleCloseAuthForm()
          }, 1500)
        }
      } else {
        const { user, error, message } = await signUp(formData.email, formData.password, formData.name)

        if (error) {
          setErrors({ general: message || error.message })
        } else if (user) {
          setSuccessMessage(message || 'Account created successfully!')
          // Reset form after successful signup
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
          })
        }
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Mobile Backdrop */}
      {showAuthForm && (
        <div
          className={`fixed inset-0 bg-black/60 z-30 lg:hidden transition-all duration-500 ease-out backdrop-blur-sm ${
            isClosing ? 'opacity-0' : 'opacity-100 animate-fade-in'
          }`}
          onClick={handleCloseAuthForm}
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

      <div className="flex min-h-screen flex-col lg:flex-row overflow-hidden">
        {/* Left Side - Hero Section */}
        <div className={`flex-1 flex items-center justify-center p-4 lg:p-8 transition-all duration-500 ${
          showAuthForm ? 'lg:flex-none lg:w-1/2' : 'lg:flex-1'
        }`}>
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

              {/* CTA Button */}
              <div className="animate-fade-in-delay-3 flex justify-center lg:justify-start">
                <Button
                  onClick={() => {
                    setShowAuthForm(true)
                    setIsLogin(true)
                  }}
                  size="lg"
                  className={`px-12 py-4 text-lg font-semibold transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 active:scale-95 active:translate-y-0 animate-pulse-subtle ${
                    isDarkMode
                      ? 'bg-white text-black hover:bg-gray-200 shadow-lg hover:shadow-white/20'
                      : 'bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-black/30'
                  } relative overflow-hidden group`}
                >
                  <span className="relative z-10">Sign In</span>
                  <div className={`absolute inset-0 transition-transform duration-300 group-hover:scale-110 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-gray-100 to-white'
                      : 'bg-gradient-to-r from-gray-800 to-black'
                  }`} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className={`flex items-center justify-center p-4 lg:p-8 transition-all duration-700 ease-out ${
          isDarkMode ? 'bg-gray-950' : 'bg-gray-50'
        } ${
          showAuthForm
            ? `fixed inset-0 z-40 lg:relative lg:inset-auto lg:z-auto lg:flex-none lg:w-1/2 ${
                isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
              }`
            : 'hidden lg:hidden'
        }`}>
          <Card className={`w-full max-w-md transition-all duration-600 ease-out ${
            isDarkMode ? 'bg-gray-900 border-gray-800 shadow-2xl' : 'bg-white border-gray-200 shadow-2xl'
          } ${
            isClosing
              ? 'scale-95 opacity-0 translate-y-8'
              : showAuthForm
                ? 'scale-100 opacity-100 translate-y-0 animate-scale-in'
                : 'scale-95 opacity-0 translate-y-8'
          }`}>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseAuthForm}
                  className={`transition-all duration-200 hover:scale-110 hover:rotate-90 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
                >
                  ✕
                </Button>
              </div>
              <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {isLogin ? 'Sign in to your account' : 'Sign up to get started'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Error Message */}
              {errors.general && (
                <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-300 text-red-700 text-sm">
                  {errors.general}
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="mb-4 p-3 rounded-md bg-green-100 border border-green-300 text-green-700 text-sm">
                  {successMessage}
                </div>
              )}

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
                      } ${errors.name ? 'border-red-500' : ''}`}
                      required={!isLogin}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
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
                    } ${errors.email ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
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
                      } ${errors.password ? 'border-red-500' : ''}`}
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
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
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
                      } ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      required={!isLogin}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || authLoading}
                  className={`w-full transition-all duration-300 hover:scale-105 disabled:hover:scale-100 ${
                    isDarkMode
                      ? 'bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400'
                      : 'bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500'
                  }`}
                >
                  {isLoading || authLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      {isLogin ? 'Signing In...' : 'Creating Account...'}
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`} />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className={`px-2 ${isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'}`}>
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Sign In */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || authLoading}
                  className={`w-full transition-all duration-300 hover:scale-105 disabled:hover:scale-100 ${
                    isDarkMode
                      ? 'border-gray-600 text-white hover:bg-gray-800 disabled:bg-gray-700 disabled:text-gray-500'
                      : 'border-gray-300 text-black hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400'
                  }`}
                >
                  {isLoading || authLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      Connecting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Continue with Google
                    </div>
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
