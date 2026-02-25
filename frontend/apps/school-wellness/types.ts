
export enum Role {
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  grade?: string;
  age?: number;
  institution_id: string;
}

export interface WellnessChallenge {
  id: string;
  challenge_name: string;
  challenge_slug: string;
  challenge_type: 'mindfulness' | 'focus' | 'social_emotional' | 'physical';
  duration_days: number;
  description: string;
  short_description: string;
  goal: string;
  benefits: string[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_time_per_day: number;
  points_per_day: number;
  points_per_completion: number;
  badge_name: string;
  badge_description: string;
  featured: boolean;
  daily_prompts: Record<string, { title: string; prompt: string; duration_minutes: number }>;
}

export interface StudentEnrollment {
  id: string;
  challenge_id: string;
  student_id: string;
  enrolled_at: string;
  status: 'enrolled' | 'in_progress' | 'completed';
  days_completed: number;
  current_streak: number;
  longest_streak: number;
  total_points_earned: number;
  check_ins: Record<string, any>;
}

export interface AcademicImpactMetrics {
  attendanceImprovement: number;
  disciplineDecrease: number;
  avgGpaIncrease: number;
  wellnessParticipation: number;
}
