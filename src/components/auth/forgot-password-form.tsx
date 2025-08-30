'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient, SupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Mail, Loader2, CheckCircle } from 'lucide-react'

export function ForgotPasswordForm() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [email, setEmail] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    try {
      const client = createClientComponentClient()
      setSupabase(client)
      setIsInitialized(true)
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      setIsInitialized(false)
    }
  }, [])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isInitialized || !supabase) {
      toast.error('Authentication service is not available. Please try again later.')
      return
    }
    
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    try {
      setIsPending(true)
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        toast.error(`Failed to send reset email: ${error.message}`)
      } else {
        setIsSubmitted(true)
        toast.success('Password reset email sent! Check your inbox.')
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Initializing...</span>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h3>
          <p className="text-gray-600 mb-4">
            We&apos;ve sent password reset instructions to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Didn&apos;t receive the email? Check your spam folder or try again.
          </p>
        </div>
        <Button
          onClick={() => {
            setIsSubmitted(false)
            setEmail('')
          }}
          variant="outline"
          className="w-full"
        >
          Send another email
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10"
          />
        </div>
        <p className="text-xs text-gray-500">
          We&apos;ll send you a link to reset your password.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Reset Email...
          </>
        ) : (
          'Send Reset Instructions'
        )}
      </Button>
    </form>
  )
} 