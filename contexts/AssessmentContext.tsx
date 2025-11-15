
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserInfo, AssessmentResponse } from '@/types/assessment';

interface AssessmentContextType {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;
  responses: AssessmentResponse[];
  addResponse: (response: AssessmentResponse) => void;
  updateResponse: (questionId: string, rating: number) => void;
  experienceRating: number | null;
  setExperienceRating: (rating: number) => void;
  resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [experienceRating, setExperienceRating] = useState<number | null>(null);

  const addResponse = (response: AssessmentResponse) => {
    setResponses((prev) => {
      const existing = prev.find((r) => r.questionId === response.questionId);
      if (existing) {
        return prev.map((r) =>
          r.questionId === response.questionId ? response : r
        );
      }
      return [...prev, response];
    });
  };

  const updateResponse = (questionId: string, rating: number) => {
    addResponse({ questionId, rating });
  };

  const resetAssessment = () => {
    setUserInfo(null);
    setResponses([]);
    setExperienceRating(null);
  };

  return (
    <AssessmentContext.Provider
      value={{
        userInfo,
        setUserInfo,
        responses,
        addResponse,
        updateResponse,
        experienceRating,
        setExperienceRating,
        resetAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
}
