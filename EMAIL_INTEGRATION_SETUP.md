
# Email Integration Setup Instructions

This app uses Supabase Edge Functions and Resend to send assessment reports via email.

## ✅ Current Status

The email integration is **FULLY CONFIGURED** and ready to use! Here's what's already set up:

- ✅ Supabase Edge Function `send-assessment-email` deployed (v2)
- ✅ Database table `assessments` created with RLS enabled
- ✅ Email service integration code implemented
- ✅ Results screen configured to send emails on submission
- ✅ Emails automatically sent to both participant and Sven

## 📧 How It Works

When a user completes the assessment and clicks "Submit and Email My Report":

1. **Assessment is saved** to the Supabase `assessments` table
2. **Email is sent** to both:
   - The participant's email address (entered in the form)
   - Sven's email: `sven@impactwon.com`
3. **Email contains**:
   - Participant information (name, email, date)
   - Detailed competency breakdown table
   - Benchmark comparison with status indicators
   - Satisfaction survey results (star rating)
   - Professional HTML formatting with ImpactWon branding

## 🔧 Required Setup (One-Time)

### 1. Configure Environment Variables

Create a `.env` file in your project root with:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://oafjzglwgovmalykvfpp.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Set Up Resend API Key

You need to add your Resend API key to Supabase Edge Function secrets:

**Option A: Via Supabase CLI**
```bash
supabase secrets set RESEND_API_KEY=re_your_api_key_here
```

**Option B: Via Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions** → **Secrets**
3. Click **Add Secret**
4. Name: `RESEND_API_KEY`
5. Value: Your Resend API key (starts with `re_`)

### 3. Get a Resend API Key

