import { Metadata } from 'next'
import { SignInForm } from '@/components/auth/sign-in-form'

export const metadata: Metadata = {
  title: 'Sign In - QMarket',
  description: 'Sign in to your QMarket account to continue shopping.',
}

export default function SignInPage() {
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in to your account</h2>
          <p className="text-gray-600">Welcome back! Please enter your details</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <SignInForm />
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
} 