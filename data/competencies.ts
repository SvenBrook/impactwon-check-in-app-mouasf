
import { Competency } from '@/types/assessment';

export const competencies: Competency[] = [
  {
    id: 'brand_advocate',
    name: 'Brand Advocate',
    questions: [
      { id: 'ba_1', text: 'I effectively communicate our brand values to clients', scale: 5 },
      { id: 'ba_2', text: 'I represent our company professionally in all interactions', scale: 5 },
      { id: 'ba_3', text: 'I actively promote our brand in the marketplace', scale: 5 },
      { id: 'ba_4', text: 'I understand and embody our brand promise', scale: 5 },
      { id: 'ba_5', text: 'I consistently deliver on our brand commitments', scale: 5 },
    ],
  },
  {
    id: 'investigator',
    name: 'Investigator',
    questions: [
      { id: 'inv_1', text: 'I thoroughly research client needs before proposing solutions', scale: 5 },
      { id: 'inv_2', text: 'I ask insightful questions to uncover hidden opportunities', scale: 5 },
      { id: 'inv_3', text: 'I analyze market trends to inform my sales approach', scale: 5 },
      { id: 'inv_4', text: 'I gather comprehensive information about prospects', scale: 5 },
      { id: 'inv_5', text: 'I use data to support my recommendations', scale: 5 },
    ],
  },
  {
    id: 'team_player',
    name: 'Team Player',
    questions: [
      { id: 'tp_1', text: 'I collaborate effectively with colleagues', scale: 5 },
      { id: 'tp_2', text: 'I share knowledge and best practices with my team', scale: 5 },
      { id: 'tp_3', text: 'I support team members to achieve collective goals', scale: 5 },
      { id: 'tp_4', text: 'I communicate openly and constructively', scale: 5 },
      { id: 'tp_5', text: 'I contribute positively to team culture', scale: 5 },
    ],
  },
  {
    id: 'leadership_ethics',
    name: 'Leadership & Ethics',
    questions: [
      { id: 'le_1', text: 'I demonstrate ethical behavior in all business dealings', scale: 3 },
      { id: 'le_2', text: 'I take responsibility for my actions and decisions', scale: 3 },
      { id: 'le_3', text: 'I lead by example in my interactions', scale: 5 },
      { id: 'le_4', text: 'I inspire confidence in clients and colleagues', scale: 5 },
      { id: 'le_5', text: 'I make decisions that align with company values', scale: 5 },
    ],
  },
  {
    id: 'business_acumen',
    name: 'Business Acumen',
    questions: [
      { id: 'ba_1', text: 'I understand key business drivers in my industry', scale: 5 },
      { id: 'ba_2', text: 'I can articulate ROI and business value to clients', scale: 5 },
      { id: 'ba_3', text: 'I stay informed about market conditions and trends', scale: 5 },
      { id: 'ba_4', text: 'I understand financial implications of my recommendations', scale: 5 },
      { id: 'ba_5', text: 'I align solutions with client business objectives', scale: 5 },
    ],
  },
  {
    id: 'products_services',
    name: 'Products & Services',
    questions: [
      { id: 'ps_1', text: 'I have deep knowledge of our product/service offerings', scale: 5 },
      { id: 'ps_2', text: 'I can explain technical features in business terms', scale: 5 },
      { id: 'ps_3', text: 'I understand competitive advantages of our solutions', scale: 5 },
      { id: 'ps_4', text: 'I stay current with product updates and enhancements', scale: 5 },
      { id: 'ps_5', text: 'I can match solutions to specific client needs', scale: 5 },
    ],
  },
  {
    id: 'sales_planning_selling',
    name: 'Sales Planning & Selling',
    questions: [
      { id: 'sps_1', text: 'I develop strategic account plans', scale: 5 },
      { id: 'sps_2', text: 'I effectively manage my sales pipeline', scale: 5 },
      { id: 'sps_3', text: 'I use consultative selling techniques', scale: 5 },
      { id: 'sps_4', text: 'I handle objections professionally and effectively', scale: 5 },
      { id: 'sps_5', text: 'I close deals while maintaining client relationships', scale: 5 },
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
