# 🌐 Domain Deployment Guide - www.coastedcode.com

## Overview
This guide will help you deploy your Coasted Code application to your custom domain `www.coastedcode.com` purchased from nakroteck.net.

## 🚀 Deployment Options

### **Option 1: Vercel (Recommended for Next.js)**
- **Best for**: Next.js applications
- **Features**: Automatic deployments, custom domains, SSL certificates
- **Cost**: Free tier available, paid plans for advanced features

### **Option 2: Netlify**
- **Best for**: Static sites and JAMstack applications
- **Features**: Easy deployment, custom domains, form handling
- **Cost**: Free tier available

### **Option 3: Custom Server**
- **Best for**: Full control over hosting
- **Requirements**: VPS or dedicated server
- **Cost**: Varies by provider

---

## 🎯 **Recommended: Vercel Deployment**

### **Step 1: Prepare Your Repository**

1. **Ensure all changes are committed:**
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin master
   ```

2. **Create production environment variables:**
   - Copy your `.env.local` to production environment
   - Update URLs to use `https://www.coastedcode.com`

### **Step 2: Deploy to Vercel**

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up/Login** with your GitHub account
3. **Import your repository:**
   - Click "New Project"
   - Select your `coasted-code` repository
   - Vercel will auto-detect it's a Next.js app

4. **Configure Environment Variables:**
   ```
   NEXT_PUBLIC_SITE_URL=https://www.coastedcode.com
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-H2EE34FVLG
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   PAYSTACK_PUBLIC_KEY=your_paystack_public_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - You'll get a temporary URL like `coasted-code-xyz.vercel.app`

### **Step 3: Configure Custom Domain**

1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Settings" → "Domains"
   - Click "Add Domain"
   - Enter: `www.coastedcode.com`
   - Click "Add"

2. **Vercel will provide DNS records:**
   ```
   Type: A
   Name: www
   Value: 76.76.19.61
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### **Step 4: Update DNS at nakroteck.net**

1. **Login to your nakroteck.net account**
2. **Go to Domain Management**
3. **Find your domain: coastedcode.com**
4. **Update DNS records:**
   - **A Record**: `www` → `76.76.19.61`
   - **CNAME Record**: `www` → `cname.vercel-dns.com`
   - **A Record**: `@` → `76.76.19.61` (for root domain)

5. **Save changes**

### **Step 5: SSL Certificate**
- Vercel automatically provides SSL certificates
- Your site will be available at `https://www.coastedcode.com`
- SSL will be active within 24 hours

---

## 🔧 **Alternative: Netlify Deployment**

### **Step 1: Deploy to Netlify**

1. **Go to [Netlify.com](https://netlify.com)**
2. **Sign up/Login** with GitHub
3. **New site from Git:**
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Configure Environment Variables:**
   - Site settings → Environment variables
   - Add all your production environment variables

### **Step 2: Custom Domain Setup**

1. **In Netlify Dashboard:**
   - Site settings → Domain management
   - Add custom domain: `www.coastedcode.com`

2. **DNS Configuration:**
   ```
   Type: A
   Name: www
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: coasted-code.netlify.app
   ```

---

## 📋 **Production Checklist**

### **Before Deployment:**
- [ ] All code committed to GitHub
- [ ] Environment variables prepared
- [ ] Google Analytics configured
- [ ] Payment gateway configured for production
- [ ] Email services configured
- [ ] Database (Supabase) ready for production

### **After Deployment:**
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Google Analytics tracking working
- [ ] Payment processing tested
- [ ] Email notifications working
- [ ] All features tested on live site

---

## 🛠️ **Environment Variables for Production**

```env
# Production URLs
NEXT_PUBLIC_SITE_URL=https://www.coastedcode.com
NEXT_PUBLIC_APP_URL=https://www.coastedcode.com
NODE_ENV=production

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-H2EE34FVLG

# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key

# Payment Gateway (Production Keys)
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key
PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key

# Email Services
SENDGRID_API_KEY=your_sendgrid_key
RESEND_API_KEY=your_resend_key
FROM_EMAIL=noreply@coastedcode.com

# AI Services
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🚨 **Important Notes**

1. **HTTPS Required**: Your payment gateway and email services require HTTPS
2. **Production Keys**: Use live/production API keys, not test keys
3. **Domain Verification**: Some services may require domain verification
4. **DNS Propagation**: DNS changes can take 24-48 hours to propagate globally

---

## 📞 **Support**

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Netlify Support**: [netlify.com/support](https://netlify.com/support)
- **nakroteck.net Support**: Contact your domain provider for DNS help

---

**Next Steps**: Choose your deployment platform and follow the steps above!
