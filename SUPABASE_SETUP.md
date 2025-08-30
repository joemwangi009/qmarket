# Supabase Setup Guide for QMarket

## Current Issue
The authentication system is showing "Configuration Error" because Supabase environment variables are not configured.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `qmarket` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait for project setup to complete (2-3 minutes)

## Step 2: Get Environment Variables

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Set Environment Variables in Vercel

1. Go to your Vercel dashboard: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your QMarket project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

   **Variable 1:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://your-project-id.supabase.co` (from Step 2)
   - **Environment**: Production, Preview, Development
   
   **Variable 2:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (from Step 2)
   - **Environment**: Production, Preview, Development

5. Click **Save**
6. **Redeploy** your project (Vercel will automatically detect the new environment variables)

## Step 4: Enable Authentication Providers

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable the providers you want:
   - **Google**: Click "Enable" and configure OAuth credentials
   - **GitHub**: Click "Enable" and configure OAuth credentials
   - **Email**: Should be enabled by default

## Step 5: Configure OAuth (Optional)

### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret to Supabase Google provider settings

### GitHub OAuth:
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Add redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase GitHub provider settings

## Step 6: Test Authentication

1. After redeploying, visit your auth pages:
   - Sign Up: `/auth/sign-up`
   - Sign In: `/auth/sign-in`
2. The "Configuration Error" should be gone
3. Try creating an account or signing in

## Troubleshooting

### Still seeing "Configuration Error"?
- Check that environment variables are set in Vercel
- Ensure variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Redeploy your project after adding environment variables

### OAuth not working?
- Verify redirect URIs are correct in both Supabase and OAuth provider settings
- Check that OAuth providers are enabled in Supabase

### Database connection issues?
- Ensure your Supabase project is active
- Check database password and connection settings

## Support

If you continue to have issues:
1. Check Vercel deployment logs
2. Verify Supabase project status
3. Ensure all environment variables are correctly set
4. Check that the project has been redeployed after adding environment variables

## Quick Test

After setup, you should be able to:
- ✅ See auth forms without configuration errors
- ✅ Create new accounts
- ✅ Sign in with existing accounts
- ✅ Use OAuth providers (if configured)
- ✅ Access user dashboard after authentication 