# 🚀 Supabase Setup - Step by Step Guide

## Step 1: Create Supabase Project

1. **Go to [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Click "New Project"**
3. **Fill in the details:**
   - **Name**: `coasted-code` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. **Click "Create new project"**
5. **Wait for the project to be created** (this takes 1-2 minutes)

## Step 2: Get Your API Keys

1. **In your project dashboard, go to Settings → API**
2. **Copy these three values:**

### Project URL
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
```

### Anon Public Key
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE5NTYzNTUyMDB9.your-anon-key-here
```

### Service Role Key
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2NDA5OTUyMDAsImV4cCI6MTk1NjM1NTIwMH0.your-service-role-key-here
```

## Step 3: Update Your Environment File

1. **Open `.env.local` in your project root**
2. **Replace the placeholder values with your actual credentials:**

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
```

## Step 4: Run Database Migration

1. **In your Supabase dashboard, click "SQL Editor"**
2. **Click "New Query"**
3. **Copy the entire contents of `supabase/migrations/001_initial_schema.sql`**
4. **Paste it into the SQL Editor**
5. **Click "Run" to execute the migration**

## Step 5: Verify Setup

1. **Restart your development server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Visit `http://localhost:3000/test-supabase`**

3. **Click "Run Database Tests"**

4. **You should see all tests pass! ✅**

## Step 6: Test Enrollment

1. **Click "Test Enrollment"**
2. **You should see a success message! ✅**

## Troubleshooting

### If tests fail:

#### Database Connection Failed
- Check your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Make sure your Supabase project is active

#### Table Access Failed
- Verify you ran the migration script
- Check the SQL Editor for any errors

#### Environment Variables Missing
- Make sure `.env.local` exists in your project root
- Restart your development server after updating environment variables

### Common Issues:

#### Wrong Project URL Format
❌ Wrong: `https://supabase.com/dashboard/project/your-project-id`
✅ Correct: `https://your-project-id.supabase.co`

#### Missing Migration
- The migration script creates all necessary tables
- Without it, table access tests will fail

#### Wrong API Keys
- Make sure you're copying the correct keys from Settings → API
- Don't mix up anon and service role keys

## Success Indicators

You'll know everything is working when:

✅ **All 10 database tests pass**  
✅ **Test enrollment creates successfully**  
✅ **No error messages in the console**  
✅ **Test page shows green checkmarks**  

## Next Steps After Setup

1. **Test the login flow** at `/login`
2. **Test payment processing** (if configured)
3. **Test user registration** and profile management
4. **Test the guidance system** for parental controls

## Need Help?

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Migration Guide**: `MIGRATION_GUIDE.md`
- **Testing Guide**: `TESTING_GUIDE.md`
- **Environment Setup**: `ENVIRONMENT_SETUP.md`

---

*Once you complete these steps, your Firebase to Supabase migration will be fully functional! 🎉*
