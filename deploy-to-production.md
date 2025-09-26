# 🚀 Quick Deployment Steps for www.coastedcode.com

## **Immediate Action Plan**

### **1. Choose Your Hosting Platform**
**Recommended: Vercel** (Best for Next.js apps)

### **2. Deploy to Vercel (5 minutes)**

1. **Go to**: https://vercel.com
2. **Sign up** with your GitHub account
3. **Import Project**:
   - Click "New Project"
   - Select your `coasted-code` repository
   - Click "Import"

4. **Configure Environment Variables**:
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

5. **Deploy**: Click "Deploy" button

### **3. Add Custom Domain (2 minutes)**

1. **In Vercel Dashboard**:
   - Go to your project
   - Settings → Domains
   - Add: `www.coastedcode.com`

2. **Vercel will show DNS records**:
   ```
   Type: A
   Name: www
   Value: 76.76.19.61
   ```

### **4. Update DNS at nakroteck.net (5 minutes)**

1. **Login to nakroteck.net**
2. **Go to Domain Management**
3. **Find coastedcode.com**
4. **Add DNS Record**:
   - Type: A
   - Name: www
   - Value: 76.76.19.61
   - TTL: 3600

5. **Save changes**

### **5. Wait for SSL (24 hours)**
- Vercel automatically provides SSL
- Your site will be live at: https://www.coastedcode.com

---

## **Total Time: ~15 minutes + 24 hours for SSL**

## **What You'll Get:**
- ✅ Live website at www.coastedcode.com
- ✅ HTTPS/SSL certificate
- ✅ Google Analytics tracking
- ✅ Payment processing
- ✅ AI Chatbot
- ✅ All features working

## **Need Help?**
- Vercel has excellent documentation
- Your domain provider (nakroteck.net) can help with DNS
- All your code is already production-ready!

---

**Ready to deploy? Start with step 1 above! 🚀**
