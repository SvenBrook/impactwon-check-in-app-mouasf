
/**
 * SUPABASE SETUP INSTRUCTIONS FOR EMAIL FUNCTIONALITY
 * 
 * To enable email sending with assessment results and spider graph:
 * 
 * ============================================================
 * STEP 1: ENABLE SUPABASE IN NATIVELY
 * ============================================================
 * 1. Press the Supabase button in Natively
 * 2. Connect to your Supabase project (create one at https://supabase.com if needed)
 * 3. Your EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY will be automatically configured
 * 
 * ============================================================
 * STEP 2: CREATE THE ASSESSMENTS TABLE
 * ============================================================
 * Run this SQL in your Supabase SQL Editor:
 * 
 * CREATE TABLE assessments (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   first_name TEXT NOT NULL,
 *   surname TEXT NOT NULL,
 *   email TEXT NOT NULL,
 *   mobile TEXT,
 *   brand_advocate DECIMAL,
 *   investigator DECIMAL,
 *   team_player DECIMAL,
 *   leadership_ethics DECIMAL,
 *   business_acumen DECIMAL,
 *   products_services DECIMAL,
 *   sales_planning_selling DECIMAL,
 *   experience_rating INTEGER
 * );
 * 
 * -- Enable Row Level Security
 * ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
 * 
 * -- Create a policy to allow inserts (adjust as needed for your security requirements)
 * CREATE POLICY "Allow public inserts" ON assessments
 *   FOR INSERT TO anon
 *   WITH CHECK (true);
 * 
 * ============================================================
 * STEP 3: CREATE THE EMAIL EDGE FUNCTION
 * ============================================================
 * 
 * 1. In your Supabase project, go to Edge Functions
 * 2. Create a new function called "send-assessment-email"
 * 3. Use the code below for the Edge Function
 * 4. Set up an email service (Resend, SendGrid, or similar)
 * 5. Add your email service API key as a secret:
 *    supabase secrets set RESEND_API_KEY=your_api_key_here
 * 
 * ============================================================
 * EDGE FUNCTION CODE (supabase/functions/send-assessment-email/index.ts)
 * ============================================================
 * 
 * import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
 * 
 * const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
 * 
 * interface RequestBody {
 *   userEmail: string
 *   ccEmail: string
 *   firstName: string
 *   surname: string
 *   competencyAverages: { [key: string]: number }
 *   benchmarkProfile: { [key: string]: number }
 *   experienceRating: number
 *   chartImageBase64: string | null
 * }
 * 
 * serve(async (req) => {
 *   // Handle CORS
 *   if (req.method === 'OPTIONS') {
 *     return new Response('ok', {
 *       headers: {
 *         'Access-Control-Allow-Origin': '*',
 *         'Access-Control-Allow-Methods': 'POST',
 *         'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 *       },
 *     })
 *   }
 * 
 *   try {
 *     const body: RequestBody = await req.json()
 *     const { userEmail, ccEmail, firstName, surname, competencyAverages, benchmarkProfile, experienceRating, chartImageBase64 } = body
 * 
 *     // Format competency results for email
 *     const competencyNames = {
 *       brand_advocate: 'Brand Advocate',
 *       investigator: 'Investigator',
 *       team_player: 'Team Player',
 *       leadership_ethics: 'Leadership & Ethics',
 *       business_acumen: 'Business Acumen',
 *       products_services: 'Products & Services',
 *       sales_planning_selling: 'Sales Planning & Selling',
 *     }
 * 
 *     let competencyRows = ''
 *     for (const [key, name] of Object.entries(competencyNames)) {
 *       const userScore = competencyAverages[key] || 0
 *       const benchScore = benchmarkProfile[key] || 4.0
 *       const diff = userScore - benchScore
 *       const status = diff > 0.3 ? 'Ahead of benchmark' : diff < -0.3 ? 'Priority development area' : 'In line with benchmark'
 *       
 *       competencyRows += `
 *         <tr>
 *           <td style="padding: 12px; border-bottom: 1px solid #E3D8FF;">${name}</td>
 *           <td style="padding: 12px; border-bottom: 1px solid #E3D8FF; text-align: center; font-weight: bold; color: #0D95FF;">${userScore.toFixed(1)}</td>
 *           <td style="padding: 12px; border-bottom: 1px solid #E3D8FF; text-align: center;">${benchScore.toFixed(1)}</td>
 *           <td style="padding: 12px; border-bottom: 1px solid #E3D8FF;">${status}</td>
 *         </tr>
 *       `
 *     }
 * 
 *     // Build email HTML
 *     const htmlContent = `
 *       <!DOCTYPE html>
 *       <html>
 *       <head>
 *         <meta charset="utf-8">
 *         <meta name="viewport" content="width=device-width, initial-scale=1.0">
 *       </head>
 *       <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1F2B73; background-color: #FFFDF9; margin: 0; padding: 20px;">
 *         <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 25px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
 *           <h1 style="color: #1F2B73; margin-bottom: 10px;">ImpactWon Client Expert Check-in</h1>
 *           <h2 style="color: #0D95FF; margin-top: 0;">Assessment Results</h2>
 *           
 *           <p>Dear ${firstName} ${surname},</p>
 *           
 *           <p>Thank you for completing the ImpactWon Client Expert Competency Assessment. Below are your results:</p>
 *           
 *           ${chartImageBase64 ? `
 *             <div style="text-align: center; margin: 30px 0;">
 *               <img src="data:image/png;base64,${chartImageBase64}" alt="Competency Spider Chart" style="max-width: 100%; height: auto; border-radius: 15px;" />
 *             </div>
 *           ` : ''}
 *           
 *           <h3 style="color: #1F2B73; margin-top: 30px;">Competency Breakdown</h3>
 *           
 *           <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
 *             <thead>
 *               <tr style="background-color: #C1E6FF;">
 *                 <th style="padding: 12px; text-align: left; border-bottom: 2px solid #0D95FF;">Competency</th>
 *                 <th style="padding: 12px; text-align: center; border-bottom: 2px solid #0D95FF;">Your Score</th>
 *                 <th style="padding: 12px; text-align: center; border-bottom: 2px solid #0D95FF;">Benchmark</th>
 *                 <th style="padding: 12px; text-align: left; border-bottom: 2px solid #0D95FF;">Status</th>
 *               </tr>
 *             </thead>
 *             <tbody>
 *               ${competencyRows}
 *             </tbody>
 *           </table>
 *           
 *           <div style="background-color: #E3D8FF; border-radius: 15px; padding: 20px; margin: 30px 0;">
 *             <h3 style="color: #1F2B73; margin-top: 0;">Your Experience Rating</h3>
 *             <p style="font-size: 18px; margin: 0;">You rated your experience: <strong>${experienceRating}/5</strong></p>
 *           </div>
 *           
 *           <p style="margin-top: 30px;">If you have any questions about your results, please don't hesitate to reach out.</p>
 *           
 *           <p style="margin-top: 30px; color: #666; font-size: 14px;">
 *             Best regards,<br>
 *             <strong>ImpactWon Team</strong>
 *           </p>
 *         </div>
 *       </body>
 *       </html>
 *     `
 * 
 *     // Send email using Resend (or your preferred email service)
 *     const emailResponse = await fetch('https://api.resend.com/emails', {
 *       method: 'POST',
 *       headers: {
 *         'Content-Type': 'application/json',
 *         'Authorization': `Bearer ${RESEND_API_KEY}`,
 *       },
 *       body: JSON.stringify({
 *         from: 'ImpactWon <noreply@yourdomain.com>',
 *         to: [userEmail],
 *         cc: [ccEmail],
 *         subject: `Your ImpactWon Assessment Results - ${firstName} ${surname}`,
 *         html: htmlContent,
 *       }),
 *     })
 * 
 *     if (!emailResponse.ok) {
 *       const errorText = await emailResponse.text()
 *       throw new Error(`Email service error: ${errorText}`)
 *     }
 * 
 *     const result = await emailResponse.json()
 * 
 *     return new Response(JSON.stringify({ success: true, result }), {
 *       headers: {
 *         'Content-Type': 'application/json',
 *         'Access-Control-Allow-Origin': '*',
 *       },
 *     })
 *   } catch (error) {
 *     console.error('Error sending email:', error)
 *     return new Response(JSON.stringify({ success: false, error: error.message }), {
 *       status: 500,
 *       headers: {
 *         'Content-Type': 'application/json',
 *         'Access-Control-Allow-Origin': '*',
 *       },
 *     })
 *   }
 * })
 * 
 * ============================================================
 * ALTERNATIVE EMAIL SERVICES
 * ============================================================
 * 
 * Instead of Resend, you can use:
 * 
 * 1. SendGrid: https://sendgrid.com/
 *    - Set SENDGRID_API_KEY secret
 *    - Use SendGrid API endpoint
 * 
 * 2. Mailgun: https://www.mailgun.com/
 *    - Set MAILGUN_API_KEY and MAILGUN_DOMAIN secrets
 *    - Use Mailgun API endpoint
 * 
 * 3. AWS SES: https://aws.amazon.com/ses/
 *    - Set AWS credentials as secrets
 *    - Use AWS SDK for Deno
 * 
 * ============================================================
 * TESTING
 * ============================================================
 * 
 * After setup, test the email function:
 * 
 * 1. Complete an assessment in the app
 * 2. Check the Supabase Edge Functions logs for any errors
 * 3. Verify emails are received at both addresses
 * 4. Check that the spider chart image is included
 * 
 * ============================================================
 * SEE ALSO
 * ============================================================
 * 
 * - SUPABASE_EMAIL_SETUP.md - Complete setup guide
 * - EMAIL_SETUP_INSTRUCTIONS.txt - Quick start guide
 * - utils/supabaseClient.ts - Supabase client configuration
 * - utils/emailService.ts - Email sending implementation
 * - utils/chartCapture.ts - Chart image capture utility
 * 
 */

// This file is for documentation purposes only.
// The actual implementation is in:
// - utils/supabaseClient.ts
// - utils/emailService.ts
// - utils/chartCapture.ts
