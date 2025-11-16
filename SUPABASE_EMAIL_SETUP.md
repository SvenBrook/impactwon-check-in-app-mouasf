
# Supabase Email Setup Guide

This guide will help you set up email functionality to send assessment results with the spider graph to participants and sven@impactwon.com.

## Prerequisites

- A Supabase account (create one at https://supabase.com)
- An email service account (Resend, SendGrid, or Mailgun recommended)

## Step 1: Enable Supabase in Natively

1. Press the **Supabase** button in Natively
2. Connect to your Supabase project (or create a new one)
3. Your environment variables will be automatically configured

## Step 2: Create the Database Table

In your Supabase project:

1. Go to **SQL Editor**
2. Create a new query
3. Paste and run this SQL:

```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_name TEXT NOT NULL,
  surname TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT,
  brand_advocate DECIMAL,
  investigator DECIMAL,
  team_player DECIMAL,
  leadership_ethics DECIMAL,
  business_acumen DECIMAL,
  products_services DECIMAL,
  sales_planning_selling DECIMAL,
  experience_rating INTEGER
);

-- Enable Row Level Security
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Allow public inserts
CREATE POLICY "Allow public inserts" ON assessments
  FOR INSERT TO anon
  WITH CHECK (true);
```

## Step 3: Set Up Email Service

### Option A: Using Resend (Recommended)

1. Sign up at https://resend.com
2. Get your API key from the dashboard
3. Verify your domain (or use their test domain for development)

### Option B: Using SendGrid

1. Sign up at https://sendgrid.com
2. Create an API key with "Mail Send" permissions
3. Verify your sender email address

### Option C: Using Mailgun

1. Sign up at https://mailgun.com
2. Get your API key and domain from the dashboard
3. Verify your domain

## Step 4: Create the Edge Function

1. Install Supabase CLI if you haven't:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Create the edge function:
   ```bash
   supabase functions new send-assessment-email
   ```

4. Copy the edge function code from `utils/supabaseSetup.ts` into:
   ```
   supabase/functions/send-assessment-email/index.ts
   ```

5. Set your email service API key as a secret:
   ```bash
   supabase secrets set RESEND_API_KEY=your_api_key_here
   ```

6. Deploy the function:
   ```bash
   supabase functions deploy send-assessment-email
   ```

## Step 5: Update Email Configuration

In the edge function code, update:

- **From address**: Change `noreply@yourdomain.com` to your verified email
- **Email service**: If not using Resend, update the API endpoint and headers

## Testing

1. Complete an assessment in the app
2. Check that emails are received at:
   - The participant's email address
   - sven@impactwon.com
3. Verify the spider chart image is included
4. Check Supabase Edge Functions logs for any errors

## Troubleshooting

### Email not sending

- Check Edge Function logs in Supabase dashboard
- Verify your email service API key is correct
- Ensure your sender email is verified
- Check rate limits on your email service

### Chart image not appearing

- Ensure the chart is fully rendered before submission
- Check that `react-native-view-shot` is properly installed
- Verify the base64 image data is being captured

### Database errors

- Verify the assessments table exists
- Check Row Level Security policies
- Ensure the table structure matches the schema

## Support

For issues with:
- **Supabase**: https://supabase.com/docs
- **Resend**: https://resend.com/docs
- **SendGrid**: https://docs.sendgrid.com
- **Mailgun**: https://documentation.mailgun.com

## Security Notes

- Never commit API keys to version control
- Use Supabase secrets for sensitive data
- Implement proper Row Level Security policies for production
- Consider rate limiting to prevent abuse
