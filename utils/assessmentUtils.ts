
import { AssessmentResponse, Competency } from '@/types/assessment';

export function rescaleRating(rating: number, fromScale: 3 | 5): number {
  if (fromScale === 5) {
    return rating;
  }
  // Rescale 1-3 to 1-5: scaled = 1 + (original - 1) * (4 / 2)
  return 1 + (rating - 1) * 2;
}

export function calculateCompetencyAverage(
  competency: Competency,
  responses: AssessmentResponse[]
): number {
  const competencyResponses = responses.filter((r) =>
    competency.questions.some((q) => q.id === r.questionId)
  );

  if (competencyResponses.length === 0) {
    return 0;
  }

  const scaledRatings = competencyResponses.map((response) => {
    const question = competency.questions.find((q) => q.id === response.questionId);
    if (!question) return 0;
    return rescaleRating(response.rating, question.scale);
  });

  const sum = scaledRatings.reduce((acc, rating) => acc + rating, 0);
  return sum / scaledRatings.length;
}

export function calculateAllAverages(
  competencies: Competency[],
  responses: AssessmentResponse[]
): { [key: string]: number } {
  const averages: { [key: string]: number } = {};
  
  competencies.forEach((competency) => {
    averages[competency.id] = calculateCompetencyAverage(competency, responses);
  });

  return averages;
}

export function getCompetencyStatus(userScore: number, benchmarkScore: number): string {
  const difference = userScore - benchmarkScore;
  
  if (difference >= 0.3) {
    return 'Ahead of benchmark';
  } else if (difference <= -0.3) {
    return 'Priority development area';
  } else {
    return 'In line with benchmark';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Ahead of benchmark':
      return '#A6E0C5'; // Insight Teal
    case 'Priority development area':
      return '#FF810C'; // Beacon Orange
    default:
      return '#C1E6FF'; // Sky Blue
  }
}
