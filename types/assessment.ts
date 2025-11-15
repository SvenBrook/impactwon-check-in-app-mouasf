
export interface UserInfo {
  firstName: string;
  surname: string;
  email: string;
  mobile?: string;
}

export interface CompetencyQuestion {
  id: string;
  text: string;
  scale: 3 | 5;
}

export interface Competency {
  id: string;
  name: string;
  questions: CompetencyQuestion[];
}

export interface AssessmentResponse {
  questionId: string;
  rating: number;
}

export interface AssessmentData {
  userInfo: UserInfo;
  responses: AssessmentResponse[];
  competencyAverages: { [key: string]: number };
  experienceRating?: number;
  timestamp: string;
}

export interface BenchmarkProfile {
  [key: string]: number;
}