1. Sign up for a free account at [resend.com](https://resend.com)
2. Verify your domain (or use Resend's test domain for development)
3. Go to **API Keys** in the dashboard
4. Click **Create API Key**
5. Copy the key (starts with `re_`)

**For Testing (No Domain Required):**
- Use Resend's test domain: `onboarding@resend.dev`
- Free tier: 100 emails/day, 3,000 emails/month

**For Production:**
- Verify your domain in Resend
- Update the `from` field in the Edge Function to use your domain

### 4. Configure Email Sender (Optional)

If you want to use your own domain instead of the test domain:

1. Verify your domain in Resend
2. Update the Edge Function `from` field:
   ```typescript
   from: 'ImpactWon <noreply@yourdomain.com>',
   ```

### 5. Update Recipient Email (Optional)

To change Sven's email address, the Edge Function automatically sends to `sven@impactwon.com`. 

To change this, you would need to redeploy the Edge Function with a different email address in the code.

## 📊 Database Schema

The `assessments` table stores all assessment data:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (auto-generated) |
| created_at | timestamp | Submission timestamp |
| first_name | text | Participant's first name |
| surname | text | Participant's surname |
| email | text | Participant's email |
| mobile | text | Participant's mobile (optional) |
| brand_advocate | numeric | Brand Advocate score (1-5) |
| investigator | numeric | Investigator score (1-5) |
| team_player | numeric | Team Player score (1-5) |
| leadership_ethics | numeric | Leadership & Ethics score (1-5) |
| business_acumen | numeric | Business Acumen score (1-5) |
| products_services | numeric | Products & Services score (1-5) |
| sales_planning_selling | numeric | Sales Planning & Selling score (1-5) |
| experience_rating | integer | User satisfaction rating (1-5) |

**RLS Policies:**
- Public inserts allowed (for anonymous users)
- No read/update/delete permissions (data is write-only)

## 📧 Email Content

The email includes:

1. **Header Section**
   - ImpactWon branding
   - Professional styling with brand colors

2. **Participant Information**
   - Name, email, and submission date
   - Styled with Reliable Lilac background

3. **Competency Breakdown Table**
   - All 7 competencies with scores
   - Benchmark comparison
   - Status indicators (color-coded):
     - 🟢 Ahead of benchmark (Insight Teal)
     - 🔵 In line with benchmark (Sky Blue)
     - 🟠 Priority development area (Beacon Orange)

4. **Satisfaction Survey**
   - Star rating display (★★★★★)
   - Experience rating out of 5

5. **Footer**
   - Thank you message
   - ImpactWon branding

## 🧪 Testing

1. **Complete an assessment:**
   - Fill in user information (name, email, mobile)
   - Answer all questions across 7 competency sections
   - Rate your experience (1-5 stars)

2. **Submit the assessment:**
   - Click "Submit and Email My Report"
   - Wait for confirmation message

3. **Verify:**
   - ✅ Assessment saved to Supabase `assessments` table
   - ✅ Email received by participant
   - ✅ Email received by sven@impactwon.com
   - ✅ Email contains complete report with all sections
   - ✅ Satisfaction survey included in email

## 🐛 Troubleshooting

### Email not sending

**Symptom:** User clicks submit but no email is received

**Solutions:**
1. Check that `RESEND_API_KEY` is set in Supabase Edge Function secrets
2. Verify your Resend account is active and not rate-limited
3. Check Edge Function logs in Supabase Dashboard:
   - Go to **Edge Functions** → **send-assessment-email** → **Logs**
4. Verify the `from` email address is verified in Resend
5. Check spam/junk folders

**Common Errors:**
- `Email service not configured`: RESEND_API_KEY not set
- `Failed to send email via Resend API`: Invalid API key or rate limit exceeded
- `Missing required fields`: Data validation failed

### Assessment not saving

**Symptom:** Email sends but data not in database

**Solutions:**
1. Verify Supabase credentials in `.env` file
2. Check that the `assessments` table exists
3. Verify RLS policies allow inserts
4. Check browser console for errors

### Environment variables not loading

**Symptom:** App shows "Supabase is not configured" error

**Solutions:**
1. Ensure `.env` file exists in project root
2. Restart the Expo development server: `npm run dev`
3. Verify variables are prefixed with `EXPO_PUBLIC_`
4. Check that `.env` is not in `.gitignore` (for local development)

### Emails going to spam

**Solutions:**
1. Verify your domain in Resend
2. Set up SPF, DKIM, and DMARC records
3. Use a professional `from` address
4. Avoid spam trigger words in subject/content

## 💰 Cost Considerations

### Resend Free Tier
- ✅ 100 emails/day
- ✅ 3,000 emails/month
- ✅ Perfect for testing and small deployments

### Resend Paid Plans
- **Pro**: $20/month for 50,000 emails
- **Business**: Custom pricing for higher volumes

### Supabase Free Tier
- ✅ Edge Functions included
- ✅ 500,000 Edge Function invocations/month
- ✅ 2GB database storage

### Recommendations
- Start with free tiers for development/testing
- Monitor usage in both dashboards
- Upgrade when approaching limits
- Consider email batching for high-volume scenarios

## 🔒 Security Notes

### Environment Variables
- ✅ `EXPO_PUBLIC_` prefix makes variables accessible in client code
- ✅ Never expose sensitive API keys with this prefix
- ✅ Resend API key stored securely in Supabase Edge Function secrets
- ✅ API key never exposed to client-side code

### Database Security
- ✅ RLS policies enabled on `assessments` table
- ✅ Public inserts allowed (for anonymous assessments)
- ✅ No read/update/delete permissions (write-only)
- ✅ Data encrypted at rest and in transit

### Email Security
- ✅ Emails sent server-side via Edge Function
- ✅ No email credentials in client code
- ✅ Rate limiting via Resend
- ✅ CORS properly configured

### Best Practices
- 🔐 Never commit `.env` files to version control
- 🔐 Use different API keys for development/production
- 🔐 Regularly rotate API keys
- 🔐 Monitor Edge Function logs for suspicious activity
- 🔐 Implement rate limiting on the client side if needed

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [React Native Email Best Practices](https://reactnative.dev/docs/network)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Edge Function logs in Supabase Dashboard
3. Check Resend dashboard for email delivery status
4. Verify all environment variables are set correctly
5. Test with a simple email first (without attachments)

For Resend-specific issues, contact: support@resend.com
For Supabase-specific issues, visit: https://supabase.com/support
