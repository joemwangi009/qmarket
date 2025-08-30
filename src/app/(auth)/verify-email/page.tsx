import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Verify Your Email - QMarket',
  description: 'Please verify your email address to complete your account setup.',
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">QMarket</h1>
          </div>
        </div>

        {/* Verification Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription className="text-base">
              We&apos;ve sent you a verification link to complete your account setup.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Icon */}
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-10 h-10 text-blue-600" />
              </div>
              <p className="text-gray-600 mb-2">
                Click the verification link in your email to activate your account.
              </p>
              <p className="text-sm text-gray-500">
                Didn&apos;t receive the email? Check your spam folder.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Resend Verification Email
              </Button>
              
              <Link href="/auth/sign-in" className="block">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </div>

            {/* Help Text */}
            <div className="text-center text-sm text-gray-500">
              <p>
                Having trouble?{' '}
                <Link href="/support" className="text-blue-600 hover:text-blue-700 font-medium">
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
} 