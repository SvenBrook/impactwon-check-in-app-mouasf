
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { UserInfo } from '@/types/assessment';

interface EmailData {
  userInfo: UserInfo;
  competencyAverages: { [key: string]: number };
  benchmarkProfile: { [key: string]: number };
  experienceRating: number;
  chartImageBase64: string | null;
}

export async function sendAssessmentEmail(data: EmailData): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    console.log('Supabase is not configured. Email not sent.');
    return {
      success: false,
      error: 'Supabase is not configured. Please enable Supabase to send emails.',
    };
  }

  try {
    const { data: result, error } = await supabase.functions.invoke('send-assessment-email', {
      body: {
        userEmail: data.userInfo.email,
        ccEmail: 'sven@impactwon.com',
        firstName: data.userInfo.firstName,
        surname: data.userInfo.surname,
        competencyAverages: data.competencyAverages,
        benchmarkProfile: data.benchmarkProfile,
        experienceRating: data.experienceRating,
        chartImageBase64: data.chartImageBase64,
      },
    });

    if (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }

    console.log('Email sent successfully:', result);
    return { success: true };
  } catch (error: any) {
    console.error('Exception sending email:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

export async function saveAssessmentToDatabase(data: EmailData): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    console.log('Supabase is not configured. Assessment not saved.');
    return {
      success: false,
      error: 'Supabase is not configured.',
    };
  }

  try {
    const assessmentData = {
      first_name: data.userInfo.firstName,
      surname: data.userInfo.surname,
      email: data.userInfo.email,
      mobile: data.userInfo.mobile || null,
      brand_advocate: data.competencyAverages.brand_advocate,
      investigator: data.competencyAverages.investigator,
      team_player: data.competencyAverages.team_player,
      leadership_ethics: data.competencyAverages.leadership_ethics,
      business_acumen: data.competencyAverages.business_acumen,
      products_services: data.competencyAverages.products_services,
      sales_planning_selling: data.competencyAverages.sales_planning_selling,
      experience_rating: data.experienceRating,
    };

    const { data: result, error } = await supabase
      .from('assessments')
      .insert([assessmentData]);

    if (error) {
      console.error('Error saving assessment:', error);
      return {
        success: false,
        error: error.message || 'Failed to save assessment',
      };
    }

    console.log('Assessment saved successfully:', result);
    return { success: true };
  } catch (error: any) {
    console.error('Exception saving assessment:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}
