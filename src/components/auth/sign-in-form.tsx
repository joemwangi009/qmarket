'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient, SupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Mail, Lock, LogIn, XCircle } from 'lucide-react'

interface FormData {
  email: string
  password: string
}

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize Supabase client
  useEffect(() => {
    try {
      // Check if required environment variables are available
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('Missing Supabase environment variables')
        setIsInitialized(false)
        return
      }
      
      const client = createClientComponentClient()
      setSupabase(client)
      setIsInitialized(true)
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      setIsInitialized(false)
    }
  }, [])

  // Check if user is already authenticated
  useEffect(() => {
    if (!isInitialized || !supabase) return

    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Redirect based on redirectTo parameter or default to dashboard
          const redirectTo = searchParams.get('redirectTo')
          if (redirectTo && redirectTo.startsWith('/')) {
            router.push(redirectTo)
          } else {
            router.push('/dashboard')
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [supabase, router, searchParams, isInitialized])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return false
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }

    return true
  }

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    if (!isInitialized || !supabase) {
      toast.error('Authentication service is not available. Please try again later.')
      return
    }

    try {
      setIsPending(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        toast.error(`Failed to sign in with ${provider}: ${error.message}`)
      }
    } catch (error) {
      toast.error(`An unexpected error occurred: ${error}`)
    } finally {
      setIsPending(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isInitialized || !supabase) {
      toast.error('Authentication service is not available. Please try again later.')
      return
    }
    
    if (!validateForm()) return

    try {
      setIsPending(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please try again.')
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email address before signing in.')
        } else {
          toast.error(`Sign in failed: ${error.message}`)
        }
      } else if (data.user) {
        toast.success('Welcome back!')
        
        // Redirect based on redirectTo parameter or default to dashboard
        const redirectTo = searchParams.get('redirectTo')
        if (redirectTo && redirectTo.startsWith('/')) {
          router.push(redirectTo)
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  // Show loading state while checking authentication or initializing
  if (isCheckingAuth || !isInitialized) {
    // Check if environment variables are missing
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuration Error</h3>
          <p className="text-gray-600 mb-4">
            Authentication service is not properly configured. Please contact support.
          </p>
          <p className="text-sm text-gray-500">
            Error: Missing Supabase environment variables
          </p>
        </div>
      )
    }
    
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-gray-600">
            {!isInitialized ? 'Initializing...' : 'Checking authentication...'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* OAuth Providers */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full h-11"
          onClick={() => handleOAuthSignIn('google')}
          disabled={isPending}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="w-full h-11"
          onClick={() => handleOAuthSignIn('github')}
          disabled={isPending}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
          Continue with GitHub
        </Button>
      </div>

      {/* Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with email</span>
        </div>
      </div>

      {/* Email Sign In Form */}
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link 
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </>
          )}
        </Button>
      </form>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/auth/sign-up" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
} 