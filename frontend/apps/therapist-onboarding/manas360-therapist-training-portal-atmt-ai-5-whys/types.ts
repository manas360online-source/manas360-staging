import { ModuleLevel, NLPModule } from './constants';

export { ModuleLevel };
export type { NLPModule };

export interface UserProgress {
  userId: string;
  studentName: string;
  profileImage: string;
  completedModules: string[];
}

export interface User {
  id: string;
  name: string;
  role: 'therapist' | 'admin';
  isCertified: boolean;
  certificationDate?: string;
  certificateId?: string;
  progress: {
    module1: number; // 0-100
    module2: number;
    module3: number;
    module4: number;
    module5: number;
    module6: number;
    module7: number;
    quizPassed: boolean;
    quizScore?: number;
    quizAttempts: number;
  };
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  lastSessionDate: string;
  lastSessionSummary: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // index
  correctFeedback?: string;
  incorrectFeedback?: string;
  explanation: string;
}

export interface VideoMeta {
  id: string;
  title: string;
  duration: string;
  description: string;
  thumbnailColor: string;
  embedUrl?: string;
}

export interface AdminStat {
  name: string;
  value: number;
  fullMark?: number;
}