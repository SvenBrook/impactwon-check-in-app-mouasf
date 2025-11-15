
import { Competency } from '@/types/assessment';

export const competencies: Competency[] = [
  {
    id: 'brand_advocate',
    name: 'Brand Advocate',
    questions: [
      {
        id: 'BA1',
        text: 'Authenticity',
        scale: 5,
      },
      {
        id: 'BA2',
        text: 'Eminence',
        scale: 5,
      },
      {
        id: 'BA3',
        text: 'Strong Communication Skills',
        scale: 5,
      },
      {
        id: 'BA4',
        text: 'Social Media Savvy',
        scale: 5,
      },
      {
        id: 'BA5',
        text: 'Professionalism',
        scale: 5,
      },
    ],
  },
  {
    id: 'investigator',
    name: 'Investigator',
    questions: [
      {
        id: 'IN1',
        text: 'Good Planner',
        scale: 5,
      },
      {
        id: 'IN2',
        text: 'Critical Thinking',
        scale: 5,
      },
      {
        id: 'IN3',
        text: 'Good Problem Solver',
        scale: 5,
      },
      {
        id: 'IN4',
        text: 'Insight Discovery',
        scale: 5,
      },
      {
        id: 'IN5',
        text: 'Curiosity and Continuous Learning',
        scale: 5,
      },
    ],
  },
  {
    id: 'team_player',
    name: 'Team Player',
    questions: [
      {
        id: 'TP1',
        text: 'Collaboration',
        scale: 5,
      },
      {
        id: 'TP2',
        text: 'Supportiveness',
        scale: 5,
      },
      {
        id: 'TP3',
        text: 'Active Participation',
        scale: 5,
      },
      {
        id: 'TP4',
        text: 'Conflict Handling',
        scale: 5,
      },
      {
        id: 'TP5',
        text: 'Adaptability in Teams',
        scale: 5,
      },
    ],
  },
  {
    id: 'leadership_ethics',
    name: 'Leadership & Ethics',
    questions: [
      {
        id: 'LE1',
        text: 'Formal Leadership Skills',
        scale: 5,
      },
      {
        id: 'LE2',
        text: 'Informal Leadership Skills',
        scale: 5,
      },
      {
        id: 'LE3',
        text: 'Good Core Values',
        scale: 3,
      },
      {
        id: 'LE4',
        text: 'Integrity',
        scale: 3,
      },
      {
        id: 'LE5',
        text: 'Responsibility',
        scale: 5,
      },
    ],
  },
  {
    id: 'business_acumen',
    name: 'Business Acumen',
    questions: [
      {
        id: 'BAc1',
        text: 'Good Planner',
        scale: 5,
      },
      {
        id: 'BAc2',
        text: 'Financial Understanding',
        scale: 5,
      },
      {
        id: 'BAc3',
        text: 'Understanding the Business',
        scale: 5,
      },
      {
        id: 'BAc4',
        text: 'Understanding the Market',
        scale: 5,
      },
      {
        id: 'BAc5',
        text: 'Growth Mindset',
        scale: 5,
      },
    ],
  },
  {
    id: 'products_services',
    name: 'Products & Services',
    questions: [
      {
        id: 'PS1',
        text: 'Product Knowledge',
        scale: 5,
      },
      {
        id: 'PS2',
        text: 'Solution Fit',
        scale: 5,
      },
      {
        id: 'PS3',
        text: 'Differentiation',
        scale: 5,
      },
      {
        id: 'PS4',
        text: 'Updating Knowledge',
        scale: 5,
      },
      {
        id: 'PS5',
        text: 'Market Alignment',
        scale: 5,
      },
    ],
  },
  {
    id: 'sales_planning_selling',
    name: 'Sales Planning & Selling',
    questions: [
      {
        id: 'SP1',
        text: 'Use of Sales Tools',
        scale: 5,
      },
      {
        id: 'SP2',
        text: 'Understanding the Sales Cycle',
        scale: 5,
      },
      {
        id: 'SP3',
        text: 'Pipeline Management',
        scale: 5,
      },
      {
        id: 'SP4',
        text: 'Account Planning',
        scale: 5,
      },
      {
        id: 'SP5',
        text: 'Sales Activity and Execution',
        scale: 5,
      },
    ],
  },
];

export const benchmarkProfile = {
  brand_advocate: 4.0,
  investigator: 4.0,
  team_player: 4.0,
  leadership_ethics: 4.0,
  business_acumen: 4.0,
  products_services: 4.0,
  sales_planning_selling: 4.0,
};
