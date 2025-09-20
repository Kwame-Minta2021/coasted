#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 Supabase Setup Helper')
console.log('========================\n')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
const envExamplePath = path.join(process.cwd(), '.env.example')

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found')
  console.log('📝 Creating .env.local from template...\n')
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath)
    console.log('✅ .env.local created from .env.example')
  } else {
    // Create basic .env.local template
    const envTemplate = `# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Supabase Configuration
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
`
    fs.writeFileSync(envPath, envTemplate)
    console.log('✅ .env.local created with template')
  }
} else {
  console.log('✅ .env.local file exists')
}

console.log('\n📋 Setup Checklist:')
console.log('==================')
console.log('1. ✅ Environment file ready')
console.log('2. ⏳ Create Supabase project at https://supabase.com/dashboard')
console.log('3. ⏳ Run migration script in Supabase SQL Editor')
console.log('4. ⏳ Update environment variables with your Supabase credentials')
console.log('5. ⏳ Test the migration at http://localhost:3000/test-supabase')

console.log('\n🔗 Useful Links:')
console.log('===============')
console.log('• Supabase Dashboard: https://supabase.com/dashboard')
console.log('• Migration Script: supabase/migrations/001_initial_schema.sql')
console.log('• Test Page: http://localhost:3000/test-supabase')
console.log('• Documentation: MIGRATION_GUIDE.md')

console.log('\n📝 Next Steps:')
console.log('==============')
console.log('1. Create a new Supabase project')
console.log('2. Copy your project URL and API keys')
console.log('3. Update the environment variables in .env.local')
console.log('4. Run the migration script in Supabase SQL Editor')
console.log('5. Start your development server: npm run dev')
console.log('6. Visit http://localhost:3000/test-supabase to run tests')

console.log('\n🎉 Happy coding!')
