
export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export type MessageStatus = 'sending' | 'sent' | 'read';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  isCrisis?: boolean;
  suggestedResources?: Resource[];
  status?: MessageStatus;
  voiceUrl?: string; // For user voice notes (blob URLs)
  voiceBase64?: string; // For synthesized bot voice (raw base64)
  voiceDuration?: number;
}

export interface UserProfile {
  isPremium: boolean;
  dailyMessageCount: number;
  totalVoiceSecondsUsed: number;
  lastMessageDate: string;
  teleManasID?: string;
  preferredLanguage?: string;
  voiceEnabled: boolean; // Added for optional voice response
}

export interface AIResponse {
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  isCrisis: boolean;
  suggestedResources?: Resource[];
}

export interface Resource {
  title: string;
  type: 'article' | 'video' | 'contact';
  url: string;
}

// Government & Compliance Types
export interface ReferralRecord {
  id: string;
  patientName: string;
  teleManasRef: string;
  status: 'pending' | 'active' | 'completed';
  timestamp: number;
  priority: 'low' | 'medium' | 'high';
}

// Therapist Training Types
export interface TrainingModule {
  id: string;
  code: string;
  title: string;
  description: string;
  durationMinutes: number;
  sections: TrainingSection[];
  requiredForCertification: boolean;
  badgeUrl: string;
}

export interface TrainingSection {
  id: string;
  title: string;
  content: string;
  durationMinutes: number;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: { [key: string]: string };
  correctAnswer: string;
  explanation: string;
}

export interface Certification {
  id: string;
  moduleCode: string;
  title: string;
  issuedAt: number;
  certNumber: string;
  score: number;
}

export interface QuizAttempt {
  timestamp: number;
  score: number;
}

export interface TherapistProfile {
  name: string;
  isCertified: boolean;
  certifications: Certification[];
  trainingProgress: { [moduleId: string]: number }; // moduleId -> percentage
  quizAttempts: { [moduleId: string]: QuizAttempt };
}
