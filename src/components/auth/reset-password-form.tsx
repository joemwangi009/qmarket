'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Lock, CheckCircle, XCircle } from 'lucide-react'

interface PasswordStrength {
  score: number
  feedback: string[]
}

export function ResetPasswordForm() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, feedback: [] })

  // Password strength checker
  const checkPasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push('At least 8 characters')
    }

    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push('Include a number')
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1
    } else {
      feedback.push('Include a special character')
    }

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push('Include both uppercase and lowercase letters')
    }

    return { score, feedback }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setPasswordStrength(checkPasswordStrength(value))
  }

  const validateForm = (): boolean => {
    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields')
      return false
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }

    if (passwordStrength.score < 3) {
      toast.error('Password does not meet security requirements')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setIsPending(true)
      
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        toast.error(`Failed to update password: ${error.message}`)
      } else {
        setIsSuccess(true)
        toast.success('Password updated successfully!')
        
        // Redirect to sign in after a short delay
        setTimeout(() => {
          router.push('/auth/sign-in')
        }, 2000)
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 1) return 'text-red-500'
    if (score <= 2) return 'text-yellow-500'
    if (score <= 3) return 'text-blue-500'
    return 'text-green-500'
  }

  const getPasswordStrengthText = (score: number) => {
    if (score <= 1) return 'Weak'
    if (score <= 2) return 'Fair'
    if (score <= 3) return 'Good'
    return 'Strong'
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Updated!</h3>
          <p className="text-gray-600">
            Your password has been successfully updated. You will be redirected to the sign-in page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* New Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">New Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
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
        
        {/* Password Strength Indicator */}
        {password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Password strength:</span>
              <span className={`font-medium ${getPasswordStrengthColor(passwordStrength.score)}`}>
                {getPasswordStrengthText(passwordStrength.score)}
              </span>
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-2 flex-1 rounded-full ${
                    level <= passwordStrength.score
                      ? getPasswordStrengthColor(passwordStrength.score).replace('text-', 'bg-')
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            {passwordStrength.feedback.length > 0 && (
              <div className="text-xs text-gray-600 space-y-1">
                {passwordStrength.feedback.map((feedback, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <XCircle className="h-3 w-3 text-red-400" />
                    <span>{feedback}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        
        {/* Password Match Indicator */}
        {confirmPassword && (
          <div className="flex items-center space-x-2 text-sm">
            {password === confirmPassword ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-600">Passwords match</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-600">Passwords do not match</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating Password...
          </>
        ) : (
          'Update Password'
        )}
      </Button>
    </form>
  )
} 