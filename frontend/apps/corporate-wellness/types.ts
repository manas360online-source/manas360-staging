
export enum Role {
  HR_ADMIN = 'HR_ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  entity_id: string;
}

export interface WellnessChallenge {
  id: string;
  challenge_name: string;
  challenge_slug: string;
  challenge_type: 'mindfulness' | 'sleep' | 'stress_reduction' | 'physical_activity';
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

export interface ChallengeEnrollment {
  id: string;
  challenge_id: string;
  patient_id: string;
  enrolled_at: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'abandoned';
  days_completed: number;
  current_streak: number;
  longest_streak: number;
  total_points_earned: number;
  check_ins: Record<string, { completed: boolean; notes?: string; mood_after: number; checked_in_at: string }>;
}

export interface ROIMetrics {
  participation: {
    total_employees: number;
    participating_employees: number;
    participation_rate: number;
  };
  utilization: {
    total_therapy_sessions: number;
    avg_sessions_per_employee: number;
    challenge_participants: number;
    challenge_completion_rate: number;
  };
  absenteeism: {
    sick_days_baseline: number;
    sick_days_current_period: number;
    sick_days_saved: number;
    reduction_percent: number;
  };
  financial_impact: {
    avg_cost_per_sick_day: number;
    total_sick_day_cost_saved: number;
    program_cost: number;
    net_savings: number;
    roi_ratio: number;
  };
  clinical_outcomes: {
    employees_improved: number;
    improvement_rate: number;
    avg_phq9_improvement: number;
    avg_employee_satisfaction: number;
  };
  recommendations: string[];
}
