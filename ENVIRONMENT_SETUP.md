# 🔧 Environment Setup Guide

## Quick Fix for Current Error

The error you're seeing is because the Supabase environment variables are missing. Here's how to fix it:

### 1. Create `.env.local` file

Create a file named `.env.local` in your project root with the following content:

```env
# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Supabase Configuration
# Replace these with your actual Supabase project credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Payment Gateway
PAYSTACK_SECRET_KEY=sk_test_your_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key

# Email Services
RESEND_API_KEY=re_your_resend_key
SENDGRID_API_KEY=SG.your_sendgrid_key
FROM_EMAIL=noreply@yourdomain.com

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 2. Get Your Supabase Credentials

1. **Go to [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Create a new project** (if you don't have one)
3. **Go to Settings → API**
4. **Copy the following values:**
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Update Your `.env.local` File

Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Run the Database Migration

1. **Go to your Supabase project dashboard**
2. **Click on "SQL Editor"**
3. **Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`**
4. **Click "Run" to execute the migration**

### 5. Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

### 6. Test the Setup

1. **Visit `http://localhost:3000/test-supabase`**
2. **Click "Run Database Tests"**
3. **Verify all tests pass**

## Temporary Development Mode

If you want to test the application without setting up Supabase first, the updated code now includes:

- **Placeholder values** for missing environment variables
- **Warning messages** in the console
- **Graceful degradation** in development mode

The app will now load without crashing, but you'll see warnings in the console until you add the proper Supabase credentials.

## What's Fixed

✅ **No more crashes** when environment variables are missing  
✅ **Helpful warning messages** in the console  
✅ **Graceful degradation** in development mode  
✅ **Environment validation** in the test page  
✅ **Clear setup instructions**  

## Next Steps

1. **Create `.env.local`** with the template above
2. **Set up Supabase project** and get your credentials
3. **Update environment variables** with real values
4. **Run the migration script** in Supabase
5. **Test everything** at `/test-supabase`

## Need Help?

- **Supabase Setup**: [supabase.com/docs](https://supabase.com/docs)
- **Migration Guide**: `MIGRATION_GUIDE.md`
- **Testing Guide**: `TESTING_GUIDE.md`
- **Run setup helper**: `npm run setup:supabase`

---

*Your app should now load without errors! 🚀*
