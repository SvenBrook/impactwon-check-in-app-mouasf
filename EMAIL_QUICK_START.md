
# 🚀 Email Integration - Quick Start Guide

## What's Already Done ✅

Your ImpactWon Client Expert Check-in app is **fully configured** to send assessment reports via email!

- ✅ Supabase Edge Function deployed
- ✅ Database table created
- ✅ Email service code implemented
- ✅ UI configured to send emails

## What You Need to Do (5 Minutes)

### Step 1: Get Your Resend API Key

1. Go to [resend.com](https://resend.com) and sign up (free)
2. Click **API Keys** in the dashboard
3. Click **Create API Key**
4. Copy the key (starts with `re_`)

### Step 2: Add API Key to Supabase

**Option A: Via Supabase Dashboard (Easiest)**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `oafjzglwgovmalykvfpp`
3. Go to **Edge Functions** → **Secrets**
4. Click **Add Secret**
5. Name: `RESEND_API_KEY`
6. Value: Paste your Resend API key
7. Click **Save**

**Option B: Via CLI**
```bash
supabase secrets set RESEND_API_KEY=re_your_api_key_here
```

### Step 3: Test It!

1. Run your app: `npm run dev`
2. Complete an assessment
3. Click "Submit and Email My Report"
4. Check your email inbox (and spam folder)
5. Verify Sven receives the email at `sven@impactwon.com`

## 📧 Who Receives Emails?

Every time a user submits an assessment, emails are automatically sent to:

1. **The participant** - Email address they entered in the form
2. **Sven** - `sven@impactwon.com` (hardcoded)

## 📝 What's in the Email?

- Participant information (name, email, date)
- Complete competency breakdown table
- Benchmark comparison with color-coded status
- Satisfaction survey results (star rating)
- Professional HTML formatting with ImpactWon branding

## 🎨 Email Branding

The email uses your ImpactWon brand colors:
- **Focus Blue** (#1F2B73) - Headers and primary text
- **Clarity Blue** (#0D95FF) - Scores and highlights
- **Sky Blue** (#C1E6FF) - Table headers
- **Reliable Lilac** (#E3D8FF) - Info panels
- **Insight Teal** (#A6E0C5) - "Ahead of benchmark"
- **Beacon Orange** (#FF810C) - "Priority development area"

## 🐛 Troubleshooting

### "Email service not configured" error
→ You haven't added the RESEND_API_KEY to Supabase secrets yet

### Email not received
→ Check spam folder
→ Verify Resend API key is correct
→ Check Resend dashboard for delivery status

### "Supabase is not configured" error
→ Add environment variables to `.env` file:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://oafjzglwgovmalykvfpp.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```
→ Restart Expo dev server

## 💰 Costs

**Free Tier (Perfect for Testing):**
- Resend: 100 emails/day, 3,000/month
- Supabase: 500,000 Edge Function calls/month

**No credit card required for testing!**

## 🔄 Changing Sven's Email

To change the recipient email from `sven@impactwon.com`:

1. The email is hardcoded in the Edge Function
2. You would need to redeploy the Edge Function with a different email
3. Or contact support to update it

## 📚 Full Documentation

For detailed setup, troubleshooting, and advanced configuration, see:
- `EMAIL_INTEGRATION_SETUP.md` - Complete setup guide
- `SUPABASE_EMAIL_SETUP.md` - Supabase-specific instructions

## ✨ That's It!

Your email integration is ready to go. Just add your Resend API key and start sending assessment reports!

**Questions?** Check the troubleshooting section or review the full documentation.
