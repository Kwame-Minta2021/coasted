# Google Analytics Verification Steps

## 🚀 Your Server is Running!

✅ **Development server is active on port 3000**

## 📊 Stream Information

| Detail | Value |
|--------|-------|
| **Stream Name** | coasted code |
| **Stream ID** | 12039784773 |
| **Measurement ID** | G-H2EE34FVLG |

## 🔍 Step-by-Step Verification

### 1. Open Your Website
Visit: **http://localhost:3001** (Note: Server is running on port 3001)

### 2. Test Google Analytics
Visit: **http://localhost:3001/test-ga**
- This page will automatically track events
- Click the "Test Event Tracking" button
- Check browser console for gtag events

### 3. Check Google Analytics Dashboard
1. Go to [Google Analytics](https://analytics.google.com)
2. Select your "coasted code" property
3. Navigate to **Real-time** → **Overview**
4. Look for:
   - Active users (should show 1+ if you're on the site)
   - Page views
   - Events

### 4. Browser Developer Tools
1. Press **F12** to open developer tools
2. Go to **Console** tab
3. Type: `window.gtag` (should show function)
4. Type: `window.dataLayer` (should show array)
5. Go to **Network** tab and look for requests to `googletagmanager.com`

### 5. Test Different Pages
Navigate to different pages on your site:
- Homepage: `http://localhost:3001/`
- Courses: `http://localhost:3001/courses`
- Login: `http://localhost:3001/login`
- Student dashboard: `http://localhost:3001/student`

Each page should automatically track page views.

## 🎯 Expected Results

### In Google Analytics Real-time:
- ✅ Active users: 1 (or more)
- ✅ Page views: Multiple entries
- ✅ Events: Custom events from test page

### In Browser Console:
- ✅ `window.gtag` function available
- ✅ `window.dataLayer` array with events
- ✅ No JavaScript errors

### In Network Tab:
- ✅ Requests to `googletagmanager.com`
- ✅ Successful 200 responses

## 🚨 Troubleshooting

### If No Data Appears:
1. **Check Ad Blockers**: Disable ad blockers temporarily
2. **Clear Cache**: Hard refresh (Ctrl+F5)
3. **Wait**: Real-time data can take 1-2 minutes
4. **Check Console**: Look for JavaScript errors

### If Errors in Console:
1. Check if scripts are loading
2. Verify Measurement ID is correct
3. Ensure no conflicting scripts

## 📈 Next Steps

Once verified:
1. **Set up Goals** in Google Analytics
2. **Create Custom Reports** for your metrics
3. **Add Event Tracking** to key user actions
4. **Monitor Performance** regularly

## 🎉 Success Indicators

You'll know it's working when:
- Real-time reports show active users
- Page views appear in Google Analytics
- Events are tracked successfully
- No console errors related to gtag

---

**Ready to test?** Visit http://localhost:3001/test-ga now!
